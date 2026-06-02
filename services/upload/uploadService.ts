// src/services/uploadService.ts

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  currentChunk: number;
  totalChunks: number;
}

export interface UploadOptions {
  file: File;
  metadata: {
    nom: string;
    domaine: string;
    description?: string;
  };
  onProgress?: (progress: UploadProgress) => void;
  onChunkComplete?: (chunkIndex: number, total: number) => void;
}

export interface UploadResult {
  fileKey: string;
  fileUrl: string;
  uploadId: string;
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PARALLEL_CHUNKS = 3;       // 3 chunks en parallèle max

// ── Étape 1 : Initier le multipart upload ──────────────────
async function initiateUpload(file: File, metadata: UploadOptions["metadata"]) {
  const res = await fetch("/api/upload/initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      metadata,
    }),
  });

  if (!res.ok) throw new Error("Impossible d'initier l'upload");

  return res.json() as Promise<{
    uploadId: string;
    fileKey: string;
    presignedUrls: { partNumber: number; url: string }[];
  }>;
}

// ── Étape 2 : Uploader un chunk via presigned URL ──────────
async function uploadChunk(
  presignedUrl: string,
  chunk: Blob,
  onProgress?: (loaded: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded);
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        // S3 retourne l'ETag dans le header
        const etag = xhr.getResponseHeader("ETag");
        if (!etag) reject(new Error("ETag manquant"));
        else resolve(etag.replace(/"/g, ""));
      } else {
        reject(new Error(`Chunk upload échoué: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Erreur réseau"));

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.send(chunk);
  });
}

// ── Étape 3 : Compléter le multipart upload ────────────────
async function completeUpload(
  fileKey: string,
  uploadId: string,
  parts: { partNumber: number; etag: string }[]
) {
  const res = await fetch("/api/upload/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileKey, uploadId, parts }),
  });

  if (!res.ok) throw new Error("Impossible de finaliser l'upload");
  return res.json() as Promise<{ fileUrl: string }>;
}

// ── Annuler un upload en cours ─────────────────────────────
export async function abortUpload(fileKey: string, uploadId: string) {
  await fetch("/api/upload/abort", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileKey, uploadId }),
  });
}

// ── Fonction principale ────────────────────────────────────
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { file, metadata, onProgress, onChunkComplete } = options;

  // Découper le fichier en chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const chunks: Blob[] = [];
  for (let i = 0; i < totalChunks; i++) {
    chunks.push(file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
  }

  // 1. Initier
  const { uploadId, fileKey, presignedUrls } = await initiateUpload(file, metadata);

  // Tracker la progression par chunk
  const chunkProgress = new Array(totalChunks).fill(0);
  const chunkSizes = chunks.map(c => c.size);
  const totalSize = file.size;

  const handleChunkProgress = (chunkIndex: number, loaded: number) => {
    chunkProgress[chunkIndex] = loaded;
    const totalLoaded = chunkProgress.reduce((a, b) => a + b, 0);
    onProgress?.({
      loaded: totalLoaded,
      total: totalSize,
      percentage: Math.round((totalLoaded / totalSize) * 100),
      currentChunk: chunkIndex + 1,
      totalChunks,
    });
  };

  // 2. Upload des chunks avec parallélisme limité
  const parts: { partNumber: number; etag: string }[] = [];
  
  for (let i = 0; i < totalChunks; i += MAX_PARALLEL_CHUNKS) {
    const batch = presignedUrls.slice(i, i + MAX_PARALLEL_CHUNKS);
    
    const batchResults = await Promise.all(
      batch.map(async ({ partNumber, url }) => {
        const chunkIndex = partNumber - 1;
        const etag = await uploadChunk(
          url,
          chunks[chunkIndex],
          (loaded) => handleChunkProgress(chunkIndex, loaded)
        );
        // Marquer ce chunk comme complet
        chunkProgress[chunkIndex] = chunkSizes[chunkIndex];
        onChunkComplete?.(partNumber, totalChunks);
        return { partNumber, etag };
      })
    );

    parts.push(...batchResults);
  }

  // Trier par partNumber (S3 l'exige)
  parts.sort((a, b) => a.partNumber - b.partNumber);

  // 3. Compléter
  const { fileUrl } = await completeUpload(fileKey, uploadId, parts);

  return { fileKey, fileUrl, uploadId };
}

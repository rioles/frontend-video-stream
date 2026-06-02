// src/hooks/useUpload.ts
import { useState, useCallback, useRef } from "react";
import { uploadFile, abortUpload, UploadProgress, UploadOptions } from "@/services/uploadService";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export function useUpload() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ fileUrl: string; fileKey: string } | null>(null);
  const abortRef = useRef<{ fileKey: string; uploadId: string } | null>(null);

  const upload = useCallback(async (options: UploadOptions) => {
    setStatus("uploading");
    setProgress(null);
    setError(null);
    setResult(null);

    try {
      const res = await uploadFile({
        ...options,
        onProgress: (p) => setProgress(p),
      });

      abortRef.current = { fileKey: res.fileKey, uploadId: res.uploadId };
      setResult({ fileUrl: res.fileUrl, fileKey: res.fileKey });
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setStatus("error");
    }
  }, []);

  const abort = useCallback(async () => {
    if (abortRef.current) {
      await abortUpload(abortRef.current.fileKey, abortRef.current.uploadId);
      abortRef.current = null;
    }
    setStatus("idle");
    setProgress(null);
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(null);
    setError(null);
    setResult(null);
  }, []);

  return { status, progress, error, result, upload, abort, reset };
}

"use client";
import { useState, useRef } from "react";
import { useKeycloak } from "@/context/KeycloakContext";

type MenuItem = "upload" | "rapports" | "resumes" | "uploads";

export default function Dashboard() {
  const { logout } = useKeycloak();
  const [activeMenu, setActiveMenu] = useState<MenuItem>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({ nom: "", domaine: "", description: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: "upload" as MenuItem, label: "Uploader une réunion", icon: "⬆", desc: "Nouvelle réunion" },
    { id: "rapports" as MenuItem, label: "Mes rapports", icon: "📄", desc: "Rapports générés" },
    { id: "resumes" as MenuItem, label: "Mes résumés", icon: "✦", desc: "Résumés générés" },
    { id: "uploads" as MenuItem, label: "Mes uploads", icon: "🗂", desc: "Fichiers uploadés" },
  ];

  const stats = [
    { label: "Uploads", value: "0", icon: "🎬", color: "#6C63FF" },
    { label: "Rapports", value: "0", icon: "📄", color: "#00C9A7" },
    { label: "Résumés", value: "0", icon: "✦", color: "#FF6584" },
  ];

  const tips = [
    { icon: "🎙", title: "Bonne qualité audio", desc: "Utilisez un micro externe ou un casque pour une transcription optimale." },
    { icon: "🔇", title: "Évitez le bruit de fond", desc: "Enregistrez dans un endroit calme pour de meilleurs résultats." },
    { icon: "🗣", title: "Parlez clairement", desc: "Articulez bien et évitez de parler en même temps que les autres." },
    { icon: "📁", title: "Formats supportés", desc: "MP4, MOV, WebM pour la vidéo — MP3, WAV pour l'audio. Max 2 GB." },
  ];

  const handleFile = (file: File) => {
    const allowed = ["video/mp4", "video/quicktime", "video/webm", "audio/mpeg", "audio/wav", "audio/mp4"];
    if (allowed.includes(file.type)) setSelectedFile(file);
    else alert("Format non supporté. Utilisez MP4, MOV, WebM, MP3 ou WAV.");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f7f4", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width: 260, background: "#0e0e14", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: "1.75rem 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6C63FF, #00C9A7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>▶</div>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "-0.5px", margin: 0 }}>MeetReport</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>Espace de travail</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: 4 }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "0.75rem 1rem",
                borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                background: activeMenu === item.id ? "rgba(108,99,255,0.15)" : "transparent",
                borderLeft: activeMenu === item.id ? "3px solid #6C63FF" : "3px solid transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (activeMenu !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (activeMenu !== item.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>
              <p style={{ color: activeMenu === item.id ? "#fff" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: activeMenu === item.id ? 600 : 400, margin: 0 }}>{item.label}</p>
            </button>
          ))}
        </nav>

        <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => logout()}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.75rem 1rem", borderRadius: 10, border: "none", cursor: "pointer", width: "100%", background: "transparent", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,80,80,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 18 }}>⎋</span>
            <p style={{ color: "rgba(255,100,100,0.8)", fontSize: 13, fontWeight: 500, margin: 0 }}>Se déconnecter</p>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 260, flex: 1, padding: "2.5rem 2.5rem", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#9997a0", fontSize: 13, fontWeight: 500, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {menuItems.find(m => m.id === activeMenu)?.desc}
          </p>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "#0e0e14", margin: 0, letterSpacing: "-0.5px" }}>
            {menuItems.find(m => m.id === activeMenu)?.label}
          </h1>
        </div>

        {/* UPLOAD PAGE — deux colonnes */}
        {activeMenu === "upload" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>

            {/* Colonne gauche */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Infos réunion */}
              <div style={{ background: "#fff", borderRadius: 20, padding: "1.75rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0e0e14", margin: "0 0 1.25rem", paddingBottom: "1rem", borderBottom: "1px solid #f0ede8" }}>
                  Informations de la réunion
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4a4760", marginBottom: 6 }}>
                      Nom de la réunion <span style={{ color: "#6C63FF" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Réunion équipe produit — Sprint 12"
                      value={form.nom}
                      onChange={e => setForm({ ...form, nom: e.target.value })}
                      style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: 10, border: "1.5px solid #e8e5f0", fontSize: 14, color: "#0e0e14", background: "#fafaf9", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = "#6C63FF"}
                      onBlur={e => e.target.style.borderColor = "#e8e5f0"}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4a4760", marginBottom: 6 }}>
                      Domaine <span style={{ color: "#6C63FF" }}>*</span>
                    </label>
                    <select
                      value={form.domaine}
                      onChange={e => setForm({ ...form, domaine: e.target.value })}
                      style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: 10, border: "1.5px solid #e8e5f0", fontSize: 14, color: form.domaine ? "#0e0e14" : "#9997a0", background: "#fafaf9", outline: "none", boxSizing: "border-box", cursor: "pointer", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = "#6C63FF"}
                      onBlur={e => e.target.style.borderColor = "#e8e5f0"}
                    >
                      <option value="">Sélectionner un domaine</option>
                      <option value="tech">Technologie & Produit</option>
                      <option value="marketing">Marketing & Communication</option>
                      <option value="rh">Ressources Humaines</option>
                      <option value="finance">Finance & Comptabilité</option>
                      <option value="legal">Juridique & Conformité</option>
                      <option value="direction">Direction & Stratégie</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4a4760", marginBottom: 6 }}>
                      Description
                      <span style={{ fontWeight: 400, color: "#9997a0", marginLeft: 6 }}>(optionnel)</span>
                    </label>
                    <textarea
                      placeholder="Décrivez brièvement l'objectif de cette réunion..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: 10, border: "1.5px solid #e8e5f0", fontSize: 14, color: "#0e0e14", background: "#fafaf9", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = "#6C63FF"}
                      onBlur={e => e.target.style.borderColor = "#e8e5f0"}
                    />
                  </div>
                </div>
              </div>

              {/* Zone upload */}
              <div style={{ background: "#fff", borderRadius: 20, padding: "1.75rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0e0e14", margin: "0 0 1.25rem", paddingBottom: "1rem", borderBottom: "1px solid #f0ede8" }}>
                  Fichier de la réunion
                </h2>
                {!selectedFile ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    style={{ border: `2px dashed ${dragOver ? "#6C63FF" : "#e0ddf0"}`, borderRadius: 16, padding: "2.5rem 2rem", textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(108,99,255,0.04)" : "#fafaf9", transition: "all 0.2s" }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(108,99,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: 22 }}>🎬</div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: "#0e0e14", margin: "0 0 6px" }}>Glissez votre fichier ici</p>
                    <p style={{ color: "#9997a0", fontSize: 13, margin: "0 0 1.25rem" }}>ou cliquez pour parcourir</p>
                    <span style={{ display: "inline-block", padding: "0.5rem 1.25rem", borderRadius: 8, background: "#6C63FF", color: "#fff", fontSize: 13, fontWeight: 600 }}>Choisir un fichier</span>
                    <input ref={fileRef} type="file" accept="video/*,audio/*" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "1.25rem", borderRadius: 12, background: "rgba(108,99,255,0.06)", border: "1.5px solid rgba(108,99,255,0.2)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(108,99,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                      {selectedFile.type.startsWith("video") ? "🎬" : "🎵"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: "#0e0e14", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedFile.name}</p>
                      <p style={{ color: "#9997a0", fontSize: 12, margin: 0 }}>{formatSize(selectedFile.size)}</p>
                    </div>
                    <button onClick={() => setSelectedFile(null)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(255,80,80,0.1)", color: "#ff5050", cursor: "pointer", fontSize: 18, flexShrink: 0 }}>×</button>
                  </div>
                )}
              </div>

              {/* Bouton submit */}
              <button
                disabled={!form.nom || !form.domaine || !selectedFile}
                style={{
                  width: "100%", padding: "1rem", borderRadius: 14, border: "none",
                  background: form.nom && form.domaine && selectedFile ? "linear-gradient(135deg, #6C63FF, #00C9A7)" : "#e8e5f0",
                  color: form.nom && form.domaine && selectedFile ? "#fff" : "#b0adc0",
                  fontSize: 16, fontWeight: 700, cursor: form.nom && form.domaine && selectedFile ? "pointer" : "not-allowed",
                  letterSpacing: "-0.3px", transition: "all 0.3s",
                }}
              >
                {form.nom && form.domaine && selectedFile ? "⬆ Uploader et analyser" : "Remplissez les champs requis"}
              </button>
            </div>

            {/* Colonne droite */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Stats */}
              <div style={{ background: "#fff", borderRadius: 20, padding: "1.75rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0e0e14", margin: "0 0 1.25rem" }}>Vos statistiques</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {stats.map((stat, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", borderRadius: 12, background: "#fafaf9", border: "1px solid #f0ede8" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{stat.icon}</div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#4a4760" }}>{stat.label}</span>
                      </div>
                      <span style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div style={{ background: "#0e0e14", borderRadius: 20, padding: "1.75rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: 16 }}>💡</span>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>Conseils pour un bon résultat</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {tips.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < tips.length - 1 ? 16 : 0, borderBottom: i < tips.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{tip.icon}</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 3px" }}>{tip.title}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6 }}>{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badge sécurité */}
              <div style={{ borderRadius: 16, padding: "1.25rem", background: "linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,201,167,0.08))", border: "1px solid rgba(108,99,255,0.15)", textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#6C63FF", margin: "0 0 4px" }}>🔒 Vos données sont sécurisées</p>
                <p style={{ fontSize: 12, color: "#9997a0", margin: 0, lineHeight: 1.5 }}>Tous vos fichiers sont chiffrés et ne sont jamais partagés avec des tiers.</p>
              </div>

            </div>
          </div>
        )}

        {/* PAGES VIDES */}
        {activeMenu !== "upload" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(108,99,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: "1.5rem" }}>
              {menuItems.find(m => m.id === activeMenu)?.icon}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0e0e14", margin: "0 0 8px" }}>
              {menuItems.find(m => m.id === activeMenu)?.label}
            </h2>
            <p style={{ color: "#9997a0", fontSize: 14, maxWidth: 320 }}>
              Cette section sera disponible prochainement. Commencez par uploader une réunion !
            </p>
            <button
              onClick={() => setActiveMenu("upload")}
              style={{ marginTop: "1.5rem", padding: "0.75rem 1.75rem", borderRadius: 10, background: "#6C63FF", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Uploader une réunion
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

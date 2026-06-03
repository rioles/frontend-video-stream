"use client";
import { useKeycloak } from "@/context/KeycloakContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80",
    badge: "Réunions intelligentes",
    title: "Transformez vos réunions en rapports clairs",
    subtitle: "Importez une vidéo ou un audio, obtenez un rapport structuré en quelques secondes.",
    accent: "#6C63FF",
  },
  {
    image: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1600&q=80",
    badge: "Transcription automatique",
    title: "L'IA retranscrit chaque mot de vos échanges",
    subtitle: "Fini la prise de notes manuelle. Concentrez-vous sur la discussion, pas sur le stylo.",
    accent: "#00C9A7",
  },
  {
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=80",
    badge: "Rapports structurés",
    title: "Résumés, décisions, actions — tout est là",
    subtitle: "Chaque rapport identifie les points clés, les décisions prises et les tâches à suivre.",
    accent: "#FF6584",
  },
];

const features = [
  {
    icon: "🎬",
    title: "Upload vidéo & audio",
    desc: "Formats MP4, MOV, MP3, WAV supportés. Déposez votre fichier et laissez faire.",
  },
  {
    icon: "🧠",
    title: "IA de transcription",
    desc: "Reconnaissance vocale de pointe, multi-locuteurs, ponctuations automatiques.",
  },
  {
    icon: "📄",
    title: "Rapport en 1 clic",
    desc: "Résumé exécutif, décisions, points d'action — exportable en PDF ou Word.",
  },
  {
    icon: "🔒",
    title: "Données sécurisées",
    desc: "Vos fichiers sont chiffrés et jamais partagés. Conformité RGPD garantie.",
  },
];

export default function Home() {
  const { isAuthenticated, login, isLoading } = useKeycloak();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % slides.length);
        setAnimating(false);
      }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/view/dashboard"); // ✅ corrigé
    }
  }, [isLoading, isAuthenticated, router]);

  const slide = slides[current];

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #6C63FF", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6C63FF, #00C9A7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶</div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>MeetReport</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {!isAuthenticated ? (
            <>
              <a href="/view/register" style={{ padding: "0.5rem 1.25rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                S'inscrire
              </a>
              <button onClick={login} style={{ padding: "0.5rem 1.25rem", borderRadius: 8, background: "#6C63FF", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#5a52e0")}
                onMouseLeave={e => (e.currentTarget.style.background = "#6C63FF")}>
                Se connecter
              </button>
            </>
          ) : (
            <a href="/view/dashboard" style={{ padding: "0.5rem 1.25rem", borderRadius: 8, background: "#6C63FF", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Mon espace →
            </a>
          )}
        </div>
      </nav>

      {/* HERO SLIDESHOW */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>

        {/* Background image */}
        <div style={{ position: "absolute", inset: 0, transition: "opacity 0.5s ease", opacity: animating ? 0 : 1 }}>
          <img src={slide.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(1.2)" }} />
        </div>

        {/* Overlay gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,15,0.95) 40%, rgba(10,10,15,0.4) 100%)" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 4rem", maxWidth: 700, transition: "opacity 0.5s ease", opacity: animating ? 0 : 1 }}>
          <span style={{ display: "inline-block", padding: "0.3rem 1rem", borderRadius: 100, border: `1px solid ${slide.accent}`, color: slide.accent, fontSize: 13, fontWeight: 600, marginBottom: "1.5rem", letterSpacing: "0.05em", width: "fit-content" }}>
            {slide.badge}
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1.25rem", letterSpacing: "-1px" }}>
            {slide.title}
          </h1>
          <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 520 }}>
            {slide.subtitle}
          </p>

          {!isAuthenticated ? (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button onClick={login} style={{ padding: "0.85rem 2rem", borderRadius: 10, background: "#6C63FF", border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.3px" }}>
                Commencer gratuitement
              </button>
              <a href="/view/register" style={{ padding: "0.85rem 2rem", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                Créer un compte
              </a>
            </div>
          ) : (
            <a href="/view/dashboard" style={{ padding: "0.85rem 2rem", borderRadius: 10, background: "#6C63FF", color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-block", width: "fit-content" }}>
              Accéder à mon espace →
            </a>
          )}
        </div>

        {/* Slide indicators */}
        <div style={{ position: "absolute", bottom: 40, left: "4rem", display: "flex", gap: 8, zIndex: 10 }}>
          {slides.map((s, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ height: 4, width: i === current ? 32 : 16, borderRadius: 100, background: i === current ? slide.accent : "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", transition: "all 0.4s ease" }} />
          ))}
        </div>

        {/* Slide counter */}
        <div style={{ position: "absolute", bottom: 36, right: "4rem", fontSize: 13, color: "rgba(255,255,255,0.4)", fontVariantNumeric: "tabular-nums", zIndex: 10 }}>
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "6rem 4rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#6C63FF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Fonctionnalités</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, marginTop: "0.75rem", letterSpacing: "-0.5px" }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem", marginTop: "0.75rem" }}>
            De l'enregistrement au rapport, en quelques clics.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "2rem 1.75rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(108,99,255,0.08)"; e.currentTarget.style.borderColor = "rgba(108,99,255,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <div style={{ fontSize: 32, marginBottom: "1rem" }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: "0.6rem" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "4rem", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#00C9A7", letterSpacing: "0.1em", textTransform: "uppercase" }}>Comment ça marche</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, margin: "0.75rem 0 3rem", letterSpacing: "-0.5px" }}>3 étapes, c'est tout</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { n: "01", t: "Importez votre fichier", d: "Vidéo de réunion Zoom, Teams, Meet — ou un simple enregistrement audio." },
              { n: "02", t: "L'IA analyse et transcrit", d: "Identification des intervenants, horodatage, résumé automatique par section." },
              { n: "03", t: "Téléchargez votre rapport", d: "Format PDF ou Word, prêt à partager avec votre équipe." },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 24, padding: "2rem 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "left" }}>
                <span style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 900, color: "rgba(108,99,255,0.25)", letterSpacing: "-2px", lineHeight: 1, flexShrink: 0, width: 80 }}>{step.n}</span>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: "0.4rem" }}>{step.t}</h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "6rem 4rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-1px" }}>
          Prêt à gagner du temps ?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem", marginBottom: "2.5rem" }}>
          Rejoignez les équipes qui transforment leurs réunions en actions concrètes.
        </p>
        {!isAuthenticated ? (
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={login} style={{ padding: "0.9rem 2.5rem", borderRadius: 10, background: "#6C63FF", border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Se connecter
            </button>
            <a href="/view/register" style={{ padding: "0.9rem 2.5rem", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
              Créer un compte gratuit
            </a>
          </div>
        ) : (
          <a href="/view/dashboard" style={{ padding: "0.9rem 2.5rem", borderRadius: 10, background: "#6C63FF", color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
            Accéder à mon espace →
          </a>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "2rem 4rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #6C63FF, #00C9A7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>▶</div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>MeetReport</span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2025 MeetReport. Tous droits réservés.</p>
      </footer>

    </main>
  );
}

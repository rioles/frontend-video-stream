"use client";
import { useState, useEffect } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
    badge: "Génération de rapports",
    title: "Vos réunions transformées en rapports clairs",
    subtitle: "Importez votre vidéo, obtenez un rapport structuré en quelques secondes.",
    accent: "#6C63FF",
  },
  {
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
    badge: "Résumés intelligents",
    title: "L'essentiel de chaque réunion, sans effort",
    subtitle: "Notre IA identifie les moments clés et génère un résumé prêt à partager.",
    accent: "#00C9A7",
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    badge: "Transcription automatique",
    title: "Chaque mot retranscrit avec précision",
    subtitle: "Identification automatique des intervenants, horodatage et ponctuation.",
    accent: "#FF6584",
  },
  {
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
    badge: "Export & Partage",
    title: "Partagez vos rapports en un clic",
    subtitle: "Export PDF, Word ou Markdown — prêt à envoyer à votre équipe.",
    accent: "#FFB347",
  },
];

const benefits = [
  { icon: "⚡", text: "Rapport généré en moins de 2 minutes" },
  { icon: "🌍", text: "Transcription en 30+ langues" },
  { icon: "📤", text: "Export PDF, Word et Markdown" },
  { icon: "👥", text: "Identification automatique des intervenants" },
];

export const RegisterSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(p => (p + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div
      className="hidden lg:block"
      style={{
        width: "45%",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Images en fond — toutes empilées, transition opacity */}
      {slides.map((s, i) => (
        <img
          key={i}
          src={s.image}
          alt={s.title}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        />
      ))}

      {/* Overlay dégradé sombre pour lisibilité */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 100%)",
      }} />

      {/* Contenu superposé */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "2rem",
        zIndex: 10,
      }}>

        {/* Header — Logo + Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #6C63FF, #00C9A7)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
            }}>▶</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: "-0.5px" }}>
              MeetReport
            </span>
          </div>

          {/* Badge slide */}
          <div style={{
            padding: "0.35rem 0.9rem", borderRadius: 100,
            background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
            border: `1px solid ${slide.accent}60`,
            transition: "opacity 0.4s ease",
            opacity: animating ? 0 : 1,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: slide.accent, letterSpacing: "0.05em" }}>
              {slide.badge}
            </span>
          </div>
        </div>

        {/* Bas — Texte slide + indicateurs + bénéfices */}
        <div>

          {/* Titre + sous-titre */}
          <div style={{
            marginBottom: "1.5rem",
            transition: "opacity 0.4s ease",
            opacity: animating ? 0 : 1,
          }}>
            <h2 style={{
              fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
              fontWeight: 800, color: "#fff",
              lineHeight: 1.2, margin: "0 0 0.6rem",
              letterSpacing: "-0.5px",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}>
              {slide.title}
            </h2>
            <p style={{
              fontSize: 14, color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7, margin: 0,
            }}>
              {slide.subtitle}
            </p>
          </div>

          {/* Indicateurs */}
          <div style={{ display: "flex", gap: 8, marginBottom: "1.75rem" }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  height: 4, width: i === current ? 28 : 14,
                  borderRadius: 100,
                  background: i === current ? slide.accent : "rgba(255,255,255,0.3)",
                  border: "none", cursor: "pointer",
                  transition: "all 0.4s ease", padding: 0,
                }}
              />
            ))}
          </div>

          {/* Séparateur */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.5rem" }}>
            <p style={{
              fontSize: 11, fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              margin: "0 0 1rem",
            }}>
              Ce que vous obtenez
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {benefits.map((b, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 10, padding: "0.6rem 0.75rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{b.icon}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500, lineHeight: 1.4 }}>
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

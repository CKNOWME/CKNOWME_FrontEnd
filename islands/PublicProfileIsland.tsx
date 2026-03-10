import { useEffect, useState } from "preact/hooks";
import { Certificate, PublicUser } from "../types.ts";
import CertCard from "../components/CertCard.tsx";
import Loading from "../components/Loading.tsx";

const PublicProfileIsland = () => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    const username = decodeURIComponent(globalThis.location.pathname.slice(1));

    const load = async () => {
      try {
        const res = await fetch(`/api/user/${username}`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError("Usuario no encontrado");
          return;
        }
        if (!cancelled) setUser((data as { user: PublicUser }).user);
      } catch (_err) {
        if (!cancelled) setError("No se pudo cargar el perfil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <section class="hero">
        <div class="hero-badge">
          <span class="dot" /> Error
        </div>
        <h1 class="hero-title">{error}</h1>
        <p class="hero-sub">Prueba con otro username.</p>
      </section>
    );
  }

  if (!user) return null;

  const certs: Certificate[] = user.certs ?? [];
  const profileUrl = globalThis.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=6&data=${encodeURIComponent(profileUrl)}&color=8bff2b&bgcolor=0a0c10`;
  const qrDownloadUrl = `${qrUrl}&format=png`;

  return (
    <>
      <section class="hero" style={{ paddingBottom: "2rem" }}>
        <div class="hero-badge">
          <span class="dot" /> Perfil publico
        </div>
        <h1 class="hero-title">
          {user.name} <em>@{user.username}</em>
        </h1>
        <p class="hero-sub">{certs.length} certificaciones publicadas</p>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              style={{ width: "120px", height: "120px", borderRadius: "999px", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "999px",
                background: "rgba(255,255,255,.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                color: "rgba(255,255,255,.45)",
              }}
            >
              ◈
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: ".45rem", minWidth: "220px" }}>
            {typeof user.age === "number" && (
              <div class="hero-sub">Edad: {user.age}</div>
            )}
            {user.studies && (
              <div class="hero-sub">Estudios: {user.studies}</div>
            )}
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
              {user.links?.github && (
                <a class="btn-secondary" href={user.links.github} target="_blank" rel="noreferrer">GitHub</a>
              )}
              {user.links?.portfolio && (
                <a class="btn-secondary" href={user.links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
              )}
              {user.links?.linkedin && (
                <a class="btn-secondary" href={user.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              )}
              {user.links?.website && (
                <a class="btn-secondary" href={user.links.website} target="_blank" rel="noreferrer">Website</a>
              )}
              {user.cv && (
                <a class="btn-primary" href={user.cv} download={`cv-${user.username}.pdf`}>Descargar CV</a>
              )}
            </div>
          </div>
          <div class="qr-card">
            <div class="qr-head">
              <span>Compartir perfil</span>
              <span class="qr-chip">QR</span>
            </div>
            <div class="qr-frame">
              <span class="qr-glow" />
              <img src={qrUrl} alt="QR" />
            </div>
            <div class="qr-actions">
              <a class="btn-primary" href={qrDownloadUrl} download={`qr-${user.username}.png`}>Descargar QR</a>
            </div>
            <div class="qr-url">{profileUrl}</div>
          </div>
        </div>
      </section>

      <section>
        <div class="cards" id="cards">
          {certs.length === 0
            ? (
              <div class="empty">
                <span class="empty-g">◈</span>
                <p>Este usuario aun no ha publicado certificados</p>
              </div>
            )
            : certs.map((cert) => (
              <CertCard key={cert.id} {...cert} />
            ))}
        </div>
      </section>
    </>
  );
};

export default PublicProfileIsland;

import { useEffect, useRef, useState } from "preact/hooks";
import { User, UserLinks } from "../types.ts";
import Loading from "./Loading.tsx";
import { getCsrfToken } from "../utils.ts";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [studies, setStudies] = useState("");
  const [links, setLinks] = useState<UserLinks>({});
  const [photo, setPhoto] = useState<string>("");
  const [cv, setCv] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [photoStatus, setPhotoStatus] = useState<string>("");
  const [cvStatus, setCvStatus] = useState<string>("");
  const [photoMenu, setPhotoMenu] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const cvRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const res = await fetch("/api/user/me", {
          method: "POST",
          headers: { "x-csrf-token": getCsrfToken() },
        });
        if (!res.ok) {
          globalThis.location.replace("/");
          return;
        }
        const data = await res.json();
        const current = (data as { user: User }).user;
        if (!cancelled) {
          setUser(current);
          setName(current.name || "");
          setEmail(current.email || "");
          setPhoto(current.photo || "");
          setCv(current.cv || "");
          setAge(current.age);
          setStudies(current.studies || "");
          setLinks(current.links || {});
        }
      } catch (_err) {
        if (!cancelled) globalThis.location.replace("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSave = async (e: Event) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatus("");
    const csrf = getCsrfToken();
    const res = await fetch("/api/user/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify({ name, email, age, studies, links }),
    });
    if (!res.ok) {
      setStatus("No se pudo actualizar el perfil");
      setSaving(false);
      return;
    }
    const data = await res.json();
    setUser((data as { user: User }).user);
    setStatus("Perfil actualizado");
    setSaving(false);
  };

  const onPhotoChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!/image\/(png|jpeg|jpg)/.test(file.type)) {
      setPhotoStatus("Solo PNG o JPG/JPEG");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoStatus("Maximo 2MB");
      return;
    }
    const form = new FormData();
    form.append("photo", file);
    setUploading(true);
    setPhotoStatus("");

    const csrf = getCsrfToken();
    const res = await fetch("/api/user/photo", {
      method: "POST",
      headers: { "x-csrf-token": csrf },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      setPhotoStatus((data as { error?: string }).error || "Error al subir");
      setUploading(false);
      return;
    }
    setPhoto((data as { photo?: string }).photo || "");
    setPhotoStatus("Foto actualizada");
    setUploading(false);
    setPhotoMenu(false);
  };


  const onCvChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setCvStatus("Solo PDF");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setCvStatus("Maximo 4MB");
      return;
    }
    const form = new FormData();
    form.append("cv", file);
    setCvUploading(true);
    setCvStatus("");

    const csrf = getCsrfToken();
    const res = await fetch("/api/user/cv", {
      method: "POST",
      headers: { "x-csrf-token": csrf },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      setCvStatus((data as { error?: string }).error || "Error al subir");
      setCvUploading(false);
      return;
    }
    setCv((data as { cv?: string }).cv || "");
    setCvStatus("CV actualizado");
    setCvUploading(false);
  };

  const onDeleteCv = async () => {
    setCvUploading(true);
    setCvStatus("");
    const csrf = getCsrfToken();
    const res = await fetch("/api/user/cv", {
      method: "DELETE",
      headers: { "x-csrf-token": csrf },
    });
    if (!res.ok) {
      setCvStatus("No se pudo eliminar");
      setCvUploading(false);
      return;
    }
    setCv("");
    setCvStatus("CV eliminado");
    setCvUploading(false);
  };

  const onDeletePhoto = async () => {
    setUploading(true);
    setPhotoStatus("");
    const csrf = getCsrfToken();
    const res = await fetch("/api/user/photo", {
      method: "DELETE",
      headers: { "x-csrf-token": csrf },
    });
    if (!res.ok) {
      setPhotoStatus("No se pudo eliminar");
      setUploading(false);
      return;
    }
    setPhoto("");
    setPhotoStatus("Foto eliminada");
    setUploading(false);
    setPhotoMenu(false);
  };

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <section class="hero" style={{ paddingBottom: "1.5rem" }}>
      <div class="hero-badge">
        <span class="dot" />Mi Perfil
      </div>
      <h1 class="hero-title">
        Hola, <em>{user.name}</em>
      </h1>
      <p class="hero-sub">
        @{user.username} · {user.certs.length} certificaciones
      </p>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            class="avatar-btn"
            onClick={() => setPhotoMenu((v) => !v)}
            aria-label="Editar foto"
          >
            {photo ? (
              <img
                src={photo}
                alt="Avatar"
                class="avatar-img"
              />
            ) : (
              <div class="avatar-empty">◈</div>
            )}
            <span class="avatar-overlay">Editar</span>
          </button>
          {photoMenu && (
            <div class="avatar-menu">
              <button type="button" onClick={() => fileRef.current?.click()}>
                Cambiar foto
              </button>
              <button type="button" onClick={onDeletePhoto} disabled={uploading}>
                Eliminar foto
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg"
            onChange={onPhotoChange}
            style={{ display: "none" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
          <div style={{ color: "#dde2ee", fontWeight: 700 }}>{user.name}</div>
          <div style={{ color: "#7c8799", fontFamily: "DM Mono, monospace", fontSize: ".78rem" }}>
            {user.email}
          </div>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {!cv && (
              <button class="btn-secondary" type="button" onClick={() => cvRef.current?.click()} disabled={cvUploading}>
                Subir CV (PDF)
              </button>
            )}
            {cv && (
              <a class="btn-secondary" href={cv} download={`cv-${user.username}.pdf`}>Descargar CV</a>
            )}
            {cv && (
              <button class="btn-secondary" type="button" onClick={onDeleteCv} disabled={cvUploading}>
                Eliminar CV
              </button>
            )}
          </div>
          <input
            ref={cvRef}
            type="file"
            accept="application/pdf"
            onChange={onCvChange}
            style={{ display: "none" }}
          />
          {photoStatus && (
            <div class="hero-sub">{photoStatus}</div>
          )}
          {cvStatus && (
            <div class="hero-sub">{cvStatus}</div>
          )}
        </div>
      </div>

      <form onSubmit={onSave} class="form" style={{ maxWidth: "720px", marginTop: "2rem" }}>
        <div class="form-row">
          <div class="fg">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="fg">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
          </div>
        </div>
        <div class="form-row">
          <div class="fg">
            <label htmlFor="age">Edad</label>
            <input
              id="age"
              type="number"
              min="0"
              value={age ?? ""}
              onInput={(e) => setAge(Number((e.target as HTMLInputElement).value) || undefined)}
            />
          </div>
          <div class="fg">
            <label htmlFor="studies">Estudios</label>
            <input
              id="studies"
              type="text"
              placeholder="Grado, Bootcamp..."
              value={studies}
              onInput={(e) => setStudies((e.target as HTMLInputElement).value)}
            />
          </div>
        </div>
        <div class="form-row">
          <div class="fg">
            <label htmlFor="github">GitHub</label>
            <input
              id="github"
              type="url"
              placeholder="https://github.com/usuario"
              value={links.github || ""}
              onInput={(e) => setLinks({ ...links, github: (e.target as HTMLInputElement).value })}
            />
          </div>
          <div class="fg">
            <label htmlFor="portfolio">Portfolio</label>
            <input
              id="portfolio"
              type="url"
              placeholder="https://tu-portfolio.com"
              value={links.portfolio || ""}
              onInput={(e) => setLinks({ ...links, portfolio: (e.target as HTMLInputElement).value })}
            />
          </div>
        </div>
        <div class="form-row">
          <div class="fg">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/usuario"
              value={links.linkedin || ""}
              onInput={(e) => setLinks({ ...links, linkedin: (e.target as HTMLInputElement).value })}
            />
          </div>
          <div class="fg">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              placeholder="https://tusitio.com"
              value={links.website || ""}
              onInput={(e) => setLinks({ ...links, website: (e.target as HTMLInputElement).value })}
            />
          </div>
        </div>
        <div class="form-acts">
          {status && (
            <span class="hero-sub" style={{ marginRight: "auto" }}>{status}</span>
          )}
          <button class="btn-save" type="submit" disabled={saving || uploading}>
            {saving ? "Guardando..." : "Guardar perfil"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Profile;

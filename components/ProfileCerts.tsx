import { useEffect, useMemo, useState } from "preact/hooks";
import { Certificate } from "../types.ts";
import CertCard from "./CertCard.tsx";
import { getCsrfToken } from "../utils.ts";

const getCerts = async (): Promise<Certificate[]> => {
  const res = await fetch("/api/certificate");
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Error");
  }
  return (data as { certs?: Certificate[] }).certs ?? [];
};

const getMyCertIds = async (): Promise<string[]> => {
  const res = await fetch("/api/user/me", {
    method: "POST",
    headers: { "x-csrf-token": getCsrfToken() },
  });
  const data = await res.json();
  if (!res.ok) return [];
  return (data as { user?: { certs?: string[] } }).user?.certs ?? [];
};

const getCertById = async (id: string): Promise<Certificate | null> => {
  const res = await fetch(`/api/certificate/${id}`);
  const data = await res.json();
  if (!res.ok) return null;
  return (data as { cert?: Certificate }).cert ?? null;
};

const THIS_YEAR = new Date().getFullYear();
const DAY_MS = 24 * 60 * 60 * 1000;

const ProfileCerts = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [tagEditInput, setTagEditInput] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const loaded = await getCerts();
      if (loaded.length > 0) {
        setCerts(loaded);
        setError("");
        return;
      }
      const ids = await getMyCertIds();
      if (ids.length > 0) {
        const items = await Promise.all(ids.map(getCertById));
        const filtered = items.filter((c): c is Certificate => Boolean(c));
        setCerts(filtered);
      } else {
        setCerts([]);
      }
      setError("");
    } catch (err) {
      setError((err as Error).message || "No se pudieron cargar los certificados");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const thisYear = useMemo(
    () => certs.filter((c) => new Date(c.date).getFullYear() === THIS_YEAR).length,
    [certs],
  );

  const expiringSoon = useMemo(() => {
    const now = Date.now();
    return certs.filter((c) =>
      typeof c.expiresAt === "number" && c.expiresAt > now && c.expiresAt - now < 30 * DAY_MS
    );
  }, [certs]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const tagQ = tag.trim().toLowerCase();
    const fromMs = from ? Date.parse(from) : null;
    const toMs = to ? Date.parse(to) : null;
    return certs.filter((c) => {
      const termOk = !q ||
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      const catOk = !category || c.category?.toLowerCase().includes(category.toLowerCase());
      const tagOk = !tagQ || (c.tags || []).some((t) => t.toLowerCase().includes(tagQ));
      const fromOk = !fromMs || c.date >= fromMs;
      const toOk = !toMs || c.date <= toMs;
      return termOk && catOk && tagOk && fromOk && toOk;
    });
  }, [certs, search, category, tag, from, to]);

  const onDelete = async (id: string) => {
    const csrf = getCsrfToken();
    await fetch(`/api/certificate/${id}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrf },
    });
    await load();
  };

  const onSaveEdit = async (e: Event) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const csrf = getCsrfToken();
    await fetch(`/api/certificate/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    await load();
  };

  return (
    <section class="section-compact">
      <div class="mini-head">
        <div>
          <h2>Mis certificados</h2>
          <p>Gestiona tu portfolio en un vistazo.</p>
        </div>
        <div class="mini-stats">
          <div>
            <span class="mini-n">{certs.length}</span>
            <span>Total</span>
          </div>
          <div>
            <span class="mini-n">{thisYear}</span>
            <span>Este ano</span>
          </div>
        </div>
      </div>

      {expiringSoon.length > 0 && (
        <div class="hero-sub" style={{ marginBottom: "1rem" }}>
          {expiringSoon.length} certificado(s) caducan en menos de 30 dias.
        </div>
      )}

      <div class="mini-tools">
        <label class="search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Buscar..."
            value={search}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
        </label>
        <input
          class="search"
          style={{ width: "160px" }}
          placeholder="Categoria"
          value={category}
          onInput={(e) => setCategory((e.target as HTMLInputElement).value)}
        />
        <input
          class="search"
          style={{ width: "160px" }}
          placeholder="Tag"
          value={tag}
          onInput={(e) => setTag((e.target as HTMLInputElement).value)}
        />
        <input
          class="search"
          type="date"
          value={from}
          onInput={(e) => setFrom((e.target as HTMLInputElement).value)}
        />
        <input
          class="search"
          type="date"
          value={to}
          onInput={(e) => setTo((e.target as HTMLInputElement).value)}
        />
        <a class="btn-secondary" href="/certs/add">Añadir</a>
        <a class="btn-secondary" href="/certs/import">Importar</a>
      </div>

      {error && (
        <div class="hero-sub" style={{ marginBottom: "1rem" }}>{error}</div>
      )}

      <div class="cards cards-compact" id="cards">
        {visible.length === 0
          ? (
            <div class="empty">
              <span class="empty-g">◈</span>
              <p>No hay certificados</p>
            </div>
          )
          : visible.map((cert) => (
            <div key={cert.id}>
              <CertCard {...cert} />
              <div class="card-acts" style={{ marginTop: ".4rem" }}>
                <button class="ca-btn" onClick={() => setEditing({ ...cert })}>Editar</button>
                <button class="ca-btn del" onClick={() => onDelete(cert.id)}>Eliminar</button>
              </div>
            </div>
          ))}
      </div>

      {editing && (
        <div class="overlay">
          <div class="modal">
            <div class="modal-head">
              <h2>Editar certificado</h2>
              <button type="button" class="m-close" onClick={() => setEditing(null)}>✕</button>
            </div>
            <form class="form" onSubmit={onSaveEdit}>
              <div class="form-row">
                <div class="fg">
                  <label>Titulo</label>
                  <input
                    value={editing.title}
                    onInput={(e) => setEditing({ ...editing, title: (e.target as HTMLInputElement).value })}
                  />
                </div>
                <div class="fg">
                  <label>Emisor</label>
                  <input
                    value={editing.issuer}
                    onInput={(e) => setEditing({ ...editing, issuer: (e.target as HTMLInputElement).value })}
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="fg">
                  <label>Categoria</label>
                  <input
                    value={editing.category}
                    onInput={(e) => setEditing({ ...editing, category: (e.target as HTMLInputElement).value })}
                  />
                </div>
                <div class="fg">
                  <label>Tags (coma)</label>
                  <input
                    value={tagEditInput}
                    onInput={(e) => setTagEditInput((e.target as HTMLInputElement).value)}
                  />
                </div>
              </div>
              <div class="fg">
                <label>Descripcion</label>
                <textarea
                  value={editing.description}
                  onInput={(e) => setEditing({ ...editing, description: (e.target as HTMLTextAreaElement).value })}
                />
              </div>
              <div class="form-row">
                <div class="fg">
                  <label>Publico</label>
                  <select
                    value={editing.isPublic ? "public" : "private"}
                    onInput={(e) => setEditing({ ...editing, isPublic: (e.target as HTMLSelectElement).value === "public" })}
                  >
                    <option value="public">Publico</option>
                    <option value="private">Privado</option>
                  </select>
                </div>
                <div class="fg">
                  <label>Caduca</label>
                  <input
                    type="date"
                    value={editing.expiresAt ? new Date(editing.expiresAt).toISOString().split("T")[0] : ""}
                    onInput={(e) => setEditing({ ...editing, expiresAt: parseInt((e.target as HTMLInputElement).value) })}
                  />
                </div>
              </div>
              <div class="form-acts">
                <button type="button" class="btn-secondary" onClick={() => setEditing(null)}>Cancelar</button>
                <button type="submit" class="btn-save" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfileCerts;

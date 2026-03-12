import { useEffect, useMemo, useState } from "preact/hooks";
import { Certificate } from "../types.ts";
import CertCard from "./CertCard.tsx";

const getCerts = async (): Promise<Certificate[]> => {
  const res = await fetch("/api/certificate");
  const data = await res.json();
  if (!res.ok) return [];
  return (data as { certs?: Certificate[] }).certs ?? [];
};

const THIS_YEAR = new Date().getFullYear();

type Props = {
  compact?: boolean;
};

export default function Certifications({ compact = false }: Props) {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [certTypes, setCertTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadCerts = async () => {
      const loaded = await getCerts();
      setCerts(loaded);
      const types = new Set(loaded.map((c) => c.category || "General"));
      setCertTypes(Array.from(types));
    };
    loadCerts();
  }, []);

  const countByType = useMemo(() => {
    const map: Record<string, number> = { all: certs.length };
    for (const cert of certs) {
      const cat = cert.category || "General";
      map[cat] = (map[cat] ?? 0) + 1;
    }
    return map;
  }, [certs]);

  const thisYearCount = useMemo(
    () => certs.filter((c) => new Date(c.date).getFullYear() === THIS_YEAR).length,
    [certs],
  );

  const activeCatCount = useMemo(
    () => new Set(certs.map((c) => c.category || "General")).size,
    [certs],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return certs.filter((c) => {
      const cat = c.category || "General";
      const catOk = filter === "all" || cat === filter;
      const termOk = !q ||
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      return catOk && termOk;
    });
  }, [certs, filter, search]);

  return (
    <section class={compact ? "section-compact" : ""}>
      {!compact && (
        <>
          <div class="hero-badge">
            <span class="dot" /> Portfolio activo
          </div>
          <h1 class="hero-title">
            Mis <em>Certificaciones</em><br />Profesionales
          </h1>
          <p class="hero-sub">
            Coleccion verificable de logros, cursos y acreditaciones
          </p>
        </>
      )}

      <div class={compact ? "stats stats-compact" : "stats"}>
        <div class="stat">
          <span class="stat-n">{certs.length}</span>
          <span class="stat-l">Total</span>
        </div>
        <span class="stat-div" />
        <div class="stat">
          <span class="stat-n">{thisYearCount}</span>
          <span class="stat-l">Este ano</span>
        </div>
        <span class="stat-div" />
        <div class="stat">
          <span class="stat-n">{activeCatCount}</span>
          <span class="stat-l">Categorias</span>
        </div>
      </div>

      <div class={compact ? "toolbar toolbar-compact" : "toolbar"}>
        <div class="filters">
          <button
            type="button"
            class={`f-btn${filter === "all" ? " on" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos <span class="badge">{countByType.all ?? 0}</span>
          </button>
          {certTypes.map((cat) =>
            (countByType[cat] ?? 0) > 0 && (
              <button
                type="button"
                key={cat}
                class={`f-btn${filter === cat ? " on" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat} <span class="badge">{countByType[cat]}</span>
              </button>
            )
          )}
        </div>

        <label class="search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Buscar certificados…"
            value={search}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
        </label>
      </div>

      <div class={compact ? "cards cards-compact" : "cards"} id="cards">
        {visible.length === 0
          ? (
            <div class="empty">
              <span class="empty-g">◈</span>
              <p>
                {search || filter !== "all"
                  ? "Ningun certificado coincide"
                  : "Aun no hay certificados"}
              </p>
              {!search && filter === "all" && !compact && (
                <span>Haz clic en "+ Añadir certificado" para empezar</span>
              )}
            </div>
          )
          : visible.map((cert) => (
            <CertCard
              key={cert.id}
              {...cert}
            />
          ))}
      </div>
    </section>
  );
}

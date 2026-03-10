import { useState } from "preact/hooks";
import { Certificate } from "../types.ts";
import { getCsrfToken } from "../utils.ts";

const parseCsv = (text: string): Partial<Certificate>[] => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => row[h] = (cols[i] || "").trim());
    return {
      title: row.title,
      issuer: row.issuer,
      description: row.description,
      date: row.date ? Date.parse(row.date) : Date.now(),
      category: row.category || "General",
      pdfUrl: row.pdfUrl || "",
      verifyUrl: row.verifyUrl || "",
      photo: row.photo || "",
      tags: row.tags ? row.tags.split(";").map((t) => t.trim()).filter(Boolean) : [],
      expiresAt: row.expiresAt ? Date.parse(row.expiresAt) : undefined,
      isPublic: row.isPublic !== "false",
    } as Partial<Certificate>;
  });
};

const parseOpenBadges = (json: any): Partial<Certificate>[] => {
  const items: any[] = Array.isArray(json) ? json : [json];
  return items.map((item) => {
    const badge = item.badge || item.assertion?.badge || item.badgeclass || {};
    const issuer = badge.issuer?.name || item.issuer || "";
    const title = badge.name || item.title || "";
    const description = badge.description || item.description || "";
    const date = item.issuedOn || item.issuedOn || item.date || Date.now();
    return {
      title,
      issuer,
      description,
      date: typeof date === "string" ? Date.parse(date) : date,
      category: "OpenBadges",
      verifyUrl: item.verify?.url || "",
      pdfUrl: "",
      photo: badge.image || "",
      tags: [],
      isPublic: true,
    } as Partial<Certificate>;
  });
};

const ImportCerts = () => {
  const [status, setStatus] = useState<string>("");
  const [credlyUrl, setCredlyUrl] = useState<string>("");
  const [credlyStatus, setCredlyStatus] = useState<string>("");

  const upload = async (items: Partial<Certificate>[]) => {
    const csrf = getCsrfToken();
    for (const item of items) {
      await fetch("/api/certificate/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
        body: JSON.stringify(item),
      });
    }
  };

  const onCsv = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const text = await file.text();
    const items = parseCsv(text);
    await upload(items);
    setStatus("Importacion CSV completada");
  };

  const onJson = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const text = await file.text();
    const json = JSON.parse(text);
    const items = parseOpenBadges(json);
    await upload(items);
    setStatus("Importacion Open Badges completada");
  };


  const onCredlyImport = async () => {
    setCredlyStatus("");
    const url = credlyUrl.trim();
    if (!url) {
      setCredlyStatus("Introduce una URL de Credly");
      return;
    }
    const csrf = getCsrfToken();
    const res = await fetch("/api/oauth/credly/import", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCredlyStatus(data.error || "No se pudo importar desde Credly");
      return;
    }
    setCredlyStatus(`Importados: ${data.imported ?? 0}, omitidos: ${data.skipped ?? 0}`);
  };

  return (
    <section class="hero">
      <div class="hero-badge">
        <span class="dot" /> Importar certificados
      </div>
      <h1 class="hero-title">Importar</h1>
      <p class="hero-sub">Soporta CSV (LinkedIn) y Open Badges JSON (Credly).</p>

      <div class="form" style={{ maxWidth: "720px" }}>
        <div class="fg">
          <label>CSV (headers: title,issuer,description,date,category,pdfUrl,verifyUrl,photo,tags,expiresAt,isPublic)</label>
          <input type="file" accept="text/csv" onChange={onCsv} />
        </div>
        <div class="fg">
          <label>Open Badges JSON</label>
          <input type="file" accept="application/json" onChange={onJson} />
        </div>

        <div class="fg">
          <label>Credly (URL de perfil publico o endpoint de badges)</label>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <input
              type="url"
              placeholder="https://www.credly.com/users/tu-usuario"
              value={credlyUrl}
              onInput={(e) => setCredlyUrl((e.target as HTMLInputElement).value)}
              style={{ flex: "1 1 320px" }}
            />
            <button class="btn-primary" type="button" onClick={onCredlyImport}>Importar Credly</button>
          </div>
          {credlyStatus && <div class="hero-sub">{credlyStatus}</div>}
        </div>
        {status && <div class="hero-sub">{status}</div>}
      </div>
    </section>
  );
};

export default ImportCerts;

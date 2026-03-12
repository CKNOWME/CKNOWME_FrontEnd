import { useRef, useState } from "preact/hooks";
import { getCsrfToken } from "../utils.ts";

const ImportCerts = () => {
  const linkedinRef = useRef<HTMLInputElement | null>(null);
  const [linkedinFile, setLinkedinFile] = useState<string>("");
  const [credlyUrl, setCredlyUrl] = useState<string>("");
  const [credlyStatus, setCredlyStatus] = useState<string>("");
  const [credlyLoading, setCredlyLoading] = useState<boolean>(false);


  const ensureCsrf = async (): Promise<string> => {
    let token = getCsrfToken();
    if (!token) {
      await fetch("/api/csrf");
      token = getCsrfToken();
    }
    return token;
  };


  const normalizeUrl = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };


  const [linkedinStatus, setLinkedinStatus] = useState<string>("");
  const [linkedinLoading, setLinkedinLoading] = useState<boolean>(false);

  const onLinkedinImport = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    setLinkedinFile(file.name);
    if (file.type !== "text/html") {
      setLinkedinStatus("Sube el HTML guardado de LinkedIn");
      return;
    }
    setLinkedinLoading(true);
    setLinkedinStatus("");
    const form = new FormData();
    form.append("html", file);
    const csrf = await ensureCsrf();
    const res = await fetch("/api/oauth/linkedin/import-html", {
      method: "POST",
      headers: { "x-csrf-token": csrf },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      setLinkedinStatus(data.error || "No se pudo importar LinkedIn");
      setLinkedinLoading(false);
      return;
    }
    setLinkedinStatus(`Importados: ${data.imported ?? 0}, omitidos: ${data.skipped ?? 0}`);
    setLinkedinLoading(false);
  };

  const onCredlyImport = async () => {
    setCredlyStatus("");
    setCredlyLoading(true);
    const url = normalizeUrl(credlyUrl);
    if (!url) {
      setCredlyStatus("Introduce una URL de Credly");
      setCredlyLoading(false);
      return;
    }
    const csrf = await ensureCsrf();
    const res = await fetch("/api/oauth/credly/import", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCredlyStatus(data.error || "No se pudo importar desde Credly");
      setCredlyLoading(false);
      return;
    }
    setCredlyStatus(`Importados: ${data.imported ?? 0}, omitidos: ${data.skipped ?? 0}`);
    setCredlyLoading(false);
  };

  return (
    <section class="hero">
      <div class="hero-badge">
        <span class="dot" /> Importar certificados
      </div>
      <h1 class="hero-title">Importar</h1>
      <p class="hero-sub">Importa certificados desde Credly o desde HTML guardado de LinkedIn.</p>

      <div class="form" style={{ maxWidth: "720px" }}>
        <div class="fg">
          <label><span class="brand-pill li-pill"><span class="brand-dot li-dot">in</span>LinkedIn</span> HTML guardado</label>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <input
              type="text"
              value={linkedinFile || "Selecciona tu archivo html"}
              readOnly
              style={{ flex: "1 1 320px" }}
            />
            <button class="btn-save" type="button" onClick={() => linkedinRef.current?.click()} disabled={linkedinLoading}>
              {linkedinLoading ? "Importando..." : "Importar LinkedIn"}
            </button>
          </div>
          <input
            ref={linkedinRef}
            type="file"
            accept="text/html"
            onChange={onLinkedinImport}
            style={{ display: "none" }}
          />
          {linkedinStatus && <div class="hero-sub">{linkedinStatus}</div>}
        </div>


        <div class="fg">
          <label><span class="brand-pill credly-pill"><span class="brand-dot credly-dot">C</span>Credly</span> URL de perfil publico o endpoint de badges</label>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <input
              type="url"
              placeholder="https://www.credly.com/users/tu-usuario"
              value={credlyUrl}
              onInput={(e) => setCredlyUrl((e.target as HTMLInputElement).value)}
              style={{ flex: "1 1 320px" }}
            />
            <button class="btn-save" type="button" onClick={onCredlyImport} disabled={credlyLoading}>{credlyLoading ? "Importando..." : "Importar Credly"}</button>
          </div>
          {credlyStatus && <div class="hero-sub">{credlyStatus}</div>}
        </div>
      </div>
    </section>
  );
};

export default ImportCerts;

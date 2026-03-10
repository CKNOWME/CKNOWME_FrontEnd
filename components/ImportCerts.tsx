import { useState } from "preact/hooks";
import { getCsrfToken } from "../utils.ts";

const ImportCerts = () => {
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
      <p class="hero-sub">Importa tus badges desde una URL publica de Credly.</p>

      <div class="form" style={{ maxWidth: "720px" }}>

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
            <button class="btn-save" type="button" onClick={onCredlyImport} disabled={credlyLoading}>{credlyLoading ? "Importando..." : "Importar Credly"}</button>
          </div>
          {credlyStatus && <div class="hero-sub">{credlyStatus}</div>}
        </div>
      </div>
    </section>
  );
};

export default ImportCerts;

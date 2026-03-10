import { useState } from "preact/hooks";
import { redirectToPdf, computeSHA256 } from "../utils.ts";
import { Certificate } from "../types.ts";

const formatDate = (value: number) => {
  try {
    return new Date(value).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
};

const classForCategory = (raw?: string) => {
  const value = raw || "General";
  const allowed = ["Cloud", "Security", "Development", "Data", "Management", "General"];
  return allowed.includes(value) ? value : "General";
};

const CertCard = (cert: Certificate) => {
  const [verifyMsg, setVerifyMsg] = useState<string>("");
  const categoryLabel = cert.category || "General";
  const categoryClass = classForCategory(categoryLabel);

  const onVerify = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file || !cert.hash) return;
    setVerifyMsg("Verificando...");
    const hash = await computeSHA256(file);
    if (hash === cert.hash) {
      setVerifyMsg("✅ Coincide con el hash guardado");
    } else {
      setVerifyMsg("❌ No coincide el hash");
    }
  };

  return (
    <div
      class={`card ${categoryClass}`}
      data-cat={categoryLabel}
      data-title={cert.title}
      data-issuer={cert.issuer}
    >
      <div class="thumb" onClick={() => redirectToPdf(cert.pdfUrl)}>
        {cert.photo ? (
          <img src={cert.photo} alt={cert.title} loading="lazy" />
        ) : cert.pdfUrl ? (
          <div class="thumb-pdf">
            <span class="thumb-pdf-icon">📄</span>
            <span class="thumb-pdf-lbl">PDF</span>
          </div>
        ) : (
          <div class="thumb-empty">
            <span class="thumb-empty-icon">◈</span>
            <span class="thumb-empty-hint">Sin preview</span>
          </div>
        )}
        <div class="thumb-ov">
          <span class="view-chip">Ver certificado</span>
        </div>
      </div>
      <span class="cat-tag">{categoryLabel}</span>
      {cert.isPublic === false && (
        <span class="cat-tag" style={{ left: ".72rem", right: "auto" }}>Privado</span>
      )}
      <div class="card-body">
        <h3 class="card-title">{cert.title}</h3>
        <p class="card-issuer">
          <span>◈</span> {cert.issuer}
        </p>
        <p class="card-desc">{cert.description}</p>
        {cert.tags && cert.tags.length > 0 && (
          <div class="card-acts" style={{ flexWrap: "wrap", gap: ".3rem", marginBottom: ".6rem" }}>
            {cert.tags.map((t) => (
              <span class="badge" key={t}>{t}</span>
            ))}
          </div>
        )}
        <footer class="card-foot">
          <time class="card-date">{formatDate(cert.date)}</time>
          <div class="card-acts">
            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                class="ca-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                ↗ Verificar
              </a>
            )}
          </div>
        </footer>
        {cert.hash && (
          <div style={{ marginTop: ".6rem" }}>
            <input type="file" accept="application/pdf" onChange={onVerify} />
            {verifyMsg && <div class="hero-sub" style={{ marginTop: ".3rem" }}>{verifyMsg}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertCard;

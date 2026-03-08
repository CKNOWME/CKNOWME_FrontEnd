import { redirectToPdf } from "../utils.ts";
import { Certificate } from "../types.ts";

const CertCard = (cert: Certificate) => {
  return (
    <div
      class="card data"
      data-cat="data"
      data-title={cert.title}
      data-issuer={cert.issuer}
    >
      <div class="thumb" onClick={redirectToPdf}>
        <div class="thumb-pdf">
          <span>📄</span>
          <span class="thumb-pdf-lbl">PDF</span>
        </div>
        <div class="thumb-ov">
          <span class="view-chip">Ver certificado</span>
        </div>
      </div>
      <span class="cat-tag">Data</span>
      <div class="card-body">
        <h3 class="card-title">{cert.title}</h3>
        <p class="card-issuer">
          <span>◈</span> {cert.issuer}
        </p>
        <p class="card-desc">{cert.description}</p>
        <footer class="card-foot">
          <time class="card-date">{cert.date}</time>
          <div class="card-acts">
            <a
              href={cert.verifyUrl}
              class="ca-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              ↗ Verificar
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CertCard;

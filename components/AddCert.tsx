import { useMemo, useState } from "preact/hooks";
import { Certificate, Message } from "../types.ts";
import { alertaCert } from "../signal.ts";
import MessageIsland from "../islands/MessageIsland.tsx";
import { computeSHA256, getCsrfToken } from "../utils.ts";

const emptyCert: Certificate = {
  id: "",
  title: "",
  issuer: "",
  description: "",
  date: Date.now(),
  pdfUrl: "",
  verifyUrl: "",
  photo: "",
  category: "General",
  isPublic: true,
  tags: [],
  hash: "",
  expiresAt: undefined,
};

const AddCert = () => {
  const [certificate, setCertificate] = useState<Certificate>(emptyCert);
  const [dateInput, setDateInput] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [expiryInput, setExpiryInput] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");
  const [msg, setMsg] = useState<Message>({ message: "", visible: false });
  const [hashing, setHashing] = useState(false);

  const showMessage = (message: string) => {
    setMsg({ message, visible: true });
    alertaCert.value = true;
  };

  const handleChange = (field: keyof Certificate, value: string | number | boolean) => {
    setCertificate((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = useMemo(
    () =>
      certificate.title.trim() &&
      certificate.issuer.trim() &&
      dateInput.trim(),
    [certificate.title, certificate.issuer, dateInput],
  );

  const onHashFile = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    setHashing(true);
    try {
      const hash = await computeSHA256(file);
      handleChange("hash", hash);
      showMessage("✅ Hash calculado");
    } finally {
      setHashing(false);
    }
  };

  async function handleAdd(e: Event) {
    e.preventDefault();
    if (!isValid) {
      showMessage("❌ Completa los campos obligatorios");
      return;
    }

    const payload = {
      ...certificate,
      date: dateInput,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      expiresAt: expiryInput ? expiryInput : undefined,
    };

    const csrf = getCsrfToken();
    const res = await fetch("/api/certificate/add", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      showMessage("✅ Certificado anadido");
      setCertificate(emptyCert);
      setDateInput(new Date().toISOString().split("T")[0]);
      setTagsInput("");
      setExpiryInput("");
    } else {
      showMessage(data?.error ? `❌ ${data.error}` : "❌ No se pudo anadir");
    }
  }

  return (
    <section class="hero">
      <div class="hero-badge">
        <span class="dot" /> Nuevo certificado
      </div>
      <h1 class="hero-title">
        Subir <em>Certificado</em>
      </h1>
      <p class="hero-sub">
        Guarda tus acreditaciones con enlaces verificables y PDF.
      </p>

      {msg.visible && alertaCert.value && (
        <MessageIsland message={msg.message} />
      )}


      <div class="form-acts" style={{ marginBottom: "1rem" }}>
        <a class="btn-secondary" href="/certs/import">Importar certificados</a>
      </div>

      <form onSubmit={handleAdd} class="form" style={{ maxWidth: "820px" }}>
        <div class="form-row">
          <div class="fg">
            <label htmlFor="title">Titulo</label>
            <input
              id="title"
              type="text"
              placeholder="AWS Solutions Architect"
              value={certificate.title}
              onInput={(e) => handleChange("title", (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="fg">
            <label htmlFor="issuer">Emisor</label>
            <input
              id="issuer"
              type="text"
              placeholder="Amazon Web Services"
              value={certificate.issuer}
              onInput={(e) => handleChange("issuer", (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        <div class="form-row">
          <div class="fg">
            <label htmlFor="date">Fecha</label>
            <input
              id="date"
              type="date"
              value={dateInput}
              onInput={(e) => setDateInput((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="fg">
            <label htmlFor="expiresAt">Caduca (opcional)</label>
            <input
              id="expiresAt"
              type="date"
              value={expiryInput}
              onInput={(e) => setExpiryInput((e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        <div class="form-row">
          <div class="fg">
            <label htmlFor="category">Categoria (libre)</label>
            <input
              id="category"
              type="text"
              placeholder="Cloud, Security, UX..."
              value={certificate.category}
              onInput={(e) => handleChange("category", (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="fg">
            <label htmlFor="tags">Tags (coma)</label>
            <input
              id="tags"
              type="text"
              placeholder="aws, cloud, architect"
              value={tagsInput}
              onInput={(e) => setTagsInput((e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        <div class="fg">
          <label htmlFor="description">Descripcion</label>
          <textarea
            id="description"
            placeholder="Resumen breve del logro o curso."
            value={certificate.description}
            onInput={(e) => handleChange("description", (e.target as HTMLTextAreaElement).value)}
          />
        </div>

        <div class="form-row">
          <div class="fg">
            <label htmlFor="pdfUrl">URL PDF</label>
            <input
              id="pdfUrl"
              type="url"
              placeholder="https://..."
              value={certificate.pdfUrl}
              onInput={(e) => handleChange("pdfUrl", (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="fg">
            <label htmlFor="verifyUrl">URL verificacion</label>
            <input
              id="verifyUrl"
              type="url"
              placeholder="https://..."
              value={certificate.verifyUrl}
              onInput={(e) => handleChange("verifyUrl", (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        <div class="form-row">
          <div class="fg">
            <label htmlFor="photo">Imagen portada (URL publica)</label>
            <input
              id="photo"
              type="url"
              placeholder="https://..."
              value={certificate.photo}
              onInput={(e) => handleChange("photo", (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="fg">
            <label htmlFor="hash">Hash PDF (SHA-256)</label>
            <input
              id="hash"
              type="text"
              placeholder="Calcula desde archivo PDF"
              value={certificate.hash || ""}
              onInput={(e) => handleChange("hash", (e.target as HTMLInputElement).value)}
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={onHashFile}
            />
            {hashing && <div class="hero-sub">Calculando hash...</div>}
          </div>
        </div>

        <div class="form-row">
          <div class="fg">
            <label htmlFor="isPublic">Visibilidad</label>
            <select
              id="isPublic"
              value={certificate.isPublic ? "public" : "private"}
              onInput={(e) => handleChange("isPublic", (e.target as HTMLSelectElement).value === "public")}
            >
              <option value="public">Publico</option>
              <option value="private">Privado</option>
            </select>
          </div>
        </div>

        <div class="form-acts">
          <button class="btn-secondary" type="button" onClick={() => setCertificate(emptyCert)}>
            Limpiar
          </button>
          <button class="btn-save" type="submit" disabled={!isValid}>
            Guardar certificado
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddCert;

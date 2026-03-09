import { useState } from "preact/hooks";
import { Certificate } from "../types.ts";
import { Message } from "../types.ts";
import { alertaCert } from "../signal.ts";
import MessageIsland from "../islands/MessageIsland.tsx";

const AddCert = () => {
  const [certificate, setCertificate] = useState<Certificate>({
    id: "",
    title: "",
    issuer: "",
    description: "",
    date: Date.now(),
    pdfUrl: "",
    verifyUrl: "",
    photo: "",
    category: "",
  });
  const [msg, setMsg] = useState<Message>({ message: "", visible: false });

  const showMessage = (message: string) => {
    setMsg({ message, visible: true });
    alertaCert.value = true;
  };

  const handleChange = (field: keyof Certificate, value: string | number) => {
    setCertificate((prev) => ({ ...prev, [field]: value }));
  };

  async function handleAdd(e: Event) {
    e.preventDefault();
    const res = await fetch("/api/cert/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ certificate }),
    });
    if (res.ok) {
      showMessage("✅ Añadido");
    } else {
      showMessage("❌ No se pudo añadir");
    }
  }

  const inputClass =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const labelClass = "block text-gray-700 text-sm font-bold mb-2";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Add New Certificate</h1>
      {msg.visible && alertaCert.value && (
        <MessageIsland message={msg.message} />
      )}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <div>
          <label className={labelClass} htmlFor="id">ID</label>
          <input
            id="id"
            type="text"
            placeholder="Unique certificate ID"
            value={certificate.id}
            onInput={(e) => handleChange("id", (e.target as HTMLInputElement).value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Certificate title"
            value={certificate.title}
            onInput={(e) => handleChange("title", (e.target as HTMLInputElement).value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="issuer">Issuer</label>
          <input
            id="issuer"
            type="text"
            placeholder="Issuing organization"
            value={certificate.issuer}
            onInput={(e) => handleChange("issuer", (e.target as HTMLInputElement).value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Certificate description"
            value={certificate.description}
            onInput={(e) => handleChange("description", (e.target as HTMLTextAreaElement).value)}
            className={`${inputClass} h-24 resize-none`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={new Date(certificate.date).toISOString().split("T")[0]}
            onInput={(e) =>
              handleChange("date", new Date((e.target as HTMLInputElement).value).getTime())
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="pdfUrl">PDF URL</label>
          <input
            id="pdfUrl"
            type="url"
            placeholder="https://..."
            value={certificate.pdfUrl}
            onInput={(e) => handleChange("pdfUrl", (e.target as HTMLInputElement).value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="verifyUrl">Verify URL</label>
          <input
            id="verifyUrl"
            type="url"
            placeholder="https://..."
            value={certificate.verifyUrl}
            onInput={(e) => handleChange("verifyUrl", (e.target as HTMLInputElement).value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="photo">Photo URL</label>
          <input
            id="photo"
            type="url"
            placeholder="https://..."
            value={certificate.photo}
            onInput={(e) => handleChange("photo", (e.target as HTMLInputElement).value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            placeholder="e.g. Backend, Cloud, Security..."
            value={certificate.category}
            onInput={(e) => handleChange("category", (e.target as HTMLInputElement).value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Certificate
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCert;
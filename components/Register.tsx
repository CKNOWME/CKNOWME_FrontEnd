import { useState } from "preact/hooks";
import { alertaRegistro } from "../signal.ts";
import {
  getEmailErrors,
  getPasswordErrors,
  isEmailValid,
  isPasswordValid,
} from "../utils.ts";
import LoginMessageIsland from "../islands/MessageIsland.tsx";
import { Message } from "../types.ts";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [msg, setMsg] = useState<Message>({ message: "", visible: false });
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const showMessage = (message: string) => {
    setMsg({ message, visible: true });
    alertaRegistro.value = true;
  };

  function handlePasswordChange(value: string) {
    setPassword(value);
    setPasswordError(getPasswordErrors(value));
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setEmailError(getEmailErrors(value));
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      showMessage("❌ Contraseña no valida");
      return;
    }
    if (!isEmailValid(email)) {
      showMessage("❌ Email no valido");
      return;
    }
    const bodyData = { username, email, password, name };
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });
    if (res.ok) {
      showMessage("✅ Registro correcto");
      globalThis.location.href = "/profile";
    } else {
      showMessage(
        "❌ Registro incorrecto,asegurate que el usuario no este registrado",
      );
    }
  }
  const isFormValid = username && isEmailValid(email) && name &&
    isPasswordValid(password);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Register</h1>
      {msg.visible && alertaRegistro.value && (
        <LoginMessageIsland
          message={msg.message}
        />
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            onInput={(e) =>
              handleEmailChange((e.target as HTMLInputElement).value)}
          />
          {emailError && (
            <p className="text-red-500 text-xs italic mt-2">{emailError}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            onInput={(e) =>
              handlePasswordChange((e.target as HTMLInputElement).value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>
        {passwordError && (
          <div
            style={{
              marginLeft: "40px",
              marginRight: "40px",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              marginTop: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
            }}
          >
            {passwordError}
          </div>
        )}
        {emailError.includes("❌") && (
          <div
            style={{
              marginLeft: "40px",
              marginRight: "40px",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              marginTop: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
            }}
          >
            {emailError}
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            disabled={!isFormValid}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            style={{
              opacity: isFormValid ? 1 : 0.5,
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
          >
            Register
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:text-blue-800">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;

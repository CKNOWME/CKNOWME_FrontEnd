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
import { getCsrfToken } from "../utils.ts";

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
      showMessage("❌ Contrasena no valida");
      return;
    }
    if (!isEmailValid(email)) {
      showMessage("❌ Email no valido");
      return;
    }
    const bodyData = { username, email, password, name };
    const csrf = getCsrfToken();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify(bodyData),
    });
    if (res.ok) {
      showMessage("✅ Registro correcto");
      globalThis.location.href = "/profile";
    } else {
      showMessage("❌ Registro incorrecto. Revisa tus datos.");
    }
  }
  const isFormValid = username && isEmailValid(email) && name &&
    isPasswordValid(password);

  return (
    <section class="auth-wrap">
      <div class="auth">
        <h1>Crear cuenta</h1>
        <p class="auth-sub">Sube y comparte tus certificaciones.</p>
        {msg.visible && alertaRegistro.value && (
          <LoginMessageIsland message={msg.message} />
        )}
        <form onSubmit={handleSubmit} class="auth-form">
          <div class="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
              type="text"
              placeholder="tu-username"
            />
          </div>
          <div class="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              onInput={(e) =>
                handleEmailChange((e.target as HTMLInputElement).value)}
            />
            {emailError && (
              <p class="auth-error">{emailError}</p>
            )}
          </div>
          <div class="auth-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Tu nombre"
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="auth-field">
            <label htmlFor="password">Password</label>
            <input
              onInput={(e) =>
                handlePasswordChange((e.target as HTMLInputElement).value)}
              id="password"
              type="password"
              placeholder="********"
            />
            {passwordError && (
              <p class="auth-error">{passwordError}</p>
            )}
          </div>
          <div class="auth-actions">
            <button
              disabled={!isFormValid}
              class="btn-save"
              type="submit"
              style={{ opacity: isFormValid ? 1 : 0.5 }}
            >
              Crear cuenta
            </button>
          </div>
        </form>
        <p class="auth-link">
          Ya tienes cuenta? <a href="/login">Iniciar sesion</a>
        </p>
      </div>
    </section>
  );
};

export default Register;

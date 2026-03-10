import { useState } from "preact/hooks";
import { alertaLogin } from "../signal.ts";
import LoginMessageIsland from "../islands/MessageIsland.tsx";
import { Message } from "../types.ts";
import { getCsrfToken } from "../utils.ts";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msg, setMsg] = useState<Message>({ message: "", visible: false });

  const showMessage = (message: string) => {
    setMsg({ message, visible: true });
    alertaLogin.value = true;
  };

  async function handleLogin(e: Event) {
    e.preventDefault();
    const bodyData = { username, password };
    const csrf = getCsrfToken();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify(bodyData),
    });
    if (res.ok) {
      showMessage("✅ Login correcto");
      globalThis.location.replace("/profile");
    } else {
      if (res.status === 429) {
        showMessage("❌ Demasiados intentos. Prueba mas tarde.");
        return;
      }
      showMessage("❌ Login incorrecto");
    }
  }

  return (
    <section class="auth-wrap">
      <div class="auth">
        <h1>Iniciar sesion</h1>
        <p class="auth-sub">Accede a tu portfolio de certificaciones.</p>
        {msg.visible && alertaLogin.value && (
          <LoginMessageIsland message={msg.message} />
        )}
        <form onSubmit={handleLogin} class="auth-form">
          <div class="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="tu-username"
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="auth-actions">
            <button type="submit" class="btn-save">Entrar</button>
          </div>
        </form>
        <p class="auth-link">
          No tienes cuenta? <a href="/register">Crear cuenta</a>
        </p>
      </div>
    </section>
  );
};

export default Login;

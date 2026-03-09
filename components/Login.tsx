import { useState } from "preact/hooks";
import { alertaLogin } from "../signal.ts";
import LoginMessageIsland from "../islands/MessageIsland.tsx";
import { Message } from "../types.ts";

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
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });
    if (res.ok) {
      showMessage("✅ Login correcto");
      globalThis.location.replace("/profile");
    } else {
      if (res.status === 429) {
        showMessage(`❌ Blocked by rate limit. Try again later.`);
        return;
      }
      showMessage("❌ Login Incorrecto");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      {msg.visible && alertaLogin.value && (
        <LoginMessageIsland
          message={msg.message}
        />
      )}
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            id="password"
            type="password"
            placeholder="Enter your password"
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:text-blue-800">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;

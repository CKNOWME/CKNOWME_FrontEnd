import { getCsrfToken } from "../utils.ts";

const LogoutIsland = () => {
  const onLogout = async () => {
    const csrf = getCsrfToken();
    await fetch("/api/logout", {
      method: "POST",
      headers: { "x-csrf-token": csrf },
    });
    globalThis.location.replace("/");
  };

  return (
    <button type="button" class="btn-secondary" onClick={onLogout}>
      Logout
    </button>
  );
};

export default LogoutIsland;

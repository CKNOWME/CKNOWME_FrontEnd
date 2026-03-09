import { useEffect, useState } from "preact/hooks";
import {User} from "../types.ts";
import Loading from "./Loading.tsx";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const tkn = document.cookie
          .split(";")
          .find((row) => row.trim().startsWith("bearer="))
          ?.split("=")[1];
        const res = await fetch("/api/user/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bearer: tkn }),
        });

        if (!res.ok) {
          globalThis.location.replace("/");
          return;
        }

        const data = await res.json();
        if (!cancelled) setUser(data);
      } catch (_err) {
        if (!cancelled) globalThis.location.replace("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loading />;
   if (user) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <p className="text-gray-700 mb-2">
        <strong>Username:</strong> {user.username}
      </p>
      <img src={user.photo} alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
      <p className="text-gray-700 mb-2">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Certifications:</strong> {user.certs.length}
      </p>
    </div>
   );
  }
  return null;
};
export default Profile;
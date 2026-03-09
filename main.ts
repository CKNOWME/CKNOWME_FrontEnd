import { App, Context, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";
import dotenv from "dotenv";

export const app = new App<State>();
dotenv.config();

const backendUrl =
  (Deno.env.get("BACKEND_URL") || "https://cknowme-backend.sergioom9.deno.net")
    .replace(/\/$/, "");

app.use(staticFiles());

app.post("/api/user/me", async (_ctx: Context<State>) => {
  try {
    const apiResponse = await fetch(backendUrl + "/user/me");
    const data = await apiResponse.json()
    if (!apiResponse.ok) {
      if(data.error === "Too many request"){
        return new Response(
        JSON.stringify({
          error: "Rate Limit Triggered",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
      }
      return new Response(
        JSON.stringify({
          error: "No se pudo obtener la informacion del usuario",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: apiResponse.headers },
    );
  } catch (_error: Error | unknown) {
    return new Response(
      JSON.stringify({ error: `Error interno` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.post("/api/login", async (ctx: Context<State>) => {
  try {
    const data = await ctx.req.json();
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Body vacío" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const { username, password } = data;
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Campos vacíos" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const apiResponse = await fetch(backendUrl + "/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await apiResponse.json();

    if (result.error === "Anti-BruteForce Triggered") {
      return new Response(
        JSON.stringify({ error: "Email bloqueado por seguridad" }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }
    if (result.error === "Too many requests") {
      return new Response(
        JSON.stringify({
          error: "Demasiadas solicitudes, inténtalo más tarde",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Credenciales Incorrectas" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: Error | unknown) {
    console.log(err);
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.post("/api/register", async (ctx: Context<State>) => {
  try {
    const data = await ctx.req.json();
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Body vacío" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const { username, name, email, password } = data;
    if (!email || !password || !username || !name) {
      return new Response(
        JSON.stringify({ error: "Campos vacíos" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const apiResponse = await fetch(
      backendUrl + "/user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: apiResponse.statusText }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: apiResponse.headers },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: `Error interno` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.get("/api/certificate", async (_ctx: Context<State>) => {
  try {
    const apiResponse = await fetch(backendUrl + "/certificate/all");
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: "No se pudo obtener los certificados" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: apiResponse.headers },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: `Error interno` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.get("/api/certificate/:id", async (ctx: Context<State>) => {
  try {
    const { id } = ctx.params;
    const apiResponse = await fetch(backendUrl + `/certificate/${id}`);
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: "No se pudo obtener el certificado" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: apiResponse.headers },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: `Error interno` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.put("/api/certificate/:id", async (ctx: Context<State>) => {
  try {
    const { id } = ctx.params;
    const data = await ctx.req.json();
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Body vacío" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const apiResponse = await fetch(
      backendUrl + `/certificate/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: "No se pudo actualizar el certificado" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: `Error interno` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.delete("/api/certificate/:id", async (ctx: Context<State>) => {
  try {
    const { id } = ctx.params;
    const apiResponse = await fetch(
      backendUrl + `/certificate/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: "No se pudo eliminar el certificado" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify({ message: "Certificado eliminado correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: `Error interno` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

const checkAuth = define.middleware(async (ctx: Context<State>) => {
  const cookie = ctx.req.headers.get("cookie") || "";
  const match = cookie.match(/bearer=([^;]+)/);
  const token = match?.[1];
  if (!token) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }
  try {
    const checkLogin = checkToken(token);
    if (!checkLogin) {
      return new Response(JSON.stringify({ error: "Token no valido" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "bearer=; Path=/; Max-Age=0",
        },
      });
    }
    return await ctx.next();
  } catch (_e: Error | unknown) {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/login",
        "Set-Cookie": "bearer=; Path=/; Max-Age=0",
      },
    });
  }
});

const alreadylogged = define.middleware(async (ctx: Context<State>) => {
  const cookie = ctx.req.headers.get("cookie") || "";
  const match = cookie.split("=");
  const token = match?.[1];
  if (!token) return await ctx.next();
  try {
    const checktkn = checkToken(token);
    if (!checktkn) {
      return await ctx.next();
    }
    return new Response(null, {
      status: 302,
      headers: { Location: "/profile" },
    });
  } catch (_err: Error | unknown) {
    return await ctx.next();
  }
});

const checkToken = (_token: string) => {
  return true;
};

app.use("/(main)", alreadylogged);
app.use("/(me)", checkAuth);

app.fsRoutes();

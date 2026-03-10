import { App, Context, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";
import dotenv from "dotenv";

export const app = new App<State>();
dotenv.config();

const backendUrl =
  (Deno.env.get("BACKEND_URL") || "https://cknowme-backend.sergioom9.deno.net")
    .replace(/\/$/, "");

app.use(staticFiles());

const cookieFrom = (ctx: Context<State>): string => {
  return ctx.req.headers.get("cookie") || "";
};

const csrfFromHeader = (ctx: Context<State>): string => {
  return ctx.req.headers.get("x-csrf-token") || "";
};

const csrfFromCookie = (cookie: string): string => {
  const match = cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("csrf="));
  return match ? match.split("=")[1] : "";
};

const proxyHeaders = (ctx: Context<State>, extra?: HeadersInit): Headers => {
  const headers = new Headers(extra || undefined);
  const cookie = cookieFrom(ctx);
  const csrf = csrfFromHeader(ctx);
  if (cookie) headers.set("cookie", cookie);
  if (csrf) headers.set("x-csrf-token", csrf);
  return headers;
};

const requireCsrf = (ctx: Context<State>): Response | null => {
  const token = csrfFromHeader(ctx);
  if (!token) {
    return new Response(
      JSON.stringify({ error: "CSRF token missing" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }
  return null;
};

const setCookieFrom = (apiResponse: Response, headers: Headers): void => {
  const cookie = apiResponse.headers.get("set-cookie");
  if (cookie) headers.set("set-cookie", cookie);
};

app.get("/api/csrf", async (ctx: Context<State>) => {
  try {
    const apiResponse = await fetch(backendUrl + "/user/csrf", {
      headers: proxyHeaders(ctx),
    });
    const result = await apiResponse.json();
    const headers = new Headers({ "Content-Type": "application/json" });
    setCookieFrom(apiResponse, headers);
    return new Response(JSON.stringify(result), {
      status: apiResponse.status,
      headers,
    });
  } catch (_error: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.post("/api/user/me", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const apiResponse = await fetch(backendUrl + "/user/me", {
      method: "POST",
      headers: proxyHeaders(ctx),
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      if ((data as { error?: string }).error === "Too many requests") {
        return new Response(
          JSON.stringify({ error: "Rate Limit Triggered" }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "No se pudo obtener la informacion del usuario" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.put("/api/user/me", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const data = await ctx.req.json();
    const apiResponse = await fetch(backendUrl + "/user/me", {
      method: "PUT",
      headers: proxyHeaders(ctx, { "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.post("/api/user/photo", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const contentType = ctx.req.headers.get("content-type") || "";
    const body = new Uint8Array(await ctx.req.arrayBuffer());
    const apiResponse = await fetch(backendUrl + "/user/me/photo", {
      method: "POST",
      headers: proxyHeaders(ctx, { "Content-Type": contentType }),
      body,
    });
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});


app.post("/api/user/cv", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const contentType = ctx.req.headers.get("content-type") || "";
    const body = new Uint8Array(await ctx.req.arrayBuffer());
    const apiResponse = await fetch(backendUrl + "/user/me/cv", {
      method: "POST",
      headers: proxyHeaders(ctx, { "Content-Type": contentType }),
      body,
    });
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.delete("/api/user/cv", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const apiResponse = await fetch(backendUrl + "/user/me/cv", {
      method: "DELETE",
      headers: proxyHeaders(ctx),
    });
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.delete("/api/user/photo", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const apiResponse = await fetch(backendUrl + "/user/me/photo", {
      method: "DELETE",
      headers: proxyHeaders(ctx),
    });
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});




app.post("/api/oauth/credly/import", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const payload = await ctx.req.json();
    const apiResponse = await fetch(backendUrl + "/oauth/credly/import", {
      method: "POST",
      headers: proxyHeaders(ctx, { "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.post("/api/logout", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const apiResponse = await fetch(backendUrl + "/user/logout", {
      method: "POST",
      headers: proxyHeaders(ctx),
    });
    const result = await apiResponse.json();
    const headers = new Headers({ "Content-Type": "application/json" });
    setCookieFrom(apiResponse, headers);
    return new Response(JSON.stringify(result), {
      status: apiResponse.status,
      headers,
    });
  } catch (_error: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.get("/api/user/:username", async (ctx: Context<State>) => {
  try {
    const { username } = ctx.params;
    const apiResponse = await fetch(backendUrl + `/user/${username}`);
    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(data),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.post("/api/login", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const data = await ctx.req.json();
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Body vacio" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const { username, password } = data as { username?: string; password?: string };
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Campos vacios" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const apiResponse = await fetch(backendUrl + "/user/login", {
      method: "POST",
      headers: proxyHeaders(ctx, { "Content-Type": "application/json" }),
      body: JSON.stringify({ username, password }),
    });

    const result = await apiResponse.json();

    if ((result as { error?: string }).error === "Anti-BruteForce Triggered") {
      return new Response(
        JSON.stringify({ error: "Cuenta bloqueada temporalmente" }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }
    if ((result as { error?: string }).error === "Too many requests") {
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes, intentalo mas tarde" }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Credenciales Incorrectas" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const headers = new Headers({ "Content-Type": "application/json" });
    setCookieFrom(apiResponse, headers);
    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (err: Error | unknown) {
    console.log(err);
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.post("/api/register", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const data = await ctx.req.json();
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Body vacio" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const { username, name, email, password } = data as {
      username?: string;
      name?: string;
      email?: string;
      password?: string;
    };
    if (!email || !password || !username || !name) {
      return new Response(
        JSON.stringify({ error: "Campos vacios" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const apiResponse = await fetch(
      backendUrl + "/user/register",
      {
        method: "POST",
        headers: proxyHeaders(ctx, { "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      },
    );
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    const headers = new Headers({ "Content-Type": "application/json" });
    setCookieFrom(apiResponse, headers);
    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.get("/api/certificate", async (ctx: Context<State>) => {
  try {
    const apiResponse = await fetch(backendUrl + "/certificate/all", {
      headers: proxyHeaders(ctx),
    });
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.post("/api/certificate/add", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const data = await ctx.req.json();
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Body vacio" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const apiResponse = await fetch(
      backendUrl + "/certificate/add",
      {
        method: "POST",
        headers: proxyHeaders(ctx, { "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      },
    );
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.get("/api/certificate/:id", async (ctx: Context<State>) => {
  try {
    const { id } = ctx.params;
    const apiResponse = await fetch(backendUrl + `/certificate/id/${id}`);
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.put("/api/certificate/:id", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const { id } = ctx.params;
    const data = await ctx.req.json();
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Body vacio" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const apiResponse = await fetch(
      backendUrl + `/certificate/id/${id}`,
      {
        method: "PUT",
        headers: proxyHeaders(ctx, { "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      },
    );
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

app.delete("/api/certificate/:id", async (ctx: Context<State>) => {
  const missing = requireCsrf(ctx);
  if (missing) return missing;
  try {
    const { id } = ctx.params;
    const apiResponse = await fetch(
      backendUrl + `/certificate/id/${id}`,
      {
        method: "DELETE",
        headers: proxyHeaders(ctx, { "Content-Type": "application/json" }),
      },
    );
    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify(result),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_err: Error | unknown) {
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

const clearCookie = "bearer=; Path=/; Max-Age=0";

const checkAuth = define.middleware(async (ctx: Context<State>) => {
  const cookie = cookieFrom(ctx);
  const match = cookie.match(/bearer=([^;]+)/);
  const token = match?.[1];
  if (!token) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }
  try {
    const csrf = csrfFromCookie(cookie);
    const apiResponse = await fetch(backendUrl + "/user/me", {
      method: "POST",
      headers: { cookie, "x-csrf-token": csrf },
    });
    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login", "Set-Cookie": clearCookie },
      });
    }
    return await ctx.next();
  } catch (_e: Error | unknown) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login", "Set-Cookie": clearCookie },
    });
  }
});

const alreadylogged = define.middleware(async (ctx: Context<State>) => {
  const cookie = cookieFrom(ctx);
  const match = cookie.match(/bearer=([^;]+)/);
  const token = match?.[1];
  if (!token) return await ctx.next();
  try {
    const csrf = csrfFromCookie(cookie);
    const apiResponse = await fetch(backendUrl + "/user/me", {
      method: "POST",
      headers: { cookie, "x-csrf-token": csrf },
    });
    if (!apiResponse.ok) return await ctx.next();
    return new Response(null, {
      status: 302,
      headers: { Location: "/profile" },
    });
  } catch (_err: Error | unknown) {
    return await ctx.next();
  }
});

app.use("/(main)", alreadylogged);
app.use("/(me)", checkAuth);

app.fsRoutes();

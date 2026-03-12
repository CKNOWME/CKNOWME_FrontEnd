# CKNOWME FrontEnd

Aplicación web para gestion de certificados profesionales.

## Stack

- Fresh 2
- Preact + Islands
- Vite

## Estructura

- `main.ts`: endpoints `/api/*` (proxy).
- `routes/`: páginas web.
- `components/` e `islands/`: Componentes y islas interactivas.
- `assets/` y `static/`: estilos y recursos.

## Variables de entorno

```env
BACKEND_URL=https://cknowme-backend.sergioom9.deno.net
```

## Ejecución

```bash
deno task dev
```

Build + run:

```bash
deno task build
deno task start
```

## Notas

- La app consume `CKNOWME_BackEnd`.

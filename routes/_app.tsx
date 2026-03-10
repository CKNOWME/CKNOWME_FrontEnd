import { define } from "../utils.ts";
import CsrfInitIsland from "../islands/CsrfInitIsland.tsx";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CKNOWME</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Mono:wght@300;400;500&display=swap"
        />
      </head>
      <body>
        <div class="bg-grid" />
        <div class="bg-aurora" />
        <div class="page">
          <CsrfInitIsland />
          <Component />
        </div>
      </body>
    </html>
  );
});

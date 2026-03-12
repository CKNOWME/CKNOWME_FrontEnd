import LogoutIsland from "../islands/LogoutIsland.tsx";

const Header = () => {
  return (
    <header class="header">
      <div class="header-in">
        <a class="logo" href="/">
          <span class="logo-g">◈</span>
          <span class="logo-t">CertFolio</span>
        </a>
        <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
          <a href="/certs/add">
            <button type="button" class="btn-add">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Añadir certificado
            </button>
          </a>
          <a href="/user" class="btn-secondary">Buscar Usuario</a>
          <a href="/dashboard" class="btn-secondary">Explorar</a>
          <a href="/profile" class="btn-secondary">Mi perfil</a>
          <a href="/certs/import" class="btn-secondary">Importar</a>
          <LogoutIsland />
        </div>
      </div>
    </header>
  );
};

export default Header;

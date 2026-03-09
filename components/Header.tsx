
const Header = () => {
  return (
    <div class="header-in">
      <a class="logo" href="#">
        <span class="logo-g">◈</span>
        <span class="logo-t">CertFolio</span>
      </a>
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
    </div>
  );
};

export default Header;

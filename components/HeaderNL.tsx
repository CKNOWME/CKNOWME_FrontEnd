const HeaderNL = () => {
  return (
    <header class="header">
      <div class="header-in">
        <a class="logo" href="/">
          <span class="logo-g">◈</span>
          <span class="logo-t">CKNOWME</span>
        </a>
        <div style={{ display: "flex", gap: ".6rem" }}>
          <a href="/login" class="btn-secondary">Login</a>
          <a href="/register" class="btn-add">Crear cuenta</a>
        </div>
      </div>
    </header>
  );
};

export default HeaderNL;

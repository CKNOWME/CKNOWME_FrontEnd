import SearchUserIsland from "../../islands/SearchUserIsland.tsx";

const Home = () => {
  return (
    <section class="hero">
      <div class="hero-badge">
        <span class="dot" /> Plataforma de certificaciones
      </div>
      <h1 class="hero-title">
        Crea tu <em>Curriculum</em> publico
      </h1>
      <p class="hero-sub">
        Sube tus certificados, comparte tu perfil y visualiza el portfolio de otros.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <a class="btn-add" href="/register">Empieza aqui</a>
        <a class="btn-secondary" href="/login">Ya soy usuario</a>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <SearchUserIsland />
      </div>
    </section>
  );
};

export default Home;

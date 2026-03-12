const certByCategory = [
  {
    category: "Security",
    items: ["Security+", "AWS Security Specialty", "Certified in Cybersecurity", "eJPT"],
  },
  {
    category: "Cloud",
    items: ["AWS Solutions Architect", "Azure Fundamentals", "Google Cloud Digital Leader"],
  },
  {
    category: "Data",
    items: ["Google Data Analytics", "IBM Data Science", "Azure Data Fundamentals"],
  },
  {
    category: "Development",
    items: ["AWS Developer", "Scrum Master", "React Professional"],
  },
];

const cvTemplates = [
  { name: "Minimal ATS", focus: "Alta compatibilidad con ATS" },
  { name: "Tech Portfolio", focus: "Proyectos + stack" },
  { name: "Security Analyst", focus: "Certs + labs" },
  { name: "Executive", focus: "Experiencia y liderazgo" },
];

const companiesBySector = [
  { sector: "Cloud", names: ["AWS", "Google", "Microsoft", "Oracle"] },
  { sector: "Ciberseguridad", names: ["CrowdStrike", "Palo Alto", "Fortinet", "Okta"] },
  { sector: "Consultoria", names: ["Accenture", "Deloitte", "EY", "KPMG"] },
  { sector: "Fintech", names: ["Stripe", "Adyen", "Revolut", "Wise"] },
];

const Dashboard = () => {
  return (
    <>
      <section class="hero" style={{ paddingBottom: "2rem" }}>
        <div class="hero-badge">
          <span class="dot" /> Panel
        </div>
        <h1 class="hero-title">
          Recomendaciones <em>personalizadas</em>
        </h1>
        <p class="hero-sub">
          Ideas rapidas para mejorar tu perfil: certificaciones, plantillas de CV y empresas por sector.
        </p>
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <a class="btn-secondary" href="/profile">Editar perfil</a>
          <a class="btn-secondary" href="/certs/add">Añadir certificado</a>
          <a class="btn-secondary" href="/certs/import">Importar</a>
        </div>
      </section>

      <section>
        <div class="cards" id="cards">
          {certByCategory.map((block) => (
            <article class={`card ${block.category}`} key={block.category}>
              <div class="card-body">
                <div class="card-issuer">Certificaciones sugeridas</div>
                <div class="card-title">{block.category}</div>
                <div class="card-desc">
                  {block.items.join(" · ")}
                </div>
                <div class="card-foot">
                  <span class="card-date">Actualiza tu portfolio</span>
                  <div class="card-acts">
                    <a class="ca-btn" href="/certs/add">Añadir</a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div class="cards" id="cards-templates">
          {cvTemplates.map((tpl) => (
            <article class="card General" key={tpl.name}>
              <div class="card-body">
                <div class="card-issuer">Plantilla CV</div>
                <div class="card-title">{tpl.name}</div>
                <div class="card-desc">{tpl.focus}</div>
                <div class="card-foot">
                  <span class="card-date">PDF / ATS</span>
                  <div class="card-acts">
                    <a class="ca-btn" href="/profile">Configurar</a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div class="cards" id="cards-companies">
          {companiesBySector.map((block) => (
            <article class="card Management" key={block.sector}>
              <div class="card-body">
                <div class="card-issuer">Empresas por sector</div>
                <div class="card-title">{block.sector}</div>
                <div class="card-desc">
                  {block.names.join(" · ")}
                </div>
                <div class="card-foot">
                  <span class="card-date">Explora roles</span>
                  <div class="card-acts">
                    <a class="ca-btn" href="/">Explorar</a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default Dashboard;

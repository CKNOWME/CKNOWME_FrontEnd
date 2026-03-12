import { useState } from "preact/hooks";

const certByCategory = [
  {
    category: "Security",
    icon: "🔒",
    items: [
      { name: "CompTIA Security+", issuer: "CompTIA", level: "Entrada", url: "https://www.comptia.org/certifications/security", demand: "Muy Alta" },
      { name: "CISSP", issuer: "ISC²", level: "Avanzado", url: "https://www.isc2.org/certifications/cissp", demand: "Muy Alta" },
      { name: "CEH – Certified Ethical Hacker", issuer: "EC-Council", level: "Intermedio", url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/", demand: "Alta" },
      { name: "CISM", issuer: "ISACA", level: "Avanzado", url: "https://www.isaca.org/credentialing/cism", demand: "Alta" },
      { name: "AWS Security Specialty", issuer: "Amazon Web Services", level: "Especialidad", url: "https://aws.amazon.com/certification/certified-security-specialty/", demand: "Alta" },
      { name: "eJPT – Jr Penetration Tester", issuer: "INE Security", level: "Entrada", url: "https://security.ine.com/certifications/ejpt-certification/", demand: "Media" },
      { name: "ISO 27001 Lead Implementer", issuer: "PECB", level: "Avanzado", url: "https://pecb.com/en/education-and-certification-for-individuals/iso-iec-27001", demand: "Alta" },
    ],
  },
  {
    category: "Cloud",
    icon: "☁️",
    items: [
      { name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services", level: "Intermedio", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/", demand: "Muy Alta" },
      { name: "AZ-104 Azure Administrator", issuer: "Microsoft", level: "Intermedio", url: "https://learn.microsoft.com/en-us/certifications/azure-administrator/", demand: "Muy Alta" },
      { name: "Google Cloud Professional Architect", issuer: "Google", level: "Avanzado", url: "https://cloud.google.com/learn/certification/cloud-architect", demand: "Alta" },
      { name: "AZ-900 Azure Fundamentals", issuer: "Microsoft", level: "Entrada", url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/", demand: "Alta" },
      { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", level: "Entrada", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/", demand: "Alta" },
      { name: "Terraform Associate", issuer: "HashiCorp", level: "Intermedio", url: "https://developer.hashicorp.com/certifications/infrastructure-automation", demand: "Alta" },
      { name: "Google Cloud Digital Leader", issuer: "Google", level: "Entrada", url: "https://cloud.google.com/learn/certification/cloud-digital-leader", demand: "Media" },
    ],
  },
  {
    category: "Data",
    icon: "📊",
    items: [
      { name: "Google Data Analytics", issuer: "Google / Coursera", level: "Entrada", url: "https://grow.google/certificates/data-analytics/", demand: "Muy Alta" },
      { name: "IBM Data Science Professional", issuer: "IBM / Coursera", level: "Intermedio", url: "https://www.ibm.com/training/badge/data-science-professional-certificate", demand: "Alta" },
      { name: "DP-203 Azure Data Engineer", issuer: "Microsoft", level: "Avanzado", url: "https://learn.microsoft.com/en-us/certifications/azure-data-engineer/", demand: "Alta" },
      { name: "Databricks Certified Associate", issuer: "Databricks", level: "Intermedio", url: "https://www.databricks.com/learn/certification", demand: "Alta" },
      { name: "TensorFlow Developer Certificate", issuer: "Google", level: "Intermedio", url: "https://www.tensorflow.org/certificate", demand: "Media" },
      { name: "AWS Machine Learning Specialty", issuer: "Amazon Web Services", level: "Especialidad", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/", demand: "Alta" },
    ],
  },
  {
    category: "Development",
    icon: "💻",
    items: [
      { name: "Oracle Java SE Developer", issuer: "Oracle", level: "Intermedio", url: "https://education.oracle.com/oracle-certified-professional-java-se-17-developer/pexam_1Z0-829", demand: "Alta" },
      { name: "AWS Developer Associate", issuer: "Amazon Web Services", level: "Intermedio", url: "https://aws.amazon.com/certification/certified-developer-associate/", demand: "Alta" },
      { name: "CKA – Certified Kubernetes Admin", issuer: "CNCF / Linux Foundation", level: "Avanzado", url: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/", demand: "Muy Alta" },
      { name: "CKAD – Kubernetes App Developer", issuer: "CNCF / Linux Foundation", level: "Intermedio", url: "https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/", demand: "Alta" },
      { name: "Meta Front-End Developer", issuer: "Meta / Coursera", level: "Intermedio", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", demand: "Alta" },
      { name: "GitHub Actions Certification", issuer: "GitHub", level: "Intermedio", url: "https://resources.github.com/learn/certifications/", demand: "Alta" },
    ],
  },
  {
    category: "Management",
    icon: "📋",
    items: [
      { name: "PMP – Project Management Professional", issuer: "PMI", level: "Avanzado", url: "https://www.pmi.org/certifications/project-management-pmp", demand: "Muy Alta" },
      { name: "ITIL 4 Foundation", issuer: "Axelos / PeopleCert", level: "Entrada", url: "https://www.axelos.com/certifications/itil-service-management/itil-4-foundation", demand: "Muy Alta" },
      { name: "Professional Scrum Master I", issuer: "Scrum.org", level: "Entrada", url: "https://www.scrum.org/assessments/professional-scrum-master-i-certification", demand: "Muy Alta" },
      { name: "SAFe Scrum Master", issuer: "Scaled Agile", level: "Intermedio", url: "https://scaledagile.com/training/safe-scrum-master/", demand: "Alta" },
      { name: "Six Sigma Green Belt", issuer: "ASQ / IASSC", level: "Intermedio", url: "https://asq.org/cert/six-sigma-green-belt", demand: "Alta" },
      { name: "PRINCE2 Foundation", issuer: "Axelos / PeopleCert", level: "Entrada", url: "https://www.axelos.com/certifications/prince2/prince2-foundation", demand: "Alta" },
    ],
  },
  {
    category: "General",
    icon: "💼",
    items: [
      { name: "CFA – Chartered Financial Analyst", issuer: "CFA Institute", level: "Avanzado", url: "https://www.cfainstitute.org/en/programs/cfa", demand: "Muy Alta" },
      { name: "ACCA – Accounting & Finance", issuer: "ACCA Global", level: "Avanzado", url: "https://www.accaglobal.com/gb/en/qualifications/glbqual/acca.html", demand: "Alta" },
      { name: "Google Project Management", issuer: "Google / Coursera", level: "Entrada", url: "https://grow.google/certificates/project-management/", demand: "Alta" },
      { name: "CCNA", issuer: "Cisco", level: "Intermedio", url: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html", demand: "Muy Alta" },
      { name: "CompTIA Network+", issuer: "CompTIA", level: "Entrada", url: "https://www.comptia.org/certifications/network", demand: "Alta" },
      { name: "Google UX Design", issuer: "Google / Coursera", level: "Entrada", url: "https://grow.google/certificates/ux-design/", demand: "Media" },
    ],
  },
];

const cvTemplates = [
  { name: "Minimal ATS", focus: "Máxima compatibilidad con sistemas ATS. Sin tablas ni columnas. Puro texto estructurado.", tag: "Grandes empresas", icon: "📄", url: "https://cvonline.me/assets/downloable-files/plantilla-curriculum-gratis-1.docx" },
  { name: "Tech Portfolio", focus: "Proyectos + stack tecnológico destacados. Ideal para roles de desarrollo y DevOps.", tag: "Developers", icon: "🖥️", url: "https://cvonline.me/assets/downloable-files/plantilla-curriculum-gratis-2.docx"},
  { name: "Security Analyst", focus: "Certificaciones, labs (TryHackMe, HTB) y habilidades técnicas en primer plano.", tag: "Ciberseguridad", icon: "🔒", url: "https://cvonline.me/assets/downloable-files/plantilla-curriculum-gratis-3.docx" },
  { name: "Executive", focus: "Experiencia, liderazgo y KPIs. Datos cuantificables y logros de negocio.", tag: "Gestión / Senior", icon: "👔", url: "https://cvonline.me/assets/downloable-files/plantilla-curriculum-gratis-4.docx" },
  { name: "Cloud Engineer", focus: "Arquitecturas cloud, certs AWS/Azure/GCP y proyectos de infraestructura.", tag: "Cloud & DevOps", icon: "☁️", url: "https://cvonline.me/assets/downloable-files/plantilla-curriculum-gratis-5.docx" },
  { name: "Data Scientist", focus: "Modelos, datasets, publicaciones y herramientas: Python, SQL, Spark, TensorFlow.", tag: "Datos & IA", icon: "📊", url: "https://cvonline.me/assets/downloable-files/plantilla-curriculum-gratis-6.docx" },
];

const companiesBySector = [
  { sector: "Cloud", icon: "☁️", names: [
    { name: "Amazon Web Services", url: "https://www.amazon.jobs/en/business_categories/aws" },
    { name: "Microsoft Azure", url: "https://careers.microsoft.com" },
    { name: "Google Cloud", url: "https://careers.google.com" },
    { name: "Oracle Cloud", url: "https://www.oracle.com/careers/" },
    { name: "IBM Cloud", url: "https://www.ibm.com/employment/" },
    { name: "Cloudflare", url: "https://www.cloudflare.com/careers/" },
  ]},
  { sector: "Ciberseguridad", icon: "🔒", names: [
    { name: "CrowdStrike", url: "https://www.crowdstrike.com/careers/" },
    { name: "Palo Alto Networks", url: "https://jobs.paloaltonetworks.com" },
    { name: "Fortinet", url: "https://www.fortinet.com/corporate/careers" },
    { name: "Okta", url: "https://www.okta.com/company/careers/" },
    { name: "SentinelOne", url: "https://www.sentinelone.com/careers/" },
    { name: "Darktrace", url: "https://www.darktrace.com/careers" },
  ]},
  { sector: "Consultoría", icon: "🏢", names: [
    { name: "Accenture", url: "https://www.accenture.com/us-en/careers" },
    { name: "Deloitte Tech", url: "https://www2.deloitte.com/global/en/careers.html" },
    { name: "Capgemini", url: "https://www.capgemini.com/careers/" },
    { name: "Indra", url: "https://www.indracompany.com/en/careers" },
    { name: "NTT DATA", url: "https://careers.nttdata.com" },
    { name: "Cognizant", url: "https://careers.cognizant.com" },
  ]},
  { sector: "Fintech", icon: "💳", names: [
    { name: "Stripe", url: "https://stripe.com/jobs" },
    { name: "Revolut", url: "https://www.revolut.com/careers" },
    { name: "Adyen", url: "https://www.adyen.com/careers" },
    { name: "Wise", url: "https://wise.com/careers" },
    { name: "Klarna", url: "https://jobs.lever.co/klarna" },
    { name: "N26", url: "https://n26.com/en-eu/careers" },
  ]},
  { sector: "Big Tech", icon: "🚀", names: [
    { name: "Apple", url: "https://jobs.apple.com" },
    { name: "Meta", url: "https://www.metacareers.com" },
    { name: "Netflix", url: "https://jobs.netflix.com" },
    { name: "Spotify", url: "https://www.lifeatspotify.com/jobs" },
    { name: "Salesforce", url: "https://www.salesforce.com/company/careers/" },
    { name: "Atlassian", url: "https://www.atlassian.com/company/careers" },
  ]},
  { sector: "Datos & IA", icon: "🤖", names: [
    { name: "Databricks", url: "https://www.databricks.com/company/careers" },
    { name: "Snowflake", url: "https://careers.snowflake.com" },
    { name: "OpenAI", url: "https://openai.com/careers" },
    { name: "Hugging Face", url: "https://apply.workable.com/huggingface/" },
    { name: "Palantir", url: "https://www.palantir.com/careers/" },
    { name: "Scale AI", url: "https://scale.com/careers" },
  ]},
];

const allCategories = certByCategory.map(c => c.category);
const allLevels = ["Entrada", "Intermedio", "Avanzado", "Especialidad"];
const allDemands = ["Muy Alta", "Alta", "Media"];
const allSectors = companiesBySector.map(c => c.sector);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("certs");
  const [selectedCats, setSelectedCats] = useState<string[]>(allCategories);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(allLevels);
  const [selectedDemands, setSelectedDemands] = useState<string[]>(allDemands);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(allSectors);
  const [search, setSearch] = useState("");
  const [expandedCert, setExpandedCert] = useState<string | null>(null);

  const toggle = (val: string, arr: string[], set: any) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const filteredCerts = certByCategory
    .filter(c => selectedCats.includes(c.category))
    .map(c => ({
      ...c,
      items: c.items.filter(i =>
        selectedLevels.some((l: string) => i.level.includes(l)) &&
        selectedDemands.includes(i.demand) &&
        (i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.issuer.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter(c => c.items.length > 0);

  const totalCerts = filteredCerts.reduce((a, c) => a + c.items.length, 0);
  const filteredCompanies = companiesBySector.filter(c => selectedSectors.includes(c.sector));

  return (
    <>
      <section className="hero" style={{ paddingBottom: "1.5rem" }}>
        <div className="hero-badge">
          <span className="dot" /> Career Dashboard
        </div>
        <h1 className="hero-title">
          Recomendaciones <em>personalizadas</em>
        </h1>
        <p className="hero-sub">
          Certificaciones reales · Plantillas de CV · Empresas por sector
        </p>
      </section>

      <div className="toolbar" style={{ paddingBottom: "1rem" }}>
        <div className="filters">
          {[
            { id: "certs", label: "Certificaciones", count: totalCerts },
            { id: "cv", label: "Plantillas CV", count: cvTemplates.length },
            { id: "companies", label: "Empresas", count: companiesBySector.reduce((a, c) => a + c.names.length, 0) },
          ].map(tab => (
            <button
              key={tab.id}
              className={`f-btn${activeTab === tab.id ? " on" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} <span className="badge">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "certs" && (
        <>
          <div className="toolbar" style={{ paddingTop: 0, flexDirection: "column", alignItems: "flex-start", gap: ".65rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", width: "100%" }}>
              <label className="search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch((e.target as HTMLInputElement).value)}
                  placeholder="Buscar certificación o emisor…"
                />
              </label>
              <div className="filters">
                {allCategories.map(cat => {
                  const catData = certByCategory.find(c => c.category === cat)!;
                  return (
                    <button
                      key={cat}
                      className={`f-btn${selectedCats.includes(cat) ? " on" : ""}`}
                      onClick={() => toggle(cat, selectedCats, setSelectedCats)}
                    >
                      {catData.icon} {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--fm)", fontSize: ".62rem", letterSpacing: ".09em", textTransform: "uppercase", color: "#4791fe" }}>Nivel</span>
              <div className="filters">
                {allLevels.map(lvl => (
                  <button key={lvl} className={`f-btn${selectedLevels.includes(lvl) ? " on" : ""}`} onClick={() => toggle(lvl, selectedLevels, setSelectedLevels)}>
                    {lvl}
                  </button>
                ))}
              </div>
              <span style={{ fontFamily: "var(--fm)", fontSize: ".62rem", letterSpacing: ".09em", textTransform: "uppercase", color: "#4791fe" }}>Demanda</span>
              <div className="filters">
                {allDemands.map(d => (
                  <button key={d} className={`f-btn${selectedDemands.includes(d) ? " on" : ""}`} onClick={() => toggle(d, selectedDemands, setSelectedDemands)}>
                    {d}
                  </button>
                ))}
              </div>
              <button className="btn-secondary" style={{ fontSize: ".68rem", padding: ".3rem .75rem" }}
                onClick={() => { setSelectedCats(allCategories); setSelectedLevels(allLevels); setSelectedDemands(allDemands); setSearch(""); }}>
                Resetear
              </button>
              <span style={{ fontFamily: "var(--fm)", fontSize: ".68rem", color: "var(--tm)" }}>
                <span style={{ color: "var(--lime)", fontWeight: 700 }}>{totalCerts}</span> resultados
              </span>
            </div>
          </div>

          {filteredCerts.length === 0 ? (
            <div className="cards">
              <div className="empty">
                <span className="empty-g">🔍</span>
                <p>Sin resultados</p>
                <span>Prueba a cambiar los filtros</span>
              </div>
            </div>
          ) : (
            filteredCerts.map(block => (
              <section key={block.category}>
                <div style={{ maxWidth: 1380, margin: "0 auto", padding: "1rem 2.5rem .6rem", display: "flex", alignItems: "center", gap: ".55rem" }}>
                  <span>{block.icon}</span>
                  <span style={{ fontFamily: "var(--fm)", fontSize: ".65rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--td)" }}>
                    {block.category}
                  </span>
                  <span className="badge">{block.items.length}</span>
                </div>
                <div className="cards" style={{ paddingBottom: "1rem" }}>
                  {block.items.map(cert => (
                    <article
                      key={cert.name}
                      className={`card ${block.category}`}
                      onClick={() => setExpandedCert(expandedCert === cert.name ? null : cert.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-body">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".5rem", marginBottom: ".45rem" }}>
                          <div className="card-issuer" style={{ margin: 0 }}>
                            {block.icon} {cert.issuer}
                          </div>
                          <span className="cat-tag" style={{ position: "static", flexShrink: 0 }}>{cert.demand}</span>
                        </div>
                        <div className="card-title">{cert.name}</div>
                        <div className="card-desc" style={{ marginTop: ".2rem" }}>
                          {cert.level}
                          {expandedCert === cert.name && (
                            <> · <a href={cert.url} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{ color: "var(--lime)", textDecoration: "none" }}>
                              Ver oficial →
                            </a></>
                          )}
                        </div>
                        <div className="card-foot">
                          <span className="card-date">{cert.level}</span>
                          <div className="card-acts">
                            <a className="ca-btn" href={cert.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                              Oficial
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </>
      )}

      {activeTab === "cv" && (
        <>
          <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 2.5rem .75rem" }}>
            <p style={{ fontFamily: "var(--fm)", fontSize: ".75rem", color: "var(--tm)" }}>
              Elige la plantilla que mejor se adapte a tu perfil y sector objetivo.
            </p>
          </div>
          <div className="cards">
            {cvTemplates.map(tpl => (
              <article key={tpl.name} className="card General">
                <div className="card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".5rem", marginBottom: ".45rem" }}>
                    <div className="card-issuer" style={{ margin: 0 }}>{tpl.icon} Plantilla CV</div>
                    <span className="cat-tag" style={{ position: "static", flexShrink: 0 }}>{tpl.tag}</span>
                  </div>
                  <div className="card-title">{tpl.name}</div>
                  <div className="card-desc" style={{ marginTop: ".2rem" }}>{tpl.focus}</div>
                  <div className="card-foot">
                    <span className="card-date">DOC</span>
                    <div className="card-acts">
                      <a className="ca-btn" href={tpl.url} target="_blank" rel="noopener noreferrer">Descargar plantilla</a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {activeTab === "companies" && (
        <>
          <div className="toolbar" style={{ paddingTop: 0 }}>
            <div className="filters">
              {allSectors.map(s => {
                const sectorData = companiesBySector.find(c => c.sector === s)!;
                return (
                  <button
                    key={s}
                    className={`f-btn${selectedSectors.includes(s) ? " on" : ""}`}
                    onClick={() => toggle(s, selectedSectors, setSelectedSectors)}
                  >
                    {sectorData.icon} {s}
                  </button>
                );
              })}
            </div>
            <button className="btn-secondary" style={{ fontSize: ".68rem", padding: ".3rem .75rem" }} onClick={() => setSelectedSectors(allSectors)}>
              Ver todos
            </button>
          </div>

          <div className="cards">
            {filteredCompanies.map(block => (
              <article key={block.sector} className="card Management">
                <div className="card-body">
                  <div className="card-issuer">{block.icon} Empresas por sector</div>
                  <div className="card-title">{block.sector}</div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".32rem", margin: ".65rem 0" }}>
                    {block.names.map(company => (
                      <a
                        key={company.name}
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          background: "var(--s2)", borderRadius: "var(--rads)",
                          padding: ".4rem .72rem", textDecoration: "none",
                          color: "var(--td)", fontFamily: "var(--fm)", fontSize: ".72rem",
                          border: "1px solid transparent", transition: "border-color .18s, color .18s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--b1)"; e.currentTarget.style.color = "var(--tx)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "var(--td)"; }}
                      >
                        {company.name} <span style={{ opacity: .45, fontSize: ".65rem" }}>→</span>
                      </a>
                    ))}
                  </div>
                  <div className="card-foot">
                    <span className="card-date">{block.names.length} empresas</span>
                  </div>
                </div>
              </article>
            ))}
            {filteredCompanies.length === 0 && (
              <div className="empty">
                <span className="empty-g">🏢</span>
                <p>Sin sectores seleccionados</p>
                <span>Activa al menos uno de los filtros</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
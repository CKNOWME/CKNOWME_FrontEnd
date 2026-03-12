import buscar_html from "../assets/buscar_html.png"
import copiar from "../assets/copiar.png"
import inspeccionar from "../assets/inspeccionar.png"

const LinkedInImport = () => {
  return (
    <section class="hero">
      <div class="hero-badge">
        <span class="dot" /> Como conseguir tu HTML de LinkedIn
      </div>
      <h1 class="hero-title">
        Descargar tu HTML desde Linkedin paso a paso
      </h1>
      <p class="hero-sub">
        Lo primero que haremos sera ir desde un navegador a la web de LinkedIn,
        importante que se realize desde ordenador.
      </p>
      <p class="hero-sub">
        Una vez estemos logueados nos dirigimos a nuestro perfil y le entramos
        en la seccion de certificados.
      </p>
      <p class="hero-sub">
        La url deberia ser algo como
        https://www.linkedin.com/in/TU_USUARIO/details/certifications/
      </p>
      <p class="hero-sub">Una vez estemos ahi daremos click derecho en cualquier sitio de la web y buscaremos la opcion inspeccionar</p>
      <img src={inspeccionar}></img>
      <p class="hero-sub">Se nos abrira un panel donde debemos buscar la etiqueta html la cual encapsula todo el contenido de la pagina, siempre esta arriba del todo, la primera</p>
      <img src={buscar_html}></img>
      <p class="hero-sub">Por ultimo click derecho en donde aparece html y copiamos el elemento</p>
      <img src={copiar}></img>
      <p class="hero-sub">Abrimos un bloc de notas o notepad pegamos todo el contenido y lo guardamos como export.html</p>
      <p class="hero-sub">Este archivo es el que subiremos para importar</p>
      <div style={{ marginTop: "2rem" }}>
      </div>
    </section>
  );
};

export default LinkedInImport;

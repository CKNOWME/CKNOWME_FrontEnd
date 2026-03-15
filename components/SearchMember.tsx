import { useState } from "preact/hooks";

const SearchMember = () => {
  const [query, setQuery] = useState("");

  const onSubmit = (e: Event) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    globalThis.location.href = `/user/${encodeURIComponent(trimmed)}`;
  };

  return (
    <div style={{ marginTop: "2rem" }}>
    <section class="hero">
      <h1 class="hero-title">
        Busca a un usuario !
      </h1>
    <form class="search" style={{ maxWidth: "350px" }} onSubmit={onSubmit}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        placeholder="Introduce el usuario"
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
      />
      <button class="btn-add" type="submit" style={{ padding: ".35rem 1rem" }}>
        Buscar
      </button>
    </form>
    </section>
    </div>
  );
};

export default SearchMember;

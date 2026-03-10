import { useEffect } from "preact/hooks";

const CsrfInitIsland = () => {
  useEffect(() => {
    fetch("/api/csrf").catch(() => undefined);
  }, []);

  return null;
};

export default CsrfInitIsland;

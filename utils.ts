import { createDefine } from "fresh";

export interface State {
  shared: string;
}

export const define = createDefine<State>();

export const redirectToPdf = (url?: string) => {
  if (!url) return;
  globalThis.open(url, "_blank", "noopener,noreferrer");
};

export const getCookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${name}=`));
  return match ? match.split("=")[1] : "";
};

export const getCsrfToken = (): string => getCookie("csrf");

export const computeSHA256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export function isPasswordValid(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

export function isEmailValid(email: string): boolean {
  if (!email.includes("@")) return false;
  if (!email.includes(".")) return false;
  return true;
}

export function getEmailErrors(email: string): string {
  if (email.length === 0) return "Email es requerido";
  const errors = [];
  if (!email.includes("@") && !email.includes(".")) errors.push("Email invalido");
  if (errors.length === 0) return "";
  return `❌ ${errors.join(", ")}`;
}

export function getPasswordErrors(password: string): string {
  if (password.length === 0) return "";

  const errors = [];
  if (password.length < 8) errors.push("minimo 8 caracteres");
  if (!/[A-Z]/.test(password)) errors.push("una mayuscula");
  if (!/[a-z]/.test(password)) errors.push("una minuscula");
  if (!/[0-9]/.test(password)) errors.push("un numero");

  if (errors.length === 0) return "";
  return `❌ Requisitos faltantes : ${errors.join(", ")}`;
}

import { createDefine } from "fresh";

export interface State {
  shared: string;
}

export const define = createDefine<State>();


export const redirectToPdf = () => {
  alert("Redirección a PDF");
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

  export  function getEmailErrors(email: string): string {
    if (email.length === 0) return "Email es requerido";
    const errors = [];
    if (!email.includes("@") && !email.includes(".")) errors.push("Email invalido");
    if (errors.length === 0) return "";
    return `❌ ${errors.join(", ")}`;
  }

  export function getPasswordErrors(password: string): string {
    if (password.length === 0) return "";

    const errors = [];
    if (password.length < 8) errors.push("mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errors.push("una mayúscula");
    if (!/[a-z]/.test(password)) errors.push("una minúscula");
    if (!/[0-9]/.test(password)) errors.push("un número");

    if (errors.length === 0) return "";
    return `❌ Requisitos faltantes : ${errors.join(", ")}`;
  }
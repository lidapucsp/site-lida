import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 * Evita problemas de timezone ao tratar a string diretamente
 */
export function formatDateBR(dateString: string): string {
  if (!dateString) return '';
  
  // Se for uma string no formato YYYY-MM-DD, fazer parse manual
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  
  // Fallback: usar Date se não for o formato esperado
  return new Date(dateString).toLocaleDateString('pt-BR');
}

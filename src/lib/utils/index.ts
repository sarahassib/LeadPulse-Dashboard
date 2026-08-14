import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    META: "Meta Ads",
    GOOGLE_SEARCH: "Google Ads",
    LINKEDIN: "LinkedIn",
    EMAIL: "Email",
    WHATSAPP: "WhatsApp",
    TIKTOK: "TikTok",
    SNAPCHAT: "Snapchat",
    OTHER: "Autre",
  };
  return labels[platform] || platform;
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    META: "bg-primary-500/10 text-primary-400",
    GOOGLE_SEARCH: "bg-accent-500/10 text-accent-400",
    LINKEDIN: "bg-accent-600/10 text-accent-300",
    EMAIL: "bg-primary-600/10 text-primary-300",
    WHATSAPP: "bg-primary-400/10 text-primary-300",
    TIKTOK: "bg-red-500/10 text-red-400",
    SNAPCHAT: "bg-yellow-500/10 text-yellow-400",
    OTHER: "bg-surface-elevated text-text-muted",
  };
  return colors[platform] || "bg-surface-elevated text-text-muted";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: "Brouillon",
    TO_DIFFUSE: "À diffuser",
    ACTIVE: "En cours",
    PAUSED: "En pause",
    COMPLETED: "Terminée",
    CANCELLED: "Annulée",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: "bg-surface-elevated text-text-muted",
    TO_DIFFUSE: "bg-accent-500/10 text-accent-400",
    ACTIVE: "bg-primary-500/10 text-primary-400",
    PAUSED: "bg-accent-500/10 text-accent-400",
    COMPLETED: "bg-primary-600/10 text-primary-300",
    CANCELLED: "bg-red-500/10 text-red-400",
  };
  return colors[status] || "bg-surface-elevated text-text-muted";
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

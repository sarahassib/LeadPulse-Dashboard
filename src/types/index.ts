export type CampaignPlatform =
  | "META"
  | "GOOGLE_SEARCH"
  | "LINKEDIN"
  | "EMAIL"
  | "WHATSAPP"
  | "TIKTOK"
  | "SNAPCHAT"
  | "OTHER";

export type CampaignStatus =
  | "DRAFT"
  | "TO_DIFFUSE"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED";

export type Region = "MAROC" | "AFRIQUE";

export type VisualType = "REEL" | "VIDEO" | "CAROUSEL" | "SINGLE_IMAGE";

export type DestinationType =
  | "WHATSAPP"
  | "META_INSTANT_FORM"
  | "LANDING_PAGE"
  | "WEBSITE"
  | "DIRECT_CALL";

export interface CampaignVisual {
  id: string;
  campaignId: string;
  imageUrl: string;
  fileName: string;
  altText?: string | null;
  isPrimary: boolean;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  campaignId: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  startDate: Date;
  endDate?: Date | null;
  angle: string;
  cible?: string | null;
  objectif?: string | null;
  region?: string | null;
  countries?: string | null;
  message: string;
  headline?: string | null;
  description?: string | null;
  visualType?: string | null;
  callToAction?: string | null;
  destinationType?: string | null;
  destinationUrl?: string | null;
  objective?: string | null;
  targetAudience?: string | null;
  visuals: CampaignVisual[];
  leads: number;
  mql: number;
  sql: number;
  nq: number;
  spend: number;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignWithCalculations extends Campaign {
  mqlRate: number;
  sqlGlobalRate: number;
  sqlFromMqlRate: number;
  nqRate: number;
  unclassifiedLeads: number;
  cpl: number;
  costPerSql: number;
}

export interface CampaignFormData {
  campaignId: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  startDate: string;
  endDate?: string | null;
  angle: string;
  cible?: string | null;
  objectif?: string | null;
  region?: string | null;
  countries?: string | null;
  message: string;
  headline?: string | null;
  description?: string | null;
  visualType?: string | null;
  callToAction?: string | null;
  destinationType?: string | null;
  destinationUrl?: string | null;
  objective?: string | null;
  targetAudience?: string | null;
  leads?: number;
  mql?: number;
  sql?: number;
  nq?: number;
  spend?: number;
  notes?: string | null;
  visuals?: { imageUrl: string; fileName: string; altText?: string; isPrimary?: boolean }[];
}

export interface DashboardFilters {
  search: string;
  platform: CampaignPlatform | "ALL";
  status: CampaignStatus | "ALL";
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export type SortField =
  | "leads"
  | "mql"
  | "sql"
  | "nq"
  | "spend"
  | "mqlRate"
  | "sqlGlobalRate"
  | "sqlFromMqlRate"
  | "nqRate"
  | "cpl"
  | "costPerSql";

export interface PerformanceBadge {
  label: string;
  color: string;
  bgColor: string;
}

export type DateRangeOption = "today" | "7days" | "month" | "all";

export interface Setting {
  id: string;
  category: string;
  value: string;
  createdAt: Date;
}

export const AFRICAN_COUNTRIES = [
  "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso",
  "Burundi", "Cameroun", "Cap-Vert", "Centrafrique", "Comores",
  "Congo", "Côte d'Ivoire", "Djibouti", "Égypte", "Érythrée",
  "Eswatini", "Éthiopie", "Gabon", "Gambie", "Ghana",
  "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Kenya", "Lesotho",
  "Liberia", "Libye", "Madagascar", "Malawi", "Mali",
  "Maroc", "Maurice", "Mauritanie", "Mozambique", "Namibie",
  "Niger", "Nigeria", "Ouganda", "République démocratique du Congo",
  "République du Congo", "Rwanda", "São Tomé-et-Principe", "Sénégal",
  "Seychelles", "Sierra Leone", "Somalie", "Soudan", "Soudan du Sud",
  "Tanzanie", "Tchad", "Togo", "Tunisie", "Zambie", "Zimbabwe",
] as const;

export type CampaignPlatform =
  | "META"
  | "GOOGLE_SEARCH"
  | "LINKEDIN"
  | "EMAIL"
  | "WHATSAPP"
  | "ORGANIC_SOCIAL"
  | "OTHER";

export type CampaignStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

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
  message: string;
  objective?: string | null;
  targetAudience?: string | null;
  callToAction?: string | null;
  visuals: CampaignVisual[];
  leads: number;
  mql: number;
  sql: number;
  nq: number;
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
}

export interface CampaignFormData {
  campaignId: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  startDate: string;
  endDate?: string | null;
  angle: string;
  message: string;
  objective?: string | null;
  targetAudience?: string | null;
  callToAction?: string | null;
  leads?: number;
  mql?: number;
  sql?: number;
  nq?: number;
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
  | "mqlRate"
  | "sqlGlobalRate"
  | "sqlFromMqlRate"
  | "nqRate";

export interface PerformanceBadge {
  label: string;
  color: string;
  bgColor: string;
}

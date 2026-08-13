import { z } from "zod";

const PLATFORMS = ["META", "GOOGLE_SEARCH", "LINKEDIN", "EMAIL", "WHATSAPP", "ORGANIC_SOCIAL", "OTHER"] as const;
const STATUSES = ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"] as const;

export const campaignFormSchema = z.object({
  campaignId: z.string().min(1, "L'ID de campagne est obligatoire."),
  name: z.string().min(1, "Le nom de la campagne est obligatoire."),
  platform: z.enum(PLATFORMS, { message: "La plateforme est obligatoire." }),
  status: z.enum(STATUSES, { message: "Le statut est obligatoire." }),
  startDate: z.string().min(1, "La date de début est obligatoire."),
  endDate: z.string().optional().nullable(),
  angle: z.string().min(1, "L'angle de campagne est obligatoire."),
  message: z.string().min(1, "Le message principal est obligatoire."),
  objective: z.string().optional().nullable(),
  targetAudience: z.string().optional().nullable(),
  callToAction: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  leads: z.number().default(0).optional(),
  mql: z.number().default(0).optional(),
  sql: z.number().default(0).optional(),
  nq: z.number().default(0).optional(),
  spend: z.number().min(0, "Le budget consommé ne peut pas être négatif.").default(0).optional(),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  { message: "La date de fin ne peut pas être antérieure à la date de début.", path: ["endDate"] }
).refine(
  (data) => {
    const leads = data.leads ?? 0;
    const mql = data.mql ?? 0;
    const sql = data.sql ?? 0;
    if (mql > leads) return false;
    if (sql > mql) return false;
    return true;
  },
  { message: "Les leads doivent être >= MQL >= SQL.", path: ["mql"] }
);

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export const campaignUpdateSchema = campaignFormSchema;
export type CampaignUpdateValues = z.infer<typeof campaignUpdateSchema>;

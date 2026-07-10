import { Campaign, CampaignWithCalculations } from "@/types";

export function calculateMqlRate(leads: number, mql: number): number {
  if (leads === 0) return 0;
  return Math.round((mql / leads) * 1000) / 10;
}

export function calculateSqlGlobalRate(leads: number, sql: number): number {
  if (leads === 0) return 0;
  return Math.round((sql / leads) * 1000) / 10;
}

export function calculateSqlFromMqlRate(mql: number, sql: number): number {
  if (mql === 0) return 0;
  return Math.round((sql / mql) * 1000) / 10;
}

export function calculateNqRate(leads: number, nq: number): number {
  if (leads === 0) return 0;
  return Math.round((nq / leads) * 1000) / 10;
}

export function calculateUnclassifiedLeads(leads: number, mql: number, nq: number): number {
  return leads - mql - nq;
}

export function enrichCampaign(campaign: Campaign): CampaignWithCalculations {
  return {
    ...campaign,
    mqlRate: calculateMqlRate(campaign.leads, campaign.mql),
    sqlGlobalRate: calculateSqlGlobalRate(campaign.leads, campaign.sql),
    sqlFromMqlRate: calculateSqlFromMqlRate(campaign.mql, campaign.sql),
    nqRate: calculateNqRate(campaign.leads, campaign.nq),
    unclassifiedLeads: calculateUnclassifiedLeads(campaign.leads, campaign.mql, campaign.nq),
  };
}

export function getBestCampaign(campaigns: Campaign[]): Campaign | null {
  if (campaigns.length === 0) return null;
  return campaigns.reduce((best, current) => {
    const bestRate = calculateSqlGlobalRate(best.leads, best.sql);
    const currentRate = calculateSqlGlobalRate(current.leads, current.sql);
    if (currentRate > bestRate) return current;
    if (currentRate === bestRate && current.sql > best.sql) return current;
    return best;
  });
}

export function getCampaignPerformanceBadge(campaign: Campaign): { label: string; color: string; bgColor: string } | null {
  const sqlRate = calculateSqlGlobalRate(campaign.leads, campaign.sql);
  const mqlRate = calculateMqlRate(campaign.leads, campaign.mql);
  const nqRate = calculateNqRate(campaign.leads, campaign.nq);

  if (sqlRate >= 5 && campaign.leads >= 500) {
    return { label: "Top performance", color: "text-primary-700", bgColor: "bg-primary-50 border-primary-200" };
  }
  if (sqlRate >= 4) {
    return { label: "Bon taux SQL", color: "text-primary-600", bgColor: "bg-primary-100 border-primary-300" };
  }
  if (campaign.leads >= 800) {
    return { label: "Volume élevé", color: "text-accent-700", bgColor: "bg-accent-50 border-accent-200" };
  }
  if (nqRate >= 40) {
    return { label: "Taux NQ à surveiller", color: "text-red-700", bgColor: "bg-red-50 border-red-200" };
  }
  return null;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function generateCampaignId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `CMP-${year}-${random}`;
}


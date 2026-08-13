import { Campaign, CampaignWithCalculations } from "@/types";

export function calculateMqlRate(leads: number, mql: number): number {
  if (leads === 0) return 0;
  const rate = (mql / leads) * 100;
  return Math.round(Math.min(rate, 100) * 10) / 10;
}

export function calculateSqlGlobalRate(leads: number, sql: number): number {
  if (leads === 0) return 0;
  const rate = (sql / leads) * 100;
  return Math.round(Math.min(rate, 100) * 10) / 10;
}

export function calculateSqlFromMqlRate(mql: number, sql: number): number {
  if (mql === 0) return 0;
  const rate = (sql / mql) * 100;
  return Math.round(Math.min(rate, 100) * 10) / 10;
}

export function calculateNqRate(leads: number, nq: number): number {
  if (leads === 0) return 0;
  const rate = (nq / leads) * 100;
  return Math.round(Math.min(rate, 100) * 10) / 10;
}

export function calculateUnclassifiedLeads(leads: number, mql: number, nq: number): number {
  return Math.max(0, leads - mql - nq);
}

export function calculateCpl(spend: number, leads: number): number {
  if (leads === 0 || spend === 0) return 0;
  return Math.round((spend / leads) * 100) / 100;
}

export function calculateCostPerSql(spend: number, sql: number): number {
  if (sql === 0 || spend === 0) return 0;
  return Math.round((spend / sql) * 100) / 100;
}

export function clampConversionValues(leads: number, mql: number, sql: number): { leads: number; mql: number; sql: number } {
  const safeLeads = Math.max(0, leads);
  const safeMql = Math.min(Math.max(0, mql), safeLeads);
  const safeSql = Math.min(Math.max(0, sql), safeMql);
  return { leads: safeLeads, mql: safeMql, sql: safeSql };
}

export function enrichCampaign(campaign: Campaign): CampaignWithCalculations {
  const { leads, mql, sql } = clampConversionValues(campaign.leads, campaign.mql, campaign.sql);
  return {
    ...campaign,
    leads,
    mql,
    sql,
    mqlRate: calculateMqlRate(leads, mql),
    sqlGlobalRate: calculateSqlGlobalRate(leads, sql),
    sqlFromMqlRate: calculateSqlFromMqlRate(mql, sql),
    nqRate: calculateNqRate(leads, campaign.nq),
    unclassifiedLeads: calculateUnclassifiedLeads(leads, mql, campaign.nq),
    cpl: calculateCpl(campaign.spend, leads),
    costPerSql: calculateCostPerSql(campaign.spend, sql),
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

export function formatCurrency(value: number): string {
  if (value === 0) return "0";
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 1 });
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return formatCurrency(value);
}

export function generateCampaignId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `CMP-${year}-${random}`;
}

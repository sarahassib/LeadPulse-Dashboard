"use client";

import { useState } from "react";
import {
  Users,
  DollarSign,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import {
  formatNumber,
  formatPercentage,
  formatCurrency,
  calculateMqlRate,
  calculateSqlFromMqlRate,
  calculateNqRate,
} from "@/lib/calculations";
import KpiCard from "./KpiCard";

interface KpiTotals {
  leads: number;
  mql: number;
  sql: number;
  nq: number;
  spend: number;
}

interface KpiSectionProps {
  totals: KpiTotals;
  activeCount: number;
}

export default function KpiSection({ totals, activeCount }: KpiSectionProps) {
  const [showFunnel, setShowFunnel] = useState(false);

  const totalSpend = totals.spend;
  const avgCpl = totals.leads > 0 ? totalSpend / totals.leads : 0;
  const sqlGlobalRate = totals.leads > 0 ? (totals.sql / totals.leads) * 100 : 0;
  const mqlRate = calculateMqlRate(totals.leads, totals.mql);
  const sqlFromMqlRate = calculateSqlFromMqlRate(totals.mql, totals.sql);
  const nqRate = calculateNqRate(totals.leads, totals.nq);

  return (
    <div className="space-y-4">
      {/* Primary KPIs - 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Leads"
          value={formatNumber(totals.leads)}
          icon={<Users size={20} />}
          description={`${formatNumber(totals.mql)} MQL · ${formatNumber(totals.sql)} SQL`}
          color="bg-accent-500/10 text-accent-400"
        />
        <KpiCard
          title="Budget & CPL"
          value={`${formatCurrency(totalSpend)}`}
          icon={<DollarSign size={20} />}
          description={`CPL moyen: $${avgCpl.toFixed(1)}`}
          color="bg-primary-500/10 text-primary-400"
        />
        <KpiCard
          title="Taux SQL Global"
          value={formatPercentage(sqlGlobalRate)}
          icon={<Target size={20} />}
          description={`${formatNumber(totals.sql)} / ${formatNumber(totals.leads)} leads`}
          color="bg-accent-500/10 text-accent-400"
        />
        <KpiCard
          title="Campagnes actives"
          value={formatNumber(activeCount)}
          icon={<TrendingUp size={20} />}
          color="bg-primary-500/10 text-primary-400"
        />
      </div>

      {/* Collapsible Funnel Analytics */}
      <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowFunnel(!showFunnel)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-text-secondary hover:bg-surface-elevated/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target size={16} className="text-text-muted" />
            <span>Funnel Analytics</span>
            <span className="text-xs text-text-muted font-normal">
              (MQL Rate, NQ Rate, SQL/MQL)
            </span>
          </div>
          {showFunnel ? (
            <ChevronUp size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </button>

        {showFunnel && (
          <div className="px-5 pb-5 border-t border-border">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <KpiCard
                title="Taux MQL"
                value={formatPercentage(mqlRate)}
                icon={<TrendingUp size={16} />}
                description="MQL / Leads"
                color="bg-accent-500/10 text-accent-400"
              />
              <KpiCard
                title="Taux SQL / MQL"
                value={formatPercentage(sqlFromMqlRate)}
                icon={<Target size={16} />}
                description="SQL / MQL"
                color="bg-accent-500/10 text-accent-400"
              />
              <KpiCard
                title="Taux NQ"
                value={formatPercentage(nqRate)}
                icon={<AlertTriangle size={16} />}
                description="NQ / Leads"
                color="bg-red-500/10 text-red-400"
              />
              <KpiCard
                title="Total MQL"
                value={formatNumber(totals.mql)}
                icon={<TrendingUp size={16} />}
                description="Marketing Qualified Leads"
                color="bg-accent-500/10 text-accent-400"
              />
            </div>

            {/* Funnel Visual */}
            <div className="mt-5 p-4 bg-surface-elevated/50 rounded-lg">
              <div className="flex flex-col gap-2">
                {[
                  { label: "Leads", value: totals.leads, width: "100%", color: "bg-primary-500" },
                  { label: "MQL", value: totals.mql, width: `${totals.leads > 0 ? (totals.mql / totals.leads) * 100 : 0}%`, color: "bg-accent-500" },
                  { label: "SQL", value: totals.sql, width: `${totals.leads > 0 ? (totals.sql / totals.leads) * 100 : 0}%`, color: "bg-accent-700" },
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-text-secondary w-10">{step.label}</span>
                    <div className="flex-1 relative h-8 bg-surface-card rounded-md overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 ${step.color} rounded-md transition-all duration-500`}
                        style={{ width: `${Math.max(parseFloat(step.width) || 2, 3)}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white drop-shadow-sm">
                          {formatNumber(step.value)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-text-muted w-12 text-right">{step.width}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

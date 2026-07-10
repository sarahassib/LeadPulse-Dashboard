"use client";

import { CampaignWithCalculations } from "@/types";
import { formatNumber, formatPercentage } from "@/lib/calculations";

interface GlobalFunnelChartProps {
  campaigns: CampaignWithCalculations[];
}

export function GlobalFunnelChart({ campaigns }: GlobalFunnelChartProps) {
  const totals = campaigns.reduce(
    (acc, c) => ({
      leads: acc.leads + c.leads,
      mql: acc.mql + c.mql,
      sql: acc.sql + c.sql,
    }),
    { leads: 0, mql: 0, sql: 0 }
  );

  const mqlRate = totals.leads > 0 ? (totals.mql / totals.leads) * 100 : 0;
  const sqlRate = totals.leads > 0 ? (totals.sql / totals.leads) * 100 : 0;
  const sqlFromMqlRate = totals.mql > 0 ? (totals.sql / totals.mql) * 100 : 0;

  const maxVolume = totals.leads || 1;

  const steps = [
    {
      label: "Leads",
      value: totals.leads,
      color: "bg-primary-500",
      widthPercent: 100,
    },
    {
      label: "MQL",
      value: totals.mql,
      color: "bg-accent-500",
      widthPercent: (totals.mql / maxVolume) * 100,
    },
    {
      label: "SQL",
      value: totals.sql,
      color: "bg-accent-700",
      widthPercent: (totals.sql / maxVolume) * 100,
    },
  ];

  return (
    <div className="bg-surface-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Funnel Global</h3>
      <div className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <div key={step.label}>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-text-secondary w-12">{step.label}</span>
              <div className="flex-1 relative h-12 bg-surface-elevated rounded-lg overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 ${step.color} rounded-lg transition-all duration-700 ease-out`}
                  style={{ width: `${Math.max(step.widthPercent, 2)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-bold text-white drop-shadow-sm">
                    {formatNumber(step.value)}
                  </span>
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center gap-4 ml-4 my-1">
                <span className="w-12" />
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                  <span>
                    Conversion :{" "}
                    <span className="font-semibold text-text-secondary">
                      {i === 0 ? formatPercentage(mqlRate) : formatPercentage(sqlFromMqlRate)}
                    </span>{" "}
                    ({formatPercentage(sqlRate)} du total)
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

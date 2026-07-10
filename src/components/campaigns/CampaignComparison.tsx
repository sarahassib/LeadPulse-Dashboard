"use client";

import { useState } from "react";
import {
  GitCompare,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { CampaignWithCalculations } from "@/types";
import { formatPercentage, formatNumber } from "@/lib/calculations";

interface CampaignComparisonProps {
  currentCampaign: CampaignWithCalculations;
  allCampaigns: CampaignWithCalculations[];
  onCompare: (otherId: string) => void;
  comparedCampaign: CampaignWithCalculations | null;
}

interface ComparisonRow {
  label: string;
  currentValue: number;
  comparedValue: number;
  isPercentage: boolean;
}

function getIndicator(
  diff: number,
  isPercentage: boolean,
  metricLabel: string
): { icon: typeof ArrowUp; color: string } {
  const lowerIsBetter = metricLabel === "Taux NQ";

  if (Math.abs(diff) < 0.01) {
    return { icon: Minus, color: "text-text-muted" };
  }

  if (lowerIsBetter) {
    return diff < 0
      ? { icon: ArrowUp, color: "text-green-600" }
      : { icon: ArrowDown, color: "text-red-600" };
  }

  return diff > 0
    ? { icon: ArrowUp, color: "text-green-600" }
    : { icon: ArrowDown, color: "text-red-600" };
}

export default function CampaignComparison({
  currentCampaign,
  allCampaigns,
  onCompare,
  comparedCampaign,
}: CampaignComparisonProps) {
  const [selectedId, setSelectedId] = useState<string>("");

  const otherCampaigns = allCampaigns.filter(
    (c) => c.id !== currentCampaign.id
  );

  const rows: ComparisonRow[] = comparedCampaign
    ? [
        {
          label: "Leads",
          currentValue: currentCampaign.leads,
          comparedValue: comparedCampaign.leads,
          isPercentage: false,
        },
        {
          label: "MQL",
          currentValue: currentCampaign.mql,
          comparedValue: comparedCampaign.mql,
          isPercentage: false,
        },
        {
          label: "SQL",
          currentValue: currentCampaign.sql,
          comparedValue: comparedCampaign.sql,
          isPercentage: false,
        },
        {
          label: "NQ",
          currentValue: currentCampaign.nq,
          comparedValue: comparedCampaign.nq,
          isPercentage: false,
        },
        {
          label: "Taux MQL",
          currentValue: currentCampaign.mqlRate,
          comparedValue: comparedCampaign.mqlRate,
          isPercentage: true,
        },
        {
          label: "Taux SQL global",
          currentValue: currentCampaign.sqlGlobalRate,
          comparedValue: comparedCampaign.sqlGlobalRate,
          isPercentage: true,
        },
        {
          label: "Taux SQL depuis MQL",
          currentValue: currentCampaign.sqlFromMqlRate,
          comparedValue: comparedCampaign.sqlFromMqlRate,
          isPercentage: true,
        },
        {
          label: "Taux NQ",
          currentValue: currentCampaign.nqRate,
          comparedValue: comparedCampaign.nqRate,
          isPercentage: true,
        },
      ]
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedId(id);
    if (id) {
      onCompare(id);
    }
  };

  return (
    <div className="bg-surface-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <GitCompare className="h-5 w-5 text-text-secondary" />
        <h3 className="text-lg font-semibold text-white">
          Comparer avec une autre campagne
        </h3>
      </div>

      <div className="relative mb-6">
        <select
          value={selectedId}
          onChange={handleChange}
          className="w-full appearance-none bg-surface-card border border-border rounded-lg px-4 py-2.5 pr-10 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Sélectionner une campagne...</option>
          {otherCampaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name} ({campaign.campaignId})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
      </div>

      {comparedCampaign && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-muted">
                  Métrique
                </th>
                <th className="text-right py-3 px-4 font-medium text-text-muted">
                  {currentCampaign.name}
                </th>
                <th className="text-right py-3 px-4 font-medium text-text-muted">
                  {comparedCampaign.name}
                </th>
                <th className="text-right py-3 px-4 font-medium text-text-muted">
                  Différence
                </th>
                <th className="text-right py-3 px-4 font-medium text-text-muted">
                  Diff. %
                </th>
                <th className="text-center py-3 px-4 font-medium text-text-muted">
                  Tendance
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const diff = row.currentValue - row.comparedValue;
                const pctDiff =
                  row.comparedValue !== 0
                    ? (diff / row.comparedValue) * 100
                    : 0;
                const indicator = getIndicator(
                  diff,
                  row.isPercentage,
                  row.label
                );
                const IndicatorIcon = indicator.icon;

                return (
                  <tr
                    key={row.label}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 px-4 font-medium text-white">
                      {row.label}
                    </td>
                    <td className="py-3 px-4 text-right text-text-secondary">
                      {row.isPercentage
                        ? formatPercentage(row.currentValue)
                        : formatNumber(row.currentValue)}
                    </td>
                    <td className="py-3 px-4 text-right text-text-secondary">
                      {row.isPercentage
                        ? formatPercentage(row.comparedValue)
                        : formatNumber(row.comparedValue)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-medium ${
                        diff > 0
                          ? "text-green-600"
                          : diff < 0
                          ? "text-red-600"
                          : "text-text-muted"
                      }`}
                    >
                      {diff > 0 ? "+" : ""}
                      {row.isPercentage
                        ? formatPercentage(diff)
                        : formatNumber(diff)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-medium ${
                        pctDiff > 0
                          ? "text-green-600"
                          : pctDiff < 0
                          ? "text-red-600"
                          : "text-text-muted"
                      }`}
                    >
                      {pctDiff > 0 ? "+" : ""}
                      {pctDiff.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <IndicatorIcon
                        className={`h-4 w-4 inline ${indicator.color}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



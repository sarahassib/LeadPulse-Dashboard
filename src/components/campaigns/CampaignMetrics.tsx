"use client";

import {
  Users,
  CheckCircle,
  Star,
  XCircle,
  Target,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  DollarSign,
} from "lucide-react";
import { CampaignWithCalculations } from "@/types";
import { formatPercentage, formatNumber, formatCurrency } from "@/lib/calculations";

interface CampaignMetricsProps {
  campaign: CampaignWithCalculations;
}

export default function CampaignMetrics({ campaign }: CampaignMetricsProps) {
  const metrics = [
    {
      label: "Leads",
      value: formatNumber(campaign.leads),
      description: "Nombre total de leads générés",
      icon: Users,
      color: "text-primary-400",
      bgColor: "bg-primary-500/10",
    },
    {
      label: "MQL",
      value: formatNumber(campaign.mql),
      description: "Leads marketing qualifiés",
      icon: CheckCircle,
      color: "text-primary-300",
      bgColor: "bg-primary-500/10",
    },
    {
      label: "SQL",
      value: formatNumber(campaign.sql),
      description: "Leads commercialement qualifiés",
      icon: Star,
      color: "text-accent-400",
      bgColor: "bg-accent-500/10",
    },
    {
      label: "NQ",
      value: formatNumber(campaign.nq),
      description: "Leads non qualifiés",
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Budget consommé",
      value: `$${formatCurrency(campaign.spend)}`,
      description: "Montant total dépensé",
      icon: DollarSign,
      color: "text-primary-400",
      bgColor: "bg-primary-500/10",
    },
    {
      label: "CPL",
      value: `$${campaign.cpl.toFixed(2)}`,
      description: "Coût par lead",
      icon: DollarSign,
      color: "text-accent-400",
      bgColor: "bg-accent-500/10",
    },
    {
      label: "Coût par SQL",
      value: campaign.costPerSql > 0 ? `$${campaign.costPerSql.toFixed(2)}` : "—",
      description: "Coût par lead SQL",
      icon: DollarSign,
      color: "text-accent-300",
      bgColor: "bg-accent-500/10",
    },
    {
      label: "Taux MQL",
      value: formatPercentage(campaign.mqlRate),
      description: "Pourcentage de leads convertis en MQL",
      icon: Target,
      color: "text-primary-300",
      bgColor: "bg-primary-500/10",
    },
    {
      label: "Taux SQL global",
      value: formatPercentage(campaign.sqlGlobalRate),
      description: "Pourcentage de leads convertis en SQL",
      icon: Target,
      color: "text-primary-400",
      bgColor: "bg-primary-500/10",
    },
    {
      label: "Taux SQL depuis MQL",
      value: formatPercentage(campaign.sqlFromMqlRate),
      description: "Pourcentage de MQL convertis en SQL",
      icon: TrendingUp,
      color: "text-accent-400",
      bgColor: "bg-accent-500/10",
    },
    {
      label: "Taux NQ",
      value: formatPercentage(campaign.nqRate),
      description: "Pourcentage de leads non qualifiés",
      icon: AlertTriangle,
      color: "text-accent-300",
      bgColor: "bg-accent-500/10",
    },
    {
      label: "Leads non classés",
      value: formatNumber(campaign.unclassifiedLeads),
      description: "Leads sans classification MQL/NQ",
      icon: HelpCircle,
      color: "text-text-muted",
      bgColor: "bg-surface-elevated",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="bg-surface-card border border-border rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-muted">{metric.label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{metric.value}</p>
                <p className="text-xs text-text-muted mt-1">{metric.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

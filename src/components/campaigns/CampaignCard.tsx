"use client";

import { Image as ImageIcon } from "lucide-react";
import { CampaignWithCalculations } from "@/types";
import { formatPercentage, formatNumber, getCampaignPerformanceBadge } from "@/lib/calculations";
import { cn, getPlatformLabel, getPlatformColor, getStatusLabel, getStatusColor, truncateText } from "@/lib/utils";

interface CampaignCardProps {
  campaign: CampaignWithCalculations;
  onView: (id: string) => void;
}

export default function CampaignCard({ campaign, onView }: CampaignCardProps) {
  const badge = getCampaignPerformanceBadge(campaign);
  const hasVisuals = campaign.visuals && campaign.visuals.length > 0;

  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-primary-500/40 flex flex-col">
      <div className="relative h-36 bg-surface-elevated">
        {hasVisuals ? (
          <img
            src={campaign.visuals[0].imageUrl}
            alt={campaign.visuals[0].altText || campaign.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-text-muted" />
          </div>
        )}
        {badge && (
          <span className={cn("absolute top-2 right-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border", badge.bgColor, badge.color)}>
            {badge.label}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-white truncate">{campaign.name}</h3>
        <p className="text-xs text-text-muted font-mono mt-0.5">{campaign.campaignId}</p>

        <div className="flex items-center gap-2 mt-2">
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", getPlatformColor(campaign.platform))}>
            {getPlatformLabel(campaign.platform)}
          </span>
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", getStatusColor(campaign.status))}>
            {getStatusLabel(campaign.status)}
          </span>
        </div>

        <p className="text-xs text-text-muted mt-2 line-clamp-2">
          {truncateText(campaign.angle, 60)}
        </p>

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          <div className="text-center">
            <p className="text-[10px] text-text-muted uppercase">Leads</p>
            <p className="text-sm font-bold text-white">{formatNumber(campaign.leads)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-text-muted uppercase">MQL</p>
            <p className="text-sm font-bold text-white">{formatNumber(campaign.mql)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-text-muted uppercase">SQL</p>
            <p className="text-sm font-bold text-white">{formatNumber(campaign.sql)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-text-muted uppercase">NQ</p>
            <p className="text-sm font-bold text-white">{formatNumber(campaign.nq)}</p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
          <span>Taux MQL: <span className="font-medium text-text-secondary">{formatPercentage(campaign.mqlRate)}</span></span>
          <span>Taux SQL: <span className="font-medium text-text-secondary">{formatPercentage(campaign.sqlGlobalRate)}</span></span>
        </div>

        <div className="mt-auto pt-3">
          <button
            onClick={() => onView(campaign.id)}
            className="w-full py-2 px-3 rounded-lg bg-surface-elevated text-sm font-medium text-text-secondary hover:bg-primary-500 hover:text-black border border-border hover:border-primary-400 transition-all duration-200"
          >
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  );
}

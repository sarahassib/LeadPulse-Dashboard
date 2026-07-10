"use client";

import { Trophy, Image as ImageIcon } from "lucide-react";
import { CampaignWithCalculations } from "@/types";
import { formatPercentage, formatNumber } from "@/lib/calculations";
import { cn, getPlatformLabel, getPlatformColor } from "@/lib/utils";

interface BestCampaignCardProps {
  campaign: CampaignWithCalculations;
}

export default function BestCampaignCard({ campaign }: BestCampaignCardProps) {
  const hasVisuals = campaign.visuals && campaign.visuals.length > 0;

  return (
    <div className="bg-surface-card border border-primary-500/30 rounded-xl overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-600" />

      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-primary-500/10 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wide">Meilleure campagne</h3>
        </div>

        <div className="flex items-start gap-4">
          {hasVisuals ? (
            <img
              src={campaign.visuals[0].imageUrl}
              alt={campaign.visuals[0].altText || campaign.name}
              className="h-16 w-20 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-16 w-20 rounded-lg bg-surface-elevated flex items-center justify-center flex-shrink-0">
              <ImageIcon className="h-6 w-6 text-text-muted" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{campaign.name}</h4>
            <p className="text-xs text-text-muted font-mono">{campaign.campaignId}</p>
            <div className="mt-1">
              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", getPlatformColor(campaign.platform))}>
                {getPlatformLabel(campaign.platform)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="bg-surface-elevated rounded-lg py-2 text-center">
            <p className="text-[10px] text-text-muted uppercase">Leads</p>
            <p className="text-sm font-bold text-white">{formatNumber(campaign.leads)}</p>
          </div>
          <div className="bg-surface-elevated rounded-lg py-2 text-center">
            <p className="text-[10px] text-text-muted uppercase">MQL</p>
            <p className="text-sm font-bold text-white">{formatNumber(campaign.mql)}</p>
          </div>
          <div className="bg-surface-elevated rounded-lg py-2 text-center">
            <p className="text-[10px] text-text-muted uppercase">SQL</p>
            <p className="text-sm font-bold text-white">{formatNumber(campaign.sql)}</p>
          </div>
          <div className="bg-surface-elevated rounded-lg py-2 text-center">
            <p className="text-[10px] text-text-muted uppercase">Taux SQL</p>
            <p className="text-sm font-bold text-primary-400">{formatPercentage(campaign.sqlGlobalRate)}</p>
          </div>
        </div>

        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 px-3 py-1 text-xs font-medium text-primary-400">
            <Trophy className="h-3 w-3" />
            Meilleure performance
          </span>
        </div>
      </div>
    </div>
  );
}

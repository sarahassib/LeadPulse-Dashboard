"use client";

import { Campaign } from "@/types";
import {
  getPlatformLabel,
  getPlatformColor,
  getStatusLabel,
  getStatusColor,
  formatDate,
} from "@/lib/utils";

interface CampaignInfoProps {
  campaign: Campaign;
}

export default function CampaignInfo({ campaign }: CampaignInfoProps) {
  const infoItems = [
    { label: "ID Campagne", value: campaign.campaignId },
    { label: "Nom", value: campaign.name },
    {
      label: "Plateforme",
      value: getPlatformLabel(campaign.platform),
      badge: true,
      badgeColor: getPlatformColor(campaign.platform),
    },
    {
      label: "Statut",
      value: getStatusLabel(campaign.status),
      badge: true,
      badgeColor: getStatusColor(campaign.status),
    },
    {
      label: "Période",
      value: campaign.endDate
        ? `${formatDate(campaign.startDate)} – ${formatDate(campaign.endDate)}`
        : `${formatDate(campaign.startDate)} – En cours`,
    },
    { label: "Angle", value: campaign.angle },
    { label: "Message", value: campaign.message },
    { label: "Objectif", value: campaign.objective },
    { label: "Audience cible", value: campaign.targetAudience },
    { label: "CTA", value: campaign.callToAction },
    { label: "Notes", value: campaign.notes },
    { label: "Créé le", value: formatDate(campaign.createdAt) },
    { label: "Mis à jour le", value: formatDate(campaign.updatedAt) },
  ];

  return (
    <div className="bg-surface-card border border-border rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {infoItems.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
              {item.label}
            </span>
            {item.value ? (
              item.badge ? (
                <span
                  className={`mt-1 inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-xs font-medium ${item.badgeColor}`}
                >
                  {item.value}
                </span>
              ) : (
                <span className="mt-1 text-sm text-white whitespace-pre-wrap">
                  {item.value}
                </span>
              )
            ) : (
              <span className="mt-1 text-sm text-text-muted italic">—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

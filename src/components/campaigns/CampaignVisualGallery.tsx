"use client";

import { Camera } from "lucide-react";
import { CampaignVisual } from "@/types";

interface CampaignVisualGalleryProps {
  visuals: CampaignVisual[];
  onOpenModal?: (visual: CampaignVisual) => void;
}

export default function CampaignVisualGallery({
  visuals,
  onOpenModal,
}: CampaignVisualGalleryProps) {
  const primaryVisual = visuals.find((v) => v.isPrimary);
  const otherVisuals = visuals.filter((v) => !v.isPrimary);

  if (visuals.length === 0) {
    return (
      <div className="bg-surface-card border border-border rounded-lg p-6">
        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
          <Camera className="h-12 w-12 mb-3" />
          <p className="text-sm font-medium">Aucun visuel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-border rounded-lg p-6">
      {primaryVisual && (
        <div
          className="mb-4 cursor-pointer overflow-hidden rounded-lg border border-border"
          onClick={() => onOpenModal?.(primaryVisual)}
        >
          <img
            src={primaryVisual.imageUrl}
            alt={primaryVisual.altText || primaryVisual.fileName}
            className="w-full h-80 object-contain bg-surface-elevated"
          />
        </div>
      )}

      {otherVisuals.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {otherVisuals.map((visual) => (
            <div
              key={visual.id}
              className="cursor-pointer overflow-hidden rounded-lg border border-border hover:border-primary-400 transition-colors"
              onClick={() => onOpenModal?.(visual)}
            >
              <img
                src={visual.imageUrl}
                alt={visual.altText || visual.fileName}
                className="w-full h-20 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

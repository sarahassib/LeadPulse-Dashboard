"use client";

import { cn } from "@/lib/utils";
import { CampaignStatus } from "@/types";
import { LayoutGrid, Play, Pause, CheckCircle2, XCircle, Send } from "lucide-react";

interface StatusTab {
  status: string;
  label: string;
  icon: typeof LayoutGrid;
  count: number;
}

interface StatusTabsProps {
  counts: Record<string, number>;
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

const TAB_CONFIG: { status: string; label: string; icon: typeof LayoutGrid }[] = [
  { status: "ALL", label: "Tous", icon: LayoutGrid },
  { status: "TO_DIFFUSE", label: "À diffuser", icon: Send },
  { status: "ACTIVE", label: "En cours", icon: Play },
  { status: "PAUSED", label: "En pause", icon: Pause },
  { status: "COMPLETED", label: "Terminée", icon: CheckCircle2 },
  { status: "CANCELLED", label: "Annulée", icon: XCircle },
];

export default function StatusTabs({ counts, activeStatus, onStatusChange }: StatusTabsProps) {
  const tabs: StatusTab[] = TAB_CONFIG.map((tab) => ({
    ...tab,
    count: counts[tab.status] || 0,
  }));

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.status;
        const Icon = tab.icon;
        return (
          <button
            key={tab.status}
            onClick={() => onStatusChange(tab.status)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150",
              isActive
                ? "bg-primary-500 text-black shadow-sm"
                : "text-text-muted hover:text-text-secondary hover:bg-surface-elevated"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            <span
              className={cn(
                "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold",
                isActive
                  ? "bg-black/20 text-black"
                  : "bg-surface-elevated text-text-muted"
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

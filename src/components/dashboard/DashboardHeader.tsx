"use client";

import { useRouter } from "next/navigation";
import { Plus, Download, Calendar } from "lucide-react";
import type { DateRangeOption } from "@/types";

interface DashboardHeaderProps {
  dateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  onExport: () => void;
}

const dateRangeOptions: { value: DateRangeOption; label: string }[] = [
  { value: "today", label: "Aujourd'hui" },
  { value: "7days", label: "7 derniers jours" },
  { value: "month", label: "Ce mois" },
  { value: "all", label: "Tout" },
];

export default function DashboardHeader({
  dateRange,
  onDateRangeChange,
  onExport,
}: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Tableau de bord des campagnes
        </h1>
        <p className="text-sm text-text-muted">
          Vue d&apos;ensemble des performances de vos campagnes AMM
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Range Filter */}
        <div className="flex items-center gap-1 bg-surface-card border border-border rounded-lg p-1">
          <Calendar size={14} className="text-text-muted ml-2" />
          {dateRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onDateRangeChange(option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                dateRange === option.value
                  ? "bg-primary-500 text-black shadow-sm"
                  : "text-text-muted hover:text-text-secondary hover:bg-surface-elevated"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface-elevated hover:text-white transition-colors"
        >
          <Download size={14} />
          Exporter
        </button>

        {/* Add Campaign Button */}
        <button
          onClick={() => router.push("/campaigns/new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-black text-sm font-medium rounded-lg hover:bg-primary-400 transition-colors shrink-0"
        >
          <Plus size={16} />
          Ajouter une campagne
        </button>
      </div>
    </div>
  );
}

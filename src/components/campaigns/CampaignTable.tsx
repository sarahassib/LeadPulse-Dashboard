"use client";

import { useState } from "react";
import { Eye, Pencil, Copy, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { CampaignWithCalculations } from "@/types";
import { formatPercentage, formatNumber, getCampaignPerformanceBadge } from "@/lib/calculations";
import { cn, getPlatformLabel, getPlatformColor, getStatusLabel, getStatusColor, formatDate } from "@/lib/utils";

interface CampaignTableProps {
  campaigns: CampaignWithCalculations[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

function SortIcon({ field, sortField, sortOrder }: { field: string; sortField: string; sortOrder: "asc" | "desc" }) {
  if (field !== sortField) {
    return <ChevronUp className="h-3 w-3 text-text-muted" />;
  }
  return sortOrder === "asc" ? (
    <ChevronUp className="h-3 w-3 text-primary-400" />
  ) : (
    <ChevronDown className="h-3 w-3 text-primary-400" />
  );
}

export default function CampaignTable({
  campaigns,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  sortField,
  sortOrder,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
}: CampaignTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCampaigns = campaigns.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const sortableColumns = [
    { key: "leads", label: "Leads" },
    { key: "mql", label: "MQL" },
    { key: "sql", label: "SQL" },
    { key: "nq", label: "NQ" },
    { key: "mqlRate", label: "Taux MQL" },
    { key: "sqlGlobalRate", label: "Taux SQL global" },
    { key: "sqlFromMqlRate", label: "Taux SQL / MQL" },
    { key: "nqRate", label: "Taux NQ" },
  ];

  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-elevated">
              <th className="px-3 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider w-12">Visuel</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Nom</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Plateforme</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Statut</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Période</th>
              {sortableColumns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer select-none hover:text-text-secondary"
                  onClick={() => onSort(col.key)}
                >
                  <div className="flex items-center justify-end gap-1">
                    {col.label}
                    <SortIcon field={col.key} sortField={sortField} sortOrder={sortOrder} />
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">Badge</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedCampaigns.map((campaign) => {
              const badge = getCampaignPerformanceBadge(campaign);
              const hasVisuals = campaign.visuals && campaign.visuals.length > 0;

              return (
                <tr
                  key={campaign.id}
                  className={cn(
                    "transition-colors",
                    hoveredRow === campaign.id ? "bg-surface-elevated" : "bg-surface-card"
                  )}
                  onMouseEnter={() => setHoveredRow(campaign.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-3 py-3">
                    {hasVisuals ? (
                      <img src={campaign.visuals[0].imageUrl} alt={campaign.visuals[0].altText || campaign.name} className="h-8 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-8 w-10 rounded bg-surface-elevated flex items-center justify-center">
                        <ImageIcon className="h-3.5 w-3.5 text-text-muted" />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-text-muted">{campaign.campaignId}</td>
                  <td className="px-3 py-3 font-medium text-white max-w-[180px] truncate">{campaign.name}</td>
                  <td className="px-3 py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", getPlatformColor(campaign.platform))}>
                      {getPlatformLabel(campaign.platform)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", getStatusColor(campaign.status))}>
                      {getStatusLabel(campaign.status)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-text-muted whitespace-nowrap">
                    {formatDate(campaign.startDate)}
                    {campaign.endDate ? ` - ${formatDate(campaign.endDate)}` : ""}
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-white">{formatNumber(campaign.leads)}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">{formatNumber(campaign.mql)}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">{formatNumber(campaign.sql)}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">{formatNumber(campaign.nq)}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">{formatPercentage(campaign.mqlRate)}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">{formatPercentage(campaign.sqlGlobalRate)}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">{formatPercentage(campaign.sqlFromMqlRate)}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">{formatPercentage(campaign.nqRate)}</td>
                  <td className="px-3 py-3 text-right">
                    {badge ? (
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border", badge.bgColor, badge.color)}>
                        {badge.label}
                      </span>
                    ) : (
                      <span className="text-text-muted">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onView(campaign.id)} className="p-1.5 rounded-md text-text-muted hover:text-primary-400 hover:bg-primary-500/10 transition-colors" title="Voir">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => onEdit(campaign.id)} className="p-1.5 rounded-md text-text-muted hover:text-accent-400 hover:bg-accent-500/10 transition-colors" title="Modifier">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDuplicate(campaign.id)} className="p-1.5 rounded-md text-text-muted hover:text-primary-300 hover:bg-primary-500/10 transition-colors" title="Dupliquer">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(campaign.id)} className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-3 p-4">
        {paginatedCampaigns.map((campaign) => {
          const badge = getCampaignPerformanceBadge(campaign);
          const hasVisuals = campaign.visuals && campaign.visuals.length > 0;

          return (
            <div key={campaign.id} className="bg-surface-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                {hasVisuals ? (
                  <img src={campaign.visuals[0].imageUrl} alt={campaign.visuals[0].altText || campaign.name} className="h-12 w-14 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="h-12 w-14 rounded-lg bg-surface-elevated flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="h-5 w-5 text-text-muted" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{campaign.name}</p>
                  <p className="text-xs text-text-muted font-mono">{campaign.campaignId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", getPlatformColor(campaign.platform))}>
                      {getPlatformLabel(campaign.platform)}
                    </span>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", getStatusColor(campaign.status))}>
                      {getStatusLabel(campaign.status)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-text-muted line-clamp-2">{campaign.angle}</p>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-surface-elevated rounded-lg py-1.5">
                  <p className="text-xs text-text-muted">Leads</p>
                  <p className="text-sm font-semibold text-white">{formatNumber(campaign.leads)}</p>
                </div>
                <div className="bg-surface-elevated rounded-lg py-1.5">
                  <p className="text-xs text-text-muted">MQL</p>
                  <p className="text-sm font-semibold text-white">{formatNumber(campaign.mql)}</p>
                </div>
                <div className="bg-surface-elevated rounded-lg py-1.5">
                  <p className="text-xs text-text-muted">SQL</p>
                  <p className="text-sm font-semibold text-white">{formatNumber(campaign.sql)}</p>
                </div>
                <div className="bg-surface-elevated rounded-lg py-1.5">
                  <p className="text-xs text-text-muted">NQ</p>
                  <p className="text-sm font-semibold text-white">{formatNumber(campaign.nq)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Taux MQL: {formatPercentage(campaign.mqlRate)}</span>
                <span>Taux SQL: {formatPercentage(campaign.sqlGlobalRate)}</span>
              </div>

              {badge && (
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border", badge.bgColor, badge.color)}>
                  {badge.label}
                </span>
              )}

              <div className="flex items-center gap-2 pt-1 border-t border-border">
                <button onClick={() => onView(campaign.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-text-secondary hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors">
                  <Eye className="h-3.5 w-3.5" /> Voir
                </button>
                <button onClick={() => onEdit(campaign.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-text-secondary hover:text-accent-400 hover:bg-accent-500/10 rounded-lg transition-colors">
                  <Pencil className="h-3.5 w-3.5" /> Modifier
                </button>
                <button onClick={() => onDuplicate(campaign.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-text-secondary hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors">
                  <Copy className="h-3.5 w-3.5" /> Dupliquer
                </button>
                <button onClick={() => onDelete(campaign.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-sm text-text-muted">
          {startIdx + 1}-{Math.min(startIdx + ITEMS_PER_PAGE, campaigns.length)} sur {campaigns.length} campagne{campaigns.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-primary-500 text-black"
                  : "text-text-secondary hover:bg-surface-elevated"
              )}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

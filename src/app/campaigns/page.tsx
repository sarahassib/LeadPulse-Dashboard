"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enrichCampaign } from "@/lib/calculations";
import { Campaign, CampaignWithCalculations, CampaignPlatform, CampaignStatus } from "@/types";
import {
  formatPercentage,
  formatNumber,
  getCampaignPerformanceBadge,
} from "@/lib/calculations";
import {
  cn,
  getPlatformLabel,
  getPlatformColor,
  getStatusLabel,
  getStatusColor,
} from "@/lib/utils";
import StatusTabs from "@/components/campaigns/StatusTabs";
import CloseArchiveModal from "@/components/campaigns/CloseArchiveModal";
import { generateCampaignPDF } from "@/lib/pdf/generateReport";
import {
  Plus,
  Search,
  ArrowLeft,
  LayoutGrid,
  FileText,
  Pause,
  Play,
  Trash2,
  XCircle,
  Archive,
  FileDown,
  Loader2,
  AlertCircle,
} from "lucide-react";

const platformOptions = [
  { value: "ALL", label: "Toutes les plateformes" },
  { value: "META", label: "Meta Ads" },
  { value: "GOOGLE_SEARCH", label: "Google Search" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "EMAIL", label: "Email" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "SNAPCHAT", label: "Snapchat" },
  { value: "OTHER", label: "Autre" },
];

const sortOptions = [
  { value: "leads", label: "Leads" },
  { value: "mql", label: "MQL" },
  { value: "sql", label: "SQL" },
  { value: "mqlRate", label: "Taux MQL" },
  { value: "sqlGlobalRate", label: "Taux SQL global" },
];

const STATUS_TRANSITIONS: Record<string, { nextStatus: CampaignStatus; label: string; color: string; icon: typeof Play }[]> = {
  TO_DIFFUSE: [
    { nextStatus: "ACTIVE", label: "Lancer", color: "bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20", icon: Play },
  ],
  ACTIVE: [
    { nextStatus: "PAUSED", label: "Pause", color: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/20", icon: Pause },
    { nextStatus: "COMPLETED", label: "Clôturer", color: "bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border-primary-500/20", icon: Archive },
  ],
  PAUSED: [
    { nextStatus: "ACTIVE", label: "Reprendre", color: "bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20", icon: Play },
    { nextStatus: "ACTIVE", label: "Clôturer", color: "bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border-primary-500/20", icon: Archive },
  ],
  DRAFT: [
    { nextStatus: "TO_DIFFUSE", label: "Prêt à diffuser", color: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20", icon: Play },
    { nextStatus: "CANCELLED", label: "Annuler", color: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20", icon: XCircle },
  ],
};

function SkeletonCard() {
  return (
    <div className="bg-surface-card border border-border rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-36 bg-surface-elevated" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-surface-elevated rounded w-3/4" />
        <div className="h-3 bg-surface-elevated rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-surface-elevated rounded-full w-16" />
          <div className="h-5 bg-surface-elevated rounded-full w-16" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-surface-elevated rounded-lg" />
          ))}
        </div>
        <div className="h-9 bg-surface-elevated rounded-lg" />
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignWithCalculations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("leads");
  const [closeArchiveModal, setCloseArchiveModal] = useState<{ isOpen: boolean; campaign: CampaignWithCalculations | null }>({
    isOpen: false,
    campaign: null,
  });
  const [pdfGenerating, setPdfGenerating] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de chargement");
      setCampaigns(
        (data.campaigns || []).map((c: Campaign) => enrichCampaign(c))
      );
    } catch (e) {
      setCampaigns([]);
      setFetchError(e instanceof Error ? e.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: campaigns.length,
      TO_DIFFUSE: 0,
      ACTIVE: 0,
      PAUSED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
      DRAFT: 0,
    };
    campaigns.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return counts;
  }, [campaigns]);

  const filtered = useMemo(() => {
    let result = campaigns;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.campaignId.toLowerCase().includes(q)
      );
    }

    if (platformFilter !== "ALL") {
      result = result.filter((c) => c.platform === platformFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((c) => c.status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      const valA = a[sortBy as keyof CampaignWithCalculations] as number;
      const valB = b[sortBy as keyof CampaignWithCalculations] as number;
      return valB - valA;
    });

    return result;
  }, [campaigns, search, platformFilter, statusFilter, sortBy]);

  const handleStatusChange = async (campaignId: string, newStatus: CampaignStatus) => {
    if (newStatus === "COMPLETED") {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (campaign) {
        setCloseArchiveModal({ isOpen: true, campaign });
      }
      return;
    }

    setStatusUpdating(campaignId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Erreur de mise à jour");
      await fetchCampaigns();
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleConfirmCloseArchive = async (data: {
    endDate: string;
    spend: number;
    leads: number;
    mql: number;
    sql: number;
    nq: number;
  }) => {
    const campaign = closeArchiveModal.campaign;
    if (!campaign) return;

    const res = await fetch(`/api/campaigns/${campaign.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "COMPLETED",
        endDate: data.endDate,
        spend: data.spend,
        leads: data.leads,
        mql: data.mql,
        sql: data.sql,
        nq: data.nq,
      }),
    });
    if (!res.ok) throw new Error("Erreur de mise à jour");
    setCloseArchiveModal({ isOpen: false, campaign: null });
    await fetchCampaigns();
  };

  const handlePDFExport = async (campaign: CampaignWithCalculations) => {
    setPdfGenerating(campaign.id);
    try {
      await generateCampaignPDF(campaign);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfGenerating(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Campagnes</h1>
            <p className="text-sm text-text-muted mt-1">
              {isLoading
                ? "Chargement..."
                : `${filtered.length} campagne${filtered.length !== 1 ? "s" : ""} au total`}
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-black rounded-lg text-sm font-semibold hover:bg-primary-400 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouvelle campagne
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <StatusTabs
          counts={statusCounts}
          activeStatus={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm text-white placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3 py-2.5 border border-border rounded-lg text-sm text-text-secondary bg-surface-card outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          {platformOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2.5 border border-border rounded-lg text-sm text-text-secondary bg-surface-card outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Trier par : {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 mb-4">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-base font-medium text-white">Erreur de connexion</h3>
          <p className="mt-1 text-sm text-text-muted max-w-sm">{fetchError}</p>
          <button
            onClick={fetchCampaigns}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-black rounded-lg text-sm font-semibold hover:bg-primary-400 transition-colors"
          >
            Réessayer
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-elevated mb-4">
            <LayoutGrid className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-base font-medium text-white">
            {campaigns.length === 0
              ? "Aucune campagne"
              : "Aucun résultat"}
          </h3>
          <p className="mt-1 text-sm text-text-muted max-w-sm">
            {campaigns.length === 0
              ? "Commencez par créer votre première campagne marketing."
              : "Modifiez vos filtres pour trouver ce que vous recherchez."}
          </p>
          {campaigns.length === 0 && (
            <Link
              href="/campaigns/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-surface-secondary text-white rounded-lg text-sm font-medium hover:bg-surface-elevated transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ajouter une campagne
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((campaign) => {
            const badge = getCampaignPerformanceBadge(campaign);
            const hasVisuals =
              campaign.visuals && campaign.visuals.length > 0;
            const transitions = STATUS_TRANSITIONS[campaign.status] || [];

            return (
              <div
                key={campaign.id}
                className="bg-surface-card border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col"
              >
                <Link
                  href={`/campaigns/${campaign.id}`}
                  className="block"
                >
                  <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200">
                    {hasVisuals ? (
                      <img
                        src={campaign.visuals[0].imageUrl}
                        alt={campaign.visuals[0].altText || campaign.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <LayoutGrid className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                    {badge && (
                      <span
                        className={cn(
                          "absolute top-2 right-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                          badge.bgColor,
                          badge.color
                        )}
                      >
                        {badge.label}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-4 flex-1 flex flex-col">
                  <Link href={`/campaigns/${campaign.id}`} className="block">
                    <h3 className="font-semibold text-white truncate hover:text-primary-400 transition-colors">
                      {campaign.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {campaign.campaignId}
                    </p>
                  </Link>

                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                        getPlatformColor(campaign.platform)
                      )}
                    >
                      {getPlatformLabel(campaign.platform)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                        getStatusColor(campaign.status)
                      )}
                    >
                      {getStatusLabel(campaign.status)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase">Leads</p>
                      <p className="text-sm font-bold text-white">{formatNumber(campaign.leads)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase">MQL</p>
                      <p className="text-sm font-bold text-white">{formatNumber(campaign.mql)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase">SQL</p>
                      <p className="text-sm font-bold text-white">{formatNumber(campaign.sql)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase">NQ</p>
                      <p className="text-sm font-bold text-white">{formatNumber(campaign.nq)}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
                    <span>
                      Taux MQL:{" "}
                      <span className="font-medium text-text-secondary">
                        {formatPercentage(campaign.mqlRate)}
                      </span>
                    </span>
                    <span>
                      Taux SQL:{" "}
                      <span className="font-medium text-text-secondary">
                        {formatPercentage(campaign.sqlGlobalRate)}
                      </span>
                    </span>
                  </div>

                  <div className="mt-auto pt-3 flex items-center gap-2">
                    {transitions.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        {transitions.map((t) => {
                          const Icon = t.icon;
                          return (
                            <button
                              key={t.label}
                              onClick={() => handleStatusChange(campaign.id, t.nextStatus)}
                              disabled={statusUpdating === campaign.id}
                              className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors disabled:opacity-50",
                                t.color
                              )}
                            >
                              {statusUpdating === campaign.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Icon className="h-3 w-3" />
                              )}
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button
                      onClick={() => handlePDFExport(campaign)}
                      disabled={pdfGenerating === campaign.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-border text-text-muted hover:bg-surface-elevated hover:text-white transition-colors disabled:opacity-50 ml-auto"
                    >
                      {pdfGenerating === campaign.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <FileDown className="h-3 w-3" />
                      )}
                      PDF
                    </button>

                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-border text-text-muted hover:bg-surface-elevated hover:text-white transition-colors"
                    >
                      <FileText className="h-3 w-3" />
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CloseArchiveModal
        isOpen={closeArchiveModal.isOpen}
        onClose={() => setCloseArchiveModal({ isOpen: false, campaign: null })}
        onConfirm={handleConfirmCloseArchive}
        campaignName={closeArchiveModal.campaign?.name || ""}
      />
    </div>
  );
}

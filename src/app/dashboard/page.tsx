"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  LayoutGrid,
  RefreshCw,
  TrendingUp,
  Target,
  AlertTriangle,
} from "lucide-react";

import {
  Campaign,
  CampaignWithCalculations,
  CampaignPlatform,
  CampaignStatus,
  DateRangeOption,
} from "@/types";
import {
  enrichCampaign,
  getBestCampaign,
  formatPercentage,
  formatNumber,
  formatCurrency,
} from "@/lib/calculations";
import {
  getPlatformLabel,
  getPlatformColor,
  getStatusLabel,
  getStatusColor,
} from "@/lib/utils";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiSection from "@/components/dashboard/KpiSection";
import BestCampaignCard from "@/components/dashboard/BestCampaignCard";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { VolumeBarChart } from "@/components/charts/VolumeBarChart";
import { ConversionRateChart } from "@/components/charts/ConversionRateChart";
import { PlatformDonutChart } from "@/components/charts/PlatformDonutChart";
import { ChartLimitSelector } from "@/components/charts/ChartLimitSelector";
import { KpiSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/hooks/useToast";

const ITEMS_PER_PAGE = 12;

function CardSkeleton() {
  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
      <div className="h-36 bg-surface-elevated animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-surface-elevated rounded animate-pulse" />
        <div className="h-3 w-1/3 bg-surface-elevated rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-surface-elevated rounded-full animate-pulse" />
          <div className="h-5 w-14 bg-surface-elevated rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-surface-elevated rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { toasts, success, error } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLimit, setChartLimit] = useState(10);
  const [dateRange, setDateRange] = useState<DateRangeOption>("all");

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<CampaignPlatform | "ALL">("ALL");
  const [status, setStatus] = useState<CampaignStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState("leads");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setCampaigns(data.campaigns ?? data);
    } catch {
      error("Erreur lors du chargement des campagnes");
    } finally {
      setLoading(false);
    }
  };

  const enrichedCampaigns = useMemo(
    () => campaigns.map(enrichCampaign),
    [campaigns]
  );

  const filteredCampaigns = useMemo(() => {
    let result = enrichedCampaigns;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.campaignId.toLowerCase().includes(q) ||
          c.angle.toLowerCase().includes(q)
      );
    }

    if (platform !== "ALL") {
      result = result.filter((c) => c.platform === platform);
    }

    if (status !== "ALL") {
      result = result.filter((c) => c.status === status);
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let startDate: Date;
      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "7days":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }
      result = result.filter((c) => new Date(c.startDate) >= startDate);
    }

    result = [...result].sort((a, b) => {
      const record = (x: CampaignWithCalculations) =>
        x as unknown as Record<string, number>;
      const aVal = record(a)[sortBy];
      const bVal = record(b)[sortBy];
      if (typeof aVal !== "number" || typeof bVal !== "number") return 0;
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [enrichedCampaigns, search, platform, status, sortBy, sortOrder, dateRange]);

  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);

  const totals = useMemo(() => {
    return filteredCampaigns.reduce(
      (acc, c) => ({
        leads: acc.leads + c.leads,
        mql: acc.mql + c.mql,
        sql: acc.sql + c.sql,
        nq: acc.nq + c.nq,
        spend: acc.spend + c.spend,
      }),
      { leads: 0, mql: 0, sql: 0, nq: 0, spend: 0 }
    );
  }, [filteredCampaigns]);

  const bestCampaign = useMemo(
    () => getBestCampaign(filteredCampaigns),
    [filteredCampaigns]
  );
  const bestCampaignEnriched = useMemo(
    () => (bestCampaign ? enrichCampaign(bestCampaign) : null),
    [bestCampaign]
  );

  const activeCount = filteredCampaigns.filter(
    (c) => c.status === "ACTIVE"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setPlatform("ALL");
    setStatus("ALL");
    setSortBy("leads");
    setSortOrder("desc");
    setCurrentPage(1);
    setDateRange("all");
  };

  const handleView = (id: string) => router.push(`/campaigns/${id}`);

  const handleExport = useCallback(() => {
    const headers = ["Name", "Platform", "Status", "Leads", "MQL", "SQL", "NQ", "Spend", "CPL", "Cost/SQL"];
    const rows = filteredCampaigns.map((c) => [
      c.name,
      c.platform,
      c.status,
      c.leads,
      c.mql,
      c.sql,
      c.nq,
      c.spend,
      c.cpl.toFixed(2),
      c.costPerSql.toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `amm-campaigns-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    success("Données exportées avec succès");
  }, [filteredCampaigns, success]);

  const hasFilters =
    search !== "" ||
    platform !== "ALL" ||
    status !== "ALL" ||
    sortBy !== "leads" ||
    sortOrder !== "desc" ||
    dateRange !== "all";

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-80 bg-surface-elevated rounded animate-pulse" />
            <div className="h-4 w-96 bg-surface-elevated rounded animate-pulse" />
          </div>
          <div className="h-10 w-44 bg-surface-elevated rounded-lg animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-64 bg-surface-elevated rounded-lg animate-pulse" />
          <div className="h-10 w-44 bg-surface-elevated rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-surface-elevated rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KpiSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <DashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
      />

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Rechercher par nom, ID ou angle..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <select
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value as CampaignPlatform | "ALL");
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="ALL">Toutes les plateformes</option>
          <option value="META">Meta Ads</option>
          <option value="GOOGLE_SEARCH">Google Search</option>
          <option value="LINKEDIN">LinkedIn</option>
          <option value="EMAIL">Email</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="ORGANIC_SOCIAL">Réseaux sociaux organique</option>
          <option value="OTHER">Autre</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as CampaignStatus | "ALL");
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="DRAFT">Brouillon</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">En pause</option>
          <option value="COMPLETED">Terminée</option>
        </select>

        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            setSortBy(field);
            setSortOrder(order as "asc" | "desc");
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="leads-desc">Leads décroissant</option>
          <option value="leads-asc">Leads croissant</option>
          <option value="mql-desc">MQL décroissant</option>
          <option value="sql-desc">SQL décroissant</option>
          <option value="sqlGlobalRate-desc">Taux SQL décroissant</option>
          <option value="mqlRate-desc">Taux MQL décroissant</option>
          <option value="nq-desc">NQ décroissant</option>
          <option value="nqRate-desc">Taux NQ décroissant</option>
          <option value="spend-desc">Spend décroissant</option>
        </select>

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <RefreshCw size={14} />
            Réinitialiser
          </button>
        )}
      </div>

      {/* KPI Section */}
      <KpiSection totals={totals} activeCount={activeCount} />

      {/* Best Campaign */}
      {bestCampaignEnriched && <BestCampaignCard campaign={bestCampaignEnriched} />}

      {/* Campaign Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid size={18} className="text-text-muted" />
          <h2 className="text-lg font-semibold text-white">
            Campagnes
            <span className="ml-2 text-sm font-normal text-text-muted">
              {filteredCampaigns.length} résultat{filteredCampaigns.length !== 1 ? "s" : ""}
            </span>
          </h2>
        </div>

        {filteredCampaigns.length === 0 ? (
          <EmptyState
            title="Aucune campagne trouvée"
            description={
              hasFilters
                ? "Modifiez vos filtres pour voir des résultats."
                : "Commencez par créer votre première campagne."
            }
            action={
              hasFilters ? (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated text-text-secondary text-sm font-medium rounded-lg hover:bg-surface-elevated"
                >
                  <RefreshCw size={14} />
                  Réinitialiser les filtres
                </button>
              ) : (
                <button
                  onClick={() => router.push("/campaigns/new")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-black text-sm font-medium rounded-lg hover:bg-primary-400"
                >
                  <Plus size={16} />
                  Créer une campagne
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCampaigns
                .slice(
                  (currentPage - 1) * ITEMS_PER_PAGE,
                  currentPage * ITEMS_PER_PAGE
                )
                .map((campaign) => (
                  <div
                    key={campaign.id}
                    className="cursor-pointer"
                    onClick={() => handleView(campaign.id)}
                  >
                    <CampaignCard
                      campaign={campaign}
                      onView={handleView}
                    />
                  </div>
                ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-primary-500 text-black"
                          : "text-text-secondary hover:bg-surface-elevated"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text-secondary">
              Volumes par campagne
            </h3>
            <ChartLimitSelector value={chartLimit} onChange={setChartLimit} />
          </div>
          <VolumeBarChart
            campaigns={filteredCampaigns}
            limit={chartLimit}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text-secondary">
              Taux de conversion
            </h3>
            <ChartLimitSelector value={chartLimit} onChange={setChartLimit} />
          </div>
          <ConversionRateChart
            campaigns={filteredCampaigns}
            limit={chartLimit}
          />
        </div>
      </div>

      <PlatformDonutChart campaigns={filteredCampaigns} />
    </div>
  );
}

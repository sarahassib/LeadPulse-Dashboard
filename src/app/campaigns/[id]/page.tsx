"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { enrichCampaign } from "@/lib/calculations";
import { Campaign, CampaignWithCalculations } from "@/types";
import CampaignInfo from "@/components/campaigns/CampaignInfo";
import CampaignVisualGallery from "@/components/campaigns/CampaignVisualGallery";
import CampaignMetrics from "@/components/campaigns/CampaignMetrics";
import CampaignDiagnostic from "@/components/campaigns/CampaignDiagnostic";
import CampaignComparison from "@/components/campaigns/CampaignComparison";
import DeleteCampaignDialog from "@/components/campaigns/DeleteCampaignDialog";
import DailyEntryForm from "@/components/campaigns/DailyEntryForm";
import DailyEntriesTable from "@/components/campaigns/DailyEntriesTable";
import DailyTrendChart from "@/components/charts/DailyTrendChart";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Pencil, Copy, Trash2, CalendarPlus, TrendingUp } from "lucide-react";
import Link from "next/link";

interface MetricEntry {
  id: string;
  date: string;
  leads: number;
  mql: number;
  sql: number;
  nq: number;
  notes?: string | null;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toasts, success, error } = useToast();
  const [campaign, setCampaign] = useState<CampaignWithCalculations | null>(null);
  const [allCampaigns, setAllCampaigns] = useState<CampaignWithCalculations[]>([]);
  const [comparedCampaign, setComparedCampaign] = useState<CampaignWithCalculations | null>(null);
  const [metricEntries, setMetricEntries] = useState<MetricEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${params.id}/metrics`);
      if (res.ok) {
        const data = await res.json();
        setMetricEntries(data);
      }
    } catch {}
  }, [params.id]);

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${params.id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCampaign(enrichCampaign(data));
    } catch {}
  }, [params.id]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [campaignRes, allRes] = await Promise.all([
          fetch(`/api/campaigns/${params.id}`),
          fetch("/api/campaigns"),
        ]);
        if (!campaignRes.ok) throw new Error("Campagne introuvable");
        const campaignData = await campaignRes.json();
        const allData = await allRes.json();
        setCampaign(enrichCampaign(campaignData));
        setAllCampaigns((allData.campaigns || []).map((c: Campaign) => enrichCampaign(c)));
        await fetchEntries();
      } catch {
        setFetchError("Impossible de charger la campagne.");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) loadData();
  }, [params.id, fetchEntries]);

  const handleEntrySaved = async () => {
    setShowEntryForm(false);
    success("Saisie enregistrée !");
    await Promise.all([fetchCampaign(), fetchEntries()]);
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const res = await fetch(`/api/campaigns/${params.id}/metrics?entryId=${entryId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      success("Saisie supprimée !");
      await Promise.all([fetchCampaign(), fetchEntries()]);
    } catch {
      error("Erreur lors de la suppression.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/campaigns/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      success("Campagne supprimée !");
      router.push("/dashboard");
    } catch {
      error("Erreur lors de la suppression.");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const handleDuplicate = async () => {
    if (!campaign) return;
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/campaigns/${params.id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error();
      const result = await res.json();
      success("Campagne dupliquée !");
      router.push(`/campaigns/${result.id}`);
    } catch {
      error("Erreur lors de la duplication.");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleCompare = (otherId: string) => {
    const found = allCampaigns.find((c) => c.id === otherId);
    setComparedCampaign(found || null);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-elevated rounded w-1/3" />
          <div className="h-4 bg-surface-elevated rounded w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-surface-elevated rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !campaign) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-text-muted text-lg">{fetchError || "Campagne introuvable."}</p>
          <Link href="/dashboard" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
            <p className="text-sm text-text-muted mt-1">{campaign.campaignId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/campaigns/${campaign.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-card border border-slate-300 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Modifier
            </Link>
            <button
              onClick={handleDuplicate}
              disabled={isDuplicating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-card border border-slate-300 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              {isDuplicating ? "Duplication..." : "Dupliquer"}
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-card border border-red-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <CampaignInfo campaign={campaign} />
        <CampaignVisualGallery visuals={campaign.visuals || []} onOpenModal={() => {}} />
        <CampaignMetrics campaign={campaign} />

        {/* Daily Entries Section */}
        <div className="bg-surface-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-white">Saisies journalières</h2>
            </div>
            <button
              onClick={() => setShowEntryForm(!showEntryForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-black rounded-lg text-sm font-medium hover:bg-primary-400 transition-colors"
            >
              <CalendarPlus className="h-4 w-4" />
              {showEntryForm ? "Fermer" : "Ajouter une saisie"}
            </button>
          </div>

          {showEntryForm && (
            <div className="mb-6 p-4 bg-surface-elevated rounded-lg border border-border">
              <DailyEntryForm
                campaignId={campaign.id}
                onEntrySaved={handleEntrySaved}
              />
            </div>
          )}

          {metricEntries.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-text-muted" />
                <h3 className="text-sm font-medium text-text-secondary">Évolution quotidienne</h3>
              </div>
              <DailyTrendChart entries={metricEntries} />
            </div>
          )}

          <DailyEntriesTable entries={metricEntries} onDelete={handleDeleteEntry} />
        </div>

        <CampaignDiagnostic campaign={campaign} />
        <CampaignComparison
          currentCampaign={campaign}
          allCampaigns={allCampaigns}
          onCompare={handleCompare}
          comparedCampaign={comparedCampaign}
        />
      </div>

      <DeleteCampaignDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        campaignName={campaign.name}
        isLoading={isDeleting}
      />

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
              t.type === "success" ? "bg-primary-600" : t.type === "error" ? "bg-red-600" : "bg-accent-500"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}




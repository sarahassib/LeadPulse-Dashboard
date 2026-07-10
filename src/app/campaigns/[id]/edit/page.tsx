"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CampaignForm from "@/components/forms/CampaignForm";
import { CampaignFormData } from "@/types";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const { toasts, success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<CampaignFormData | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const res = await fetch(`/api/campaigns/${params.id}`);
        if (!res.ok) throw new Error("Campagne introuvable");
        const data = await res.json();
        setInitialData(data);
      } catch {
        setFetchError("Impossible de charger la campagne. Vérifiez l'identifiant et réessayez.");
      } finally {
        setIsFetching(false);
      }
    };
    if (params.id) fetchCampaign();
  }, [params.id]);

  const handleSubmit = async (data: CampaignFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification");
      success("Campagne modifiée avec succès !");
      router.push(`/campaigns/${params.id}`);
    } catch {
      error("Une erreur est survenue lors de la modification de la campagne.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-elevated rounded w-1/3" />
          <div className="h-4 bg-surface-elevated rounded w-2/3" />
          <div className="h-96 bg-surface-elevated rounded-xl mt-6" />
        </div>
      </div>
    );
  }

  if (fetchError || !initialData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-text-muted text-lg">{fetchError || "Campagne introuvable."}</p>
          <Link
            href={`/campaigns/${params.id}`}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la campagne
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/campaigns/${params.id}`}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la campagne
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Pencil className="h-6 w-6 text-blue-600" />
          Modifier la campagne
        </h1>
        <p className="text-text-muted mt-1">Mettez à jour les informations de cette campagne.</p>
      </div>
      <CampaignForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/campaigns/${params.id}`)}
        isLoading={isLoading}
      />
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
              t.type === "success"
                ? "bg-primary-600"
                : t.type === "error"
                ? "bg-red-600"
                : "bg-accent-500"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}




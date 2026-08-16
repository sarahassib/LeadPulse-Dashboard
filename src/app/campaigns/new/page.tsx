"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CampaignForm from "@/components/forms/CampaignForm";
import { CampaignFormData } from "@/types";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewCampaignPage() {
  const router = useRouter();
  const { toasts, success, error, dismiss } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CampaignFormData) => {
    setIsLoading(true);
    try {
      const { visuals: _visuals, ...campaignData } = data;
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Erreur lors de la création");
      }
      success("Campagne créée avec succès !");
      router.push(`/campaigns/${result.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Une erreur est survenue";
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          Nouvelle campagne
        </h1>
        <p className="text-text-muted mt-1">Créez une nouvelle campagne marketing et enregistrez ses performances.</p>
      </div>
      <CampaignForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard")}
        isLoading={isLoading}
      />
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
              t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            <span>{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="ml-2 text-white/70 hover:text-white font-bold">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}



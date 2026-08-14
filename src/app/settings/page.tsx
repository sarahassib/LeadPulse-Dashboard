"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Tag,
  Users,
  Target,
  Settings,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SettingItem {
  id: string;
  category: string;
  value: string;
  createdAt: string;
}

type SettingCategory = "ANGLE" | "CIBLE" | "OBJECTIF";

const categoryConfig: Record<SettingCategory, { label: string; icon: typeof Tag; description: string }> = {
  ANGLE: { label: "Angles", icon: Tag, description: "Angles créatifs de vos campagnes marketing" },
  CIBLE: { label: "Cibles / Audiences", icon: Users, description: "Audiences cibles pour le ciblage publicitaire" },
  OBJECTIF: { label: "Objectifs", icon: Target, description: "Objectifs de vos campagnes marketing" },
};

const defaultSeed: Record<SettingCategory, string[]> = {
  ANGLE: [
    "Promotion spéciale",
    "Nouveauté produit",
    "Témoignage client",
    "Comparatif concurrent",
    "Offre limitée",
    "Sensibilisation marque",
  ],
  CIBLE: [
    "PME BTP",
    "Sociétés de construction",
    "Entreprises industrielles",
    "Directeurs d'achat",
    "Chefs de projet",
    "Artisans du BTP",
  ],
  OBJECTIF: [
    "Génération de leads",
    "Nurturing",
    "Notoriété de marque",
    "Conversion directe",
    "Réactivation",
    "Relance commerciale",
  ],
};

export default function SettingsPage() {
  const { toasts, success, error } = useToast();
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [seeding, setSeeding] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSettings(data);
    } catch {
      error("Erreur lors du chargement des paramètres");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleAdd = async (category: SettingCategory) => {
    const value = newItems[category]?.trim();
    if (!value) return;

    setAdding((prev) => ({ ...prev, [category]: true }));
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, value }),
      });
      if (!res.ok) {
        let errMsg = "Erreur lors de l'ajout";
        try {
          const err = await res.json();
          errMsg = err.error || errMsg;
        } catch {
          // Response wasn't JSON — use default message
        }
        throw new Error(errMsg);
      }
      setNewItems((prev) => ({ ...prev, [category]: "" }));
      success(`${categoryConfig[category].label} ajouté avec succès`);
      await fetchSettings();
    } catch (e: unknown) {
      error(e instanceof Error ? e.message : "Erreur lors de l'ajout");
    } finally {
      setAdding((prev) => ({ ...prev, [category]: false }));
    }
  };

  const handleDelete = async (id: string, category: string) => {
    setDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/settings?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      success("Option supprimée");
      await fetchSettings();
    } catch {
      error("Erreur lors de la suppression");
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      let added = 0;
      for (const [category, items] of Object.entries(defaultSeed)) {
        for (const value of items) {
          const res = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, value }),
          });
          if (res.ok) added++;
        }
      }
      success(`${added} options par défaut ajoutées`);
      await fetchSettings();
    } catch {
      error("Erreur lors de l'initialisation");
    } finally {
      setSeeding(false);
    }
  };

  const grouped = (category: SettingCategory) =>
    settings.filter((s) => s.category === category);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-surface-elevated rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface-elevated rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary-400" />
              Paramètres
            </h1>
            <p className="text-text-muted mt-1">
              Gérez les options dynamiques utilisées dans vos campagnes
            </p>
          </div>
          {settings.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-black text-sm font-medium rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50"
            >
              {seeding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Initialiser les options par défaut
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {(Object.keys(categoryConfig) as SettingCategory[]).map((category) => {
          const config = categoryConfig[category];
          const Icon = config.icon;
          const items = grouped(category);

          return (
            <div
              key={category}
              className="bg-surface-card border border-border rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Icon size={18} className="text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{config.label}</h2>
                  <p className="text-xs text-text-muted">{config.description}</p>
                </div>
                <span className="ml-auto text-xs text-text-muted bg-surface-elevated px-2.5 py-1 rounded-full">
                  {items.length} option{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="p-6">
                {/* Add new item */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder={`Ajouter un(e) ${config.label.toLowerCase().slice(0, -1)}...`}
                    value={newItems[category] || ""}
                    onChange={(e) =>
                      setNewItems((prev) => ({ ...prev, [category]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAdd(category);
                      }
                    }}
                    className="flex-1 rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    onClick={() => handleAdd(category)}
                    disabled={!newItems[category]?.trim() || adding[category]}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-black text-sm font-medium rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {adding[category] ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    Ajouter
                  </button>
                </div>

                {/* Items list */}
                {items.length === 0 ? (
                  <div className="text-center py-8 text-text-muted text-sm">
                    Aucune option configurée. Ajoutez-en une ou initialisez les options par défaut.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-elevated/50 group transition-colors"
                      >
                        <GripVertical size={14} className="text-text-muted opacity-40" />
                        <span className="flex-1 text-sm text-text-secondary">{item.value}</span>
                        <button
                          onClick={() => handleDelete(item.id, category)}
                          disabled={deleting[item.id]}
                          className="p-1.5 rounded-md text-text-muted opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          {deleting[item.id] ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Toasts */}
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

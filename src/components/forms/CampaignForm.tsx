"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tag,
  Target,
  Image,
  Upload,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Save,
  Plus,
  X,
  FileImage,
  CheckCircle2,
  DollarSign,
  Users,
  Globe,
  MessageSquare,
  Link2,
  ChevronRight,
} from "lucide-react";
import {
  campaignFormSchema,
  CampaignFormValues,
} from "@/lib/validations";
import { generateCampaignId } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import type { Setting, AFRICAN_COUNTRIES } from "@/types";

interface CampaignFormProps {
  initialData?: CampaignFormValues;
  onSubmit: (data: CampaignFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

interface UploadedImage {
  id: string;
  url: string;
  fileName: string;
  size: number;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  url?: string;
  error?: string;
}

const platformOptions = [
  { value: "META", label: "Meta Ads" },
  { value: "GOOGLE_SEARCH", label: "Google Ads" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "EMAIL", label: "Email" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "SNAPCHAT", label: "Snapchat" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "DRAFT", label: "Brouillon" },
  { value: "TO_DIFFUSE", label: "À diffuser" },
  { value: "ACTIVE", label: "En cours" },
  { value: "PAUSED", label: "En pause" },
  { value: "COMPLETED", label: "Terminée" },
  { value: "CANCELLED", label: "Annulée" },
];

const regionOptions = [
  { value: "MAROC", label: "Maroc" },
  { value: "AFRIQUE", label: "Afrique" },
];

const visualTypeOptions = [
  { value: "REEL", label: "Reel" },
  { value: "VIDEO", label: "Vidéo" },
  { value: "CAROUSEL", label: "Carrousel" },
  { value: "SINGLE_IMAGE", label: "Single Ad Image" },
];

const destinationTypeOptions = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "META_INSTANT_FORM", label: "Meta Instant Form" },
  { value: "LANDING_PAGE", label: "Landing Page" },
  { value: "WEBSITE", label: "Website" },
  { value: "DIRECT_CALL", label: "Appel direct" },
];

const ctaOptions = [
  "Demander un devis",
  "En savoir plus",
  "Acheter maintenant",
  "S'inscrire",
  "Contacter nous",
  "Télécharger",
  "Réserver",
  "Autre",
];

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const AFRICAN_COUNTRIES_LIST = [
  "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso",
  "Burundi", "Cameroun", "Cap-Vert", "Centrafrique", "Comores",
  "Congo", "Côte d'Ivoire", "Djibouti", "Égypte", "Érythrée",
  "Eswatini", "Éthiopie", "Gabon", "Gambie", "Ghana",
  "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Kenya", "Lesotho",
  "Liberia", "Libye", "Madagascar", "Malawi", "Mali",
  "Maurice", "Mauritanie", "Mozambique", "Namibie",
  "Niger", "Nigeria", "Ouganda", "République démocratique du Congo",
  "République du Congo", "Rwanda", "São Tomé-et-Principe", "Sénégal",
  "Seychelles", "Sierra Leone", "Somalie", "Soudan", "Soudan du Sud",
  "Tanzanie", "Tchad", "Togo", "Tunisie", "Zambie", "Zimbabwe",
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function CampaignForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: CampaignFormProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Dynamic settings
  const [angles, setAngles] = useState<Setting[]>([]);
  const [cibles, setCibles] = useState<Setting[]>([]);
  const [objectifs, setObjectifs] = useState<Setting[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/settings?category=ANGLE").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setAngles(d); }).catch(() => {});
    fetch("/api/settings?category=CIBLE").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setCibles(d); }).catch(() => {});
    fetch("/api/settings?category=OBJECTIF").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setObjectifs(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData && "visuals" in initialData && Array.isArray((initialData as Record<string, unknown>).visuals)) {
      const visuals = (initialData as Record<string, unknown>).visuals as { id: string; imageUrl: string; fileName: string; isPrimary?: boolean }[];
      setUploadedImages(
        visuals.map((v) => ({
          id: v.id || `existing-${Math.random().toString(36).slice(2)}`,
          url: v.imageUrl,
          fileName: v.fileName,
          size: 0,
        }))
      );
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (initialData?.countries) {
      setSelectedCountries(initialData.countries.split(",").map((c) => c.trim()).filter(Boolean));
    }
  }, [initialData]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: initialData ?? {
      campaignId: "",
      name: "",
      platform: "META",
      status: "DRAFT",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      angle: "",
      cible: "",
      objectif: "",
      region: "MAROC",
      countries: "",
      message: "",
      headline: "",
      description: "",
      visualType: "SINGLE_IMAGE",
      callToAction: "Demander un devis",
      destinationType: "LANDING_PAGE",
      destinationUrl: "",
      notes: "",
      leads: 0,
      mql: 0,
      sql: 0,
      nq: 0,
      spend: 0,
    },
  });

  const message = watch("message") ?? "";
  const watchedStatus = watch("status");
  const watchedRegion = watch("region");

  useEffect(() => {
    if (watchedStatus === "COMPLETED" && !watch("endDate")) {
      setValue("endDate", new Date().toISOString().split("T")[0]);
    }
  }, [watchedStatus, setValue, watch]);

  const uploadFile = useCallback(async (file: File) => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setUploadingFiles((prev) => [...prev, { id, file, progress: 0, status: "uploading" }]);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
        reader.readAsDataURL(file);
      });

      setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "done", url: dataUrl, progress: 100 } : f)));
      setUploadedImages((prev) => [...prev, { id, url: dataUrl, fileName: file.name, size: file.size }]);
      setTimeout(() => setUploadingFiles((prev) => prev.filter((f) => f.id !== id)), 1500);
    } catch (err) {
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "error", error: err instanceof Error ? err.message : "Erreur" } : f))
      );
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      for (const file of Array.from(files)) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          alert(`Format non accepté : ${file.name}. Utilisez JPG, PNG ou WEBP.`);
          continue;
        }
        if (file.size > MAX_SIZE) {
          alert(`Fichier trop volumineux : ${file.name}. Max 5 Mo.`);
          continue;
        }
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files); }, [handleFiles]);
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) { handleFiles(e.target.files); e.target.value = ""; } }, [handleFiles]);
  const removeImage = useCallback((id: string) => { setUploadedImages((prev) => prev.filter((img) => img.id !== id)); }, []);

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) => {
      const next = prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country];
      setValue("countries", next.join(", "));
      return next;
    });
  };

  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepErrors.length > 0 && errorBannerRef.current) {
      errorBannerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [stepErrors]);

  const stepFields: Record<number, (keyof CampaignFormValues)[]> = {
    1: ["campaignId", "name", "platform", "status", "startDate"],
    2: ["angle"],
    3: ["message"],
    4: [],
  };

  const onFormError = (formErrors: Record<string, { message?: string }>) => {
    const fieldLabels: Record<string, string> = {
      campaignId: "ID Campagne",
      name: "Nom",
      platform: "Plateforme",
      status: "Statut",
      startDate: "Date de début",
      endDate: "Date de fin",
      angle: "Angle",
      message: "Message",
    };
    const msgs = Object.keys(formErrors).map((k) => fieldLabels[k] || k);
    setStepErrors([`Champs requis manquants : ${msgs.join(", ")}`]);
  };

  const handleNextStep = async () => {
    const fields = stepFields[currentStep];
    const valid = await trigger(fields);
    if (!valid) {
      const msgs: string[] = [];
      if (errors.name) msgs.push("Nom de la campagne");
      if (errors.platform) msgs.push("Plateforme");
      if (errors.status) msgs.push("Statut");
      if (errors.startDate) msgs.push("Date de début");
      if (errors.angle) msgs.push("Angle");
      if (errors.message) msgs.push("Message");
      setStepErrors(msgs.length > 0 ? [`Champs requis manquants : ${msgs.join(", ")}`] : []);
      return;
    }
    setStepErrors([]);
    setCurrentStep((s) => s + 1);
  };

  const handleFormSubmit = async (data: CampaignFormValues) => {
    const dataWithVisuals = {
      ...data,
      countries: selectedCountries.join(", "),
      visuals: uploadedImages.map((img, i) => ({
        imageUrl: img.url,
        fileName: img.fileName,
        altText: `${data.name} - Visual ${i + 1}`,
        isPrimary: i === 0,
      })),
    };
    await onSubmit(dataWithVisuals);
  };

  const steps = [
    { num: 1, label: "Identification", icon: Tag },
    { num: 2, label: "Stratégie", icon: Users },
    { num: 3, label: "Ad Copy & Créa", icon: MessageSquare },
    { num: 4, label: "Destination", icon: Link2 },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, onFormError)} className="mx-auto max-w-4xl space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={onCancel} className="rounded-lg border border-border p-2 text-text-muted hover:bg-surface-elevated">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {mode === "create" ? "Créer une campagne" : "Modifier la campagne"}
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              {mode === "create" ? "Remplissez les informations pour créer une nouvelle campagne" : "Modifiez les informations de la campagne"}
            </p>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center gap-2 bg-surface-card border border-border rounded-xl p-2">
        {steps.map((step, i) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;
          return (
            <div key={step.num} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => setCurrentStep(step.num)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-1",
                  isActive
                    ? "bg-primary-500 text-black"
                    : isCompleted
                    ? "text-primary-400 hover:bg-surface-elevated"
                    : "text-text-muted hover:bg-surface-elevated"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  isActive ? "bg-black text-primary-400" : isCompleted ? "bg-primary-500/20 text-primary-400" : "bg-surface-elevated text-text-muted"
                )}>
                  {isCompleted ? "✓" : step.num}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && <ChevronRight size={14} className="text-text-muted mx-1 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Identification & Launch */}
      {currentStep === 1 && (
        <section className="rounded-xl border border-border bg-surface-card p-6 shadow-sm space-y-6">
          <SectionHeader num="01" icon={Tag} title="Identification & Lancement" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                ID Campagne <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register("campaignId")}
                  placeholder="ex: CMP-2026-001"
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
                    errors.campaignId ? "border-red-300" : "border-border"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setValue("campaignId", generateCampaignId())}
                  className="shrink-0 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-elevated"
                >
                  Auto
                </button>
              </div>
              {errors.campaignId && <p className="mt-1 text-xs text-red-500">{errors.campaignId.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Nom de la campagne <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Nom de la campagne"
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
                  errors.name ? "border-red-300" : "border-border"
                )}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Plateforme <span className="text-red-500">*</span>
              </label>
              <select
                {...register("platform")}
                className={cn(
                  "w-full appearance-none rounded-lg border bg-surface-card px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
                  errors.platform ? "border-red-300" : "border-border"
                )}
              >
                {platformOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.platform && <p className="mt-1 text-xs text-red-500">{errors.platform.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className={cn(
                  "w-full appearance-none rounded-lg border bg-surface-card px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
                  errors.status ? "border-red-300" : "border-border"
                )}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Date de début <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("startDate")}
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
                  errors.startDate ? "border-red-300" : "border-border"
                )}
              />
              {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Date de fin</label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Closing Logic: Show spend when status = COMPLETED */}
          {watchedStatus === "COMPLETED" && (
            <div className="p-4 bg-primary-500/5 border border-primary-500/20 rounded-lg">
              <p className="text-xs text-primary-400 font-medium mb-3">La campagne est marquée comme terminée. Saisissez le budget final :</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">Date de fin</label>
                  <input
                    type="date"
                    {...register("endDate")}
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">Budget consommé (Spend)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("spend", { valueAsNumber: true })}
                      placeholder="Budget final depuis Ads Manager"
                      className="w-full rounded-lg border border-border pl-7 pr-3 py-2.5 text-sm text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Step 2: Strategie & Audience */}
      {currentStep === 2 && (
        <section className="rounded-xl border border-border bg-surface-card p-6 shadow-sm space-y-6">
          <SectionHeader num="02" icon={Users} title="Stratégie & Audience" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Angle <span className="text-red-500">*</span>
              </label>
              <select
                {...register("angle")}
                className={cn(
                  "w-full appearance-none rounded-lg border bg-surface-card px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
                  errors.angle ? "border-red-300" : "border-border"
                )}
              >
                <option value="">Sélectionner un angle</option>
                {angles.map((a) => (
                  <option key={a.id} value={a.value}>{a.value}</option>
                ))}
              </select>
              {errors.angle && <p className="mt-1 text-xs text-red-500">{errors.angle.message}</p>}
              <a href="/settings" target="_blank" className="mt-1 inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus size={12} /> Ajouter un angle
              </a>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Cible / Audience</label>
              <select
                {...register("cible")}
                className="w-full appearance-none rounded-lg border border-border bg-surface-card px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Sélectionner une cible</option>
                {cibles.map((c) => (
                  <option key={c.id} value={c.value}>{c.value}</option>
                ))}
              </select>
              <a href="/settings" target="_blank" className="mt-1 inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus size={12} /> Ajouter une cible
              </a>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Objectif</label>
              <select
                {...register("objectif")}
                className="w-full appearance-none rounded-lg border border-border bg-surface-card px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Sélectionner un objectif</option>
                {objectifs.map((o) => (
                  <option key={o.id} value={o.value}>{o.value}</option>
                ))}
              </select>
              <a href="/settings" target="_blank" className="mt-1 inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus size={12} /> Ajouter un objectif
              </a>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Région</label>
              <div className="flex gap-2">
                {regionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("region", opt.value)}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all",
                      watch("region") === opt.value
                        ? "border-primary-500 bg-primary-500/10 text-primary-400"
                        : "border-border text-text-muted hover:bg-surface-elevated"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conditional African Countries Multi-Select */}
          {watchedRegion === "AFRIQUE" && (
            <div className="p-4 bg-surface-elevated/50 rounded-lg border border-border">
              <label className="mb-3 block text-sm font-medium text-text-secondary">
                Pays africains ciblés
              </label>
              <div className="flex flex-wrap gap-2">
                {AFRICAN_COUNTRIES_LIST.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => toggleCountry(country)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      selectedCountries.includes(country)
                        ? "border-primary-500 bg-primary-500/10 text-primary-400"
                        : "border-border text-text-muted hover:bg-surface-elevated"
                    )}
                  >
                    {country}
                  </button>
                ))}
              </div>
              {selectedCountries.length > 0 && (
                <p className="mt-2 text-xs text-text-muted">{selectedCountries.length} pays sélectionné(s)</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* Step 3: Ad Copy & Creative Details */}
      {currentStep === 3 && (
        <section className="rounded-xl border border-border bg-surface-card p-6 shadow-sm space-y-6">
          <SectionHeader num="03" icon={MessageSquare} title="Ad Copy & Détails Créatifs" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Message / Copy <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  {...register("message")}
                  placeholder="Message principal de la campagne"
                  maxLength={500}
                  rows={4}
                  className={cn(
                    "w-full resize-none rounded-lg border px-3 py-2.5 pr-16 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
                    errors.message ? "border-red-300" : "border-border"
                  )}
                />
                <span className={cn("absolute bottom-2 right-3 text-xs", message.length > 450 ? "text-amber-500" : "text-slate-400")}>
                  {message.length}/500
                </span>
              </div>
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Headline (Titre principal)</label>
              <input
                type="text"
                {...register("headline")}
                placeholder="Titre de l'annonce"
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Description / Sous-titre</label>
              <input
                type="text"
                {...register("description")}
                placeholder="Description de l'annonce"
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Type de Visuel</label>
              <div className="grid grid-cols-2 gap-2">
                {visualTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("visualType", opt.value)}
                    className={cn(
                      "py-2.5 rounded-lg border text-sm font-medium transition-all",
                      watch("visualType") === opt.value
                        ? "border-primary-500 bg-primary-500/10 text-primary-400"
                        : "border-border text-text-muted hover:bg-surface-elevated"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Call To Action (CTA)</label>
              <select
                {...register("callToAction")}
                className="w-full appearance-none rounded-lg border border-border bg-surface-card px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                {ctaOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Visuel Upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Visuels</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all",
                isDragOver ? "border-primary-400 bg-primary-50/50" : "border-border bg-surface-elevated/50 hover:border-slate-300"
              )}
            >
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={handleFileInputChange} className="hidden" />
              <Upload className={cn("h-8 w-8 mx-auto", isDragOver ? "text-primary-500" : "text-slate-400")} />
              <p className="mt-3 text-sm font-medium text-text-secondary">
                {isDragOver ? "Relâchez pour télécharger" : "Glissez vos fichiers ici ou "}
                {!isDragOver && <span className="text-primary-600">parcourir</span>}
              </p>
              <p className="mt-1 text-xs text-text-muted">JPG, PNG, WEBP — Max 5 Mo</p>
            </div>

            {uploadingFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadingFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface-card px-4 py-3">
                    <FileImage className="h-5 w-5 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-secondary">{file.file.name}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                          <div className={cn("h-full rounded-full transition-all duration-300", file.status === "error" ? "bg-red-500" : file.status === "done" ? "bg-primary-500" : "bg-blue-500")} style={{ width: `${file.progress}%` }} />
                        </div>
                        <span className="shrink-0 text-xs text-text-muted">
                          {file.status === "error" ? "Erreur" : file.status === "done" ? "Terminé" : `${file.progress}%`}
                        </span>
                      </div>
                      {file.error && <p className="mt-1 text-xs text-red-500">{file.error}</p>}
                    </div>
                    {file.status === "done" && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-500" />}
                    {file.status === "error" && <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />}
                  </div>
                ))}
              </div>
            )}

            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-lg border border-border bg-surface-elevated">
                    <div className="aspect-square">
                      <img src={img.url} alt={img.fileName} className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                      <button type="button" onClick={() => removeImage(img.id)} className="rounded-full bg-surface-card/90 p-2 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="px-2.5 py-2">
                      <p className="truncate text-xs font-medium text-text-secondary">{img.fileName}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(img.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 4: Destination Specs */}
      {currentStep === 4 && (
        <section className="rounded-xl border border-border bg-surface-card p-6 shadow-sm space-y-6">
          <SectionHeader num="04" icon={Link2} title="Destination & Specs" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Type de Destination</label>
              <div className="grid grid-cols-2 gap-2">
                {destinationTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("destinationType", opt.value)}
                    className={cn(
                      "py-2.5 rounded-lg border text-sm font-medium transition-all",
                      watch("destinationType") === opt.value
                        ? "border-primary-500 bg-primary-500/10 text-primary-400"
                        : "border-border text-text-muted hover:bg-surface-elevated"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Lien de Destination / Ad Link</label>
              <input
                type="url"
                {...register("destinationUrl")}
                placeholder="https://..."
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Notes internes</label>
            <textarea
              {...register("notes")}
              placeholder="Notes sur la campagne..."
              rows={3}
              className="w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </section>
      )}

      {/* Step Errors */}
      {stepErrors.length > 0 && (
        <div ref={errorBannerRef} className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3">
          {stepErrors.map((msg, i) => (
            <p key={i} className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              {msg}
            </p>
          ))}
        </div>
      )}

      {/* Navigation + Actions */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-lg border border-border bg-surface-card px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Annuler
          </span>
        </button>

        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="rounded-lg border border-border bg-surface-card px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated"
            >
              Précédent
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-primary-400"
            >
              <span className="flex items-center gap-2">
                Suivant
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-primary-400 disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "create" ? (
                  <Plus className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {mode === "create" ? "Créer la campagne" : "Enregistrer"}
              </span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function SectionHeader({ num, icon: Icon, title }: { num: string; icon: typeof Tag; title: string }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated text-sm font-semibold text-text-secondary">
        {num}
      </div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-text-muted" />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
    </div>
  );
}

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
} from "lucide-react";
import {
  campaignFormSchema,
  CampaignFormValues,
} from "@/lib/validations";
import { generateCampaignId } from "@/lib/calculations";
import { cn } from "@/lib/utils";

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
  { value: "GOOGLE_SEARCH", label: "Google Search" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "EMAIL", label: "Email" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "ORGANIC_SOCIAL", label: "Réseaux sociaux organique" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "DRAFT", label: "Brouillon" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "En pause" },
  { value: "COMPLETED", label: "Terminée" },
];

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: initialData ?? {
      campaignId: "",
      name: "",
      platform: "META",
      status: "DRAFT",
      startDate: "",
      endDate: "",
      angle: "",
      message: "",
      objective: "",
      targetAudience: "",
      callToAction: "",
      notes: "",
      leads: 0,
      mql: 0,
      sql: 0,
      nq: 0,
      spend: 0,
    },
  });

  const message = watch("message") ?? "";

  const uploadFile = useCallback(async (file: File) => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    setUploadingFiles((prev) => [
      ...prev,
      { id, file, progress: 0, status: "uploading" },
    ]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      const result = await new Promise<{ url: string; fileName: string }>(
        (resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              setUploadingFiles((prev) =>
                prev.map((f) => (f.id === id ? { ...f, progress } : f))
              );
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error || "Erreur lors de l'upload"));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Erreur réseau lors de l'upload"));
          });

          xhr.open("POST", "/api/upload");
          xhr.send(formData);
        }
      );

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "done", url: result.url, progress: 100 } : f
        )
      );

      setUploadedImages((prev) => [
        ...prev,
        {
          id,
          url: result.url,
          fileName: result.fileName,
          size: file.size,
        },
      ]);

      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
      }, 2000);
    } catch (err) {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "error", error: err instanceof Error ? err.message : "Erreur" }
            : f
        )
      );
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          alert(
            `Format non accepté : ${file.name}. Utilisez JPG, PNG ou WEBP.`
          );
          continue;
        }
        if (file.size > MAX_SIZE) {
          alert(
            `Fichier trop volumineux : ${file.name}. Taille maximale : 5 Mo.`
          );
          continue;
        }
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        e.target.value = "";
      }
    },
    [handleFiles]
  );

  const removeImage = useCallback((id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const handleFormSubmit = async (data: CampaignFormValues) => {
    const dataWithVisuals = {
      ...data,
      visuals: uploadedImages.map((img, i) => ({
        imageUrl: img.url,
        fileName: img.fileName,
        altText: `${data.name} - Visual ${i + 1}`,
        isPrimary: i === 0,
      })),
    };
    await onSubmit(dataWithVisuals);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto max-w-4xl space-y-8 pb-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border p-2 text-text-muted hover:bg-surface-elevated"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {mode === "create"
                ? "Créer une campagne"
                : "Modifier la campagne"}
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              {mode === "create"
                ? "Remplissez les informations pour créer une nouvelle campagne"
                : "Modifiez les informations de la campagne"}
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Identification */}
      <section className="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated text-sm font-semibold text-text-secondary">
            01
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-text-muted" />
            <h2 className="text-lg font-semibold text-white">
              Identification
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="campaignId"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              ID Campagne <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="campaignId"
                {...register("campaignId")}
                placeholder="ex: CMP-2024-001"
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                  errors.campaignId ? "border-red-300" : "border-border"
                )}
              />
              <button
                type="button"
                onClick={() => {
                  const id = generateCampaignId();
                  setValue("campaignId", id);
                }}
                className="shrink-0 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-elevated"
              >
                Auto
              </button>
            </div>
            {errors.campaignId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.campaignId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              placeholder="Nom de la campagne"
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                errors.name ? "border-red-300" : "border-border"
              )}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="platform"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Plateforme <span className="text-red-500">*</span>
            </label>
            <select
              id="platform"
              {...register("platform")}
              className={cn(
                "w-full appearance-none rounded-lg border bg-surface-card px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                errors.platform ? "border-red-300" : "border-border"
              )}
            >
              {platformOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.platform && (
              <p className="mt-1 text-xs text-red-500">
                {errors.platform.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              {...register("status")}
              className={cn(
                "w-full appearance-none rounded-lg border bg-surface-card px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                errors.status ? "border-red-300" : "border-border"
              )}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Date de début <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              {...register("startDate")}
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                errors.startDate ? "border-red-300" : "border-border"
              )}
            />
            {errors.startDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Date de fin
            </label>
            <input
              type="date"
              id="endDate"
              {...register("endDate")}
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                errors.endDate ? "border-red-300" : "border-border"
              )}
            />
            {errors.endDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Budget */}
      <section className="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated text-sm font-semibold text-text-secondary">
            02
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-text-muted" />
            <h2 className="text-lg font-semibold text-white">
              Budget
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="spend"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Budget consommé (Spend)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
              <input
                type="number"
                id="spend"
                step="0.01"
                min="0"
                {...register("spend", { valueAsNumber: true })}
                placeholder="0.00"
                className={cn(
                  "w-full rounded-lg border pl-7 pr-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                  errors.spend ? "border-red-300" : "border-border"
                )}
              />
            </div>
            {errors.spend && (
              <p className="mt-1 text-xs text-red-500">
                {errors.spend.message}
              </p>
            )}
            <p className="mt-1 text-xs text-text-muted">
              Montant total dépensé pour cette campagne
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Stratégie */}
      <section className="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated text-sm font-semibold text-text-secondary">
            03
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-text-muted" />
            <h2 className="text-lg font-semibold text-white">
              Stratégie
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="angle"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Angle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="angle"
              {...register("angle")}
              placeholder="Angle principal de la campagne"
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                errors.angle ? "border-red-300" : "border-border"
              )}
            />
            {errors.angle && (
              <p className="mt-1 text-xs text-red-500">
                {errors.angle.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="targetAudience"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Audience cible
            </label>
            <input
              type="text"
              id="targetAudience"
              {...register("targetAudience")}
              placeholder="ex: PME, 25-45 ans, France"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="callToAction"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Appel à l&apos;action
            </label>
            <input
              type="text"
              id="callToAction"
              {...register("callToAction")}
              placeholder="ex: Demander un devis"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Notes
            </label>
            <textarea
              id="notes"
              {...register("notes")}
              placeholder="Notes internes sur la campagne"
              rows={2}
              className="w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="message"
                {...register("message")}
                placeholder="Message principal de la campagne"
                maxLength={500}
                rows={4}
                className={cn(
                  "w-full resize-none rounded-lg border px-3 py-2.5 pr-16 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                  errors.message ? "border-red-300" : "border-border"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-2 right-3 text-xs",
                  message.length > 450
                    ? message.length >= 500
                      ? "text-red-500"
                      : "text-amber-500"
                    : "text-slate-400"
                )}
              >
                {message.length}/500
              </span>
            </div>
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="objective"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Objectif
            </label>
            <textarea
              id="objective"
              {...register("objective")}
              placeholder="Objectif détaillé de la campagne"
              rows={3}
              className="w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Visuels */}
      <section className="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated text-sm font-semibold text-text-secondary">
            04
          </div>
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-text-muted" />
            <h2 className="text-lg font-semibold text-white">
              Visuels
            </h2>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all",
            isDragOver
              ? "border-primary-400 bg-primary-50/50"
              : "border-border bg-surface-elevated/50 hover:border-slate-300"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div
            className={cn(
              "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
                  isDragOver ? "bg-primary-100" : "bg-surface-elevated"
            )}
          >
            <Upload
              className={cn(
                "h-6 w-6",
                    isDragOver ? "text-primary-500" : "text-slate-400"
              )}
            />
          </div>
          <p className="mt-4 text-sm font-medium text-text-secondary">
            {isDragOver
              ? "Relâchez pour télécharger"
              : "Glissez vos fichiers ici ou "}
            {!isDragOver && (
              <span className="text-primary-600 hover:text-primary-700">
                parcourir
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Formats acceptés : JPG, JPEG, PNG, WEBP — Max 5 Mo par fichier
          </p>
        </div>

        {/* Uploading Files Progress */}
        {uploadingFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface-card px-4 py-3"
              >
                <FileImage className="h-5 w-5 shrink-0 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-secondary">
                    {file.file.name}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          file.status === "error"
                            ? "bg-red-500"
                            : file.status === "done"
                              ? "bg-primary-500"
                              : "bg-blue-500"
                        )}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs text-text-muted">
                      {file.status === "error"
                        ? "Erreur"
                        : file.status === "done"
                          ? "Terminé"
                          : `${file.progress}%`}
                    </span>
                  </div>
                  {file.error && (
                    <p className="mt-1 text-xs text-red-500">{file.error}</p>
                  )}
                </div>
                {file.status === "done" && (
                   <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-500" />
                )}
                {file.status === "error" && (
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Images Grid */}
        {uploadedImages.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-text-secondary">
              Images téléchargées ({uploadedImages.length})
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {uploadedImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative overflow-hidden rounded-lg border border-border bg-surface-elevated"
                >
                  <div className="aspect-square">
                    <img
                      src={img.url}
                      alt={img.fileName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="rounded-full bg-surface-card/90 p-2 text-text-secondary shadow-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-card hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="px-2.5 py-2">
                    <p className="truncate text-xs font-medium text-text-secondary">
                      {img.fileName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatFileSize(img.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
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

        {mode === "create" && (
          <button
            type="button"
            disabled={isLoading}
            className="rounded-lg border border-border bg-surface-card px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Enregistrer comme brouillon
            </span>
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-surface-secondary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-surface-elevated disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "create" ? (
              <Plus className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {mode === "create"
              ? "Créer la campagne"
              : "Enregistrer les modifications"}
          </span>
        </button>
      </div>
    </form>
  );
}




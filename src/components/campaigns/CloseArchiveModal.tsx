"use client";

import { useState } from "react";
import { X, Archive, Loader2 } from "lucide-react";

interface CloseArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    endDate: string;
    spend: number;
    leads: number;
    mql: number;
    sql: number;
    nq: number;
  }) => Promise<void>;
  campaignName: string;
}

export default function CloseArchiveModal({
  isOpen,
  onClose,
  onConfirm,
  campaignName,
}: CloseArchiveModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const [endDate, setEndDate] = useState(today);
  const [spend, setSpend] = useState<string>("");
  const [leads, setLeads] = useState<string>("");
  const [mql, setMql] = useState<string>("");
  const [sql, setSql] = useState<string>("");
  const [nq, setNq] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!spend || parseFloat(spend) < 0) errs.push("Le budget consommé est requis et ne peut pas être négatif.");
    if (leads && mql && parseFloat(mql) > parseFloat(leads)) errs.push("Les MQL ne peuvent pas dépasser les Leads.");
    if (mql && sql && parseFloat(sql) > parseFloat(mql)) errs.push("Les SQL ne peuvent pas dépasser les MQL.");
    return errs;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setIsSubmitting(true);
    try {
      await onConfirm({
        endDate,
        spend: parseFloat(spend) || 0,
        leads: parseInt(leads) || 0,
        mql: parseInt(mql) || 0,
        sql: parseInt(sql) || 0,
        nq: parseInt(nq) || 0,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cpl = spend && leads ? (parseFloat(spend) / parseInt(leads)).toFixed(2) : "—";
  const sqlFromMql = mql && sql ? ((parseInt(sql) / parseInt(mql)) * 100).toFixed(1) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10">
              <Archive className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Clôturer & Archiver</h2>
              <p className="text-xs text-text-muted">{campaignName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-elevated transition-colors">
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {errors.length > 0 && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              {errors.map((err, i) => (
                <p key={i} className="text-xs text-red-400">{err}</p>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Date de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-elevated text-white text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Budget consommé / Spend ($) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={spend}
              onChange={(e) => setSpend(e.target.value)}
              placeholder="Ex: 8500"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-elevated text-white text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-text-muted"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Total Leads</label>
              <input
                type="number"
                min="0"
                value={leads}
                onChange={(e) => setLeads(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-elevated text-white text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Total MQL</label>
              <input
                type="number"
                min="0"
                value={mql}
                onChange={(e) => setMql(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-elevated text-white text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Total SQL</label>
              <input
                type="number"
                min="0"
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-elevated text-white text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Total NQ</label>
              <input
                type="number"
                min="0"
                value={nq}
                onChange={(e) => setNq(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-elevated text-white text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-text-muted"
              />
            </div>
          </div>

          {(spend || leads) && (
            <div className="p-3 rounded-lg bg-surface-elevated border border-border">
              <p className="text-xs text-text-muted mb-2">Aperçu des calculs automatiques :</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-text-secondary">CPL: <span className="font-bold text-white">{cpl}</span></span>
                {mql && <span className="text-text-secondary">SQL/MQL: <span className="font-bold text-white">{sqlFromMql}%</span></span>}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-500 text-black text-sm font-semibold hover:bg-primary-400 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Archivage...</>
            ) : (
              <><Archive className="h-4 w-4" /> Clôturer & Archiver</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

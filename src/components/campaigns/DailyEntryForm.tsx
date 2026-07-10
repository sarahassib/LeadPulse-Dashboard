"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface DailyEntryFormProps {
  campaignId: string;
  existingEntry?: {
    date: string;
    leads: number;
    mql: number;
    sql: number;
    nq: number;
    notes?: string;
  };
  onEntrySaved: () => void;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function DailyEntryForm({
  campaignId,
  existingEntry,
  onEntrySaved,
}: DailyEntryFormProps) {
  const [date, setDate] = useState(existingEntry?.date ?? getToday());
  const [leads, setLeads] = useState(existingEntry?.leads ?? 0);
  const [mql, setMql] = useState(existingEntry?.mql ?? 0);
  const [sql, setSql] = useState(existingEntry?.sql ?? 0);
  const [nq, setNq] = useState(existingEntry?.nq ?? 0);
  const [notes, setNotes] = useState(existingEntry?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const warnings: string[] = [];
  if (mql > leads && leads > 0) warnings.push("MQL dépasse Leads");
  if (sql > mql && mql > 0) warnings.push("SQL dépasse MQL");
  if (nq > leads && leads > 0) warnings.push("NQ dépasse Leads");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          leads: Number(leads),
          mql: Number(mql),
          sql: Number(sql),
          nq: Number(nq),
          notes: notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      onEntrySaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-card border border-border rounded-xl p-4 space-y-3"
    >
      <h4 className="text-sm font-semibold text-white">Saisie journalière</h4>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Leads</label>
          <input
            type="number"
            min={0}
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">MQL</label>
          <input
            type="number"
            min={0}
            value={mql}
            onChange={(e) => setMql(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">SQL</label>
          <input
            type="number"
            min={0}
            value={sql}
            onChange={(e) => setSql(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">NQ</label>
          <input
            type="number"
            min={0}
            value={nq}
            onChange={(e) => setNq(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">Notes (optionnel)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none"
        />
      </div>

      {warnings.length > 0 && (
        <div className="space-y-1">
          {warnings.map((w) => (
            <div key={w} className="flex items-center gap-1.5 text-accent-400 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {w}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-3 rounded-lg bg-primary-500 text-black text-sm font-medium hover:bg-primary-400 disabled:opacity-50 transition-colors"
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}

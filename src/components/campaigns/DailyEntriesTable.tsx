"use client";

import { Trash2 } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  leads: number;
  mql: number;
  sql: number;
  nq: number;
  notes?: string | null;
}

interface DailyEntriesTableProps {
  entries: Entry[];
  onDelete: (entryId: string) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(n: number) {
  return n.toLocaleString("fr-FR");
}

export default function DailyEntriesTable({
  entries,
  onDelete,
}: DailyEntriesTableProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totals = entries.reduce(
    (acc, e) => ({
      leads: acc.leads + e.leads,
      mql: acc.mql + e.mql,
      sql: acc.sql + e.sql,
      nq: acc.nq + e.nq,
    }),
    { leads: 0, mql: 0, sql: 0, nq: 0 }
  );

  if (entries.length === 0) {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-6 text-center text-sm text-text-muted">
        Aucune saisie journalière. Ajoutez la première saisie pour commencer à suivre les performances.
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-elevated">
              <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Date</th>
              <th className="text-right px-4 py-2.5 font-medium text-text-secondary">Leads</th>
              <th className="text-right px-4 py-2.5 font-medium text-text-secondary">MQL</th>
              <th className="text-right px-4 py-2.5 font-medium text-text-secondary">SQL</th>
              <th className="text-right px-4 py-2.5 font-medium text-text-secondary">NQ</th>
              <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Notes</th>
              <th className="w-10 px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry) => (
              <tr key={entry.id} className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                <td className="px-4 py-2 text-white whitespace-nowrap">{formatDate(entry.date)}</td>
                <td className="px-4 py-2 text-right font-mono text-text-secondary">{formatNumber(entry.leads)}</td>
                <td className="px-4 py-2 text-right font-mono text-text-secondary">{formatNumber(entry.mql)}</td>
                <td className="px-4 py-2 text-right font-mono text-text-secondary">{formatNumber(entry.sql)}</td>
                <td className="px-4 py-2 text-right font-mono text-text-secondary">{formatNumber(entry.nq)}</td>
                <td className="px-4 py-2 text-text-muted text-xs max-w-[200px] truncate">
                  {entry.notes || "—"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="p-1 rounded hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-surface-elevated font-semibold border-t border-border">
              <td className="px-4 py-2.5 text-white">Totaux</td>
              <td className="px-4 py-2.5 text-right font-mono text-white">{formatNumber(totals.leads)}</td>
              <td className="px-4 py-2.5 text-right font-mono text-white">{formatNumber(totals.mql)}</td>
              <td className="px-4 py-2.5 text-right font-mono text-white">{formatNumber(totals.sql)}</td>
              <td className="px-4 py-2.5 text-right font-mono text-white">{formatNumber(totals.nq)}</td>
              <td className="px-4 py-2.5" />
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

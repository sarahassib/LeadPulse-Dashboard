"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Entry {
  date: string;
  leads: number;
  mql: number;
  sql: number;
  nq: number;
}

interface DailyTrendChartProps {
  entries: Entry[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DailyTrendChart({ entries }: DailyTrendChartProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = sorted.map((e) => ({
    date: formatDate(e.date),
    fullDate: formatFullDate(e.date),
    Leads: e.leads,
    MQL: e.mql,
    SQL: e.sql,
    NQ: e.nq,
  }));

  if (entries.length === 0) {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-6 text-center text-sm text-text-muted">
        Aucune donnée disponible pour le graphique.
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Tendances journalières
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#a0a0a0" }} />
          <YAxis tick={{ fontSize: 12, fill: "#a0a0a0" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px" }}
            labelStyle={{ color: "#f5f5f5" }}
            itemStyle={{ color: "#a0a0a0" }}
            formatter={(value: number, name: string) => [value, name]}
            labelFormatter={(label: string) => {
              const item = data.find((d) => d.date === label);
              return item ? item.fullDate : label;
            }}
          />
          <Legend wrapperStyle={{ color: "#a0a0a0" }} />
          <Line type="monotone" dataKey="Leads" stroke="#facc15" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="MQL" stroke="#60a5fa" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="SQL" stroke="#2563eb" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="NQ" stroke="#666666" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

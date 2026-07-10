"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CampaignWithCalculations } from "@/types";
import { formatPercentage } from "@/lib/calculations";

interface ConversionRateChartProps {
  campaigns: CampaignWithCalculations[];
  limit?: number;
}

export function ConversionRateChart({ campaigns, limit = 10 }: ConversionRateChartProps) {
  const sorted = [...campaigns]
    .sort((a, b) => b.sqlGlobalRate - a.sqlGlobalRate)
    .slice(0, limit);

  const data = sorted.map((c) => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + "..." : c.name,
    "MQL Rate": c.mqlRate,
    "SQL Global": c.sqlGlobalRate,
    "SQL from MQL": c.sqlFromMqlRate,
    "NQ Rate": c.nqRate,
  }));

  return (
    <div className="bg-surface-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Comparaison des taux de conversion</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#a0a0a0" }} angle={-20} textAnchor="end" height={80} />
          <YAxis tick={{ fontSize: 12, fill: "#a0a0a0" }} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px" }}
            labelStyle={{ color: "#f5f5f5" }}
            itemStyle={{ color: "#a0a0a0" }}
            formatter={(value: number) => formatPercentage(value)}
          />
          <Legend wrapperStyle={{ color: "#a0a0a0" }} />
          <Bar dataKey="MQL Rate" fill="#facc15" radius={[4, 4, 0, 0]} />
          <Bar dataKey="SQL Global" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="SQL from MQL" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey="NQ Rate" fill="#666666" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

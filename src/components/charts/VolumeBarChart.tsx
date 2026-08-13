"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CampaignWithCalculations } from "@/types";
import { formatNumber } from "@/lib/calculations";
import { CustomTooltip } from "./CustomTooltip";

interface VolumeBarChartProps {
  campaigns: CampaignWithCalculations[];
  limit?: number;
}

export function VolumeBarChart({ campaigns, limit = 10 }: VolumeBarChartProps) {
  const sorted = [...campaigns]
    .sort((a, b) => b.leads - a.leads)
    .slice(0, limit);

  const data = sorted.map((c) => ({
    name: c.name.length > 15 ? c.name.slice(0, 15) + "…" : c.name,
    Leads: c.leads,
    MQL: c.mql,
    SQL: c.sql,
    NQ: c.nq,
  }));

  return (
    <div className="bg-surface-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Comparaison des volumes</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#a0a0a0" }}
            angle={-35}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis tick={{ fontSize: 12, fill: "#a0a0a0" }} />
          <Tooltip
            content={<CustomTooltip formatter={(value) => formatNumber(value)} />}
          />
          <Legend wrapperStyle={{ color: "#a0a0a0" }} />
          <Bar dataKey="Leads" fill="#facc15" radius={[4, 4, 0, 0]} />
          <Bar dataKey="MQL" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="SQL" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey="NQ" fill="#666666" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

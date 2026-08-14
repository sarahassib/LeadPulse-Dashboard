"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CampaignWithCalculations, CampaignPlatform } from "@/types";
import { formatNumber } from "@/lib/calculations";
import { CustomTooltip } from "./CustomTooltip";

interface PlatformDonutChartProps {
  campaigns: CampaignWithCalculations[];
}

const PLATFORM_COLORS: Record<string, string> = {
  META: "#facc15",
  GOOGLE_SEARCH: "#60a5fa",
  LINKEDIN: "#2563eb",
  EMAIL: "#eab308",
  WHATSAPP: "#fde047",
  TIKTOK: "#ff0050",
  SNAPCHAT: "#fffc00",
  OTHER: "#666666",
};

const PLATFORM_LABELS: Record<string, string> = {
  META: "Meta",
  GOOGLE_SEARCH: "Google",
  LINKEDIN: "LinkedIn",
  EMAIL: "Email",
  WHATSAPP: "WhatsApp",
  TIKTOK: "TikTok",
  SNAPCHAT: "Snapchat",
  OTHER: "Autre",
};

export function PlatformDonutChart({ campaigns }: PlatformDonutChartProps) {
  const counts = campaigns.reduce(
    (acc, c) => {
      acc[c.platform] = (acc[c.platform] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.entries(counts)
    .map(([platform, count]) => ({
      name: PLATFORM_LABELS[platform] || platform,
      value: count,
      color: PLATFORM_COLORS[platform] || "#666666",
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-surface-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Répartition par plateforme</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#1a1a1a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip formatter={(value) => formatNumber(value)} />}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span className="text-sm text-text-secondary">{value}</span>
            )}
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-white">
            {total}
          </text>
          <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-text-muted">
            campagnes
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

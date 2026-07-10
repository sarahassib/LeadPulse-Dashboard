import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
}

const trendConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  up: { icon: TrendingUp, color: "text-primary-400", bg: "bg-primary-500/10" },
  down: { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
  neutral: { icon: Minus, color: "text-text-muted", bg: "bg-surface-card" },
};

export default function KpiCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  color = "bg-primary-500/10 text-primary-400",
}: KpiCardProps) {
  const trendInfo = trend ? trendConfig[trend] : null;
  const TrendIcon: LucideIcon | undefined = trendInfo?.icon;

  return (
    <div className="bg-surface-card rounded-xl border border-border p-5 hover:border-primary-500/30 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${color}`}>{icon}</div>
        {trend && trendInfo && TrendIcon && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendInfo.bg} ${trendInfo.color}`}
          >
            <TrendIcon size={12} />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      </div>
      {description && (
        <p className="mt-1 text-xs text-text-muted">{description}</p>
      )}
    </div>
  );
}

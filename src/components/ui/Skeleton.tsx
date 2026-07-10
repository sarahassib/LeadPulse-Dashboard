export function KpiSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-surface-elevated animate-pulse" />
        <div className="flex-1">
          <div className="h-3 w-24 bg-surface-elevated rounded animate-pulse" />
        </div>
      </div>
      <div className="mt-4">
        <div className="h-8 w-20 bg-surface-elevated rounded animate-pulse" />
      </div>
      <div className="mt-2">
        <div className="h-3 w-32 bg-surface-elevated rounded animate-pulse" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-surface-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="h-4 w-32 bg-surface-elevated rounded animate-pulse" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3">
            <div className="h-4 w-12 bg-surface-elevated rounded animate-pulse" />
            <div className="h-4 flex-1 bg-surface-elevated rounded animate-pulse" />
            <div className="h-4 w-20 bg-surface-elevated rounded animate-pulse" />
            <div className="h-4 w-16 bg-surface-elevated rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

const barHeights = [45, 72, 38, 85, 56, 67, 42, 78, 53, 61, 48, 70];

export function ChartSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border p-5">
      <div className="h-4 w-40 bg-surface-elevated rounded animate-pulse mb-4" />
      <div className="flex items-end gap-2 h-48">
        {barHeights.map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-surface-elevated rounded-t animate-pulse"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

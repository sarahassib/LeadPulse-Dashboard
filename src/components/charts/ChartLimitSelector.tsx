"use client";

interface ChartLimitSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const limits = [5, 10, 20];

export function ChartLimitSelector({ value, onChange }: ChartLimitSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-surface-elevated rounded-full p-1">
      {limits.map((limit) => (
        <button
          key={limit}
          onClick={() => onChange(limit)}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
            value === limit
              ? "bg-primary-500 text-black shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {limit}
        </button>
      ))}
    </div>
  );
}

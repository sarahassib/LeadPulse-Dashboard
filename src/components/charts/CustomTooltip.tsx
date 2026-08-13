"use client";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
  formatter?: (value: number, name: string) => string;
}

export function CustomTooltip({
  active,
  payload,
  label,
  formatter,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 shadow-xl">
      {label && (
        <p className="text-xs font-medium text-white mb-1.5 border-b border-[#2a2a2a] pb-1.5">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-[#a0a0a0]">{entry.name}:</span>
            <span className="text-xs font-semibold text-white">
              {formatter ? formatter(entry.value, entry.name) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

interface TooltipEntry {
  dataKey: string;
  label: string;
  color: string;
  value?: number;
}

interface ChartCustomTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value?: number; payload?: { isEstimated?: boolean } }>;
  label?: string | number;
  entries: TooltipEntry[];
  hiddenSeries?: Array<string>;
}

export function ChartCustomTooltip({
  active,
  payload,
  label,
  entries,
  hiddenSeries = []
}: ChartCustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="min-w-[8rem] rounded-lg border border-border/50 bg-background px-3 py-1.5 text-xs shadow-xl">
      <div className="grid gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase text-white">
            {label ? new Date(label).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="grid gap-1">
          {entries.map((entry) => {
            if (hiddenSeries.includes(entry.dataKey)) return null;

            const payloadData = payload.find(p => p.dataKey === entry.dataKey);
            if (!payloadData) return null;

            const isEstimated = payloadData.payload?.isEstimated;

            return (
              <div key={entry.dataKey} className="flex w-full flex-wrap items-stretch gap-2">
                <div className="flex flex-1 gap-2">
                  <div className="grid gap-1">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-3 w-1 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-[0.70rem] text-muted-foreground">
                        {entry.label}{isEstimated ? ' (estimated)' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {payloadData.value?.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

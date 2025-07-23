import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TrendData } from "@/utils/chart-trends";

interface TrendIndicatorProps {
  trend: TrendData | null;
}

export function TrendIndicator({ trend }: TrendIndicatorProps) {
  if (!trend) return null;

  const isZero = trend.percentage === 0;
  const bgColor = isZero ? '#9CA3AF' : (trend.isIncrease ? '#62f888' : '#f86262');

  return (
    <div className="flex items-center gap-1 text-xs text-black font-medium rounded-sm py-0.5 px-1.5" style={{ backgroundColor: bgColor }}>
      {isZero ? (
        <Minus className="h-3 w-3" />
      ) : trend.isIncrease ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {trend.percentage.toFixed(1)}%
    </div>
  );
}

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TrendData } from "@/utils/chart-trends";

interface TrendIndicatorProps {
  trend: TrendData | null;
}

export function TrendIndicator({ trend }: TrendIndicatorProps) {
  if (!trend) return null;

  const isZero = trend.percentage === 0;
  const iconColor = isZero ? "text-gray-500" : (trend.isIncrease ? "text-green-500" : "text-red-500");

  return (
    <div className="flex items-center gap-1">
      {isZero ? (
        <Minus className={`h-3 w-3 ${iconColor}`} />
      ) : trend.isIncrease ? (
        <TrendingUp className={`h-3 w-3 ${iconColor}`} />
      ) : (
        <TrendingDown className={`h-3 w-3 ${iconColor}`} />
      )}
      <span className="text-xs text-white">
        {trend.percentage.toFixed(1)}%
      </span>
    </div>
  );
}

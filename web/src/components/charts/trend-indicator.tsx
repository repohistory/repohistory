import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TrendData } from "@/utils/chart-trends";

interface TrendIndicatorProps {
  trend: TrendData | null;
}

export function TrendIndicator({ trend }: TrendIndicatorProps) {
  if (!trend) return null;

  const isZero = trend.percentage === 0;
  const iconColor = isZero ? '#9CA3AF' : (trend.isIncrease ? '#62f888' : '#f86262');
  
  return (
    <div className="flex items-center gap-1 text-xs text-white">
      {isZero ? (
        <Minus className="h-3 w-3" style={{ color: iconColor }} />
      ) : trend.isIncrease ? (
        <TrendingUp className="h-3 w-3" style={{ color: iconColor }} />
      ) : (
        <TrendingDown className="h-3 w-3" style={{ color: iconColor }} />
      )}
      {trend.percentage.toFixed(1)}%
    </div>
  );
}
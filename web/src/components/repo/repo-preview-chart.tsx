"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface RepoPreviewChartProps {
  data: Array<{
    date: string;
    total: number;
  }>;
}

export function RepoPreviewChart({ data }: RepoPreviewChartProps) {
  const chartData = useMemo(() => {
    return data.map((item, index, array) => {
      const result: { date: string; total: number; [key: string]: string | number } = {
        date: item.date,
        total: item.total,
      };

      if (index < array.length - 1) {
        result.solidTotal = item.total;
      }
      if (index >= array.length - 2) {
        result.dashedTotal = item.total;
      }

      return result;
    });
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#62C3F8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#62C3F8" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="total"
          stroke="transparent"
          fill="url(#viewsGradient)"
          strokeWidth={0}
          isAnimationActive={false}
          dot={false}
          activeDot={false}
        />
        <Area
          dataKey="solidTotal"
          fill="transparent"
          fillOpacity={0}
          stroke="#62C3F8"
          strokeWidth={2}
          isAnimationActive={false}
          dot={false}
          activeDot={false}
        />
        <Area
          dataKey="dashedTotal"
          fill="transparent"
          fillOpacity={0}
          stroke="#62C3F8"
          strokeWidth={2}
          strokeDasharray="5,5"
          isAnimationActive={false}
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

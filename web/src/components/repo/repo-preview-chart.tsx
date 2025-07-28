"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface RepoPreviewChartProps {
  data: Array<{
    date: string;
    total: number;
  }>;
}

export function RepoPreviewChart({ data }: RepoPreviewChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#62C3F8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#62C3F8" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="total"
          stroke="#62C3F8"
          fill="url(#viewsGradient)"
          strokeWidth={2}
          isAnimationActive={false}
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

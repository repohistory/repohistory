"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { RepoTrafficData } from "@/utils/repoData";

interface ViewChartProps {
  traffic: RepoTrafficData;
}

const chartConfig = {
  unique: {
    label: "Unique",
    color: "#62C3F8",
  },
  total: {
    label: "Total",
    color: "#315c72",
  },
} satisfies ChartConfig;

export function ViewChart({ traffic }: ViewChartProps) {
  const viewsData = traffic.views.views.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    unique: item.uniques,
    total: item.count,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart
        data={viewsData}
        margin={{
          left: 12,
          right: 12,
        }}
        barCategoryGap="10%"
        barGap={4}
        syncMethod="index"
      >
        <Bar
          barSize={50}
          dataKey="total"
          fill="var(--color-total)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          barSize={30}
          dataKey="unique"
          fill="var(--color-unique)"
          radius={[4, 4, 0, 0]}
        />
        <XAxis 
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
      </BarChart>
    </ChartContainer>
  );
}
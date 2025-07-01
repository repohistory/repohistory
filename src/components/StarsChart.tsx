"use client";

import { useState } from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { RepoStarsData } from "@/utils/repoData";

interface StarsChartProps {
  starsData: RepoStarsData;
}

const chartConfig = {
  stars: {
    label: "Stars",
    color: "#62C3F8",
  },
} satisfies ChartConfig;

export function StarsChart({ starsData }: StarsChartProps) {
  const [viewType, setViewType] = useState<"cumulative" | "daily">("cumulative");

  const chartData = starsData.starsHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    stars: viewType === "cumulative" ? item.cumulative : item.daily,
  }));

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Stars Over Time</CardTitle>
          <CardDescription>
            Repository star growth {viewType === "cumulative" ? "cumulative" : "daily"}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewType === "cumulative" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("cumulative")}
          >
            Cumulative
          </Button>
          <Button
            variant={viewType === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("daily")}
          >
            Daily
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="stars"
              type="natural"
              fill="var(--color-stars)"
              fillOpacity={0.4}
              stroke="var(--color-stars)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
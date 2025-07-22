"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area } from "recharts";
import { ChartConfig } from "@/components/ui/chart";
import { Chart } from "./chart";
import { RepoStarsData } from "@/utils/repo/stars";
import { calculateTrendPercentage } from "@/utils/chart-trends";
import { TrendIndicator } from "./trend-indicator";
import { useDateRange } from "@/contexts/date-range-context";

interface StarsChartProps {
  starsData: RepoStarsData;
  repositoryName?: string;
}

const chartConfig = {
  stars: {
    label: "Stars",
    color: "#62C3F8",
  },
} satisfies ChartConfig;


export function StarsChart({ starsData }: StarsChartProps) {
  const [viewType, setViewType] = useState<"cumulative" | "daily">("daily");
  const { dateRange } = useDateRange();

  const data = useMemo(() => starsData.starsHistory.map((item) => ({
    date: item.date,
    stars: viewType === "cumulative" ? item.cumulative : item.daily,
  })), [starsData.starsHistory, viewType]);

  const filteredData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return data;
    }
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  }, [data, dateRange]);

  const total = useMemo(() => {
    if (filteredData.length === 0) return 0;

    if (viewType === "cumulative") {
      return filteredData[filteredData.length - 1].stars;
    } else {
      return filteredData.reduce((acc, curr) => acc + curr.stars, 0);
    }
  }, [filteredData, viewType]);

  const starsTrend = useMemo(() => {
    if (filteredData.length === 0 || viewType === "cumulative") return null;
    return calculateTrendPercentage(filteredData, data, "stars");
  }, [filteredData, data, viewType]);


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-col justify-center gap-1">
          <CardTitle>Stars Over Time</CardTitle>
          <CardDescription>
            Repository star growth {viewType === "cumulative" ? "cumulative" : "daily"}
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            {viewType === "cumulative" ? "Total Stars" : "Total Daily Stars"}
          </span>
          <span className="text-lg font-bold leading-none sm:text-2xl">
            {total.toLocaleString()}
          </span>
          <TrendIndicator trend={starsTrend} />
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <Chart
          data={filteredData}
          chartConfig={chartConfig}
          className="h-64 w-full"
        >
          <defs>
            <linearGradient id="fillStars" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-stars)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-stars)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            isAnimationActive={false}
            dataKey="stars"
            type="monotone"
            fill="url(#fillStars)"
            fillOpacity={1}
            stroke="var(--color-stars)"
            strokeWidth={2}
          />
        </Chart>
        <div className="flex justify-center mt-6">
          <Tabs value={viewType} onValueChange={(value) => setViewType(value as "cumulative" | "daily")}>
            <TabsList>
              <TabsTrigger value="daily" className="cursor-pointer">Daily</TabsTrigger>
              <TabsTrigger value="cumulative" className="cursor-pointer">Cumulative</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

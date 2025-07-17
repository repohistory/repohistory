"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Area } from "recharts";
import { ChartConfig } from "@/components/ui/chart";
import { Chart } from "./chart";
import { RepoStarsData } from "@/utils/repo/stars";

interface StarsChartProps {
  starsData: RepoStarsData;
  repositoryName?: string;
  fullName?: string;
}

const chartConfig = {
  stars: {
    label: "Stars",
    color: "#62C3F8",
  },
} satisfies ChartConfig;


export function StarsChart({ starsData, fullName }: StarsChartProps) {
  const [viewType, setViewType] = useState<"cumulative" | "daily">("daily");
  const [filteredData, setFilteredData] = useState<Array<{ date: string; stars: number }>>([]);

  const data = useMemo(() => starsData.starsHistory.map((item) => ({
    date: item.date,
    stars: viewType === "cumulative" ? item.cumulative : item.daily,
  })), [starsData.starsHistory, viewType]);

  const handleDataChange = useCallback((newFilteredData: Array<{ date: string;[key: string]: string | number }>) => {
    setFilteredData(newFilteredData as Array<{ date: string; stars: number }>);
  }, []);

  const total = useMemo(() => {
    if (filteredData.length === 0) return 0;
    
    if (viewType === "cumulative") {
      return filteredData[filteredData.length - 1].stars;
    } else {
      return filteredData.reduce((acc, curr) => acc + curr.stars, 0);
    }
  }, [filteredData, viewType]);


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
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {total.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <Chart
          data={data}
          chartConfig={chartConfig}
          className="h-64 w-full"
          onDataChange={handleDataChange}
          extraButtons={
            fullName && (
              <Link target="_blank" href={`/star-history?owner=${fullName.split('/')[0]}&repo=${fullName.split('/')[1]}`}>
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  Share Chart
                </Button>
              </Link>
            )
          }
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

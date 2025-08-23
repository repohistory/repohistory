"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Area } from "recharts";
import { ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { Chart } from "./chart";
import { RepoStarsData } from "@/utils/repo/stars";
import { calculateTrendPercentage } from "@/utils/chart-trends";
import { TrendIndicator } from "./trend-indicator";
import { useDateRange } from "@/contexts/date-range-context";
import { NoDataMessage } from "./no-data-message";
import { ChartCustomTooltip } from "./chart-custom-tooltip";

interface StarsChartProps {
  starsData?: RepoStarsData;
  repositoryName?: string;
  isLoading?: boolean;
}

const chartConfig = {
  stars: {
    label: "Stars",
    color: "#62C3F8",
  },
} satisfies ChartConfig;


export function StarsChart({ starsData, isLoading = false }: StarsChartProps) {
  const isOver40kStars = (starsData?.totalStars || 0) > 40000;
  const [viewType, setViewType] = useState<"cumulative" | "daily">(isOver40kStars ? "cumulative" : "daily");
  const { dateRange } = useDateRange();

  const data = useMemo(() => {
    if (!starsData) return [];
    return starsData.starsHistory.map((item, index, array) => {
      const stars = viewType === "cumulative" ? item.cumulative : item.daily;
      const result: { date: string; stars: number; isEstimated?: boolean; solidStars?: number; dashedStars?: number } = {
        date: item.date,
        stars,
        isEstimated: item.isEstimated,
      };

      if (index < array.length - 1) {
        result.solidStars = stars;
      }
      if (index >= array.length - 2) {
        result.dashedStars = stars;
      }

      return result;
    });
  }, [starsData, viewType]);

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
    // Cast to the expected type for calculateTrendPercentage
    const filteredDataForTrend = filteredData.map(item => ({ date: item.date, stars: item.stars }));
    const dataForTrend = data.map(item => ({ date: item.date, stars: item.stars }));
    return calculateTrendPercentage(filteredDataForTrend, dataForTrend, "stars");
  }, [filteredData, data, viewType]);


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-col justify-center gap-1">
          <CardTitle>Stars Over Time</CardTitle>
          <CardDescription>
            Repo star growth {isLoading ? "daily" : (viewType === "cumulative" ? "cumulative" : "daily")}
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            {isLoading ? "Total Daily Stars" : (viewType === "cumulative" ? "Total Stars" : "Total Daily Stars")}
          </span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="h-6 flex items-center gap-2">
              <TrendIndicator trend={starsTrend} />
              <span className="text-lg font-bold leading-none sm:text-2xl">
                {total.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        {isLoading || filteredData.length > 0 ? (
          <Chart
            data={isLoading ? [] : filteredData.map(item => {
              const result: { [key: string]: string | number; date: string } = { 
                date: item.date, 
                stars: item.stars
              };
              if (item.solidStars !== undefined) result.solidStars = item.solidStars;
              if (item.dashedStars !== undefined) result.dashedStars = item.dashedStars;
              return result;
            })}
            chartConfig={chartConfig}
            className="h-64 w-full"
            isLoading={isLoading}
            customTooltip={
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  // Find the original data point to get isEstimated info
                  const originalDataPoint = filteredData.find(item => item.date === label);
                  const enhancedPayload = payload?.map(p => ({
                    ...p,
                    payload: { ...p.payload, isEstimated: originalDataPoint?.isEstimated }
                  }));
                  
                  return (
                    <ChartCustomTooltip
                      active={active}
                      payload={enhancedPayload}
                      label={label}
                      entries={[
                        {
                          dataKey: 'stars',
                          label: 'Stars',
                          color: '#62C3F8'
                        }
                      ]}
                    />
                  );
                }}
              />
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
              fill="url(#fillStars)"
              stroke="transparent"
              strokeWidth={0}
              fillOpacity={1}
            />
            <Area
              isAnimationActive={false}
              dataKey="solidStars"
              fill="transparent"
              stroke="var(--color-stars)"
              strokeWidth={2}
            />
            <Area
              isAnimationActive={false}
              dataKey="dashedStars"
              fill="transparent"
              stroke="var(--color-stars)"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
          </Chart>
        ) : (
          <NoDataMessage dataType="stars" />
        )}
        {(isLoading || filteredData.length > 0) && !isOver40kStars && (
          <div className="flex justify-center mt-6">
            <Tabs value={viewType} onValueChange={(value) => setViewType(value as "cumulative" | "daily")}>
              <TabsList>
                <TabsTrigger value="daily" className={isLoading ? "cursor-not-allowed" : "cursor-pointer"}>Daily</TabsTrigger>
                <TabsTrigger value="cumulative" className={isLoading ? "cursor-not-allowed" : "cursor-pointer"}>Cumulative</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo } from "react";
import { Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { Chart } from "./chart";
import { useDateRange } from "@/contexts/date-range-context";

interface PopularContentChartProps {
  traffic: {
    paths: Array<{
      path: string;
      title: string;
      data: Array<{
        timestamp: string;
        count: number;
        uniques: number;
      }>;
    }>;
  };
  repositoryName?: string;
}

const COLORS = [
  "#62C3F8",
  "#62f888",
  "#b5f862",
  "#f8d862",
  "#f88d62",
  "#f86262",
  "#f862d3",
  "#b562f8",
  "#6278f8",
];

export function PopularContentChart({ traffic }: PopularContentChartProps) {
  const { dateRange } = useDateRange();

  const { data, chartConfig } = useMemo(() => {
    if (!traffic.paths.length) return { data: [], chartConfig: {} };

    // Use all paths
    const topPaths = traffic.paths;

    // Create a map of dates to path data
    const dateMap = new Map<string, Record<string, number>>();

    topPaths.forEach(pathItem => {
      pathItem.data.forEach(item => {
        if (!dateMap.has(item.timestamp)) {
          dateMap.set(item.timestamp, {});
        }
        const dateEntry = dateMap.get(item.timestamp)!;
        // Use path as the key, but we'll display the title in the legend
        dateEntry[pathItem.path] = item.count;
      });
    });

    // Convert to array format
    const chartData = Array.from(dateMap.entries())
      .map(([date, paths]) => ({
        date,
        ...paths
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Create chart config
    const config: ChartConfig = {};
    topPaths.forEach((pathItem, index) => {
      config[pathItem.path] = {
        label: pathItem.path,
        color: COLORS[index % COLORS.length],
      };
    });

    return { data: chartData, chartConfig: config };
  }, [traffic.paths]);

  const filteredData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return data;
    }
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  }, [data, dateRange]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>Popular Content</CardTitle>
          <CardDescription>
            Most visited pages in your repository over time
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        {filteredData.length > 0 ? (
          <Chart
            data={filteredData}
            chartConfig={chartConfig}
            className="h-64 w-full"
            hideZeroValues
          >
            {Object.keys(chartConfig).map(path => (
              <Line
                isAnimationActive={false}
                key={path}
                dataKey={path}
                type="monotone"
                stroke={chartConfig[path].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </Chart>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No content data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}

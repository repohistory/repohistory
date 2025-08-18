"use client";

import { useMemo, useState } from "react";
import { Line, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Chart } from "./chart";
import { useDateRange } from "@/contexts/date-range-context";
import { NoDataMessage } from "./no-data-message";

interface PopularContentChartProps {
  traffic?: {
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
  isLoading?: boolean;
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

export function PopularContentChart({ traffic, isLoading = false }: PopularContentChartProps) {
  const { dateRange } = useDateRange();

  const filteredData = useMemo(() => {
    if (!traffic || !traffic.paths.length) return [];

    const dateMap = new Map<string, Record<string, number>>();

    traffic.paths.forEach(pathItem => {
      pathItem.data.forEach(item => {
        if (!dateMap.has(item.timestamp)) {
          dateMap.set(item.timestamp, {});
        }
        const dateEntry = dateMap.get(item.timestamp)!;
        dateEntry[pathItem.path] = item.count;
      });
    });

    const chartData = Array.from(dateMap.entries())
      .map(([date, paths]) => ({
        date,
        ...paths
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!dateRange.from || !dateRange.to) {
      return chartData;
    }
    return chartData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  }, [traffic, dateRange]);

  const [viewType, setViewType] = useState<"line" | "pie">(filteredData.length === 1 ? "pie" : "line");

  const chartConfig = useMemo(() => {
    if (!traffic || !traffic.paths.length) return {};

    const config: ChartConfig = {};
    traffic.paths.forEach((pathItem, index) => {
      config[pathItem.path] = {
        label: pathItem.path,
        color: COLORS[index % COLORS.length],
      };
    });

    return config;
  }, [traffic]);

  const pieData = useMemo(() => {
    if (!traffic || !traffic.paths.length) return [];

    const pathAverages = traffic.paths.map(pathItem => {
      const filteredItems = pathItem.data.filter(item => {
        if (!dateRange.from || !dateRange.to) return true;
        const itemDate = new Date(item.timestamp);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });

      const total = filteredItems.reduce((sum, item) => sum + item.count, 0);
      const average = filteredItems.length > 0 ? Math.round(total / filteredItems.length) : 0;

      return {
        path: pathItem.path,
        average,
        fill: chartConfig[pathItem.path]?.color || COLORS[0]
      };
    });

    return pathAverages
      .sort((a, b) => b.average - a.average)
      .slice(0, 10)
      .filter(item => item.average > 0);
  }, [traffic, dateRange, chartConfig]);

  const pieChartConfig = useMemo(() => {
    const config: ChartConfig = {
      average: {
        label: "Average",
      },
    };
    pieData.forEach((item, index) => {
      config[item.path] = {
        label: item.path,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [pieData]);


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>Popular Content</CardTitle>
          <CardDescription>
            Most visited pages in your repository
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        {isLoading || (viewType === "line" ? filteredData.length > 0 : pieData.length > 0) ? (
          viewType === "line" ? (
            <Chart
              data={isLoading ? [] : filteredData}
              chartConfig={chartConfig}
              className="h-64 w-full"
              hideZeroValues
              isLoading={isLoading}
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
            <ChartContainer
              config={pieChartConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground h-64 w-full"
              style={{
                "--label-max-width": "40px"
              } as React.CSSProperties}
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieData}
                  dataKey="average"
                  nameKey="path"
                  label={({ path }) => path.length > 15 ? `${path.substring(0, 15)}...` : path}
                  isAnimationActive={false}
                />
              </PieChart>
            </ChartContainer>
          )
        ) : (
          <NoDataMessage dataType="content data" />
        )}
        {(isLoading || (viewType === "line" ? filteredData.length > 0 : pieData.length > 0)) && (
          <div className="flex justify-center mt-6">
            <Tabs value={viewType} onValueChange={(value) => setViewType(value as "line" | "pie")}>
              <TabsList>
                <TabsTrigger value="line" className={isLoading ? "cursor-not-allowed" : "cursor-pointer"}>Line Chart</TabsTrigger>
                <TabsTrigger value="pie" className={isLoading ? "cursor-not-allowed" : "cursor-pointer"}>Top 10</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

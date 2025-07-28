"use client";

import { useMemo, useState } from "react";
import { Area } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { Chart } from "./chart";
import { calculateTrendPercentage } from "@/utils/chart-trends";
import { TrendIndicator } from "./trend-indicator";
import { useDateRange } from "@/contexts/date-range-context";
import { NoDataMessage } from "./no-data-message";
import { ChartCustomTooltip } from "./chart-custom-tooltip";
interface ViewChartProps {
  traffic?: {
    views: {
      count: number;
      uniques: number;
      views: Array<{
        timestamp: string;
        count: number;
        uniques: number;
      }>;
    };
  };
  repositoryName?: string;
  isLoading?: boolean;
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

export function ViewChart({ traffic, isLoading = false }: ViewChartProps) {
  const { dateRange } = useDateRange();

  // Track hidden series (opposite of visible)
  const [hiddenSeries, setHiddenSeries] = useState<Array<string>>([]);

  const handleLegendClick = (dataKey: string) => {
    if (hiddenSeries.includes(dataKey)) {
      setHiddenSeries(hiddenSeries.filter(key => key !== dataKey));
    } else {
      setHiddenSeries(prev => [...prev, dataKey]);
    }
  };

  const data = useMemo(() => {
    if (!traffic) return [];
    return traffic.views.views.map((item, index, array) => {
      const result: { date: string; unique: number; total: number;[key: string]: string | number } = {
        date: item.timestamp,
        unique: item.uniques,
        total: item.count,
      };

      if (index < array.length - 1) {
        result.solidUnique = item.uniques;
        result.solidTotal = item.count;
      }
      if (index >= array.length - 2) {
        result.dashedUnique = item.uniques;
        result.dashedTotal = item.count;
      }

      return result;
    });
  }, [traffic]);

  const filteredData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return data;
    }
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  }, [data, dateRange]);

  const totalViews = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.total, 0);
  }, [filteredData]);

  const viewsTrend = useMemo(() => {
    if (filteredData.length === 0) return null;
    return calculateTrendPercentage(filteredData, data, "total");
  }, [filteredData, data]);


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>Repository Views</CardTitle>
          <CardDescription>
            Daily views and unique visitors
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            Total Views
          </span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="h-6 flex items-center gap-2">
              <TrendIndicator trend={viewsTrend} />
              <span className="text-lg font-bold leading-none sm:text-2xl">
                {totalViews.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        {isLoading || filteredData.length > 0 ? (
          <Chart
            data={isLoading ? [] : filteredData}
            chartConfig={chartConfig}
            className="h-64 w-full"
            onLegendClick={isLoading ? undefined : handleLegendClick}
            hiddenSeries={hiddenSeries}
            isLoading={isLoading}
            customTooltip={
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => (
                  <ChartCustomTooltip
                    active={active}
                    payload={payload}
                    label={label}
                    entries={[
                      {
                        dataKey: 'total',
                        label: 'Total',
                        color: '#315c72'
                      },
                      {
                        dataKey: 'unique',
                        label: 'Unique',
                        color: '#62C3F8'
                      }
                    ]}
                    hiddenSeries={hiddenSeries}
                  />
                )}
              />
            }
          >
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-unique)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-unique)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              isAnimationActive={false}
              dataKey="total"
              fill="url(#fillTotal)"
              fillOpacity={1}
              stroke="transparent"
              strokeWidth={0}
              hide={hiddenSeries.includes("total")}
            />
            <Area
              isAnimationActive={false}
              dataKey="unique"
              fill="url(#fillUnique)"
              fillOpacity={1}
              stroke="transparent"
              strokeWidth={0}
              hide={hiddenSeries.includes("unique")}
            />
            <Area
              isAnimationActive={false}
              dataKey="solidTotal"
              fill="transparent"
              fillOpacity={0}
              stroke="var(--color-total)"
              strokeWidth={2}
              hide={hiddenSeries.includes("total")}
            />
            <Area
              isAnimationActive={false}
              dataKey="dashedTotal"
              fill="transparent"
              fillOpacity={0}
              stroke="var(--color-total)"
              strokeWidth={2}
              strokeDasharray="5,5"
              hide={hiddenSeries.includes("total")}
            />
            <Area
              isAnimationActive={false}
              dataKey="solidUnique"
              fill="transparent"
              fillOpacity={0}
              stroke="var(--color-unique)"
              strokeWidth={2}
              hide={hiddenSeries.includes("unique")}
            />
            <Area
              isAnimationActive={false}
              dataKey="dashedUnique"
              fill="transparent"
              fillOpacity={0}
              stroke="var(--color-unique)"
              strokeWidth={2}
              strokeDasharray="5,5"
              hide={hiddenSeries.includes("unique")}
            />
          </Chart>
        ) : (
          <NoDataMessage dataType="views" />
        )}
      </CardContent>
    </Card>
  );
}

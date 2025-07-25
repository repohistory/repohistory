"use client";

import { useMemo } from "react";
import { Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { Chart } from "./chart";
import { useDateRange } from "@/contexts/date-range-context";
import { NoDataMessage } from "./no-data-message";

interface ReferrersChartProps {
  traffic?: {
    referrers: Array<{
      referrer: string;
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

export function ReferrersChart({ traffic, isLoading = false }: ReferrersChartProps) {
  const { dateRange } = useDateRange();

  const { data, chartConfig } = useMemo(() => {
    if (!traffic || !traffic.referrers || !traffic.referrers.length) return { data: [], chartConfig: {} };

    // Use all referrers
    const topReferrers = traffic.referrers;

    // Create a map of dates to referrer data
    const dateMap = new Map<string, Record<string, number>>();

    topReferrers.forEach(referrer => {
      referrer.data.forEach(item => {
        if (!dateMap.has(item.timestamp)) {
          dateMap.set(item.timestamp, {});
        }
        const dateEntry = dateMap.get(item.timestamp)!;
        dateEntry[referrer.referrer] = item.count;
      });
    });

    // Convert to array format
    const chartData = Array.from(dateMap.entries())
      .map(([date, referrers]) => ({
        date,
        ...referrers
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Create chart config
    const config: ChartConfig = {};
    topReferrers.forEach((referrer, index) => {
      config[referrer.referrer] = {
        label: referrer.referrer,
        color: COLORS[index % COLORS.length],
      };
    });

    return { data: chartData, chartConfig: config };
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

  const showHint = filteredData.length === 1;


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>Referring Sites</CardTitle>
          <CardDescription>
            Sources driving traffic to your repository
          </CardDescription>
        </div>
        {showHint && (
          <div className="hidden md:block text-sm text-muted-foreground">
            💡 Come back in a few days to see trends over time
          </div>
        )}
      </CardHeader>
      <CardContent className="pl-0">
        {isLoading || filteredData.length > 0 ? (
          <Chart
            data={isLoading ? [] : filteredData}
            chartConfig={chartConfig}
            className="h-64 w-full"
            hideZeroValues
            isLoading={isLoading}
          >
            {Object.keys(chartConfig).map(referrer => (
              <Line
                isAnimationActive={false}
                key={referrer}
                dataKey={referrer}
                type="monotone"
                stroke={chartConfig[referrer].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </Chart>
        ) : (
          <NoDataMessage dataType="referrer data" />
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo, useState, useCallback } from "react";
import { Area } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { ZoomableChart } from "./zoomable-chart";
interface ViewChartProps {
  traffic: {
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
  const [zoomedData, setZoomedData] = useState<Array<{ date: string; unique: number; total: number }>>([]);

  // Track hidden series (opposite of visible)
  const [hiddenSeries, setHiddenSeries] = useState<Array<string>>([]);

  const handleLegendClick = (dataKey: string) => {
    if (hiddenSeries.includes(dataKey)) {
      setHiddenSeries(hiddenSeries.filter(key => key !== dataKey));
    } else {
      setHiddenSeries(prev => [...prev, dataKey]);
    }
  };

  const data = useMemo(() => traffic.views.views.map((item) => ({
    date: item.timestamp,
    unique: item.uniques,
    total: item.count,
  })), [traffic.views.views]);

  const handleDataChange = useCallback((newZoomedData: Array<{ date: string;[key: string]: string | number }>) => {
    setZoomedData(newZoomedData as Array<{ date: string; unique: number; total: number }>);
  }, []);

  const totalViews = useMemo(() => {
    const dataToUse = zoomedData.length > 0 ? zoomedData : data;
    return dataToUse.reduce((acc, curr) => acc + curr.total, 0);
  }, [zoomedData, data]);


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
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {totalViews.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <ZoomableChart
          data={data}
          chartConfig={chartConfig}
          className="h-64 w-full"
          onDataChange={handleDataChange}
          onLegendClick={handleLegendClick}
          hiddenSeries={hiddenSeries}
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
            type="monotone"
            fill="url(#fillTotal)"
            fillOpacity={1}
            stroke="var(--color-total)"
            strokeWidth={2}
            hide={hiddenSeries.includes("total")}
          />
          <Area
            isAnimationActive={false}
            dataKey="unique"
            type="monotone"
            fill="url(#fillUnique)"
            fillOpacity={1}
            stroke="var(--color-unique)"
            strokeWidth={2}
            hide={hiddenSeries.includes("unique")}
          />
        </ZoomableChart>
      </CardContent>
    </Card>
  );
}

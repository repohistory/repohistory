"use client";

import { useMemo, useState, useCallback } from "react";
import { Area } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { ZoomableChart } from "./zoomable-chart";
import { RepoTrafficData } from "@/utils/repoData";

interface CloneChartProps {
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

export function CloneChart({ traffic }: CloneChartProps) {
  const [zoomedData, setZoomedData] = useState<Array<{ date: string; unique: number; total: number }>>([]);

  const data = useMemo(() => traffic.clones.clones.map((item) => ({
    date: item.timestamp,
    unique: item.uniques,
    total: item.count,
  })), [traffic.clones.clones]);

  const handleDataChange = useCallback((newZoomedData: Array<{ date: string;[key: string]: string | number }>) => {
    setZoomedData(newZoomedData as Array<{ date: string; unique: number; total: number }>);
  }, []);

  const totalClones = useMemo(() => {
    const dataToUse = zoomedData.length > 0 ? zoomedData : data;
    return dataToUse.reduce((acc, curr) => acc + curr.total, 0);
  }, [zoomedData, data]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>Repository Clones</CardTitle>
          <CardDescription>
            Daily clones and unique cloners
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            Total Clones
          </span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {totalClones.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ZoomableChart data={data} chartConfig={chartConfig} className="h-64 w-full" onDataChange={handleDataChange}>
          <defs>
            <linearGradient id="fillTotalClone" x1="0" y1="0" x2="0" y2="1">
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
            <linearGradient id="fillUniqueClone" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="total"
            type="monotone"
            fill="url(#fillTotalClone)"
            fillOpacity={1}
            stroke="var(--color-total)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            dataKey="unique"
            type="monotone"
            fill="url(#fillUniqueClone)"
            fillOpacity={1}
            stroke="var(--color-unique)"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </ZoomableChart>
      </CardContent>
    </Card>
  );
}

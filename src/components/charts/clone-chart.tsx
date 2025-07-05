"use client";

import { useMemo, useState, useCallback } from "react";
import { Area } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { ZoomableChart } from "./zoomable-chart";
import { ExportDropdown } from "./export-dropdown";
import { exportChartData } from "@/utils/data-export";
interface CloneChartProps {
  traffic: {
    clones: {
      count: number;
      uniques: number;
      clones: Array<{
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

export function CloneChart({ traffic, repositoryName }: CloneChartProps) {
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

  const handleExportCSV = useCallback(() => {
    const dataToExport = zoomedData.length > 0 ? zoomedData : data;
    const startDate = dataToExport.length > 0 ? dataToExport[0].date : undefined;
    const endDate = dataToExport.length > 0 ? dataToExport[dataToExport.length - 1].date : undefined;
    exportChartData(dataToExport, 'clones', 'csv', repositoryName, startDate, endDate);
  }, [zoomedData, data, repositoryName]);

  const handleExportJSON = useCallback(() => {
    const dataToExport = zoomedData.length > 0 ? zoomedData : data;
    const startDate = dataToExport.length > 0 ? dataToExport[0].date : undefined;
    const endDate = dataToExport.length > 0 ? dataToExport[dataToExport.length - 1].date : undefined;
    exportChartData(dataToExport, 'clones', 'json', repositoryName, startDate, endDate);
  }, [zoomedData, data, repositoryName]);

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
        <ZoomableChart 
          data={data} 
          chartConfig={chartConfig} 
          className="h-64 w-full" 
          onDataChange={handleDataChange}
          onLegendClick={handleLegendClick}
          hiddenSeries={hiddenSeries}
          rightControls={
            <ExportDropdown
              onExportCSV={handleExportCSV}
              onExportJSON={handleExportJSON}
            />
          }
        >
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
            hide={hiddenSeries.includes("total")}
          />
          <Area
            dataKey="unique"
            type="monotone"
            fill="url(#fillUniqueClone)"
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

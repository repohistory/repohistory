"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area } from "recharts";
import { ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { TimestampZoomableChart } from "./timestamp-zoomable-chart";
import { RepoReleaseData } from "@/utils/repo/releases";

interface ReleaseChartProps {
  releasesData: RepoReleaseData;
}

const chartConfig = {
  downloads: {
    label: "Downloads",
    color: "#62C3F8",
  },
} satisfies ChartConfig;

export function ReleaseChart({ releasesData }: ReleaseChartProps) {
  const [zoomedData, setZoomedData] = useState<Array<{ date: string; timestamp: number; downloads: number }>>([]);

  const data = useMemo(() => {
    if (!releasesData.releases || releasesData.releases.length === 0) {
      return [];
    }
    return releasesData.releases
      .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
      .map(release => ({
        date: release.publishedAt.split('T')[0],
        timestamp: new Date(release.publishedAt).getTime(),
        downloads: release.downloadCount,
        name: release.name,
        tagName: release.tagName,
      }));
  }, [releasesData.releases]);

  const handleDataChange = useCallback((newZoomedData: Array<{ date: string; timestamp: number;[key: string]: string | number }>) => {
    setZoomedData(newZoomedData as Array<{ date: string; timestamp: number; downloads: number }>);
  }, []);

  const total = useMemo(() => {
    const dataToUse = zoomedData.length > 0 ? zoomedData : data;
    return dataToUse.reduce((acc, curr) => acc + curr.downloads, 0);
  }, [zoomedData, data]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: { tagName: string; downloads: number } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
          <div className="font-medium">
            {label ? new Date(Number(label)).toLocaleDateString() : ''}
          </div>
          <div className="grid gap-1.5">
            <div className="flex w-full items-center gap-2">
              <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: "#62C3F8" }} />
              <div className="flex flex-1 justify-between items-center leading-none">
                <span className="text-muted-foreground">
                  {data.tagName}
                </span>
                <span className="font-mono font-medium tabular-nums text-foreground ml-2">
                  {data.downloads.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Don't render if there are no releases
  if (!releasesData.releases || releasesData.releases.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-col justify-center gap-1">
          <CardTitle>Release Downloads</CardTitle>
          <CardDescription>
            Download count for all releases
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            Total Downloads
          </span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {total.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <TimestampZoomableChart
          data={data}
          chartConfig={chartConfig}
          className="h-64 w-full"
          onDataChange={handleDataChange}
          customTooltip={<ChartTooltip cursor={false} content={<CustomTooltip />} />}
        >
          <defs>
            <linearGradient id="fillDownloads" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-downloads)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-downloads)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            isAnimationActive={false}
            dataKey="downloads"
            type="monotone"
            fill="url(#fillDownloads)"
            fillOpacity={1}
            stroke="var(--color-downloads)"
            strokeWidth={2}
            dot={{ fill: "var(--color-downloads)", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 4, stroke: "var(--color-downloads)", strokeWidth: 2 }}
          />
        </TimestampZoomableChart>
      </CardContent>
    </Card>
  );
}

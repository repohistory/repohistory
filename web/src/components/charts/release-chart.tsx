"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Area } from "recharts";
import { ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { TimestampChart } from "./timestamp-chart";
import { RepoReleaseData } from "@/utils/repo/releases";
import { useDateRange } from "@/contexts/date-range-context";

interface ReleaseChartProps {
  releasesData?: RepoReleaseData;
  isLoading?: boolean;
}

const chartConfig = {
  downloads: {
    label: "Downloads",
    color: "#62C3F8",
  },
} satisfies ChartConfig;

export function ReleaseChart({ releasesData, isLoading = false }: ReleaseChartProps) {
  const { dateRange } = useDateRange();

  const data = useMemo(() => {
    if (!releasesData || !releasesData.releases || releasesData.releases.length === 0) {
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
  }, [releasesData]);

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
    return filteredData.reduce((acc, curr) => acc + curr.downloads, 0);
  }, [filteredData]);

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

  // Don't render if there are no releases and not loading
  if (!isLoading && (!releasesData || !releasesData.releases || releasesData.releases.length === 0)) {
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
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.toLocaleString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <TimestampChart
          data={isLoading ? [] : filteredData}
          chartConfig={chartConfig}
          className="h-64 w-full"
          customTooltip={<ChartTooltip cursor={false} content={<CustomTooltip />} />}
          isLoading={isLoading}
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
        </TimestampChart>
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { RepoReleaseData } from "@/utils/repo/releases";
import { useDateRange } from "@/contexts/date-range-context";
import { NoDataMessage } from "./no-data-message";
import { Loader } from "lucide-react";

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

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { tagName: string; downloads: number; date: string } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
          <div className="font-medium">{item.tagName}</div>
          <div className="text-muted-foreground">{new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
          <div className="grid gap-1.5">
            <div className="flex w-full items-center gap-2">
              <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: "#62C3F8" }} />
              <div className="flex flex-1 justify-between items-center leading-none">
                <span className="text-muted-foreground">Downloads</span>
                <span className="font-mono font-medium tabular-nums text-foreground ml-2">
                  {item.downloads.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Don't render if there are no releases at all
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
        {isLoading || filteredData.length > 0 ? (
          <div className="relative h-64 w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={isLoading ? [] : filteredData}
                  margin={{ left: 0, right: 0 }}
                >
                  <XAxis
                    dataKey="tagName"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    style={{ fontSize: '12px', userSelect: 'none' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    style={{ fontSize: '12px', userSelect: 'none' }}
                    allowDecimals={false}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <ChartTooltip cursor={false} content={<CustomTooltip />} />
                  <Bar
                    isAnimationActive={false}
                    dataKey="downloads"
                    fill="var(--color-downloads)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <NoDataMessage dataType="releases" />
        )}
      </CardContent>
    </Card>
  );
}

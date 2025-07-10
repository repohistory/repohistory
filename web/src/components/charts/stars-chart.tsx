"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Images } from "lucide-react";
import { Area } from "recharts";
import { ChartConfig } from "@/components/ui/chart";
import { ZoomableChart } from "./zoomable-chart";
import { ShareImage } from "./share-image";
import { RepoStarsData } from "@/utils/repo/stars";
import { BorderBeam } from "../magicui/border-beam";

interface StarsChartProps {
  starsData: RepoStarsData;
  repositoryName?: string;
  fullName?: string;
}

const chartConfig = {
  stars: {
    label: "Stars",
    color: "#62C3F8",
  },
} satisfies ChartConfig;


export function StarsChart({ starsData, fullName }: StarsChartProps) {
  const [viewType, setViewType] = useState<"cumulative" | "daily">("cumulative");
  const [zoomedData, setZoomedData] = useState<Array<{ date: string; stars: number }>>([]);

  // Preload default share image for better UX
  useEffect(() => {
    if (fullName) {
      const defaultImageUrl = `/api/svg?repo=${fullName}&type=Date&theme=dark&transparent=false`;
      const img = new Image();
      img.src = defaultImageUrl;
    }
  }, [fullName]);

  const data = useMemo(() => starsData.starsHistory.map((item) => ({
    date: item.date,
    stars: viewType === "cumulative" ? item.cumulative : item.daily,
  })), [starsData.starsHistory, viewType]);

  const handleDataChange = useCallback((newZoomedData: Array<{ date: string;[key: string]: string | number }>) => {
    setZoomedData(newZoomedData as Array<{ date: string; stars: number }>);
  }, []);

  const total = useMemo(() => {
    const dataToUse = zoomedData.length > 0 ? zoomedData : data;
    if (viewType === "cumulative") {
      return dataToUse.length > 0 ? dataToUse[dataToUse.length - 1].stars : 0;
    } else {
      return dataToUse.reduce((acc, curr) => acc + curr.stars, 0);
    }
  }, [zoomedData, data, viewType]);


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex flex-col justify-center gap-1">
          <CardTitle>Stars Over Time</CardTitle>
          <CardDescription>
            Repository star growth {viewType === "cumulative" ? "cumulative" : "daily"}
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            {viewType === "cumulative" ? "Total Stars" : "Total Daily Stars"}
          </span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {total.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ZoomableChart
          data={data}
          chartConfig={chartConfig}
          className="h-64 w-full"
          onDataChange={handleDataChange}
          extraButtons={
            fullName && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="size-8 hidden relative md:inline-flex">
                    <BorderBeam duration={1} size={100} colorFrom="#62C3F8" colorTo="#315B73" />
                    <Images />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Share Star History Image</DialogTitle>
                  </DialogHeader>
                  <ShareImage fullName={fullName} />
                </DialogContent>
              </Dialog>
            )
          }
        >
          <defs>
            <linearGradient id="fillStars" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-stars)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-stars)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            isAnimationActive={false}
            dataKey="stars"
            type="monotone"
            fill="url(#fillStars)"
            fillOpacity={1}
            stroke="var(--color-stars)"
            strokeWidth={2}
          />
        </ZoomableChart>
        <div className="flex justify-center mt-6">
          <Tabs value={viewType} onValueChange={(value) => setViewType(value as "cumulative" | "daily")}>
            <TabsList>
              <TabsTrigger value="cumulative" className="cursor-pointer">Cumulative</TabsTrigger>
              <TabsTrigger value="daily" className="cursor-pointer">Daily</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

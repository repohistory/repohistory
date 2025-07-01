"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { RepoTrafficData } from "@/utils/repoData";

interface TrafficChartsProps {
  traffic: RepoTrafficData;
}

const chartConfig = {
  unique: {
    label: "Unique",
    color: "#315c72",
  },
  nonUnique: {
    label: "Non-unique",
    color: "#62C3F8",
  },
} satisfies ChartConfig;

export function TrafficCharts({ traffic }: TrafficChartsProps) {
  const viewsData = traffic.views.views.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    unique: item.uniques,
    nonUnique: item.count - item.uniques,
  }));

  const clonesData = traffic.clones.clones.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    unique: item.uniques,
    nonUnique: item.count - item.uniques,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Traffic</CardTitle>
        <CardDescription>Daily views and clones with unique visitors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="text-sm font-medium mb-4">Views</h4>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={viewsData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="nonUnique" stackId="views" fill="var(--color-nonUnique)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="unique" stackId="views" fill="var(--color-unique)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-4">Clones</h4>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={clonesData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="nonUnique" stackId="clones" fill="var(--color-nonUnique)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="unique" stackId="clones" fill="var(--color-unique)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
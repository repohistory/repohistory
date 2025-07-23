"use client";

import { ReactNode } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";
import { ComposedChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface ChartProps {
  data: Array<{ date: string;[key: string]: string | number }>;
  chartConfig: ChartConfig;
  children: ReactNode;
  className?: string;
  onLegendClick?: (dataKey: string) => void;
  hiddenSeries?: Array<string>;
  customTooltip?: ReactNode;
  hideZeroValues?: boolean;
  isLoading?: boolean;
}

interface CustomLegendContentProps {
  chartConfig: ChartConfig;
  hiddenSeries: Array<string>;
  onLegendClick: (dataKey: string) => void;
}

function CustomLegendContent({ chartConfig, hiddenSeries, onLegendClick }: CustomLegendContentProps) {
  const legendEntries = Object.entries(chartConfig)
    .filter(([key]) => key !== "visitors")
    .map(([dataKey, config]) => ({
      dataKey,
      label: config.label,
      color: config.color,
    }));

  if (legendEntries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center pt-3">
      {legendEntries.map((entry) => {
        const isHidden = hiddenSeries.includes(entry.dataKey);

        return (
          <Button
            key={entry.dataKey}
            variant="outline"
            size="sm"
            className={`rounded-full cursor-pointer select-none hover:opacity-80 gap-1.5 ${isHidden ? "opacity-50" : "opacity-100"}`}
            onClick={() => onLegendClick(entry.dataKey)}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: entry.color,
              }}
            />
            {entry.label}
          </Button>
        );
      })}
    </div>
  );
}

export function Chart({
  data,
  chartConfig,
  children,
  className = "h-64 w-full",
  onLegendClick,
  hiddenSeries = [],
  customTooltip,
  hideZeroValues = false,
  isLoading = false
}: ChartProps) {

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      <ChartContainer config={chartConfig} className="h-full w-full">
        <div className="h-full" style={{ touchAction: 'none', userSelect: 'none' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                left: 0,
                right: 0,
              }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                style={{ fontSize: '12px', userSelect: 'none' }}
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
                style={{ fontSize: '12px', userSelect: 'none' }}
                allowDecimals={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              {customTooltip || (
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" hideZeroValues={hideZeroValues} />}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
              )}
              {children}
              {onLegendClick && (
                <ChartLegend
                  content={
                    <CustomLegendContent
                      chartConfig={chartConfig}
                      hiddenSeries={hiddenSeries}
                      onLegendClick={onLegendClick}
                    />
                  }
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
}

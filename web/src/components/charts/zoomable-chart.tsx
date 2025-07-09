"use client";

import { useState, useMemo, useRef, useEffect, ReactNode, useCallback } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";
import { ComposedChart, XAxis, YAxis, ResponsiveContainer, ReferenceArea } from "recharts";
import { Button } from "@/components/ui/button";
import { Maximize } from "lucide-react";

interface ZoomableChartProps {
  data: Array<{ date: string;[key: string]: string | number }>;
  chartConfig: ChartConfig;
  children: ReactNode;
  className?: string;
  onDataChange?: (zoomedData: Array<{ date: string;[key: string]: string | number }>) => void;
  onLegendClick?: (dataKey: string) => void;
  hiddenSeries?: Array<string>;
  isZooming?: boolean;
  customTooltip?: ReactNode;
  hideZeroValues?: boolean;
  extraButtons?: ReactNode;
}

interface CustomLegendContentProps {
  chartConfig: ChartConfig;
  hiddenSeries: Array<string>;
  onLegendClick: (dataKey: string) => void;
}

function CustomLegendContent({ chartConfig, hiddenSeries, onLegendClick }: CustomLegendContentProps) {
  // Create stable ordering from chartConfig instead of relying on dynamic payload
  const legendEntries = Object.entries(chartConfig)
    .filter(([key]) => key !== "visitors") // Filter out non-data entries
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
            className={`rounded-full cursor-pointer select-none hover:opacity-80 gap-1.5 ${isHidden ? "opacity-50" : "opacity-100"
              }`}
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

export function ZoomableChart({ data, chartConfig, children, className = "h-64 w-full", onDataChange, onLegendClick, hiddenSeries = [], customTooltip, hideZeroValues = false, extraButtons }: ZoomableChartProps) {
  const originalData = data;
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Initialize times when data is available or when date range changes
  useEffect(() => {
    if (originalData.length > 0) {
      const newStartDate = originalData[0].date;
      const newEndDate = originalData[originalData.length - 1].date;

      // Only reset zoom if this is the first load or if the date range has actually changed
      if (!startTime || !endTime ||
        startTime < newStartDate || startTime > newEndDate ||
        endTime < newStartDate || endTime > newEndDate) {
        setStartTime(newStartDate);
        setEndTime(newEndDate);
      }
    }
  }, [originalData, startTime, endTime]);

  useEffect(() => {
    const chartElement = chartRef.current;
    if (!chartElement) return;

    const handleWheel = (e: WheelEvent) => {
      if (!originalData.length || !chartRef.current || !startTime || !endTime) return;

      const zoomFactor = 0.1;
      const direction = e.deltaY < 0 ? 1 : -1;
      const clientX = e.clientX;

      const currentRange = new Date(endTime || originalData[originalData.length - 1].date).getTime() -
        new Date(startTime || originalData[0].date).getTime();
      const zoomAmount = currentRange * zoomFactor * direction;

      const chartRect = chartRef.current.getBoundingClientRect();
      const mouseX = clientX - chartRect.left;
      const chartWidth = chartRect.width;
      const mousePercentage = mouseX / chartWidth;

      const currentStartTime = new Date(startTime || originalData[0].date).getTime();
      const currentEndTime = new Date(endTime || originalData[originalData.length - 1].date).getTime();

      const newStartTime = new Date(currentStartTime + zoomAmount * mousePercentage);
      const newEndTime = new Date(currentEndTime - zoomAmount * (1 - mousePercentage));

      // Check original bounds
      const originalStartTime = new Date(originalData[0].date).getTime();
      const originalEndTime = new Date(originalData[originalData.length - 1].date).getTime();

      // Clamp the new times to not exceed original data bounds
      const clampedStartTime = Math.max(newStartTime.getTime(), originalStartTime);
      const clampedEndTime = Math.min(newEndTime.getTime(), originalEndTime);

      // Always prevent scroll propagation
      e.preventDefault();
      e.stopPropagation();

      // Apply zoom if there's actually a change
      if (clampedStartTime !== currentStartTime || clampedEndTime !== currentEndTime) {
        // If we're clamping to the exact original bounds, use the original values to ensure exact match
        const finalStartTime = clampedStartTime === originalStartTime ? originalData[0].date : new Date(clampedStartTime).toISOString();
        const finalEndTime = clampedEndTime === originalEndTime ? originalData[originalData.length - 1].date : new Date(clampedEndTime).toISOString();

        setStartTime(finalStartTime);
        setEndTime(finalEndTime);
      }
    };

    chartElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      chartElement.removeEventListener('wheel', handleWheel);
    };
  }, [originalData, startTime, endTime]);

  const zoomedData = useMemo(() => {
    if (!originalData.length || !startTime || !endTime) {
      return originalData;
    }

    const dataPointsInRange = originalData.filter(
      (dataPoint) => dataPoint.date >= startTime && dataPoint.date <= endTime
    );

    return dataPointsInRange.length > 1 ? dataPointsInRange : originalData.slice(0, 2);
  }, [startTime, endTime, originalData]);

  // Call onDataChange whenever zoomedData changes, but prevent infinite loops
  const prevZoomedDataRef = useRef<string>('');
  useEffect(() => {
    if (onDataChange) {
      // Serialize data to compare content, not reference
      const currentDataString = JSON.stringify(zoomedData);
      if (currentDataString !== prevZoomedDataRef.current) {
        prevZoomedDataRef.current = currentDataString;
        onDataChange(zoomedData);
      }
    }
  }, [zoomedData, onDataChange]);

  const handleMouseDown = (e: { activeLabel?: string }) => {
    if (e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: { activeLabel?: string }) => {
    if (isSelecting && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = useCallback(() => {
    if (refAreaLeft && refAreaRight) {
      const [left, right] = [refAreaLeft, refAreaRight].sort();
      setStartTime(left);
      setEndTime(right);
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIsSelecting(false);
  }, [refAreaLeft, refAreaRight]);

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (!isSelecting || !chartRef.current) return;

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!chartRef.current || !zoomedData.length) return;

      const chartRect = chartRef.current.getBoundingClientRect();
      const mouseX = e.clientX - chartRect.left;
      const chartWidth = chartRect.width;

      // Calculate the position as a percentage of chart width
      const percentage = Math.max(0, Math.min(1, mouseX / chartWidth));

      // Map percentage to data point index
      const dataIndex = Math.round(percentage * (zoomedData.length - 1));
      const clampedIndex = Math.max(0, Math.min(zoomedData.length - 1, dataIndex));

      // Get the corresponding date from the data
      const targetDate = zoomedData[clampedIndex]?.date;
      if (targetDate) {
        setRefAreaRight(targetDate);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isSelecting, refAreaLeft, refAreaRight, zoomedData, handleMouseUp]);

  const handleReset = () => {
    if (originalData.length > 0) {
      setStartTime(originalData[0].date);
      setEndTime(originalData[originalData.length - 1].date);
    }
  };


  const isZoomed = originalData.length > 0 && startTime && endTime && (
    startTime !== originalData[0].date ||
    endTime !== originalData[originalData.length - 1].date
  );

  return (
    <div className={className}>
      <div className="h-8 flex justify-end items-center mb-4 gap-2">
        {isZoomed && (
          <Button variant="outline" size="icon" onClick={handleReset} className="size-8">
            <Maximize />
          </Button>
        )}
        {extraButtons}
      </div>
      <ChartContainer config={chartConfig} className="h-[calc(100%-2.5rem)] w-full">
        <div className="h-full" ref={chartRef} style={{ touchAction: 'none', userSelect: 'none' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={zoomedData}
              margin={{
                left: 12,
                right: 12,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
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
              {refAreaLeft && refAreaRight && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.1}
                  stroke="white"
                  fill="white"
                  fillOpacity={0.1}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
}


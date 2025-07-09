"use client";

import { useState, useMemo, useRef, useEffect, ReactNode, useCallback } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";
import { ComposedChart, XAxis, YAxis, ResponsiveContainer, ReferenceArea } from "recharts";
import { Button } from "@/components/ui/button";
import { Maximize } from "lucide-react";

interface TimestampZoomableChartProps {
  data: Array<{ date: string; timestamp: number; [key: string]: string | number }>;
  chartConfig: ChartConfig;
  children: ReactNode;
  className?: string;
  onDataChange?: (zoomedData: Array<{ date: string; timestamp: number; [key: string]: string | number }>) => void;
  onLegendClick?: (dataKey: string) => void;
  hiddenSeries?: Array<string>;
  isZooming?: boolean;
  customTooltip?: ReactNode;
  hideZeroValues?: boolean;
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

export function TimestampZoomableChart({ data, chartConfig, children, className = "h-64 w-full", onDataChange, onLegendClick, hiddenSeries = [], customTooltip, hideZeroValues = false }: TimestampZoomableChartProps) {
  const originalData = data;
  const [refAreaLeft, setRefAreaLeft] = useState<number | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Initialize times when data is available or when date range changes
  useEffect(() => {
    if (originalData.length > 0) {
      const newStartTime = originalData[0].timestamp;
      const newEndTime = originalData[originalData.length - 1].timestamp;

      // Only reset zoom if this is the first load or if the time range has actually changed
      if (!startTime || !endTime ||
        startTime < newStartTime || startTime > newEndTime ||
        endTime < newStartTime || endTime > newEndTime) {
        setStartTime(newStartTime);
        setEndTime(newEndTime);
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

      const currentRange = endTime - startTime;
      const zoomAmount = currentRange * zoomFactor * direction;

      const chartRect = chartRef.current.getBoundingClientRect();
      const mouseX = clientX - chartRect.left;
      const chartWidth = chartRect.width;
      const mousePercentage = mouseX / chartWidth;

      const newStartTime = startTime + zoomAmount * mousePercentage;
      const newEndTime = endTime - zoomAmount * (1 - mousePercentage);

      // Check original bounds
      const originalStartTime = originalData[0].timestamp;
      const originalEndTime = originalData[originalData.length - 1].timestamp;

      // Clamp the new times to not exceed original data bounds
      const clampedStartTime = Math.max(newStartTime, originalStartTime);
      const clampedEndTime = Math.min(newEndTime, originalEndTime);

      // Always prevent scroll propagation
      e.preventDefault();
      e.stopPropagation();

      // Apply zoom if there's actually a change
      if (clampedStartTime !== startTime || clampedEndTime !== endTime) {
        setStartTime(clampedStartTime);
        setEndTime(clampedEndTime);
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
      (dataPoint) => dataPoint.timestamp >= startTime && dataPoint.timestamp <= endTime
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
      setRefAreaLeft(Number(e.activeLabel));
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: { activeLabel?: string }) => {
    if (isSelecting && e.activeLabel) {
      setRefAreaRight(Number(e.activeLabel));
    }
  };

  const handleMouseUp = useCallback(() => {
    if (refAreaLeft && refAreaRight) {
      const [left, right] = [refAreaLeft, refAreaRight].sort((a, b) => a - b);
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

      // Map percentage to timestamp range
      const timeRange = (endTime || zoomedData[zoomedData.length - 1].timestamp) - (startTime || zoomedData[0].timestamp);
      const targetTimestamp = (startTime || zoomedData[0].timestamp) + timeRange * percentage;

      setRefAreaRight(targetTimestamp);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isSelecting, startTime, endTime, zoomedData, handleMouseUp]);

  const handleReset = () => {
    if (originalData.length > 0) {
      setStartTime(originalData[0].timestamp);
      setEndTime(originalData[originalData.length - 1].timestamp);
    }
  };

  const isZoomed = originalData.length > 0 && startTime && endTime && (
    startTime !== originalData[0].timestamp ||
    endTime !== originalData[originalData.length - 1].timestamp
  );

  return (
    <div className={className}>
      <div className="h-8 flex justify-end items-center mb-4">
        {isZoomed && (
          <Button variant="outline" size="icon" onClick={handleReset} className="size-8">
            <Maximize />
          </Button>
        )}
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
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
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
                  labelFormatter={(value) => new Date(Number(value)).toLocaleDateString()}
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
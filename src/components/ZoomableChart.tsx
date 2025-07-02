"use client";

import { useState, useMemo, useRef, useEffect, ReactNode } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ComposedChart, XAxis, YAxis, ResponsiveContainer, ReferenceArea } from "recharts";
import { Button } from "@/components/ui/button";

interface ZoomableChartProps {
  data: Array<{ date: string; [key: string]: string | number }>;
  chartConfig: ChartConfig;
  children: ReactNode;
  className?: string;
  onDataChange?: (zoomedData: Array<{ date: string; [key: string]: string | number }>) => void;
}

export function ZoomableChart({ data, chartConfig, children, className = "h-64 w-full", onDataChange }: ZoomableChartProps) {
  const originalData = data;
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Initialize times when data is available
  useEffect(() => {
    if (originalData.length > 0) {
      setStartTime(originalData[0].date);
      setEndTime(originalData[originalData.length - 1].date);
    }
  }, [originalData]);

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

  const handleMouseUp = () => {
    if (refAreaLeft && refAreaRight) {
      const [left, right] = [refAreaLeft, refAreaRight].sort();
      setStartTime(left);
      setEndTime(right);
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIsSelecting(false);
  };

  const handleReset = () => {
    if (originalData.length > 0) {
      setStartTime(originalData[0].date);
      setEndTime(originalData[originalData.length - 1].date);
    }
  };


  const isZoomed = originalData.length > 0 && (
    startTime !== originalData[0].date || 
    endTime !== originalData[originalData.length - 1].date
  );

  return (
    <div className={className}>
      <div className="h-8 flex justify-end mb-2">
        {isZoomed && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
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
              onMouseLeave={handleMouseUp}
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
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              {children}
              {refAreaLeft && refAreaRight && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.5}
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.5}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
}


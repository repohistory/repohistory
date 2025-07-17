"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDateRange } from "@/contexts/date-range-context";

interface DateRangePickerProps {
  className?: string;
}

const periodOptions = [
  { value: "7", label: "Last 7 Days" },
  { value: "14", label: "Last 14 Days" },
  { value: "28", label: "Last 28 Days" },
  { value: "91", label: "Last 91 Days" },
  { value: "all", label: "All Time" },
];

export function DateRangePicker({ className }: DateRangePickerProps) {
  const { setDateRange, resetDateRange } = useDateRange();
  const [selectedPeriod, setSelectedPeriod] = useState("14");

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);

    if (value === "all") {
      resetDateRange();
    } else {
      const days = parseInt(value);
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - days);
      setDateRange({ from, to });
    }
  };

  return (
    <div className={className}>
      <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
        <SelectTrigger className="gap-2">
          <CalendarDays className="h-4 w-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

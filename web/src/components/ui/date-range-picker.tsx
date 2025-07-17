"use client";

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
  const { selectedPeriod, setSelectedPeriod } = useDateRange();

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
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

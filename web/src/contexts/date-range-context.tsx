"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangeContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  resetDateRange: () => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

interface DateRangeProviderProps {
  children: ReactNode;
}

export function DateRangeProvider({ children }: DateRangeProviderProps) {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 14);
    return { from, to };
  });

  const resetDateRange = () => {
    setDateRange({ from: null, to: null });
  };

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange, resetDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
}
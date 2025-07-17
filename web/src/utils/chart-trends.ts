export interface TrendData {
  current: number;
  previous: number;
  percentage: number;
  isIncrease: boolean;
}

export function calculateTrendPercentage(
  currentData: Array<{ date: string; [key: string]: string | number }>,
  allData: Array<{ date: string; [key: string]: string | number }>,
  valueKey: string
): TrendData | null {
  if (currentData.length === 0 || allData.length === 0) {
    return null;
  }

  const currentPeriodSum = currentData.reduce((sum, item) => sum + Number(item[valueKey]), 0);

  const currentStartDate = new Date(currentData[0].date);
  const currentEndDate = new Date(currentData[currentData.length - 1].date);
  
  const periodLength = Math.floor((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const previousEndDate = new Date(currentStartDate.getTime() - 24 * 60 * 60 * 1000);
  const previousStartDate = new Date(previousEndDate.getTime() - (periodLength - 1) * 24 * 60 * 60 * 1000);

  const previousPeriodData = allData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= previousStartDate && itemDate <= previousEndDate;
  });

  if (previousPeriodData.length === 0) {
    return null;
  }

  const previousPeriodSum = previousPeriodData.reduce((sum, item) => sum + Number(item[valueKey]), 0);

  if (previousPeriodSum === 0) {
    return {
      current: currentPeriodSum,
      previous: previousPeriodSum,
      percentage: currentPeriodSum > 0 ? 100 : 0,
      isIncrease: currentPeriodSum > 0
    };
  }

  const percentage = ((currentPeriodSum - previousPeriodSum) / previousPeriodSum) * 100;
  
  return {
    current: currentPeriodSum,
    previous: previousPeriodSum,
    percentage: Math.abs(percentage),
    isIncrease: percentage >= 0
  };
}

export function formatTrendPercentage(trend: TrendData | null): string {
  if (!trend) return "";
  
  return `${trend.percentage.toFixed(1)}%`;
}
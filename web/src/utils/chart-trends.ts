export interface TrendData {
  current: number;
  previous: number;
  percentage: number;
  isIncrease: boolean;
}

function isToday(dateString: string): boolean {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  return dateString === todayString;
}

function getCurrentDayCompletionFraction(): number {
  const now = new Date();
  const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const msInDay = 24 * 60 * 60 * 1000;
  const msSinceStartOfDayUTC = now.getTime() - startOfDayUTC.getTime();
  return Math.min(msSinceStartOfDayUTC / msInDay, 1);
}

export function calculateTrendPercentage(
  currentData: Array<{ date: string;[key: string]: string | number }>,
  allData: Array<{ date: string;[key: string]: string | number }>,
  valueKey: string
): TrendData | null {
  if (currentData.length === 0 || allData.length === 0) {
    return null;
  }

  const currentPeriodSum = currentData.reduce((sum, item) => sum + Number(item[valueKey]), 0);

  const lastDateInCurrent = currentData[currentData.length - 1].date;
  const isLastDayToday = isToday(lastDateInCurrent);
  let completionFraction = 1;

  const currentStartDate = new Date(currentData[0].date);
  const currentEndDate = new Date(currentData[currentData.length - 1].date);

  const periodLength = Math.floor((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const previousEndDate = new Date(currentStartDate.getTime() - 24 * 60 * 60 * 1000);
  const previousStartDate = new Date(previousEndDate.getTime() - (periodLength - 1) * 24 * 60 * 60 * 1000);

  const previousPeriodData = allData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= previousStartDate && itemDate <= previousEndDate;
  });

  if (previousPeriodData.length === 0 || previousPeriodData.length < periodLength) {
    return null;
  }

  let previousPeriodSum = previousPeriodData.reduce((sum, item) => sum + Number(item[valueKey]), 0);

  if (isLastDayToday) {
    completionFraction = getCurrentDayCompletionFraction();

    const firstDateInPrevious = previousPeriodData[0];
    if (firstDateInPrevious) {
      const firstDayValue = Number(firstDateInPrevious[valueKey]);
      previousPeriodSum = previousPeriodSum - firstDayValue + (firstDayValue * completionFraction);
    }
  }

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

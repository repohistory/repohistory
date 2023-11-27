export default function processStarData(
  timestamps: any[],
  growth: boolean,
): [string[], number[]] {
  const dateCounts = timestamps.reduce((acc, timestamp) => {
    // Convert timestamp to a date string
    const date = timestamp.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  let cumulativeCount = 0;
  const cumulativeData = Object.keys(dateCounts).map((date) => {
    if (growth) {
      return { [date]: dateCounts[date] };
    }

    cumulativeCount += dateCounts[date];
    return { [date]: cumulativeCount };
  });

  const d = cumulativeData.map((item) => Object.keys(item)[0]);
  const c = cumulativeData.map((item) => item[Object.keys(item)[0]]);

  return [d, c];
}

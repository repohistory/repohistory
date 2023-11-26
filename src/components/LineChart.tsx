'use client';

/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { Spinner, Switch } from '@nextui-org/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const options = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
      grid: {
        color: '#00000000',
      },
      ticks: {
        maxTicksLimit: 5,
      },
    },
    y: {
      grid: {
        color: '#202225',
      },
    },
  },
  plugins: {
    tooltip: {
      boxPadding: 2,
      usePointStyle: true,
      callbacks: {
        labelColor(ctx: any) {
          return {
            borderColor: ctx.dataset.borderColor,
            backgroundColor: ctx.dataset.borderColor,
            borderWidth: 3,
          };
        },
      },
    },
    legend: {
      display: false,
    },
  },
};

function processStarData(
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

export default function LineChart({
  fetchPromises,
}: {
  fetchPromises: Promise<any>[];
}) {
  const [starDates, setStarDates] = useState<string[] | null>(null);
  const [starsCount, setStarsCount] = useState<number[] | null>(null);
  const [growth, setGrowth] = useState(false);

  useEffect(() => {
    (async () => {
      const results = await Promise.allSettled(fetchPromises);

      const stars: any[] = [];
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const filteredData = result.value.data.map((d: any) => d.starred_at);
          stars.push(...filteredData);
        }
      });

      const [sd, sc] = processStarData(stars, growth);
      setStarDates(sd);
      setStarsCount(sc);
    })();
  }, [fetchPromises, growth]);

  return (
    <div
      className="flex flex-col items-center rounded-medium border
      border-[#303031] bg-[#111112] p-2 sm:p-5 lg:min-h-[30rem] xl:w-2/3"
    >
      <div className="relative w-full">
        <h1 className="text-center text-lg font-semibold text-white">
          {growth ? 'Stars Growth' : 'Stars Count'}
        </h1>
        <Switch
          isSelected={growth}
          onValueChange={setGrowth}
          className="absolute right-0 top-0"
        />
      </div>
      {starDates && starsCount ? (
        <Line
          options={options}
          data={{
            labels: starDates,
            datasets: [
              {
                data: starsCount,
                fill: true,
                pointRadius: 1,
                pointHoverRadius: 7,
                pointHitRadius: 30,
                label: 'Stars',
                borderColor: '#62C3F8',
                backgroundColor: '#62C3F810',
                hoverBackgroundColor: '#62C3F8',
                tension: 0.5,
              },
            ],
          }}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <Spinner color="primary" />
        </div>
      )}
    </div>
  );
}

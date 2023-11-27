'use client';

import processStarData from '@/utils/processStarsData';
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { Switch } from '@nextui-org/react';
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

export default function LineChart({
  fetchPromises,
}: {
  fetchPromises: Promise<any>[];
}) {
  const [growth, setGrowth] = useState(false);
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const results = await Promise.allSettled(fetchPromises);

      const newStars: any[] = [];
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const filteredData = result.value.data.map((d: any) => d.starred_at);
          newStars.push(...filteredData);
        }
      });

      setStars(newStars);
    })();
  }, [fetchPromises]);

  const [starsDates, starsCount] = processStarData(stars, growth);

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
      <Line
        options={options}
        data={{
          labels: starsDates,
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
    </div>
  );
}

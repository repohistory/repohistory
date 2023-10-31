'use client';

import { Chip, Spinner } from '@nextui-org/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

interface Props {
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
  data: {
    labels: string[];
    datasets: any[];
  } | null;
}

export default function Chart({
  title,
  primaryLabel,
  secondaryLabel,
  data,
}: Props) {
  return (
    <div className="mt-10 flex w-full flex-col gap-3">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      <div
        className="flex max-w-3xl flex-col items-center rounded-medium
          border border-[#202225] bg-[#111111] p-5"
      >
        {data ? (
          <Bar options={options} data={data} />
        ) : (
          <Spinner color="primary" className="py-10" />
        )}
        <div className="mt-1 flex justify-center">
          <Chip
            color="primary"
            variant="dot"
            classNames={{
              base: 'border-none',
            }}
          >
            {primaryLabel}
          </Chip>
          <Chip
            color="secondary"
            variant="dot"
            classNames={{
              base: 'border-none',
            }}
          >
            {secondaryLabel}
          </Chip>
        </div>
      </div>
    </div>
  );
}

'use client';

import { barOptions } from '@/utils/chartjs';
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

interface Props {
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
  data: {
    labels: string[];
    datasets: any[];
  } | null;
}

export default function BarChart({
  title,
  primaryLabel,
  secondaryLabel,
  data,
}: Props) {
  return (
    <div
      className="flex flex-col items-center rounded-medium
        border border-[#303031] bg-[#111112] p-2 sm:p-5 xl:w-1/2"
    >
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      {data ? (
        <Bar options={barOptions} data={data} />
      ) : (
        <Spinner color="primary" className="py-10" />
      )}
      <div className="mt-1 flex justify-center gap-3">
        <Chip
          color="primary"
          variant="dot"
          classNames={{
            base: 'border border-[#303031]',
          }}
        >
          {primaryLabel}
        </Chip>
        <Chip
          color="secondary"
          variant="dot"
          classNames={{
            base: 'border border-[#303031]',
          }}
        >
          {secondaryLabel}
        </Chip>
      </div>
    </div>
  );
}

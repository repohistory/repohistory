'use client';

import Download from '@/components/Icons/Download';
import { barOptions } from '@/utils/chartjs';
import { Chip, Link, Spinner } from '@nextui-org/react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
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
  const downloadableData: Record<string, any> = {};
  if (data !== null) {
    for (let i = 0; i < data.labels.length!; i += 1) {
      const ithData: Record<string, any> = {};
      data.datasets.forEach((dataset) => {
        ithData[dataset.label] = dataset.data[i];
      });
      downloadableData[data.labels[i]] = ithData;
    }
  }
  return (
    <div
      className="flex flex-col items-center rounded-medium
        border border-[#303031] bg-[#111112] p-2 sm:p-5 xl:w-1/2"
    >
      <div className="relative flex w-full justify-center text-lg font-semibold text-white">
        <h1>{title}</h1>
        <Link
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(downloadableData),
          )}`}
          download="repo-data.json"
          isBlock
          className="absolute right-0 text-xl text-white"
        >
          <Download />
        </Link>
      </div>
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

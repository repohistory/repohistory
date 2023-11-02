'use client';

import { Spinner } from '@nextui-org/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  data: {
    labels: string[];
    datasets: any[];
  } | null;
}

export default function LineChart({ title, data }: Props) {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-3 px-5 sm:px-0">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      <div
        className="flex flex-col items-center rounded-medium
          border border-[#202225] bg-[#111111] p-5"
      >
        {data ? (
          <Line options={options} data={data} />
        ) : (
          <Spinner color="primary" className="py-10" />
        )}
      </div>
    </div>
  );
}

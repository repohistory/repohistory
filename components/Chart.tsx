'use client';

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
};

interface Props {
  title: string;
  data: {
    labels: string[];
    datasets: any[];
  };
}

export default function Chart({ title, data }: Props) {
  return (
    <div className="mt-10 w-full max-w-3xl rounded-medium border border-[#30363D] bg-[#ffffff09] p-5 xl:w-1/2">
      <h1 className="mb-5 text-center text-lg font-semibold text-white">
        {title}
      </h1>
      <Bar options={options} data={data} />;
    </div>
  );
}

'use client';

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
    <div className="mx-auto mt-10 w-1/2 rounded-medium border border-[#30363D] bg-[#161b22] p-5">
      <h1 className="mb-5 text-center text-lg font-semibold text-white">
        {title}
      </h1>
      <Line options={options} data={data} />;
    </div>
  );
}

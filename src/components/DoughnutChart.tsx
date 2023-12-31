'use client';

import { doughnutOptions } from '@/utils/chartjs';
import { Chip } from '@nextui-org/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Link from 'next/link';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Label {
  name: string;
  path?: string;
  count: number;
  uniques: number;
  color: string;
}

interface Props {
  title: string;
  labels: Label[];
}

export default function DoughnutChart({ title, labels }: Props) {
  const data = {
    labels: labels.map((label) => label.name),
    datasets: [
      {
        label: 'Views',
        data: labels.map((label) => label.count),
        backgroundColor: labels.map((label) => label.color),
        borderColor: '#111112',
        borderRadius: 9999,
        borderWidth: 10,
      },
      {
        label: 'Unique Visitors',
        data: labels.map((label) => label.uniques),
        backgroundColor: labels.map((label) => label.color),
        borderColor: '#111112',
        borderRadius: 9999,
        borderWidth: 10,
      },
    ],
  };

  return (
    <div
      className="flex flex-col items-center gap-5 rounded-medium
        border border-[#303031] bg-[#111112] p-2 text-white sm:p-5 xl:w-1/2"
    >
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex w-full flex-col justify-center sm:flex-row sm:gap-10">
        <div className="relative mx-auto w-1/2 sm:mx-0 sm:max-w-[16.5rem]">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2
              -translate-y-1/2 transform text-center text-sm sm:text-base"
          >
            Views
            <div className="text-center text-2xl font-bold sm:text-4xl">
              {labels.reduce((acc, curr) => acc + curr.count, 0)}
            </div>
          </div>
          <div className="relative z-10">
            <Doughnut data={data} options={doughnutOptions} />
          </div>
        </div>
        <div
          className="flex flex-wrap items-center justify-center
            gap-3 sm:flex-col xl:items-stretch"
        >
          {labels.map((label) =>
            label.path ? (
              <Chip
                key={label.name}
                variant="dot"
                as={Link}
                target="_blank"
                href={label.path}
                classNames={{
                  base: 'border border-[#303031]',
                  content: 'max-w-[15rem] truncate',
                  dot: `bg-[${label.color}]`,
                }}
              >
                {label.name}
              </Chip>
            ) : (
              <Chip
                key={label.name}
                variant="dot"
                classNames={{
                  base: 'border border-[#303031]',
                  dot: `bg-[${label.color}]`,
                }}
              >
                {label.name}
              </Chip>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

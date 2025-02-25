'use client';

import Download from '@/components/Icons/Download';
import { barOptions } from '@/utils/chartjs';
import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
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

function normalizeString(s: string) {
  return s
    .replaceAll(/[^a-zA-Z0-9]/g, '')
    .replaceAll(/\s+/g, '-')
    .toLowerCase();
}

export default function BarChart({
  title,
  primaryLabel,
  secondaryLabel,
  data,
}: Props) {
  const downloadableJsonData: Record<string, any> = {};
  if (data !== null) {
    for (let i = 0; i < data.labels.length!; i += 1) {
      const ithData: Record<string, any> = {};
      data.datasets.forEach((dataset) => {
        ithData[dataset.label] = dataset.data[i];
      });
      downloadableJsonData[data.labels[i]] = ithData;
    }
  }

  let downloadableCsvData = `'date','${Object.keys(
    downloadableJsonData[Object.keys(downloadableJsonData)[0]],
  ).join("','")}'\n`;
  const keys = Object.keys(
    downloadableJsonData[Object.keys(downloadableJsonData)[0]],
  );
  Object.keys(downloadableJsonData).forEach((date: string) => {
    downloadableCsvData += `'${date}'`;
    keys.forEach((key) => {
      downloadableCsvData += `,${downloadableJsonData[date][key]}`;
    });
    downloadableCsvData += '\n';
  });
  const csvBlob = new Blob([downloadableCsvData], { type: 'text/csv' });
  const csvUrl = window.webkitURL.createObjectURL(csvBlob);

  return (
    <div
      className="flex flex-col items-center rounded-medium
        border border-[#303031] bg-[#111112] p-2 sm:p-5 xl:w-1/2"
    >
      <div className="relative flex w-full justify-center text-lg font-semibold text-white">
        <h1>{title}</h1>
        <Dropdown className="min-w-0">
          <DropdownTrigger>
            <Button className="absolute right-0 text-xl text-white">
              <Download />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Download type selection">
            <DropdownItem key="json">
              <Link
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(downloadableJsonData),
                )}`}
                download={`${normalizeString(title)}.json`}
                isBlock
                className="text-xs"
              >
                JSON
              </Link>
            </DropdownItem>
            <DropdownItem key="csv">
              <Link
                href={csvUrl}
                download={`${normalizeString(title)}.csv`}
                isBlock
                className="text-xs"
              >
                CSV
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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

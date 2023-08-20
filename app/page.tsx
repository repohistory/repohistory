import Chart from '@/components/Chart';
import clonesData from '@/data/clones';

const data = {
  labels: clonesData.clones.map((clone) =>
    clone.timestamp.slice(5, 10).replace('-', '/'),
  ),
  datasets: [
    {
      label: 'Clones',
      data: clonesData.clones.map((clone) => clone.count),
      borderColor: '#238636',
      backgroundColor: '#238636',
    },
    {
      label: 'Unique Cloners',
      data: clonesData.clones.map((clone) => clone.uniques),
      borderColor: '#1f6feb',
      backgroundColor: '#1f6feb',
    },
  ],
};

export default function HomePage() {
  return <Chart title="Git clones" data={data} />;
}

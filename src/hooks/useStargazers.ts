import useSWR from 'swr';
import fetcher, { parseCSV } from '@/utils';
import { useEffect, useState } from 'react';

export default function useStargazers(owner: string, repo: string) {
  const dataRepo = 'github-status';
  const branch = 'github-repo-stats';

  const [stargazers, setStargazers] = useState<any>(null);

  const { data, error, isLoading } = useSWR(
    `https://api.github.com/repos/${owner}/${dataRepo}/contents/${owner}/${repo}/ghrs-data/stargazers.csv?ref=${branch}`,
    fetcher,
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    const [time, counts] = parseCSV(atob(data.content));
    setStargazers({
      labels: time,
      datasets: [
        {
          fill: true,
          pointRadius: 0,
          pointHitRadius: 30,
          label: 'Stargazers',
          data: counts,
          borderColor: '#62C3F8',
          backgroundColor: '#62C3F810',
          tension: 0.5,
        },
      ],
    });
  }, [data]);

  if (error || isLoading) {
    return null;
  }

  return stargazers;
}

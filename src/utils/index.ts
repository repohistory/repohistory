import { parseCookies } from 'nookies';

export default async function fetcher(url: string) {
  const cookies = parseCookies();

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies.access_token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (res.status === 403) {
    throw new Error();
  }

  const data = await res.json();
  return data;
}

export function parseCSV(csvString: string): {
  time: string[];
  clonesTotal: number[];
  clonesUnique: number[];
  viewsTotal: number[];
  viewsUnique: number[];
} {
  const time: string[] = [];
  const clonesTotal: number[] = [];
  const clonesUnique: number[] = [];
  const viewsTotal: number[] = [];
  const viewsUnique: number[] = [];

  const lines = csvString.split('\n');

  // Remove the header line
  const headers = lines.shift()?.split(',');

  if (headers) {
    lines.forEach((line) => {
      const values = line.split(',');
      if (values.length === headers.length) {
        time.push(values[0].split(' ')[0]);
        clonesTotal.push(parseInt(values[1], 10));
        clonesUnique.push(parseInt(values[2], 10));
        viewsTotal.push(parseInt(values[3], 10));
        viewsUnique.push(parseInt(values[4], 10));
      }
    });
  }

  return {
    time,
    clonesTotal,
    clonesUnique,
    viewsTotal,
    viewsUnique,
  };
}

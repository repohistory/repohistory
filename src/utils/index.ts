/* eslint-disable no-plusplus */
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

export function parseCSV(csvString: string): any[][] {
  const rows = csvString.trim().split('\n');
  const headers = rows[0].split(',');

  const columnData: any[][] = Array.from({ length: headers.length }, () => []);

  for (let i = 1; i < rows.length; i++) {
    const columns = rows[i].split(',');
    columnData[0].push(columns[0].split(' ')[0]);
    for (let j = 1; j < columns.length; j++) {
      columnData[j].push(parseInt(columns[j], 10));
    }
  }

  return columnData;
}

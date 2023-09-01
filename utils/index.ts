import { parseCookies } from 'nookies';

export default async function fetcher(url: string) {
  const cookies = parseCookies();

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies.access_token}`,
    },
  });

  if (res.status === 403) {
    throw new Error();
  }

  const data = await res.json();
  return data;
}

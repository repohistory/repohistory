async function fetcher(url: string) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
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

async function install(userName: string) {
  const url = `https://api.github.com/users/${userName}/installation`;
  const data = await fetcher(url);
  console.log(data);
}

export default function useInstall() {
  return install;
}

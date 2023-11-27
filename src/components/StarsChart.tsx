import LineChart from '@/components/LineChart';

export default async function StarsChart({
  octokit,
  repo,
}: {
  octokit: any;
  repo: any;
}) {
  const fetchPromises: Promise<any>[] = [];
  const totalStars = Math.ceil(repo.stargazers_count / 100);
  for (let page = 1; page <= totalStars; page += 1) {
    fetchPromises.push(
      octokit.request(`GET /repos/${repo.full_name}/stargazers`, {
        per_page: 100,
        page,
        headers: {
          accept: 'application/vnd.github.v3.star+json',
        },
      }),
    );
  }

  return <LineChart fetchPromises={fetchPromises} />;
}

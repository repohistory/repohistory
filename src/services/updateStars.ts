/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { sql } from '@vercel/postgres';

function processStarData(timestamps: any[]) {
  const dateCounts = timestamps.reduce((acc, timestamp) => {
    // Convert timestamp to a date string
    const date = timestamp.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  let cumulativeCount = 0;
  const cumulativeData = Object.keys(dateCounts)
    .sort()
    .map((date) => {
      cumulativeCount += dateCounts[date];
      return { [date]: cumulativeCount };
    });

  return cumulativeData;
}

export default async function updateStars(app: any, installationId: number) {
  const octokit = await app.getInstallationOctokit(installationId);
  const response = await octokit.request('GET /installation/repositories');
  const { repositories } = response.data;
  for (const repo of repositories) {
    let page = 0;
    let stars = [];

    while (true) {
      const { data } = await octokit.request(
        `GET /repos/${repo.full_name}/stargazers`,
        {
          per_page: 100,
          page,
          headers: {
            accept: 'application/vnd.github.v3.star+json',
          },
        },
      );
      page += 1;
      const filteredData = data.map((d: any) => d.starred_at);
      stars.push(...filteredData);
      if (data.length === 0) {
        break;
      }
    }

    stars = processStarData(stars);

    for (const star of stars) {
      const [date, count] = Object.entries(star)[0];

      await sql`
        INSERT INTO repository_stars (full_name, date, stars_count)
        VALUES (${repo.full_name}, ${date}, ${count})
        ON CONFLICT (full_name, date) 
        DO UPDATE SET 
          stars_count = EXCLUDED.stars_count
      `;
    }
  }
}

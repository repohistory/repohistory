import { Octokit } from "octokit";
import { unstable_cache } from "next/cache";

export interface RepoStarsData {
  totalStars: number;
  starsHistory: Array<{
    date: string;
    cumulative: number;
    daily: number;
  }>;
}

export async function getRepoStars(
  octokit: Octokit,
  repo: { fullName: string; stargazersCount: number }
): Promise<RepoStarsData> {
  try {
    const getCachedStargazersPage = unstable_cache(
      async (fullName: string, page: number) => {
        const response = await octokit.request(`GET /repos/${fullName}/stargazers`, {
          per_page: 100,
          page,
          headers: {
            accept: 'application/vnd.github.v3.star+json',
          },
        });
        return response.data;
      },
      [],
      {
        tags: ['repo-stargazers'],
        revalidate: 86400, // 24 hours
      }
    );

    const totalPages = Math.ceil(repo.stargazersCount / 100);
    const fetchPromises: Promise<Array<{ starred_at: string }>>[] = [];

    for (let page = 1; page <= totalPages; page += 1) {
      fetchPromises.push(getCachedStargazersPage(repo.fullName, page));
    }

    const responses = await Promise.all(fetchPromises);
    const stargazers: Array<{ starred_at: string }> = [];

    responses.forEach(response => {
      stargazers.push(...response);
    });

    const starsHistory = processStarsData(stargazers, repo);

    return {
      totalStars: repo.stargazersCount,
      starsHistory,
    };
  } catch (error) {
    console.error("Error fetching stars data:", error);
    return {
      totalStars: 0,
      starsHistory: [],
    };
  }
}

function processStarsData(stargazers: Array<{ starred_at?: string }>, repo: { stargazersCount: number }) {
  const dailyStars: Record<string, number> = {};

  stargazers.forEach(({ starred_at }) => {
    if (starred_at) {
      const date = new Date(starred_at).toISOString().split('T')[0];
      dailyStars[date] = (dailyStars[date] || 0) + 1;
    }
  });

  const sortedDates = Object.keys(dailyStars).sort();
  if (sortedDates.length === 0) {
    return [];
  }

  // Generate complete date range from one day before first star to today
  const startDate = new Date(sortedDates[0]);
  startDate.setDate(startDate.getDate() - 1);
  const today = new Date().toISOString().split('T')[0];
  const endDate = new Date(today);
  const completeData = [];
  let cumulative = 0;

  for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const daily = dailyStars[dateStr] || 0;
    cumulative += daily;

    completeData.push({
      date: dateStr,
      daily,
      cumulative,
    });
  }

  // Add today's data
  const lastCumulative = completeData.length > 0 ? completeData[completeData.length - 1].cumulative : 0;
  const dailyToday = repo.stargazersCount - lastCumulative;
  completeData.push({
    date: today,
    daily: dailyToday,
    cumulative: repo.stargazersCount,
  });

  return completeData;
}

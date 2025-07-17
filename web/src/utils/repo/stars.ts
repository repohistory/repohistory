import { Octokit } from "octokit";

type StargazerResponse = {
  data: Array<{ starred_at: string }>;
  headers: {
    link?: string;
  };
};

async function getStargazersPage(octokit: Octokit, fullName: string, page: number): Promise<StargazerResponse> {
  const response = await octokit.request(`GET /repos/${fullName}/stargazers`, {
    per_page: 100,
    page,
    headers: {
      accept: 'application/vnd.github.v3.star+json',
    },
  });

  return response;
}

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
    const totalPages = Math.ceil(repo.stargazersCount / 100);
    const pagesToFetch = Math.min(totalPages, 400);

    const fetchPromises: Promise<StargazerResponse>[] = [];
    for (let page = 1; page <= pagesToFetch; page += 1) {
      fetchPromises.push(getStargazersPage(octokit, repo.fullName, page));
    }

    const responses = await Promise.all(fetchPromises);
    const stargazers: Array<{ starred_at: string }> = [];

    responses.forEach(response => {
      stargazers.push(...response.data);
    });

    const starsHistory = processStarsDataFull(stargazers, repo);

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

export async function getRepoStarsChart(
  octokit: Octokit,
  repo: { fullName: string; stargazersCount: number }
): Promise<RepoStarsData> {
  try {
    const maxRequestAmount = 15;
    const initialResponse = await getStargazersPage(octokit, repo.fullName, 1);

    const headerLink = initialResponse.headers.link || '';
    let pageCount = 1;
    const regResult = /next.*&page=(\d*).*last/.exec(headerLink);

    if (regResult) {
      if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
        pageCount = Number(regResult[1]);
      }
    }

    const requestPages: number[] = [];
    if (pageCount <= maxRequestAmount) {
      for (let i = 1; i <= pageCount; i++) {
        requestPages.push(i);
      }
    } else {
      for (let i = 1; i <= maxRequestAmount; i++) {
        const pageNumber = Math.round((i * pageCount) / maxRequestAmount);
        requestPages.push(Math.max(1, pageNumber));
      }
      if (!requestPages.includes(1)) {
        requestPages[0] = 1;
      }
    }

    const fetchPromises: Promise<StargazerResponse>[] = [];
    for (const page of requestPages) {
      fetchPromises.push(getStargazersPage(octokit, repo.fullName, page));
    }

    const responses = await Promise.all(fetchPromises);
    const responseData = responses.map(response => response.data);

    const starsHistory = processStarsDataSampled(responseData, repo, requestPages, pageCount <= maxRequestAmount);

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

function processStarsDataFull(stargazers: Array<{ starred_at?: string }>, repo: { stargazersCount: number }) {
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

  const totalStars = repo.stargazersCount;
  const lastCumulative = completeData.length > 0 ? completeData[completeData.length - 1].cumulative : 0;
  const dailyToday = totalStars - lastCumulative;
  completeData.push({
    date: today,
    daily: Math.max(0, dailyToday),
    cumulative: totalStars,
  });

  return completeData;
}

function processStarsDataSampled(
  responses: Array<Array<{ starred_at?: string }>>,
  repo: { stargazersCount: number },
  requestPages: number[],
  hasFullData: boolean
) {
  const starRecordsMap: Map<string, number> = new Map();
  const today = new Date().toISOString().split('T')[0];

  if (hasFullData) {
    const allStargazers: Array<{ starred_at?: string }> = [];
    responses.forEach(response => {
      allStargazers.push(...response);
    });

    const maxDataPoints = 15;
    const sampleStep = Math.floor(allStargazers.length / maxDataPoints) || 1;

    for (let i = 0; i < allStargazers.length; i += sampleStep) {
      const stargazer = allStargazers[i];
      if (stargazer.starred_at) {
        const date = new Date(stargazer.starred_at).toISOString().split('T')[0];
        starRecordsMap.set(date, i + 1);
      }
    }
  } else {
    const perPage = 100;

    responses.forEach((response, index) => {
      if (response.length > 0) {
        const firstStargazer = response[0];
        if (firstStargazer.starred_at) {
          const date = new Date(firstStargazer.starred_at).toISOString().split('T')[0];
          const pageNumber = requestPages[index];
          const estimatedStarCount = perPage * (pageNumber - 1);
          starRecordsMap.set(date, estimatedStarCount);
        }
      }
    });
  }

  starRecordsMap.set(today, repo.stargazersCount);

  const starRecords: Array<{ date: string; cumulative: number; daily: number }> = [];
  const sortedEntries = Array.from(starRecordsMap.entries()).sort((a, b) =>
    new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  for (let i = 0; i < sortedEntries.length; i++) {
    const [date, cumulative] = sortedEntries[i];
    const prevCumulative = i > 0 ? sortedEntries[i - 1][1] : 0;
    const daily = cumulative - prevCumulative;

    starRecords.push({
      date,
      cumulative,
      daily: Math.max(0, daily),
    });
  }

  return starRecords;
}

import { Octokit } from "octokit";
import { unstable_cache } from "next/cache";

type StargazerResponse = {
  data: Array<{ starred_at: string }>;
  headers: {
    link?: string;
  };
};

async function getStargazersPageUncached(octokit: Octokit, fullName: string, page: number): Promise<StargazerResponse> {
  const response = await octokit.request(`GET /repos/${fullName}/stargazers`, {
    per_page: 100,
    page,
    headers: {
      accept: 'application/vnd.github.v3.star+json',
    },
  });

  return response;
}

async function getStargazersPage(octokit: Octokit, fullName: string, page: number, isLastPage = false): Promise<StargazerResponse> {
  // If this is not the last page, it will definitely have 100 stargazers - use cache
  if (!isLastPage) {
    const cachedFn = unstable_cache(
      async () => getStargazersPageUncached(octokit, fullName, page),
      [fullName, page.toString()],
      {
        revalidate: 86400, // Cache for 24 hours
        tags: [`stargazers-${fullName}`]
      }
    );
    return await cachedFn();
  }

  // Last page might be partial - always fetch fresh
  return await getStargazersPageUncached(octokit, fullName, page);
}

export interface RepoStarsData {
  totalStars: number;
  hasEstimatedData: boolean;
  starsHistory: Array<{
    date: string;
    cumulative: number;
    daily: number;
    isEstimated?: boolean;
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
      const isLastPage = page === pagesToFetch;
      fetchPromises.push(getStargazersPage(octokit, repo.fullName, page, isLastPage));
    }

    const responses = await Promise.all(fetchPromises);
    const stargazers: Array<{ starred_at: string }> = [];

    responses.forEach(response => {
      stargazers.push(...response.data);
    });

    const { starsHistory, hasEstimatedData } = processStarsDataFull(stargazers, repo);

    return {
      totalStars: repo.stargazersCount,
      hasEstimatedData,
      starsHistory,
    };
  } catch (error) {
    console.error("Error fetching stars data:", error);
    return {
      totalStars: 0,
      hasEstimatedData: false,
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
    const initialResponse = await getStargazersPage(octokit, repo.fullName, 1, true); // First page in chart might be last

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
      const isLastPage = page === Math.max(...requestPages);
      fetchPromises.push(getStargazersPage(octokit, repo.fullName, page, isLastPage));
    }

    const responses = await Promise.all(fetchPromises);
    const responseData = responses.map(response => response.data);

    const { starsHistory, hasEstimatedData } = processStarsDataSampled(responseData, repo, requestPages, pageCount <= maxRequestAmount);

    return {
      totalStars: repo.stargazersCount,
      hasEstimatedData,
      starsHistory,
    };
  } catch (error) {
    console.error("Error fetching stars data:", error);
    return {
      totalStars: 0,
      hasEstimatedData: false,
      starsHistory: [],
    };
  }
}

function processStarsDataFull(stargazers: Array<{ starred_at?: string }>, repo: { stargazersCount: number }) {
  const dailyStars = groupStargazersByDate(stargazers);
  const sortedDates = Object.keys(dailyStars).sort();
  
  if (sortedDates.length === 0) {
    return { starsHistory: [], hasEstimatedData: false };
  }

  const completeData = fillMissingDates(dailyStars, sortedDates);
  const hasEstimatedData = repo.stargazersCount > 40000;
  
  if (hasEstimatedData) {
    interpolateMissingStars(completeData, dailyStars, sortedDates, repo.stargazersCount);
  }

  return { starsHistory: completeData, hasEstimatedData };
}

function groupStargazersByDate(stargazers: Array<{ starred_at?: string }>): Record<string, number> {
  const dailyStars: Record<string, number> = {};
  
  stargazers.forEach(({ starred_at }) => {
    if (!starred_at) return;
    
    const date = new Date(starred_at).toISOString().split('T')[0];
    dailyStars[date] = (dailyStars[date] || 0) + 1;
  });
  
  return dailyStars;
}

function fillMissingDates(dailyStars: Record<string, number>, sortedDates: string[]) {
  const today = new Date().toISOString().split('T')[0];
  const startDate = new Date(sortedDates[0]);
  startDate.setDate(startDate.getDate() - 1);
  
  const completeData = [];
  let cumulative = 0;

  for (let d = new Date(startDate); d.toISOString().split('T')[0] <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const daily = dailyStars[dateStr] || 0;
    cumulative += daily;

    completeData.push({
      date: dateStr,
      daily,
      cumulative,
      isEstimated: false,
    });
  }
  
  return completeData;
}

function interpolateMissingStars(
  completeData: Array<{ date: string; daily: number; cumulative: number; isEstimated: boolean }>,
  dailyStars: Record<string, number>,
  sortedDates: string[],
  totalStars: number
) {
  const lastStarDate = sortedDates[sortedDates.length - 1];
  const actualStarsCount = Object.values(dailyStars).reduce((sum, count) => sum + count, 0);
  const missingStars = totalStars - actualStarsCount;
  
  if (missingStars <= 0) return;
  
  const lastStarDateObj = new Date(lastStarDate);
  const estimatedDays = completeData.filter(item => new Date(item.date) > lastStarDateObj);
  
  if (estimatedDays.length === 0) return;
  
  distributeStarsEvenly(estimatedDays, missingStars);
  recalculateCumulativeValues(completeData, totalStars);
}

function distributeStarsEvenly(
  days: Array<{ date: string; daily: number; cumulative: number; isEstimated: boolean }>,
  totalStars: number
) {
  const baseStarsPerDay = Math.floor(totalStars / days.length);
  const remainder = totalStars % days.length;
  
  days.forEach((day, index) => {
    day.isEstimated = true;
    day.daily += baseStarsPerDay + (index < remainder ? 1 : 0);
  });
}

function recalculateCumulativeValues(
  completeData: Array<{ date: string; daily: number; cumulative: number; isEstimated: boolean }>,
  totalStars: number
) {
  let runningTotal = 0;
  
  completeData.forEach((item, index) => {
    runningTotal += item.daily;
    item.cumulative = index === completeData.length - 1 ? totalStars : runningTotal;
  });
}

function processStarsDataSampled(
  responses: Array<Array<{ starred_at?: string }>>,
  repo: { stargazersCount: number },
  requestPages: number[],
  hasFullData: boolean
) {
  const starRecordsMap: Map<string, number> = new Map();
  const today = new Date().toISOString().split('T')[0];
  let hasEstimatedData = false;

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
    hasEstimatedData = true;
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

  const starRecords: Array<{ date: string; cumulative: number; daily: number; isEstimated?: boolean }> = [];
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
      isEstimated: hasEstimatedData,
    });
  }

  return { starsHistory: starRecords, hasEstimatedData };
}

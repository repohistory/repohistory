import { Octokit } from "octokit";
import { createClient } from "@/utils/supabase/server";

export interface RepoTrafficData {
  views: {
    count: number;
    uniques: number;
    views: Array<{
      timestamp: string;
      count: number;
      uniques: number;
    }>;
  };
  clones: {
    count: number;
    uniques: number;
    clones: Array<{
      timestamp: string;
      count: number;
      uniques: number;
    }>;
  };
  referrers: Array<{
    referrer: string;
    count: number;
    uniques: number;
  }>;
  paths: Array<{
    path: string;
    title: string;
    count: number;
    uniques: number;
  }>;
}

export interface RepoStarsData {
  totalStars: number;
  starsHistory: Array<{
    date: string;
    cumulative: number;
    daily: number;
  }>;
}

export interface RepoOverviewData {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  issues: number;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

export async function getRepoOverview(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<RepoOverviewData> {
  const { data } = await octokit.rest.repos.get({
    owner,
    repo,
  });

  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    issues: data.open_issues_count,
    language: data.language,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    htmlUrl: data.html_url,
  };
}

export async function getTopReferrers(
  octokit: Octokit,
  fullName: string
): Promise<Array<{ referrer: string; count: number; uniques: number }>> {
  try {
    const [owner, repo] = fullName.split("/");
    const { data } = await octokit.rest.repos.getTopReferrers({ owner, repo });
    return data || [];
  } catch (error) {
    console.error("Error fetching referrers data:", error);
    return [];
  }
}

export async function getTopPaths(
  octokit: Octokit,
  fullName: string
): Promise<Array<{ path: string; title: string; count: number; uniques: number }>> {
  try {
    const [owner, repo] = fullName.split("/");
    const { data } = await octokit.rest.repos.getTopPaths({ owner, repo });
    return data || [];
  } catch (error) {
    console.error("Error fetching paths data:", error);
    return [];
  }
}

export async function getRepoTraffic(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fullName: string
): Promise<RepoTrafficData> {
  try {
    // Get historical traffic data from Supabase
    const { data: trafficData, error } = await supabase
      .from('repository_traffic')
      .select('*')
      .eq('full_name', fullName)
      .order('date', { ascending: true });

    if (error) {
      console.error("Error fetching traffic data from Supabase:", error);
    }

    const traffic = trafficData || [];

    // Calculate totals
    const totalViews = traffic.reduce((sum, item) => sum + (item.views_count || 0), 0);
    const totalUniqueViews = traffic.reduce((sum, item) => sum + (item.unique_views_count || 0), 0);
    const totalClones = traffic.reduce((sum, item) => sum + (item.clones_count || 0), 0);
    const totalUniqueClones = traffic.reduce((sum, item) => sum + (item.unique_clones_count || 0), 0);

    // Format data for charts
    const views = traffic.map(item => ({
      timestamp: item.date,
      count: item.views_count || 0,
      uniques: item.unique_views_count || 0,
    }));

    const clones = traffic.map(item => ({
      timestamp: item.date,
      count: item.clones_count || 0,
      uniques: item.unique_clones_count || 0,
    }));

    return {
      views: {
        count: totalViews,
        uniques: totalUniqueViews,
        views,
      },
      clones: {
        count: totalClones,
        uniques: totalUniqueClones,
        clones,
      },
      referrers: [],
      paths: [],
    };
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    return {
      views: { count: 0, uniques: 0, views: [] },
      clones: { count: 0, uniques: 0, clones: [] },
      referrers: [],
      paths: [],
    };
  }
}

export async function getRepoStars(
  octokit: Octokit,
  repo: { fullName: string; stargazersCount: number }
): Promise<RepoStarsData> {
  try {
    const fetchPromises: Promise<{ data: Array<{ starred_at?: string }> }>[] = [];
    const totalPages = Math.ceil(repo.stargazersCount / 100);

    for (let page = 1; page <= totalPages; page += 1) {
      fetchPromises.push(
        octokit.request(`GET /repos/${repo.fullName}/stargazers`, {
          per_page: 100,
          page,
          headers: {
            accept: 'application/vnd.github.v3.star+json',
          },
        }),
      );
    }

    const responses = await Promise.all(fetchPromises);
    const stargazers: Array<{ starred_at?: string }> = [];

    responses.forEach(response => {
      stargazers.push(...response.data);
    });

    // Process stars data into daily aggregations
    const starsHistory = processStarsData(stargazers);

    return {
      totalStars: stargazers.length,
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

function processStarsData(stargazers: Array<{ starred_at?: string }>) {
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

  // Generate complete date range from one day before first star to last date
  const startDate = new Date(sortedDates[0]);
  startDate.setDate(startDate.getDate() - 1); // Start one day before first star
  const endDate = new Date(sortedDates[sortedDates.length - 1]);
  const completeData = [];
  let cumulative = 0;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const daily = dailyStars[dateStr] || 0;
    cumulative += daily;

    completeData.push({
      date: dateStr,
      daily,
      cumulative,
    });
  }

  return completeData;
}

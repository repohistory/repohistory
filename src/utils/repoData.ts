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

export async function getRepoTraffic(
  octokit: Octokit,
  supabase: Awaited<ReturnType<typeof createClient>>,
  fullName: string
): Promise<RepoTrafficData> {
  try {
    // Get GitHub traffic data for referrers and paths (14-day data)
    const [owner, repo] = fullName.split("/");
    const [referrers, paths] = await Promise.all([
      octokit.rest.repos.getTopReferrers({ owner, repo }).catch(() => ({ data: [] })),
      octokit.rest.repos.getTopPaths({ owner, repo }).catch(() => ({ data: [] })),
    ]);

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
      referrers: referrers.data || [],
      paths: paths.data || [],
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
  let cumulative = 0;

  return sortedDates.map(date => {
    const daily = dailyStars[date];
    cumulative += daily;

    return {
      date,
      daily,
      cumulative,
    };
  });
}

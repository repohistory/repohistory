import { Octokit } from "octokit";
import { createClient } from "@/utils/supabase/server";

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
  repoId: number;
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
    repoId: data.id,
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

export async function getRepoViews(
  octokit: Octokit,
  supabase: Awaited<ReturnType<typeof createClient>>,
  fullName: string,
  repoId: number
): Promise<{ count: number; uniques: number; views: Array<{ timestamp: string; count: number; uniques: number }> }> {
  try {
    const [owner, repo] = fullName.split("/");

    // Fetch data from both sources in parallel
    const [supabaseResult, githubResult] = await Promise.allSettled([
      supabase
        .from('views')
        .select('date, total, unique')
        .eq('repo_id', repoId)
        .order('date', { ascending: true }),
      octokit.rest.repos.getViews({ owner, repo })
    ]);

    // Process Supabase data
    const supabaseData = supabaseResult.status === 'fulfilled' && supabaseResult.value.data || [];

    if (supabaseResult.status === 'rejected') {
      console.error("Error fetching views from Supabase:", supabaseResult.reason);
    }

    // Process GitHub data
    const githubData = githubResult.status === 'fulfilled'
      ? githubResult.value.data.views?.map(item => ({
        date: item.timestamp.split('T')[0],
        count: item.count,
        uniques: item.uniques,
      })) || []
      : [];

    if (githubResult.status === 'rejected') {
      console.error("Error fetching views from GitHub API:", githubResult.reason);
    }

    // Merge data: GitHub overrides Supabase for matching dates
    const dataMap = new Map(
      supabaseData.map(item => [
        item.date,
        { timestamp: item.date, count: item.total || 0, uniques: item.unique || 0 }
      ])
    );

    // Override with GitHub data (more precise for recent dates)
    githubData.forEach(item => {
      dataMap.set(item.date, { timestamp: item.date, count: item.count, uniques: item.uniques });
    });

    // Fill missing dates with 0 values
    const sortedViews = Array.from(dataMap.values()).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const views = [];
    
    if (sortedViews.length > 0) {
      const startDate = new Date(sortedViews[0].timestamp);
      const endDate = new Date();
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const existingData = dataMap.get(dateStr);
        views.push(existingData || { timestamp: dateStr, count: 0, uniques: 0 });
      }
    }
    
    const count = views.reduce((sum, item) => sum + item.count, 0);
    const uniques = views.reduce((sum, item) => sum + item.uniques, 0);

    return { count, uniques, views };
  } catch (error) {
    console.error("Error fetching views data:", error);
    return { count: 0, uniques: 0, views: [] };
  }
}

export async function getRepoClones(
  octokit: Octokit,
  supabase: Awaited<ReturnType<typeof createClient>>,
  fullName: string,
  repoId: number
): Promise<{ count: number; uniques: number; clones: Array<{ timestamp: string; count: number; uniques: number }> }> {
  try {
    const [owner, repo] = fullName.split("/");

    // Fetch data from both sources in parallel
    const [supabaseResult, githubResult] = await Promise.allSettled([
      supabase
        .from('clones')
        .select('date, total, unique')
        .eq('repo_id', repoId)
        .order('date', { ascending: true }),
      octokit.rest.repos.getClones({ owner, repo })
    ]);

    // Process Supabase data
    const supabaseData = supabaseResult.status === 'fulfilled' && supabaseResult.value.data || [];
    if (supabaseResult.status === 'rejected') {
      console.error("Error fetching clones from Supabase:", supabaseResult.reason);
    }

    // Process GitHub data
    const githubData = githubResult.status === 'fulfilled'
      ? githubResult.value.data.clones?.map(item => ({
        date: item.timestamp.split('T')[0],
        count: item.count,
        uniques: item.uniques,
      })) || []
      : [];

    if (githubResult.status === 'rejected') {
      console.error("Error fetching clones from GitHub API:", githubResult.reason);
    }

    // Merge data: GitHub overrides Supabase for matching dates
    const dataMap = new Map(
      supabaseData.map(item => [
        item.date,
        { timestamp: item.date, count: item.total || 0, uniques: item.unique || 0 }
      ])
    );

    // Override with GitHub data (more precise for recent dates)
    githubData.forEach(item => {
      dataMap.set(item.date, { timestamp: item.date, count: item.count, uniques: item.uniques });
    });

    // Fill missing dates with 0 values
    const sortedClones = Array.from(dataMap.values()).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const clones = [];
    
    if (sortedClones.length > 0) {
      const startDate = new Date(sortedClones[0].timestamp);
      const endDate = new Date();
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const existingData = dataMap.get(dateStr);
        clones.push(existingData || { timestamp: dateStr, count: 0, uniques: 0 });
      }
    }
    
    const count = clones.reduce((sum, item) => sum + item.count, 0);
    const uniques = clones.reduce((sum, item) => sum + item.uniques, 0);

    return { count, uniques, clones };
  } catch (error) {
    console.error("Error fetching clones data:", error);
    return { count: 0, uniques: 0, clones: [] };
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

  // Generate complete date range from one day before first star to today
  const startDate = new Date(sortedDates[0]);
  startDate.setDate(startDate.getDate() - 1); // Start one day before first star
  const endDate = new Date(); // Use today's date
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

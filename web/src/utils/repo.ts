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

export interface RepoReleaseData {
  totalDownloads: number;
  releases: Array<{
    tagName: string;
    name: string;
    publishedAt: string;
    downloadCount: number;
  }>;
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

export async function getRepoReferrers(
  octokit: Octokit,
  supabase: Awaited<ReturnType<typeof createClient>>,
  fullName: string,
  repoId: number
): Promise<{ referrers: Array<{ referrer: string; data: Array<{ timestamp: string; count: number; uniques: number }> }> }> {
  try {
    const [owner, repo] = fullName.split("/");

    // Fetch data from both sources in parallel
    const [supabaseResult, githubResult] = await Promise.allSettled([
      supabase
        .from('referrers')
        .select('date, referrer, total, unique')
        .eq('repo_id', repoId)
        .order('date', { ascending: true }),
      octokit.rest.repos.getTopReferrers({ owner, repo })
    ]);

    // Process Supabase data
    const supabaseData = supabaseResult.status === 'fulfilled' && supabaseResult.value.data || [];
    if (supabaseResult.status === 'rejected') {
      console.error("Error fetching referrers from Supabase:", supabaseResult.reason);
    }

    // Process GitHub data
    const githubData = githubResult.status === 'fulfilled'
      ? githubResult.value.data?.map(item => ({
        referrer: item.referrer,
        count: item.count,
        uniques: item.uniques,
        date: new Date().toISOString().split('T')[0], // Use today's date for GitHub data
      })) || []
      : [];

    if (githubResult.status === 'rejected') {
      console.error("Error fetching referrers from GitHub API:", githubResult.reason);
    }

    // Group data by referrer
    const referrerMap = new Map<string, Map<string, { count: number; uniques: number }>>();

    // Add Supabase data
    supabaseData.forEach(item => {
      if (!referrerMap.has(item.referrer)) {
        referrerMap.set(item.referrer, new Map());
      }
      referrerMap.get(item.referrer)!.set(item.date, { count: item.total || 0, uniques: item.unique || 0 });
    });

    // Add GitHub data (override for today's date)
    githubData.forEach(item => {
      if (!referrerMap.has(item.referrer)) {
        referrerMap.set(item.referrer, new Map());
      }
      referrerMap.get(item.referrer)!.set(item.date, { count: item.count, uniques: item.uniques });
    });

    // Convert to array format and fill missing dates
    const referrers = Array.from(referrerMap.entries()).map(([referrer, dataMap]) => {
      const sortedData = Array.from(dataMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      const data = [];
      
      if (sortedData.length > 0) {
        const startDate = new Date(sortedData[0][0]);
        const endDate = new Date();
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const existingData = dataMap.get(dateStr);
          data.push({
            timestamp: dateStr,
            count: existingData?.count || 0,
            uniques: existingData?.uniques || 0
          });
        }
      }
      
      return { referrer, data };
    });

    // Sort by total traffic (descending)
    referrers.sort((a, b) => {
      const aTotal = a.data.reduce((sum, item) => sum + item.count, 0);
      const bTotal = b.data.reduce((sum, item) => sum + item.count, 0);
      return bTotal - aTotal;
    });

    return { referrers };
  } catch (error) {
    console.error("Error fetching referrers data:", error);
    return { referrers: [] };
  }
}

export async function getRepoPaths(
  octokit: Octokit,
  supabase: Awaited<ReturnType<typeof createClient>>,
  fullName: string,
  repoId: number
): Promise<{ paths: Array<{ path: string; title: string; data: Array<{ timestamp: string; count: number; uniques: number }> }> }> {
  try {
    const [owner, repo] = fullName.split("/");

    // Fetch data from both sources in parallel
    const [supabaseResult, githubResult] = await Promise.allSettled([
      supabase
        .from('paths')
        .select('date, path, total, unique')
        .eq('repo_id', repoId)
        .order('date', { ascending: true }),
      octokit.rest.repos.getTopPaths({ owner, repo })
    ]);

    // Process Supabase data
    const supabaseData = supabaseResult.status === 'fulfilled' && supabaseResult.value.data || [];
    if (supabaseResult.status === 'rejected') {
      console.error("Error fetching paths from Supabase:", supabaseResult.reason);
    }

    // Process GitHub data
    const githubData = githubResult.status === 'fulfilled'
      ? githubResult.value.data?.map(item => ({
        path: item.path,
        title: item.title,
        count: item.count,
        uniques: item.uniques,
        date: new Date().toISOString().split('T')[0], // Use today's date for GitHub data
      })) || []
      : [];

    if (githubResult.status === 'rejected') {
      console.error("Error fetching paths from GitHub API:", githubResult.reason);
    }

    // Group data by path
    const pathMap = new Map<string, { title: string; data: Map<string, { count: number; uniques: number }> }>();

    // Add Supabase data
    supabaseData.forEach(item => {
      if (!pathMap.has(item.path)) {
        pathMap.set(item.path, { title: item.path, data: new Map() });
      }
      pathMap.get(item.path)!.data.set(item.date, { count: item.total || 0, uniques: item.unique || 0 });
    });

    // Add GitHub data (override for today's date and add title)
    githubData.forEach(item => {
      if (!pathMap.has(item.path)) {
        pathMap.set(item.path, { title: item.title, data: new Map() });
      }
      const pathData = pathMap.get(item.path)!;
      pathData.title = item.title; // Update title from GitHub data
      pathData.data.set(item.date, { count: item.count, uniques: item.uniques });
    });

    // Convert to array format and fill missing dates
    const paths = Array.from(pathMap.entries()).map(([path, pathInfo]) => {
      const sortedData = Array.from(pathInfo.data.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      const data = [];
      
      if (sortedData.length > 0) {
        const startDate = new Date(sortedData[0][0]);
        const endDate = new Date();
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const existingData = pathInfo.data.get(dateStr);
          data.push({
            timestamp: dateStr,
            count: existingData?.count || 0,
            uniques: existingData?.uniques || 0
          });
        }
      }
      
      return { path, title: pathInfo.title, data };
    });

    // Sort by total traffic (descending)
    paths.sort((a, b) => {
      const aTotal = a.data.reduce((sum, item) => sum + item.count, 0);
      const bTotal = b.data.reduce((sum, item) => sum + item.count, 0);
      return bTotal - aTotal;
    });

    return { paths };
  } catch (error) {
    console.error("Error fetching paths data:", error);
    return { paths: [] };
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

export async function getRepoReleases(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<RepoReleaseData> {
  try {
    const { data } = await octokit.rest.repos.listReleases({
      owner,
      repo,
      per_page: 100,
    });

    const releases = data.map(release => {
      const downloadCount = release.assets.reduce((sum, asset) => sum + asset.download_count, 0);
      return {
        tagName: release.tag_name,
        name: release.name || release.tag_name,
        publishedAt: release.published_at || release.created_at,
        downloadCount,
      };
    });

    const totalDownloads = releases.reduce((sum, release) => sum + release.downloadCount, 0);

    return {
      totalDownloads,
      releases,
    };
  } catch (error) {
    console.error("Error fetching releases data:", error);
    return {
      totalDownloads: 0,
      releases: [],
    };
  }
}

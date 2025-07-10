import { Octokit } from "octokit";
import { createClient } from "@/utils/supabase/server";

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
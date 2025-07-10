import { Octokit } from "octokit";
import { createClient } from "@/utils/supabase/server";

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
import { Octokit } from "octokit";
import { createClient } from "@/utils/supabase/server";

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
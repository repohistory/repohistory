import { Octokit } from "octokit";
import { createClient } from "@/utils/supabase/server";

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
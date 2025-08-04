import { Octokit } from "octokit";
import { Repo } from "@/types";
import { getRepoViews } from "./views";
import { createClient } from "@/utils/supabase/server";

export async function getOwnerViews(
  octokit: Octokit,
  supabase: Awaited<ReturnType<typeof createClient>>,
  repos: Repo[]
): Promise<{ count: number; uniques: number; views: Array<{ timestamp: string; count: number; uniques: number }> }> {
  const repoViewsPromises = repos.map(repo => 
    getRepoViews(octokit, supabase, repo.full_name, repo.id)
  );

  const allRepoViews = await Promise.all(repoViewsPromises);
  
  const totalCount = allRepoViews.reduce((sum, repoViews) => sum + repoViews.count, 0);
  const totalUniques = allRepoViews.reduce((sum, repoViews) => sum + repoViews.uniques, 0);
  
  const aggregatedViews = aggregateViewsHistory(allRepoViews);

  return {
    count: totalCount,
    uniques: totalUniques,
    views: aggregatedViews
  };
}

function aggregateViewsHistory(
  allRepoViews: Array<{ count: number; uniques: number; views: Array<{ timestamp: string; count: number; uniques: number }> }>
): Array<{ timestamp: string; count: number; uniques: number }> {
  const dateMap = new Map<string, { count: number; uniques: number }>();

  allRepoViews.forEach(repoViews => {
    repoViews.views.forEach(({ timestamp, count, uniques }) => {
      const existing = dateMap.get(timestamp);
      if (existing) {
        dateMap.set(timestamp, {
          count: existing.count + count,
          uniques: existing.uniques + uniques
        });
      } else {
        dateMap.set(timestamp, { count, uniques });
      }
    });
  });

  const sortedEntries = Array.from(dateMap.entries()).sort((a, b) => 
    a[0].localeCompare(b[0])
  );

  return sortedEntries.map(([timestamp, { count, uniques }]) => ({
    timestamp,
    count,
    uniques
  }));
}
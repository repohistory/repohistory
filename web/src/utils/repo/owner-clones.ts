import { Octokit } from "octokit";
import { Repo } from "@/types";
import { getRepoClones } from "./clones";
import { createClient } from "@/utils/supabase/server";

export async function getOwnerClones(
  octokit: Octokit,
  supabase: Awaited<ReturnType<typeof createClient>>,
  repos: Repo[]
): Promise<{ count: number; uniques: number; clones: Array<{ timestamp: string; count: number; uniques: number }> }> {
  const repoClonesPromises = repos.map(repo => 
    getRepoClones(octokit, supabase, repo.full_name, repo.id)
  );

  const allRepoClones = await Promise.all(repoClonesPromises);
  
  const totalCount = allRepoClones.reduce((sum, repoClones) => sum + repoClones.count, 0);
  const totalUniques = allRepoClones.reduce((sum, repoClones) => sum + repoClones.uniques, 0);
  
  const aggregatedClones = aggregateClonesHistory(allRepoClones);

  return {
    count: totalCount,
    uniques: totalUniques,
    clones: aggregatedClones
  };
}

function aggregateClonesHistory(
  allRepoClones: Array<{ count: number; uniques: number; clones: Array<{ timestamp: string; count: number; uniques: number }> }>
): Array<{ timestamp: string; count: number; uniques: number }> {
  const dateMap = new Map<string, { count: number; uniques: number }>();

  allRepoClones.forEach(repoClones => {
    repoClones.clones.forEach(({ timestamp, count, uniques }) => {
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
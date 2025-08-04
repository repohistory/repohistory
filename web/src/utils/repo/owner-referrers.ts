import { Octokit } from "octokit";
import { Repo } from "@/types";
import { getRepoReferrers } from "./referrers";
import { createClient } from "@/utils/supabase/server";

export async function getOwnerReferrers(
  octokit: Octokit,
  supabase: Awaited<ReturnType<typeof createClient>>,
  repos: Repo[]
): Promise<{ referrers: Array<{ referrer: string; data: Array<{ timestamp: string; count: number; uniques: number }> }> }> {
  const repoReferrersPromises = repos.map(repo => 
    getRepoReferrers(octokit, supabase, repo.full_name, repo.id)
  );

  const allRepoReferrers = await Promise.all(repoReferrersPromises);
  
  const aggregatedReferrers = aggregateReferrersHistory(allRepoReferrers);

  return {
    referrers: aggregatedReferrers
  };
}

function aggregateReferrersHistory(
  allRepoReferrers: Array<{ referrers: Array<{ referrer: string; data: Array<{ timestamp: string; count: number; uniques: number }> }> }>
): Array<{ referrer: string; data: Array<{ timestamp: string; count: number; uniques: number }> }> {
  const referrerMap = new Map<string, Map<string, { count: number; uniques: number }>>();

  // Aggregate data from all repos
  allRepoReferrers.forEach(repoReferrers => {
    repoReferrers.referrers.forEach(({ referrer, data }) => {
      if (!referrerMap.has(referrer)) {
        referrerMap.set(referrer, new Map());
      }
      
      const referrerDateMap = referrerMap.get(referrer)!;
      
      data.forEach(({ timestamp, count, uniques }) => {
        const existing = referrerDateMap.get(timestamp);
        if (existing) {
          referrerDateMap.set(timestamp, {
            count: existing.count + count,
            uniques: existing.uniques + uniques
          });
        } else {
          referrerDateMap.set(timestamp, { count, uniques });
        }
      });
    });
  });

  // Convert back to array format
  const referrers = Array.from(referrerMap.entries()).map(([referrer, dataMap]) => {
    const sortedEntries = Array.from(dataMap.entries()).sort((a, b) => 
      a[0].localeCompare(b[0])
    );

    const data = sortedEntries.map(([timestamp, { count, uniques }]) => ({
      timestamp,
      count,
      uniques
    }));

    return { referrer, data };
  });

  // Sort by total traffic (descending) and take top 10
  referrers.sort((a, b) => {
    const aTotal = a.data.reduce((sum, item) => sum + item.count, 0);
    const bTotal = b.data.reduce((sum, item) => sum + item.count, 0);
    return bTotal - aTotal;
  });

  return referrers.slice(0, 10);
}
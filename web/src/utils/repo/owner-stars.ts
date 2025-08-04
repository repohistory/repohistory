import { Octokit } from "octokit";
import { Repo } from "@/types";
import { getRepoStars, RepoStarsData } from "./stars";

export async function getOwnerStars(
  octokit: Octokit,
  repos: Repo[]
): Promise<RepoStarsData> {
  const repoStarsPromises = repos.map(repo => 
    getRepoStars(octokit, {
      fullName: repo.full_name,
      stargazersCount: repo.stargazers_count
    })
  );

  const allRepoStars = await Promise.all(repoStarsPromises);
  
  const totalStars = allRepoStars.reduce((sum, repoStars) => sum + repoStars.totalStars, 0);
  
  const aggregatedHistory = aggregateStarsHistory(allRepoStars);

  return {
    totalStars,
    starsHistory: aggregatedHistory
  };
}

function aggregateStarsHistory(allRepoStars: RepoStarsData[]): Array<{
  date: string;
  cumulative: number;
  daily: number;
}> {
  const dateMap = new Map<string, { cumulative: number; daily: number }>();

  allRepoStars.forEach(repoStars => {
    repoStars.starsHistory.forEach(({ date, cumulative, daily }) => {
      const existing = dateMap.get(date);
      if (existing) {
        dateMap.set(date, {
          cumulative: existing.cumulative + cumulative,
          daily: existing.daily + daily
        });
      } else {
        dateMap.set(date, { cumulative, daily });
      }
    });
  });

  const sortedEntries = Array.from(dateMap.entries()).sort((a, b) => 
    new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  let runningCumulative = 0;
  return sortedEntries.map(([date, { daily }]) => {
    runningCumulative += daily;
    return {
      date,
      daily,
      cumulative: runningCumulative
    };
  });
}
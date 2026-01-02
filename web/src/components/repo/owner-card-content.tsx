import { Repo } from "@/types";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import { calculateTrendPercentage } from "@/utils/chart-trends";
import { RepoPreviewChart } from "./repo-preview-chart";
import { TrendIndicator } from "@/components/charts/trend-indicator";
import { Octokit } from "octokit";

interface ViewData {
  date: string;
  total: number;
  [key: string]: string | number;
}

async function fetchRepoViews(repo: Repo, octokit: Octokit) {
  const [owner, repoName] = repo.full_name.split("/");

  let githubViews;
  try {
    githubViews = await octokit.rest.repos.getViews({ owner, repo: repoName });
  } catch (error) {
    console.error(error)
    return [];
  }

  const viewsData = githubViews.data.views?.map(item => ({
    date: item.timestamp.split('T')[0],
    total: item.count
  })) || [];

  const today = new Date();
  const complete14Days = [];

  for (let i = 14; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const existingData = viewsData.find(item => item.date === dateStr);
    complete14Days.push({
      date: dateStr,
      total: existingData ? existingData.total : 0
    });
  }

  return complete14Days;
}

function aggregateViewData(allRepoViews: ViewData[][]): ViewData[] {
  if (allRepoViews.length === 0) return [];

  const aggregated: ViewData[] = [];
  const dateCount = allRepoViews[0].length;

  for (let i = 0; i < dateCount; i++) {
    const date = allRepoViews[0][i].date;
    const totalViews = allRepoViews.reduce((sum, repoViews) => {
      return sum + (repoViews[i]?.total || 0);
    }, 0);

    aggregated.push({
      date,
      total: totalViews
    });
  }

  return aggregated;
}

export async function OwnerCardContent({ repos }: {
  repos: Repo[];
}) {
  const octokit = await getUserOctokit();
  const allRepoViews = await Promise.all(
    repos.map(repo => fetchRepoViews(repo, octokit))
  );

  const aggregatedViews = aggregateViewData(allRepoViews);

  if (aggregatedViews.length === 0) {
    return null;
  }

  const last7Days = aggregatedViews.slice(-7);
  const previous7Days = aggregatedViews.slice(0, 7);

  const totalViews = last7Days.reduce((sum, item) => sum + item.total, 0);
  const trend = calculateTrendPercentage(last7Days, previous7Days, "total");

  return (
    <>
      <div className="h-24 w-full pointer-events-none">
        <RepoPreviewChart data={last7Days} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          <strong>{totalViews}</strong> views in last 7d
        </span>
        <TrendIndicator trend={trend} />
      </div>
    </>
  );
}

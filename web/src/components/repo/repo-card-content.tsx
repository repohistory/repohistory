import { Repo } from "@/types";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import { calculateTrendPercentage } from "@/utils/chart-trends";
import { RepoPreviewChart } from "./repo-preview-chart";
import { TrendIndicator } from "@/components/charts/trend-indicator";

export async function RepoCardContent({ repo }: {
  repo: Repo;
}) {
  try {
    const octokit = await getUserOctokit();
    const [owner, repoName] = repo.full_name.split("/");

    const githubViews = await octokit.rest.repos.getViews({ owner, repo: repoName });

    const viewsData = githubViews.data.views?.map(item => ({
      date: item.timestamp.split('T')[0],
      total: item.count
    })) || [];

    // Create complete 14-day dataset with missing dates filled as 0
    const today = new Date();
    const complete14Days = [];

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const existingData = viewsData.find(item => item.date === dateStr);
      complete14Days.push({
        date: dateStr,
        total: existingData ? existingData.total : 0
      });
    }

    const last7Days = complete14Days.slice(-7);
    const previous7Days = complete14Days.slice(0, 7);

    const totalViews = last7Days.reduce((sum, item) => sum + item.total, 0);

    const trend = calculateTrendPercentage(last7Days, previous7Days, "total");

    return (
      <>
        <div className="h-16 w-full pointer-events-none">
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
  } catch (error) {
    console.error('Error fetching views:', error);
    return null;
  }
}

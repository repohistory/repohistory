import { createClient } from "@/utils/supabase/server";
import { Octokit } from "octokit";
import { getRepoOverview, getRepoTraffic, getRepoStars } from "@/utils/repoData";
import { RepoOverview } from "./RepoOverview";
import { StarsChart } from "./StarsChart";
import { TrafficCharts } from "./TrafficCharts";
import { PopularCharts } from "./PopularCharts";

interface RepoAnalyticsProps {
  fullName: string;
}

export async function RepoAnalytics({ fullName }: RepoAnalyticsProps) {
  const [owner, repo] = fullName.split("/");
  
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const octokit = new Octokit({
    auth: session?.provider_token
  });

  const [overview, traffic, stars] = await Promise.all([
    getRepoOverview(octokit, owner, repo),
    getRepoTraffic(octokit, supabase, fullName),
    getRepoStars(octokit, owner, repo),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{fullName}</h1>
        {overview.description && (
          <p className="text-muted-foreground">{overview.description}</p>
        )}
      </div>

      <RepoOverview overview={overview} traffic={traffic} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StarsChart starsData={stars} />
        <TrafficCharts traffic={traffic} />
      </div>

      <PopularCharts traffic={traffic} />
    </div>
  );
}
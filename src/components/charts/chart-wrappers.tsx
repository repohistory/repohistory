import { StarsChart } from "./stars-chart";
import { ViewChart } from "./view-chart";
import { CloneChart } from "./clone-chart";
import { PopularCharts } from "./popular-charts";
import { getRepoStars, getRepoTraffic } from "@/utils/repoData";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import { createClient } from "@/utils/supabase/server";

interface StarsChartWrapperProps {
  fullName: string;
  stargazersCount: number;
}

export async function StarsChartWrapper({ fullName, stargazersCount }: StarsChartWrapperProps) {
  const octokit = await getUserOctokit();
  const stars = await getRepoStars(octokit, {
    fullName,
    stargazersCount
  });
  return <StarsChart starsData={stars} />;
}

interface ViewChartWrapperProps {
  fullName: string;
}

export async function ViewChartWrapper({ fullName }: ViewChartWrapperProps) {
  const octokit = await getUserOctokit();
  const traffic = await getRepoTraffic(octokit, await createClient(), fullName);
  return <ViewChart traffic={traffic} />;
}

interface CloneChartWrapperProps {
  fullName: string;
}

export async function CloneChartWrapper({ fullName }: CloneChartWrapperProps) {
  const octokit = await getUserOctokit();
  const traffic = await getRepoTraffic(octokit, await createClient(), fullName);
  return <CloneChart traffic={traffic} />;
}

interface PopularChartsWrapperProps {
  fullName: string;
}

export async function PopularChartsWrapper({ fullName }: PopularChartsWrapperProps) {
  const octokit = await getUserOctokit();
  const traffic = await getRepoTraffic(octokit, await createClient(), fullName);
  return <PopularCharts traffic={traffic} />;
}

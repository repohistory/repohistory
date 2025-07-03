import { StarsChart } from "./stars-chart";
import { ViewChart } from "./view-chart";
import { CloneChart } from "./clone-chart";
import { ReferrersChart } from "./referrers-chart";
import { PopularContentChart } from "./popular-content-chart";
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

interface ReferrersChartWrapperProps {
  fullName: string;
}

export async function ReferrersChartWrapper({ fullName }: ReferrersChartWrapperProps) {
  const octokit = await getUserOctokit();
  const traffic = await getRepoTraffic(octokit, await createClient(), fullName);
  return <ReferrersChart traffic={traffic} />;
}

interface PopularContentChartWrapperProps {
  fullName: string;
}

export async function PopularContentChartWrapper({ fullName }: PopularContentChartWrapperProps) {
  const octokit = await getUserOctokit();
  const traffic = await getRepoTraffic(octokit, await createClient(), fullName);
  return <PopularContentChart traffic={traffic} />;
}

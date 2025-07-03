import { StarsChart } from "./stars-chart";
import { ViewChart } from "./view-chart";
import { CloneChart } from "./clone-chart";
import { ReferrersChart } from "./referrers-chart";
import { PopularContentChart } from "./popular-content-chart";
import { getRepoStars, getRepoViews, getRepoClones, getTopReferrers, getTopPaths } from "@/utils/repo";
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
  const views = await getRepoViews(octokit, await createClient(), fullName);
  return <ViewChart traffic={{ views }} />;
}

interface CloneChartWrapperProps {
  fullName: string;
}

export async function CloneChartWrapper({ fullName }: CloneChartWrapperProps) {
  const octokit = await getUserOctokit();
  const clones = await getRepoClones(octokit, await createClient(), fullName);
  return <CloneChart traffic={{ clones }} />;
}

interface ReferrersChartWrapperProps {
  fullName: string;
}

export async function ReferrersChartWrapper({ fullName }: ReferrersChartWrapperProps) {
  const octokit = await getUserOctokit();
  const referrers = await getTopReferrers(octokit, fullName);
  return <ReferrersChart traffic={{ referrers }} />;
}

interface PopularContentChartWrapperProps {
  fullName: string;
}

export async function PopularContentChartWrapper({ fullName }: PopularContentChartWrapperProps) {
  const octokit = await getUserOctokit();
  const paths = await getTopPaths(octokit, fullName);
  return <PopularContentChart traffic={{ paths }} />;
}

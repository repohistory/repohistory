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
  return <StarsChart starsData={stars} repositoryName={fullName} />;
}

interface ViewChartWrapperProps {
  fullName: string;
  repoId: number;
}

export async function ViewChartWrapper({ fullName, repoId }: ViewChartWrapperProps) {
  const octokit = await getUserOctokit();
  const views = await getRepoViews(octokit, await createClient(), fullName, repoId);
  return <ViewChart traffic={{ views }} repositoryName={fullName} />;
}

interface CloneChartWrapperProps {
  fullName: string;
  repoId: number;
}

export async function CloneChartWrapper({ fullName, repoId }: CloneChartWrapperProps) {
  const octokit = await getUserOctokit();
  const clones = await getRepoClones(octokit, await createClient(), fullName, repoId);
  return <CloneChart traffic={{ clones }} repositoryName={fullName} />;
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

import { StarsChart } from "./stars-chart";
import { ViewChart } from "./view-chart";
import { CloneChart } from "./clone-chart";
import { ReferrersChart } from "./referrers-chart";
import { PopularContentChart } from "./popular-content-chart";
import { ReleaseChart } from "./release-chart";
import { getRepoStars, getRepoViews, getRepoClones, getRepoReferrers, getRepoPaths, getRepoReleases } from "@/utils/repo";
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
  return <StarsChart starsData={stars} fullName={fullName} />;
}

interface ViewChartWrapperProps {
  fullName: string;
  repoId: number;
}

export async function ViewChartWrapper({ fullName, repoId }: ViewChartWrapperProps) {
  const octokit = await getUserOctokit();
  const views = await getRepoViews(octokit, await createClient(), fullName, repoId);
  return <ViewChart traffic={{ views }} />;
}

interface CloneChartWrapperProps {
  fullName: string;
  repoId: number;
}

export async function CloneChartWrapper({ fullName, repoId }: CloneChartWrapperProps) {
  const octokit = await getUserOctokit();
  const clones = await getRepoClones(octokit, await createClient(), fullName, repoId);
  return <CloneChart traffic={{ clones }} />;
}

interface ReferrersChartWrapperProps {
  fullName: string;
  repoId: number;
}

export async function ReferrersChartWrapper({ fullName, repoId }: ReferrersChartWrapperProps) {
  const octokit = await getUserOctokit();
  const supabase = await createClient();
  const { referrers } = await getRepoReferrers(octokit, supabase, fullName, repoId);
  return <ReferrersChart traffic={{ referrers }} />;
}

interface PopularContentChartWrapperProps {
  fullName: string;
  repoId: number;
}

export async function PopularContentChartWrapper({ fullName, repoId }: PopularContentChartWrapperProps) {
  const octokit = await getUserOctokit();
  const supabase = await createClient();
  const { paths } = await getRepoPaths(octokit, supabase, fullName, repoId);
  return <PopularContentChart traffic={{ paths }} />;
}

interface ReleaseChartWrapperProps {
  fullName: string;
}

export async function ReleaseChartWrapper({ fullName }: ReleaseChartWrapperProps) {
  const octokit = await getUserOctokit();
  const [owner, repo] = fullName.split("/");
  const releases = await getRepoReleases(octokit, owner, repo);
  return <ReleaseChart releasesData={releases} />;
}

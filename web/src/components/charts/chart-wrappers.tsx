import { StarsChart } from "./stars-chart";
import { ViewChart } from "./view-chart";
import { CloneChart } from "./clone-chart";
import { ReferrersChart } from "./referrers-chart";
import { PopularContentChart } from "./popular-content-chart";
import { ReleaseChart } from "./release-chart";
import { getRepoStars } from "@/utils/repo/stars";
import { getRepoViews } from "@/utils/repo/views";
import { getRepoClones } from "@/utils/repo/clones";
import { getRepoReferrers } from "@/utils/repo/referrers";
import { getRepoPaths } from "@/utils/repo/paths";
import { getRepoReleases } from "@/utils/repo/releases";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import type { SupabaseClient } from "@supabase/supabase-js";

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
  repoId: number;
  supabase: SupabaseClient;
}

export async function ViewChartWrapper({ fullName, repoId, supabase }: ViewChartWrapperProps) {
  const octokit = await getUserOctokit();
  const views = await getRepoViews(octokit, supabase, fullName, repoId);
  return <ViewChart traffic={{ views }} />;
}

interface CloneChartWrapperProps {
  fullName: string;
  repoId: number;
  supabase: SupabaseClient;
}

export async function CloneChartWrapper({ fullName, repoId, supabase }: CloneChartWrapperProps) {
  const octokit = await getUserOctokit();
  const clones = await getRepoClones(octokit, supabase, fullName, repoId);
  return <CloneChart traffic={{ clones }} />;
}

interface ReferrersChartWrapperProps {
  fullName: string;
  repoId: number;
  supabase: SupabaseClient;
}

export async function ReferrersChartWrapper({ fullName, repoId, supabase }: ReferrersChartWrapperProps) {
  const octokit = await getUserOctokit();
  const { referrers } = await getRepoReferrers(octokit, supabase, fullName, repoId);
  return <ReferrersChart traffic={{ referrers }} />;
}

interface PopularContentChartWrapperProps {
  fullName: string;
  repoId: number;
  supabase: SupabaseClient;
}

export async function PopularContentChartWrapper({ fullName, repoId, supabase }: PopularContentChartWrapperProps) {
  const octokit = await getUserOctokit();
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

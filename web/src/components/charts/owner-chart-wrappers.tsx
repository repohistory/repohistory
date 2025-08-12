import { StarsChart } from "./stars-chart";
import { ViewChart } from "./view-chart";
import { CloneChart } from "./clone-chart";
import { ReferrersChart } from "./referrers-chart";
import { PopularContentChart } from "./popular-content-chart";
import { getOwnerStars } from "@/utils/repo/owner-stars";
import { getOwnerViews } from "@/utils/repo/owner-views";
import { getOwnerClones } from "@/utils/repo/owner-clones";
import { getOwnerReferrers } from "@/utils/repo/owner-referrers";
import { getOwnerPaths } from "@/utils/repo/owner-paths";
import { getUserOctokit } from "@/utils/octokit/get-user-octokit";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Repo } from "@/types";

interface OwnerStarsChartWrapperProps {
  owner: string;
  repos: Repo[];
}

export async function OwnerStarsChartWrapper({ repos }: OwnerStarsChartWrapperProps) {
  const octokit = await getUserOctokit();
  const stars = await getOwnerStars(octokit, repos);
  return <StarsChart starsData={stars} />;
}

interface OwnerViewChartWrapperProps {
  owner: string;
  repos: Repo[];
  supabase: SupabaseClient;
}

export async function OwnerViewChartWrapper({ repos, supabase }: OwnerViewChartWrapperProps) {
  const octokit = await getUserOctokit();
  const views = await getOwnerViews(octokit, supabase, repos);
  return <ViewChart traffic={{ views }} />;
}

interface OwnerCloneChartWrapperProps {
  owner: string;
  repos: Repo[];
  supabase: SupabaseClient;
}

export async function OwnerCloneChartWrapper({ repos, supabase }: OwnerCloneChartWrapperProps) {
  const octokit = await getUserOctokit();
  const clones = await getOwnerClones(octokit, supabase, repos);
  return <CloneChart traffic={{ clones }} />;
}

interface OwnerReferrersChartWrapperProps {
  owner: string;
  repos: Repo[];
  supabase: SupabaseClient;
}

export async function OwnerReferrersChartWrapper({ repos, supabase }: OwnerReferrersChartWrapperProps) {
  const octokit = await getUserOctokit();
  const { referrers } = await getOwnerReferrers(octokit, supabase, repos);
  return <ReferrersChart traffic={{ referrers }} />;
}

interface OwnerPopularContentChartWrapperProps {
  owner: string;
  repos: Repo[];
  supabase: SupabaseClient;
}

export async function OwnerPopularContentChartWrapper({ repos, supabase }: OwnerPopularContentChartWrapperProps) {
  const octokit = await getUserOctokit();
  const { paths } = await getOwnerPaths(octokit, supabase, repos);
  return <PopularContentChart traffic={{ paths }} />;
}
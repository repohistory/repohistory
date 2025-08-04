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
import { createClient } from "@/utils/supabase/server";
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
}

export async function OwnerViewChartWrapper({ repos }: OwnerViewChartWrapperProps) {
  const octokit = await getUserOctokit();
  const supabase = await createClient();
  const views = await getOwnerViews(octokit, supabase, repos);
  return <ViewChart traffic={{ views }} />;
}

interface OwnerCloneChartWrapperProps {
  owner: string;
  repos: Repo[];
}

export async function OwnerCloneChartWrapper({ repos }: OwnerCloneChartWrapperProps) {
  const octokit = await getUserOctokit();
  const supabase = await createClient();
  const clones = await getOwnerClones(octokit, supabase, repos);
  return <CloneChart traffic={{ clones }} />;
}

interface OwnerReferrersChartWrapperProps {
  owner: string;
  repos: Repo[];
}

export async function OwnerReferrersChartWrapper({ repos }: OwnerReferrersChartWrapperProps) {
  const octokit = await getUserOctokit();
  const supabase = await createClient();
  const { referrers } = await getOwnerReferrers(octokit, supabase, repos);
  return <ReferrersChart traffic={{ referrers }} />;
}

interface OwnerPopularContentChartWrapperProps {
  owner: string;
  repos: Repo[];
}

export async function OwnerPopularContentChartWrapper({ repos }: OwnerPopularContentChartWrapperProps) {
  const octokit = await getUserOctokit();
  const supabase = await createClient();
  const { paths } = await getOwnerPaths(octokit, supabase, repos);
  return <PopularContentChart traffic={{ paths }} />;
}
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Octokit } from "octokit";
import { StarsChart } from "@/components/StarsChart";
import { ViewChart } from "@/components/ViewChart";
import { CloneChart } from "@/components/CloneChart";
import { PopularCharts } from "@/components/PopularCharts";
import { getRepoOverview, getRepoTraffic, getRepoStars } from "@/utils/repoData";
import { getValidProviderToken } from "@/utils/auth/refresh-token";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";

interface PageProps {
  params: Promise<{
    fullName: string[];
  }>;
}

export default async function RepoPage({ params }: PageProps) {
  const resolvedParams = await params;

  if (!resolvedParams.fullName || resolvedParams.fullName.length !== 2) {
    redirect("/");
  }

  const fullName = `${resolvedParams.fullName[0]}/${resolvedParams.fullName[1]}`;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  const providerToken = await getValidProviderToken();

  const octokit = new Octokit({
    auth: providerToken
  });

  const [owner, repo] = fullName.split("/");
  const overview = await getRepoOverview(octokit, owner, repo);;

  function RepoOverviewHeader() {
    return (
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{fullName}</h1>
        {overview.description && (
          <p className="text-muted-foreground">{overview.description}</p>
        )}
      </div>
    );
  }

  async function StarsChartWrapper() {
    const stars = await getRepoStars(octokit, {
      fullName: overview.fullName,
      stargazersCount: overview.stars
    });
    return <StarsChart starsData={stars} />;
  }

  async function ViewChartWrapper() {
    const traffic = await getRepoTraffic(octokit, await createClient(), fullName);
    return <ViewChart traffic={traffic} />;
  }

  async function CloneChartWrapper() {
    const traffic = await getRepoTraffic(octokit, await createClient(), fullName);
    return <CloneChart traffic={traffic} />;
  }

  async function PopularChartsWrapper() {
    const traffic = await getRepoTraffic(octokit, await createClient(), fullName);
    return <PopularCharts traffic={traffic} />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-6">
        <RepoOverviewHeader />
      </div>
      <Suspense fallback={
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
            <div className="flex flex-1 flex-col justify-center gap-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      }>
        <StarsChartWrapper />
      </Suspense>
      <Suspense fallback={
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
            <div className="flex flex-1 flex-col justify-center gap-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-52" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      }>
        <ViewChartWrapper />
      </Suspense>
      <Suspense fallback={
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
            <div className="flex flex-1 flex-col justify-center gap-1">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-3 w-22" />
              <Skeleton className="h-8 w-18" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      }>
        <CloneChartWrapper />
      </Suspense>
      <Card>
        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Top Referrers
                </CardTitle>
                <CardDescription>Sources driving traffic to your repository</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </div>
            <div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Popular Content
                </CardTitle>
                <CardDescription>Most visited pages in your repository</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </div>
          </div>
        }>
          <PopularChartsWrapper />
        </Suspense>
      </Card>
    </div>
  );
}

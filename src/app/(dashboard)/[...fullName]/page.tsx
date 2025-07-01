import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Octokit } from "octokit";
import { StarsChart } from "@/components/StarsChart";
import { ViewChart } from "@/components/ViewChart";
import { CloneChart } from "@/components/CloneChart";
import { PopularCharts } from "@/components/PopularCharts";
import { getRepoOverview, getRepoTraffic, getRepoStars } from "@/utils/repoData";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Star, GitFork, AlertCircle, Eye, Download } from "lucide-react";

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

  const cookieStore = await cookies();
  const providerToken = cookieStore.get('provider_token')?.value;

  if (!providerToken) {
    redirect("/signin");
  }

  const octokit = new Octokit({
    auth: providerToken
  });

  // Check if repository exists and user has access
  try {
    await octokit.rest.repos.get({
      owner: resolvedParams.fullName[0],
      repo: resolvedParams.fullName[1],
    });
  } catch (error) {
    console.error("Repository not found or no access:", error);
    redirect("/");
  }

  async function RepoDescriptionWrapper() {
    const [owner, repo] = fullName.split("/");
    const overview = await getRepoOverview(octokit, owner, repo);
    
    return overview.description ? (
      <p className="text-muted-foreground">{overview.description}</p>
    ) : null;
  }

  async function RepoStatWrapper({ index }: { index: number }) {
    const [owner, repo] = fullName.split("/");
    const overview = await getRepoOverview(octokit, owner, repo);
    const traffic = await getRepoTraffic(octokit, await createClient(), fullName);
    
    const stats = [
      overview.stars.toLocaleString(),
      overview.forks.toLocaleString(),
      overview.issues.toLocaleString(),
      traffic.views.count.toLocaleString(),
      traffic.clones.count.toLocaleString(),
    ];

    return <div className="text-2xl font-bold">{stats[index]}</div>;
  }

  async function StarsChartWrapper() {
    const [owner, repo] = fullName.split("/");
    const stars = await getRepoStars(octokit, owner, repo);
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

  const statsConfig = [
    { title: "Stars", icon: Star },
    { title: "Forks", icon: GitFork },
    { title: "Issues", icon: AlertCircle },
    { title: "Views", icon: Eye },
    { title: "Clones", icon: Download },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{fullName}</h1>
          <Suspense fallback={<Skeleton className="h-4 w-2/3" />}>
            <RepoDescriptionWrapper />
          </Suspense>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<Skeleton className="h-8 w-16" />}>
                    <RepoStatWrapper index={index} />
                  </Suspense>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <Suspense fallback={
          <>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stars Over Time</CardTitle>
                <CardDescription>
                  Repository star growth
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Cumulative
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Daily
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </>
        }>
          <StarsChartWrapper />
        </Suspense>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repository Views</CardTitle>
          <CardDescription>
            Daily views and unique visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <ViewChartWrapper />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repository Clones</CardTitle>
          <CardDescription>
            Daily clones and unique cloners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <CloneChartWrapper />
          </Suspense>
        </CardContent>
      </Card>

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

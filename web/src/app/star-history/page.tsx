import { StarHistoryForm } from "./components/star-history-form";
import { StarHistoryGenerator } from "./components/star-history-generator";
import { BackgroundCharts } from "./components/background-charts";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    owner?: string;
    repo?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'GitHub Repo Star History Chart Generator | Repohistory',
  description: 'Generate customizable star history charts for your GitHub repositories. Input the owner and repository name to visualize star growth over time. Perfect for showcasing project popularity in your README.',
}

export default async function StarHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const owner = params.owner || "";
  const repo = params.repo || "";
  const fullName = owner && repo ? `${owner}/${repo}` : "";

  if (!fullName) {
    return (
      <div className="relative h-dvh px-2 z-10 flex flex-col space-y-8 justify-center items-center">
        <BackgroundCharts />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">Star History Chart Generator</h1>
          <p className="text-muted-foreground">
            Create customizable star history charts for your GitHub repo
          </p>
        </div>
        <StarHistoryForm initialOwner={owner} initialRepo={repo} />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-dvh py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Want to see more detail chart? <a
              href="https://repohistory.com"
              className="underline hover:text-white transition-colors"
            >
              Try Repohistory
            </a>
          </p>
        </div>
        <StarHistoryGenerator
          initialOwner={owner}
          initialRepo={repo}
          fullName={fullName}
        />
      </div>
    </div>
  );
}

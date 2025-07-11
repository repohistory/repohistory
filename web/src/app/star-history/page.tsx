import { StarHistoryForm } from "./components/star-history-form";
import { StarHistoryChart } from "./components/star-history-chart";

interface PageProps {
  searchParams: Promise<{
    owner?: string;
    repo?: string;
  }>;
}

export default async function StarHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const owner = params.owner || "";
  const repo = params.repo || "";
  const fullName = owner && repo ? `${owner}/${repo}` : "";

  if (!fullName) {
    return (
      <div className="flex flex-col space-y-8 h-screen justify-center items-center">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Star History Chart</h1>
          <p className="text-muted-foreground">
            Generate customizable star history charts for your GitHub repo
          </p>
        </div>
        <StarHistoryForm initialOwner={owner} initialRepo={repo} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <StarHistoryChart 
          initialOwner={owner} 
          initialRepo={repo} 
          fullName={fullName} 
        />
      </div>
    </div>
  );
}

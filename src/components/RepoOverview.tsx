import { RepoOverviewData, RepoTrafficData } from "@/utils/repoData";

interface RepoOverviewProps {
  overview: RepoOverviewData;
  traffic: RepoTrafficData;
}

export function RepoOverview({ overview, traffic }: RepoOverviewProps) {
  const stats = [
    overview.stars.toLocaleString(),
    overview.forks.toLocaleString(),
    overview.issues.toLocaleString(),
    traffic.views.count.toLocaleString(),
    traffic.clones.count.toLocaleString(),
  ];

  return (
    <>
      {stats.map((value, index) => (
        <div key={index} className="text-2xl font-bold">{value}</div>
      ))}
    </>
  );
}
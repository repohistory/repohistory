import { Repo } from "@/types";
import { OwnerCard } from "./owner-card";

interface OwnerData {
  owner: string;
  repos: Repo[];
  totalStars: number;
}

interface Props {
  reposByOwner: Record<string, Repo[]>;
}

export function OwnerGrid({ reposByOwner }: Props) {
  const ownerData = Object.entries(reposByOwner).map(([owner, repos]) => ({
    owner,
    repos,
    totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {ownerData
          .sort((a, b) => b.totalStars - a.totalStars)
          .map((ownerData: OwnerData) => (
            <OwnerCard key={ownerData.owner} ownerData={ownerData} />
          ))
        }
      </div>
    </div>
  );
}

import { Repo } from "@/types";
import { RepoCard } from "./repo-card";

interface Props {
  repos: Repo[];
}

export function RepoGrid({ repos }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {repos
        .sort((a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count)
        .map((repo: Repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
    </div>
  );
}

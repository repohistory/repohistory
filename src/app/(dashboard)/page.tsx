import { Suspense } from "react";
import { RepoList } from "@/components/repo/repo-list";
import { RepoCardSkeletonGrid } from "@/components/repo/repo-card-skeleton";

export default function Home() {
  return (
    <Suspense fallback={<RepoCardSkeletonGrid />}>
      <RepoList />
    </Suspense>
  );
}

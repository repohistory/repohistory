import { Suspense } from "react";
import { RepoList } from "@/components/RepoList";
import { RepoCardSkeletonGrid } from "@/components/RepoCardSkeleton";

export default function Home() {
  return (
    <Suspense fallback={<RepoCardSkeletonGrid />}>
      <RepoList />
    </Suspense>
  );
}

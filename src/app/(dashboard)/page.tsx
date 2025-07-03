import { Suspense } from "react";
import { RepoGrid } from "@/components/repo/repo-grid";
import { RepoCardSkeletonGrid } from "@/components/repo/repo-card-skeleton";

export default function Home() {
  return (
    <Suspense fallback={<RepoCardSkeletonGrid />}>
      <RepoGrid />
    </Suspense>
  );
}

'use client';

import {
  Skeleton,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from '@nextui-org/react';
import useRepos from '@/hooks/useRepos';
import Star from '@/components/Icons/Star';
import RepoCard from '@/components/RepoCard';

export default function Dashboard() {
  const repos = useRepos();

  const skeletons = Array.from({ length: 9 }, (_, index) => (
    <Card
      key={index}
      isPressable
      disableRipple
      className="h-56 w-full rounded-md border border-[#202225] bg-[#111111] 
      text-white transition-all duration-400 hover:bg-[#222222]"
    >
      <CardHeader className="flex justify-between text-lg font-semibold">
        <Skeleton className="h-full w-32 rounded-md">path</Skeleton>
        <div className="flex items-center gap-1 text-sm font-normal text-[#ffffffa0]">
          <Star />
          <Skeleton className="rounded-md">000</Skeleton>
        </div>
      </CardHeader>
      <Divider className="bg-[#33373a]" />
      <CardBody>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-[1rem] rounded-md" />
          <Skeleton className="h-[1rem] w-1/2 rounded-md" />
        </div>
      </CardBody>
    </Card>
  ));

  return (
    <div className="mx-auto grid w-3/4 gap-10 py-10 md:grid-cols-2 xl:grid-cols-3">
      {repos === null
        ? skeletons
        : repos.map((repo: any) => (
            <RepoCard path={repo.path} key={repo.path} />
          ))}
    </div>
  );
}

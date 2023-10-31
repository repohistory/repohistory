'use client';

import Link from 'next/link';
import {
  Skeleton,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from '@nextui-org/react';
import useRepos from '@/hooks/useRepos';
import Star from '@/components/Icons/Star';

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
        <Skeleton className="h-full w-32 rounded-md" />
        <div className="flex items-center gap-1 text-sm font-normal text-[#ffffffa0]">
          <Star />
          <Skeleton className="rounded-md">000</Skeleton>
        </div>
      </CardHeader>
      <Divider className="bg-[#33373a]" />
      <CardBody>
        <Skeleton className="h-20 w-full rounded-md" />
      </CardBody>
    </Card>
  ));

  return (
    <div className="mx-auto grid w-3/4 gap-10 py-10 md:grid-cols-2 xl:grid-cols-3">
      {repos === null
        ? skeletons
        : repos.map((repo: any) => (
            <Link href={`/dashboard/${repo.path}`} key={repo.path}>
              <Card
                isPressable
                disableRipple
                className="h-56 w-full rounded-md border border-[#202225] bg-[#111111] 
                  text-white transition-all duration-400 hover:bg-[#222222]"
              >
                <CardHeader className="flex justify-between text-lg font-semibold">
                  {repo.path}
                  <div className="flex items-center gap-1 text-sm font-normal text-[#ffffffa0]">
                    <Star />
                    {/* repo.stargazers_count */}
                  </div>
                </CardHeader>
                <Divider className="bg-[#33373a]" />
                <CardBody>{/* repo.description */}</CardBody>
              </Card>
            </Link>
          ))}
    </div>
  );
}

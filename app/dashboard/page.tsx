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
    <Skeleton
      key={index}
      className="h-56 rounded-md border border-[#ffffff20] bg-[#ffffff] bg-opacity-5"
    />
  ));

  return (
    <div className="mx-auto grid w-3/4 gap-10 py-10 md:grid-cols-2 xl:grid-cols-3">
      {repos === null
        ? skeletons
        : repos.map((repo: any) => (
            <Link href={`/dashboard/${repo.full_name}`} key={repo.id}>
              <Card
                className="h-56 rounded-md border border-[#33373a] bg-[#1e2124] 
                  text-white"
              >
                <CardHeader className="flex justify-between text-lg font-semibold">
                  {repo.name}
                  <div className="flex items-center gap-1 text-sm font-normal text-[#ffffffa0]">
                    <Star />
                    {repo.stargazers_count}
                  </div>
                </CardHeader>
                <Divider className="bg-[#33373a]" />
                <CardBody>{repo.description}</CardBody>
              </Card>
            </Link>
          ))}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import useRepos from '@/hooks/useRepos';
import Star from '@/components/Icons/Star';

export default function HomePage() {
  const repos = useRepos();

  return (
    <div className="mx-auto grid w-3/4 gap-10 py-10 md:grid-cols-2 xl:grid-cols-3">
      {repos.map((repo: any) => (
        <Link href={`${repo.full_name}`} key={repo.id}>
          <Card
            className="h-56 rounded-md border border-[#30363d] bg-[#161b22] text-white
              transition-all duration-1000 ease-linear hover:scale-105"
          >
            <CardHeader className="flex justify-between text-lg font-semibold">
              {repo.name}
              <div className="flex items-center gap-1 text-sm font-normal text-[#7d8590]">
                <Star />
                {repo.stargazers_count}
              </div>
            </CardHeader>
            <Divider className="bg-[#30363d]" />
            <CardBody>{repo.description}</CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}

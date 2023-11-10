import Link from 'next/link';
import Star from '@/components/Icons/Star';
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Skeleton,
} from '@nextui-org/react';

export default function RepoCard({ repo }: { repo: any }) {
  const path = repo.full_name;

  return (
    <Link href={`/dashboard/${path}`}>
      <Card
        isPressable
        disableRipple
        className="h-56 w-full rounded-md border border-[#202225] bg-[#111111]
          text-white transition-all duration-400 hover:bg-[#222222]"
      >
        <CardHeader className="flex justify-between text-lg font-semibold">
          {path}
          <div className="flex items-center gap-1 text-sm font-normal text-[#ffffffa0]">
            <Star />
            {repo?.stargazers_count === undefined ? (
              <Skeleton className="rounded-md">000</Skeleton>
            ) : (
              <div>{repo.stargazers_count}</div>
            )}
          </div>
        </CardHeader>
        <Divider className="bg-[#33373a]" />
        <CardBody>
          {repo?.description === undefined ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-[1rem] rounded-md" />
              <Skeleton className="h-[1rem] w-1/2 rounded-md" />
            </div>
          ) : (
            <div>{repo.description}</div>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}

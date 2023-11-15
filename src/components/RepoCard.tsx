import Link from 'next/link';
import Star from '@/components/Icons/Star';
import { Card, CardHeader, CardBody, Divider } from '@nextui-org/react';

export default function RepoCard({ repo }: { repo: any }) {
  return (
    <Link href={repo.full_name}>
      <Card
        isPressable
        disableRipple
        className="h-56 w-full rounded-md border border-[#202225] bg-[#111111]
          text-white transition-all duration-400 hover:bg-[#222222]"
      >
        <CardHeader className="flex justify-between text-lg font-semibold">
          {repo.full_name}
          <div className="flex items-center gap-1 text-sm font-normal text-[#ffffffa0]">
            <Star />
            {repo.stargazers_count}
          </div>
        </CardHeader>
        <Divider className="bg-[#33373a]" />
        <CardBody>{repo.description}</CardBody>
      </Card>
    </Link>
  );
}

import {
  Skeleton,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from '@nextui-org/react';
import Star from '@/components/Icons/Star';

export default function Skeletons() {
  return Array.from({ length: 9 }, (_, index) => (
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
}

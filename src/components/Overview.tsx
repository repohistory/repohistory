import Fork from '@/components/Icons/Fork';
import Issue from '@/components/Icons/Issue';
import Star from '@/components/Icons/Star';

export default async function Overview({
  repo,
  viewsTotal,
  clonesTotal,
}: {
    repo: any;
  viewsTotal: number;
  clonesTotal: number;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-medium border
        border-[#202225] bg-[#111111] p-5 text-white xl:w-1/3"
    >
      <h1 className="text-3xl font-bold">{repo?.name}</h1>
      <div>{repo?.description}</div>
      <div className="flex gap-5">
        <div className="flex items-center gap-2">
          <Star />
          {repo?.stargazers_count}
        </div>
        <div className="flex items-center gap-2">
          <Fork />
          {repo?.forks_count}
        </div>
        <div className="flex items-center gap-2">
          <Issue />
          {repo?.open_issues_count}
        </div>
      </div>
      <div className="mt-8 flex justify-center gap-10">
        <div>
          <div className="text-center font-semibold ">Total Clones</div>
          <div className="text-center text-4xl font-bold">{clonesTotal}</div>
        </div>
        <div>
          <div className="text-center font-semibold">Total Views</div>
          <div className="text-center text-4xl font-bold">{viewsTotal}</div>
        </div>
      </div>
    </div>
  );
}

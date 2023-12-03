import { Image, Link } from '@nextui-org/react';

export default function Guide({
  repos,
  limit,
}: {
  repos: string[];
  limit: number;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 text-white md:flex-row md:items-start">
      <div className="flex flex-col justify-start gap-3">
        <h1 className="text-2xl font-bold">
          {repos.length === 0
            ? 'No repositories selected'
            : `More than ${limit} repositories selected`}
        </h1>
        <div className="mt-2">
          Visit <Link
            underline="always"
            isExternal
            className="text-sm"
            href="https://github.com/apps/repohistory/installations/new"
          >
            GitHub App page
          </Link> and follow the instructions.
        </div>
        <div className="flex gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
            1
          </div>
          <span>
            Check <b>Only select repositories</b>
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
            2
          </div>
          <span>
            Select <b>at most {limit}</b> repositories you want to track.<br />
            For more repositories, the paid plan is coming soon.
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
            3
          </div>
          <span>
            Click {repos.length === 0 ? 'Install' : 'Save'} and refresh this
            page
          </span>
        </div>
      </div>
      <Image
        src="https://github.com/m4xshen/img-host/assets/74842863/8156efbd-7be0-4432-8f26-8489e0abd782"
        alt="GitHub App installation instruction"
        width={350}
        radius="md"
        className="flex-shrink-0"
      />
    </div>
  );
}

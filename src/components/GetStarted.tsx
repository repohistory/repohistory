import { Link } from '@nextui-org/react';

export default function GetStarted() {
  return (
    <div className="mt-32 flex flex-col items-center text-white">
      <div>
        <h1 className="mb-5 text-4xl font-semibold">Welcome!</h1>
        <div className="rounded-lg border  border-[#202225] bg-[#111111] p-5">
          <h1 className="mb-5 text-lg font-semibold">Getting Started</h1>
          <ol className="ml-5 list-decimal">
            <li>
              Setup <Link
                href="https://github.com/marketplace/actions/github-repo-stats"
                target="_blank"
              >
                github-repo-stats action
              </Link>
            </li>
            <li>
              Install <Link
                href="https://github.com/apps/repohistory/installations/new"
                target="_blank"
              >
                repohistory GitHub App
              </Link>
            </li>
            <li>
              Select &quot;Only select repositories&quot; and choose your data
              repository
            </li>
          </ol>
          <div className="mt-5">
            If you already done all the steps and still see this, wait for a
            minute for it to be updated.
          </div>
        </div>
      </div>
    </div>
  );
}

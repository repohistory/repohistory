import { Marquee } from "@/components/magicui/marquee";
import { Star } from "lucide-react";
import Link from "next/link";
import repos from "@/repos.json";

interface RepoCardProps {
  fullName: string;
  starCount: number;
}

function RepoCard({ fullName, starCount }: RepoCardProps) {
  return (
    <Link
      href={`https://github.com/${fullName}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3 min-w-fit hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 fill-[#E3B342]" style={{ color: '#E3B342' }} />
        <span className="text-sm font-medium">{starCount.toLocaleString()}</span>
      </div>
      <div className="text-sm text-neutral-100">{fullName}</div>
    </Link>
  );
}

export function SocialProof() {
  const firstRow = repos.slice(0, repos.length / 2);
  const secondRow = repos.slice(repos.length / 2);

  return (
    <section className="py-16 px-8 space-y-5 bg-black relative z-0">
      <h2 className="mx-auto text-center text-neutral-300 font-medium">Trusted by open-source maintainers worldwide</h2>
      <div className="relative">
        <Marquee pauseOnHover className="[--duration:30s]">
          {firstRow.map((repo) => (
            <RepoCard key={repo.fullName} fullName={repo.fullName} starCount={repo.starCount} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:30s]">
          {secondRow.map((repo) => (
            <RepoCard key={repo.fullName} fullName={repo.fullName} starCount={repo.starCount} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black"></div>
      </div>
    </section>
  );
}

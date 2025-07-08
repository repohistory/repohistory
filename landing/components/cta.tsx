import Link from "next/link";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";

export function CTA() {
  return (
    <section className="py-24 px-8 relative">
      <DotPattern
        glow
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-semibold">
          Ready to track your repository traffic?
        </h2>
        <p className="text-lg text-neutral-300 font-medium max-w-2xl mx-auto">
          Start monitoring your GitHub repository traffic and get insights that matter.
        </p>
        <Link
          href="https://app.repohistory.com"
          className="bg-white text-black px-4 py-2 hover:brightness-100 brightness-90 active:scale-[0.98] transition-all rounded-lg font-medium inline-block"
          role="button"
        >
          Get started
        </Link>
      </div>
    </section>
  );
}

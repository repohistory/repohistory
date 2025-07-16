import { BlurFade } from "@/components/magicui/blur-fade";
import { ImageTiltWrapper } from "@/components/image-tilt-wrapper";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="flex flex-col overflow-hidden justify-center min-h-screen items-center px-5 sm:px-10 pt-30 relative">
      <div className="z-10 max-w-4xl space-y-6 flex flex-col text-center md:text-start items-center md:items-start">
        <h1 className="pb-1 text-6xl font-medium bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
          GitHub Repo Analytics Platform
        </h1>
        <h2 className="text-lg font-medium text-neutral-300 max-w-lg">
          Track your repository traffic history longer than 14 days with beautiful visualizations
        </h2>
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link
            href="https://app.repohistory.com"
            className="bg-white text-black px-4 py-2 hover:brightness-100 brightness-90 active:scale-[0.98] transition-all rounded-lg font-medium inline-block"
            role="button"
          >
            Start tracking
          </Link>
          <Link
            href="https://github.com/repohistory/repohistory"
            className="text-white px-4 py-2 hover:bg-neutral-900/60 active:scale-[0.98] transition-all rounded-lg font-medium inline-flex items-center gap-1"
            role="button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star on GitHub <ChevronRight className="size-5" />
          </Link>
        </div>
      </div>
      <div className="bg-[#62C3F8] -translate-x-1/2 absolute inset-0 top-2/5 left-1/2 h-1/4 w-3/5 blur-[9rem] opacity-0 animate-[fadeIn_2s_ease-in-out_forwards] md:h-1/3"></div>
      <div className="relative">
        <BlurFade direction="up">
          <ImageTiltWrapper imageIndex={1}>
            <div className="p-1.5 w-[600px] sm:w-[800px] md:w-[1200px] bg-muted/60 border rounded-xl drop-shadow-[-8px_8px_16px_rgba(0,0,0,0.6)]">
              <Image
                src="/screenshot1.jpeg"
                quality={100}
                width={1200}
                height={600}
                priority
                alt="Screenshot of the dashboard"
                className="border rounded-lg"
                style={{
                  backgroundColor: "#0A0A0A",
                }}
              />
            </div>
          </ImageTiltWrapper>
        </BlurFade>
        <BlurFade direction="up" delay={0.4} className="top-0 absolute">
          <ImageTiltWrapper imageIndex={2}>
            <div className="p-1.5 w-[600px] sm:w-[800px] md:w-[1200px] bg-muted/60 border rounded-xl drop-shadow-[-8px_8px_16px_rgba(0,0,0,0.6)]">
              <Image
                src="/screenshot2.jpeg"
                quality={100}
                width={1200}
                height={600}
                priority
                alt="Screenshot of the dashboard"
                className="border rounded-lg"
                style={{
                  backgroundColor: "#0A0A0A",
                }}
              />
            </div>
          </ImageTiltWrapper>
        </BlurFade>
        <BlurFade direction="up" delay={0.8} className="top-0 absolute">
          <ImageTiltWrapper imageIndex={3}>
            <div className="p-1.5 w-[600px] sm:w-[800px] md:w-[1200px] bg-muted/60 border rounded-xl drop-shadow-[-8px_8px_16px_rgba(0,0,0,0.6)]">
              <Image
                src="/screenshot3.jpeg"
                quality={100}
                width={1200}
                height={600}
                priority
                alt="Screenshot of the dashboard"
                className="border rounded-lg"
                style={{
                  backgroundColor: "#0A0A0A",
                }}
              />
            </div>
          </ImageTiltWrapper>
        </BlurFade>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-90% to-black rounded-xl pointer-events-none"></div>
    </section>
  );
}

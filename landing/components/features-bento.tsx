"use client";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Marquee } from "@/components/magicui/marquee";
import { Tree, Folder, File } from "@/components/magicui/file-tree";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import Image from "next/image";
import { useRef } from "react";

function AutoSaveBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const githubRef = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div
        ref={githubRef}
        className="flex items-center justify-center w-16 h-16 bg-neutral-800 rounded-full border border-neutral-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="w-8 h-8 text-white" fill="currentColor">
          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
        </svg>
      </div>

      {/* Database Logo */}
      <div
        ref={supabaseRef}
        className="flex items-center justify-center w-16 h-16 bg-neutral-800 rounded-full border border-neutral-700 ml-32"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-8 h-8 text-white" fill="currentColor">
          <path d="M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z" />
        </svg>
      </div>

      {/* Animated Beam */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={githubRef}
        toRef={supabaseRef}
        curvature={0}
        gradientStartColor="#62C3F8"
        gradientStopColor="#315B73"
        duration={4}
        startXOffset={32}
        endXOffset={-32}
      />
    </div>
  );
}

const chartImages = [
  "/chart1.png",
  "/chart2.png",
  "/chart3.png",
  "/chart4.png",
  "/chart5.png",
  "/chart6.png",
];

const features = [
  {
    name: "Auto-Save Traffic Data",
    description: "Save repository traffic data beyond GitHub's 14-day limit for long-term insights.",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity">
        <AutoSaveBeam />
      </div>
    ),
  },
  {
    name: "Interactive Charts",
    description: "Beautiful interactive charts to explore traffic patterns with customizable time ranges.",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 p-10 flex items-center justify-center overflow-hidden">
        <Image
          src="/interactive-charts.png"
          alt="Interactive charts dashboard"
          width={2376}
          height={538}
          className="opacity-70 group-hover:opacity-100 rounded-md border transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent" />
      </div>
    ),
  },
  {
    name: "Star History Charts",
    description: "Generate customizable star history charts for your repositories that you can easily embed in your README.",
    href: "https://app.repohistory.com/star-history",
    cta: "Generate now",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <Marquee className="[--duration:25s] absolute top-4">
          {chartImages.slice(0, 3).map((chart, idx) => (
            <Image
              key={idx}
              src={chart}
              alt={`Star history chart ${idx + 1}`}
              width={300}
              height={300}
              className="border rounded-lg opacity-70 group-hover:opacity-100 transition-opacity"
            />
          ))}
        </Marquee>
      </div>
    ),
  },
  {
    name: "Export All Data",
    description: "Your data, your control. Export all traffic analytics in CSV whenever you need.",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xs opacity-70 group-hover:opacity-90 transition-opacity">
          <Tree initialExpandedItems={["folder1"]} className="h-60">
            <Folder element="m4xshen-hardtime.nvim-data" value="folder1">
              <File value="file1">views.csv</File>
              <File value="file2">clones.csv</File>
              <File value="file3">referrers.csv</File>
              <File value="file4">popular-content.csv</File>
            </Folder>
          </Tree>
        </div>
      </div>
    ),
  },
];

export function FeaturesBento() {
  return (
    <section className="py-20 px-5 sm:px-10">
      <div className="max-w-6xl mx-auto">
        <BlurFade delay={0.2} inView>
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <h2 className="max-w-2xl text-3xl text-center sm:text-4xl font-semibold bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
              A complete GitHub repo analytics solution with all the features you need
            </h2>
            <div className="text-muted-foreground max-w-xl">
              Repohistory is packed with amazing features that enable you to better understand your repo traffic.
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={0.4} inView>
          <BentoGrid className="max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </BlurFade>
      </div>
    </section>
  );
}

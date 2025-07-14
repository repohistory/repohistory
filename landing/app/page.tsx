import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { FeaturesBento } from "@/components/features-bento";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <SocialProof />
      <FeaturesBento />
      <CTA />
    </div>
  );
}

import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <SocialProof />
      <CTA />
      <Footer />
    </div>
  );
}

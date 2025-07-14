import { PricingCard } from "@/components/pricing-card";
import { ProCard } from "./pro-card";

export const metadata = {
  title: "Pricing | Repohistory"
};

export default function PricingPage() {
  const freeFeatures = [
    { text: "Track 1 repository" },
    { text: "Traffic history beyond 14 days" },
    { text: "Advanced analytics & insights" },
    { text: "Data export capabilities" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-6xl font-medium pb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Pricing
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Use Repohistory for free to get started. Upgrade to enable unlimited repositories tracking.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PricingCard
              title="Free"
              price={0}
              period="month"
              description="Free for everyone"
              features={freeFeatures}
              buttonVariant="outline"
            />
            <ProCard />
          </div>
        </div>
      </div>
    </div>
  );
}

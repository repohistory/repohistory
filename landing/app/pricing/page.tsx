"use client";

import { Switch } from "@/components/ui/switch";
import { PricingCard } from "@/components/pricing-card";
import { useState } from "react";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  const freeFeatures = [
    { text: "Track 1 repository" },
    { text: "Traffic history beyond 14 days" },
    { text: "Advanced analytics & insights" },
    { text: "Data export capabilities" }
  ];

  const proFeatures = [
    { text: "Track unlimited repositories" },
    { text: "All features in Free" },
    { text: "Priority support" }
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
            <PricingCard
              title="Pro"
              price={isYearly ? 7.5 : 9}
              period="month"
              features={proFeatures}
              buttonVariant="default"
              middleSection={
                <div className="flex items-center gap-2">
                  <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                  <span className="text-sm text-muted-foreground">Billed yearly</span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

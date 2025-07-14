import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NumberFlow from '@number-flow/react';

interface Feature {
  text: string;
}

interface PricingCardProps {
  title: string;
  price: number;
  period: string;
  description?: string;
  features: Feature[];
  children?: React.ReactNode;
  middleSection?: React.ReactNode;
  buttonVariant?: "default" | "outline";
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  children,
  middleSection,
  buttonVariant = "outline"
}: PricingCardProps) {
  return (
    <div className="relative border border-border rounded-xl bg-card overflow-hidden flex flex-col h-full">
      <div className="p-5">
        <h3 className="text-2xl font-semibold mb-1">{title}</h3>
        <div className="relative">
          <span className="font-medium">
            $
            <NumberFlow
              value={price}
              format={{
                minimumFractionDigits: 0,
                maximumFractionDigits: price % 1 !== 0 ? 1 : 0
              }}
            />
          </span>
          {price !== 0 && (
            <span
              className="text-muted-foreground absolute bottom-0 transition-all duration-300 ease-in-out"
              style={{
                left: price === 9 ? '1.5rem' : '2.5rem'
              }}
            >
              per {period}
            </span>
          )}
        </div>
        {children}
      </div>
      <Separator />
      <div className="p-5">
        {middleSection ? middleSection : (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Separator />
      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="space-y-4 flex-1 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <svg className="size-3.5" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>
        <Button
          variant={buttonVariant}
          className={`w-full ${buttonVariant === "default" ? "bg-white text-black hover:bg-gray-100" : ""}`}
          asChild
        >
          <Link href="https://app.repohistory.com">
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
}

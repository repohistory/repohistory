'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GitHub } from "@/components/icons";
import { signin } from "@/actions/auth";
import { useState } from "react";
import { Loader2Icon } from "lucide-react"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/icons/general.png"
              alt="Repohistory Logo"
              width={64}
              height={64}
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Repohistory
          </h1>
        </div>
        <Button className="w-full" onClick={() => {
          setIsLoading(true);
          signin()
        }}>
          {
            isLoading ?
              <Loader2Icon className="animate-spin" />
              :
              <GitHub />
          }
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import SignInButton from "@/components/auth/signin-button";

export const metadata: Metadata = {
  title: "Sign In | Repohistory",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/icons/general.png"
              alt="Repohistory Logo"
              width={82}
              height={82}
            />
          </div>
          <h1 className="text-xl font-medium text-foreground mb-2">
            Sign in to Repohistory
          </h1>
        </div>
        <SignInButton />
      </div>
    </div>
  );
}

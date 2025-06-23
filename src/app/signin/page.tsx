import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GitHub } from "@/components/icons";
import { signin } from "@/actions/auth";

export default function SignInPage() {
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
        <Button className="w-full" onClick={signin}>
          <GitHub />
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}

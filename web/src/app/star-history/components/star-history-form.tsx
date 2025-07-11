"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StarHistoryFormProps {
  initialOwner: string;
  initialRepo: string;
}

export function StarHistoryForm({ initialOwner, initialRepo }: StarHistoryFormProps) {
  const router = useRouter();
  const [owner, setOwner] = useState(initialOwner);
  const [repo, setRepo] = useState(initialRepo);

  const handleGenerate = () => {
    if (owner && repo) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("owner", owner);
      newUrl.searchParams.set("repo", repo);
      router.push(newUrl.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <Input
          placeholder="facebook"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-40"
        />
        <span className="text-muted-foreground text-xl">/</span>
        <Input
          placeholder="react"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-40"
        />
      </div>
      <Button
        onClick={handleGenerate}
        disabled={!owner || !repo}
      >
        Generate
      </Button>
    </>
  );
}
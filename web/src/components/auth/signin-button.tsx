'use client';

import { Button } from "@/components/ui/button";
import { GitHub } from "@/components/icons";
import { signin } from "@/actions/auth";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      onClick={() => {
        setIsLoading(true);
        signin()
      }}>
      {
        isLoading ?
          <Loader className="animate-spin" />
          :
          <GitHub />
      }
      Continue with GitHub
    </Button>
  );
}

'use client';

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function SetupActionToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const setupAction = searchParams.get('setup_action');

    if (setupAction === 'request') {
      toast("Permission request sent!", {
        description: "Please wait for your organization approval, then refresh this page to access your repos.",
        duration: 6000,
      });

      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  return null;
}

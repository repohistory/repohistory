"use client";

import { useEffect } from "react";
import { revalidateHomePage } from "@/actions/revalidate";

export function RevalidateOnFocus() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        revalidateHomePage();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
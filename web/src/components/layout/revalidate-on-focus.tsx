"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { revalidatePage } from "@/actions/revalidate";

export function RevalidateOnFocus() {
  const pathname = usePathname();
  const lastRevalidateTime = useRef<number>(0);

  useEffect(() => {
    const handleWindowFocus = () => {
      const now = Date.now();
      const oneMinute = 60 * 1000;

      if (now - lastRevalidateTime.current >= oneMinute) {
        revalidatePage(pathname);
        lastRevalidateTime.current = now;
      }
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [pathname]);

  return null;
}

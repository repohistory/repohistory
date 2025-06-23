"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function Path() {
  const pathname = usePathname();
  
  const pathSegments = pathname.split("/").filter(Boolean);
  
  if (pathSegments.length === 0) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link href="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;
        
        return (
          <div key={href} className="flex items-center gap-2">
            <span className="text-muted-foreground">/</span>
            {isLast ? (
              <span className="text-foreground">{decodeURIComponent(segment)}</span>
            ) : (
              <Link href={href} className="text-muted-foreground hover:text-foreground">
                {decodeURIComponent(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
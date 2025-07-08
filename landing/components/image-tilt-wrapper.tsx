'use client';

import { ReactNode, useEffect, useState } from "react";

interface ImageTiltWrapperProps {
  children: ReactNode;
  imageIndex: 1 | 2 | 3;
}

export function ImageTiltWrapper({ children, imageIndex }: ImageTiltWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detect Safari
    const userAgent = window.navigator.userAgent;
    setIsSafari(/^((?!chrome|android).)*safari/i.test(userAgent));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getTransformClasses = () => {
    const baseClasses = "perspective-midrange transform-gpu";
    const transitionClasses = "transition-all duration-700";

    switch (imageIndex) {
      case 1:
        return `relative -translate-x-20 ${baseClasses} ${isSafari || !isScrolled
          ? "rotate-y-16 rotate-x-30 -rotate-z-20"
          : "rotate-y-10 rotate-x-30 -rotate-z-10 -translate-x-40"
          } ${transitionClasses}`;
      case 2:
        return `translate-x-40 translate-y-20 ${baseClasses} ${isSafari || !isScrolled
          ? "rotate-y-16 rotate-x-30 -rotate-z-20"
          : "rotate-y-10 rotate-x-30 -rotate-z-10"
          } ${transitionClasses}`;
      case 3:
        return `translate-x-100 translate-y-40 ${baseClasses} ${isSafari || !isScrolled
          ? "rotate-y-16 rotate-x-30 -rotate-z-20"
          : "rotate-y-10 rotate-x-30 -rotate-z-10 translate-x-140"
          } ${transitionClasses}`;
      default:
        return "";
    }
  };

  return (
    <div className={getTransformClasses()}>
      {children}
    </div>
  );
}

"use client";

import { MouseEvent, ReactNode } from "react";

interface ScrollLinkProps {
  targetId: string;
  children: ReactNode;
  className?: string;
}

export function ScrollLink({
  targetId,
  children,
  className,
}: ScrollLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const target = document.getElementById(targetId);

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Keep the URL clean instead of leaving #portals behind.
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
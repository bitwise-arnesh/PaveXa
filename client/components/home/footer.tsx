import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          
          {/* Brand */}

          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center">
              <Image
                src="/pavexa-logo-64.png"
                alt="PaveXa"
                width={32}
                height={32}
                className="h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">
                PaveXa
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Road Intelligence
              </p>
            </div>
          </Link>

          {/* Navigation */}

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Home
            </Link>

            <Link
              href="/report"
              className="transition-colors hover:text-foreground"
            >
              Report an Issue
            </Link>

            <Link
              href="/login"
              className="transition-colors hover:text-foreground"
            >
              Officer Login
            </Link>

            <span className="cursor-default transition-colors hover:text-foreground">
              Support
            </span>
          </nav>

          {/* Copyright */}

          <p className="text-xs text-muted-foreground md:text-right">
            © 2026 PaveXa. All rights reserved.
          </p>
        </div>

        {/* Bottom line */}

        <div className="mt-7 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />

              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>

            PaveXa infrastructure network operational
          </div>

          <div className="text-[11px] text-muted-foreground">
            Intelligent infrastructure. Safer communities.
          </div>
        </div>
      </div>
    </footer>
  );
}
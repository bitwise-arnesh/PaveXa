"use client";

import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ScrollLink } from "@/components/ui/scroll-link";

export function Navbar() {
  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <motion.div
            whileHover={{
              scale: 1.06,
              rotate: -3,
            }}
            whileTap={{
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="flex h-8 w-8 items-center justify-center"
          >
            <img
              src="/pavexa-logo-64.png"
              alt="PaveXa"
              className="h-8 w-8 object-contain"
            />
          </motion.div>

          <motion.div
            whileHover={{
              x: 1,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <span className="text-lg font-bold tracking-tight">PaveXa</span>

            <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
              Road Intelligence
            </span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Smooth scroll instead of #portals navigation */}
          <motion.div
            whileHover={{
              y: -1,
            }}
            whileTap={{
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="hidden sm:block"
          >
            <ScrollLink
              targetId="portals"
              className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-all duration-200 hover:shadow-md"
            >
              Access Portal
            </ScrollLink>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}

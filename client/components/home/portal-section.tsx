"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  UserRound,
} from "lucide-react";

const portals = [
  {
    title: "Public Portal",
    eyebrow: "For citizens",
    description:
      "Report potholes, damaged roads, broken signs, and other infrastructure issues.",
    href: "/login",
    icon: UserRound,
    action: "Report road damage",

    accent: {
      icon: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60",
      button:
        "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400",
      glow: "bg-emerald-500/5 dark:bg-emerald-500/10",
      dot: "bg-emerald-500",
    },
  },
  {
    title: "Officer Portal",
    eyebrow: "For authorities",
    description:
      "Review AI-analyzed reports, assess risk, and prioritize infrastructure repairs.",
    href: "/admin/login",
    icon: Building2,
    action: "Officer login",

    accent: {
      icon: "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
      button:
        "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
      glow: "bg-zinc-500/5 dark:bg-white/5",
      dot: "bg-zinc-800 dark:bg-zinc-300",
    },
  },
];

export function PortalSection() {
  return (
    <section
      id="portals"
      className="relative overflow-hidden border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-28">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Access
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Choose your portal.
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
            Different tools for citizens and infrastructure authorities,
            connected through the same intelligent road network.
          </p>
        </motion.div>

        {/* Portal Cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {portals.map((portal, index) => {
            const Icon = portal.icon;

            return (
              <motion.div
                key={portal.title}
                initial={{
                  opacity: 0,
                  y: 28,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -4,
                }}
              >
                <Link
                  href={portal.href}
                  className="
                    group relative block h-full
                    overflow-hidden rounded-xl
                    border border-border
                    bg-card
                    shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)]
                    transition-shadow duration-300
                    hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.45)]
                    dark:shadow-[0_8px_30px_-18px_rgba(0,0,0,0.7)]
                    dark:hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.9)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-foreground/40
                    focus-visible:ring-offset-4
                    focus-visible:ring-offset-background
                  "
                >
                  {/* Subtle accent glow */}
                  <div
                    className={`
                      pointer-events-none
                      absolute
                      -right-20
                      -top-20
                      h-56
                      w-56
                      rounded-full
                      blur-3xl
                      opacity-0
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                      ${portal.accent.glow}
                    `}
                  />

                  <div className="relative p-7 sm:p-8">

                    {/* Top row */}
                    <div className="flex items-start justify-between">

                      {/* Icon */}
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          rotate: -2,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                        className={`
                          flex h-12 w-12
                          items-center justify-center
                          rounded-xl border
                          ${portal.accent.icon}
                        `}
                      >
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={1.8}
                        />
                      </motion.div>

                      {/* Arrow */}
                      <motion.div
                        whileHover={{
                          x: 2,
                          y: -2,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-full
                          border border-border
                          text-muted-foreground
                          transition-colors duration-300
                          group-hover:border-foreground/20
                          group-hover:text-foreground
                        "
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="mt-8">

                      <div className="flex items-center gap-2">
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${portal.accent.dot}
                          `}
                        />

                        <span className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-muted-foreground
                        ">
                          {portal.eyebrow}
                        </span>
                      </div>

                      <h3 className="
                        mt-3
                        text-xl
                        font-semibold
                        tracking-[-0.025em]
                      ">
                        {portal.title}
                      </h3>

                      <p className="
                        mt-3
                        max-w-md
                        text-sm
                        leading-6
                        text-muted-foreground
                      ">
                        {portal.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-8">
                      <motion.div
                        whileHover={{
                          scale: 1.015,
                        }}
                        whileTap={{
                          scale: 0.985,
                        }}
                        transition={{
                          duration: 0.15,
                        }}
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          rounded-md
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          transition-all
                          duration-300
                          group-hover:gap-3
                          group-hover:shadow-md
                          ${portal.accent.button}
                        `}
                      >
                        {portal.action}

                        <ArrowRight
                          className="
                            h-4
                            w-4
                            transition-transform
                            duration-300
                            group-hover:translate-x-0.5
                          "
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Bottom interaction line */}
                  <div
                    className={`
                      absolute
                      bottom-0
                      left-0
                      h-[2px]
                      w-0
                      transition-all
                      duration-500
                      group-hover:w-full
                      ${portal.accent.dot}
                    `}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="
            mt-8
            flex
            items-center
            gap-2
            text-xs
            text-muted-foreground
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          One platform. Two perspectives. Smarter infrastructure decisions.
        </motion.div>
      </div>
    </section>
  );
}
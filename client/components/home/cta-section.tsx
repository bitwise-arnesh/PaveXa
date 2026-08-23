"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, MapPin, Activity } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      

      {/* Ambient glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.08, 0.14, 0.08],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-foreground
          blur-[120px]
        "
      />

      <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-28">
        {/* Top status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            PaveXa infrastructure network
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.65,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-7 max-w-3xl text-center"
        >
          <h2 className="text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
            Make every road
            <br />
            <span className="text-muted-foreground">
              safer and smarter.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Join the initiative to improve civic infrastructure through
            intelligent reporting, AI-powered analysis, and data-driven
            decisions.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.55,
            delay: 0.18,
          }}
          className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/login"
            className="
              group
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-md
              bg-foreground
              px-6
              text-sm
              font-semibold
              text-background
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            <MapPin className="h-4 w-4" />

            Enter Public Portal

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
            />
          </Link>

          <Link
            href="/admin/login"
            className="
              group
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-md
              border
              border-border
              bg-background/80
              px-6
              text-sm
              font-semibold
              text-foreground
              shadow-sm
              backdrop-blur
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-muted
              hover:shadow-md
            "
          >
            <ShieldCheck className="h-4 w-4" />

            Officer Login

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
            />
          </Link>
        </motion.div>

        {/* Divider / system stats */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.9 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.25,
          }}
          className="mx-auto mt-16 max-w-2xl border-t border-border pt-8"
        >
          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center justify-center gap-2 py-3 sm:py-0">
              <MapPin className="h-4 w-4 text-muted-foreground" />

              <span className="text-xs text-muted-foreground">
                Report
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 py-3 sm:py-0">
              <Activity className="h-4 w-4 text-muted-foreground" />

              <span className="text-xs text-muted-foreground">
                Analyze
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 py-3 sm:py-0">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />

              <span className="text-xs text-muted-foreground">
                Improve
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
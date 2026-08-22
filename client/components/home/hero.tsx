"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  CircleAlert,
  MapPin,
  ScanSearch,
} from "lucide-react";

import { ScrollLink } from "@/components/ui/scroll-link";

const heroItem = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* -------------------------------------------------- */}
      {/* SUBTLE GRID */}
      {/* -------------------------------------------------- */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          dark:opacity-[0.06]
        "
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* -------------------------------------------------- */}
      {/* AMBIENT MOTION */}
      {/* -------------------------------------------------- */}

      <motion.div
        className="
          pointer-events-none
          absolute
          -right-32
          top-24
          h-96
          w-96
          rounded-full
          bg-foreground/[0.025]
          blur-3xl
          dark:bg-white/[0.025]
        "
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* -------------------------------------------------- */}
      {/* MAIN CONTENT */}
      {/* -------------------------------------------------- */}

      <div
        className="
          relative
          mx-auto
          grid
          max-w-7xl
          items-center
          gap-14
          px-6
          py-24
          lg:grid-cols-[1.05fr_0.95fr]
          lg:py-32
        "
      >
        {/* ================================================== */}
        {/* LEFT CONTENT */}
        {/* ================================================== */}

        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div
            variants={heroItem}
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-border
              bg-muted/60
              px-3
              py-1.5
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{
                opacity: [1, 0.35, 1],
                scale: [1, 0.85, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            Infrastructure intelligence platform
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={heroItem}
            className="
              max-w-3xl
              font-sans
              text-5xl
              font-semibold
              leading-[0.98]
              tracking-[-0.045em]
              text-foreground
              sm:text-6xl
              lg:text-7xl
            "
          >
            Smarter roads.
            <br />

            <span className="text-muted-foreground">
              Safer communities.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={heroItem}
            className="
              mt-7
              max-w-xl
              text-base
              leading-7
              text-muted-foreground
              sm:text-lg
            "
          >
            PaveXa uses computer vision and location intelligence to detect
            road damage, assess risk, and help authorities prioritize repairs.
          </motion.p>

          {/* ================================================== */}
          {/* CTA BUTTONS */}
          {/* ================================================== */}

          <motion.div
            variants={heroItem}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            {/* Get Started */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              <ScrollLink
                targetId="portals"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  bg-foreground
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-background
                  shadow-sm
                  transition-all
                  duration-200
                  hover:shadow-md
                "
              >
                Get started

                <motion.span
                  className="inline-flex"
                  whileHover={{ x: 4 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </ScrollLink>
            </motion.div>

            {/* How It Works */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              <ScrollLink
                targetId="how-it-works"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-border
                  bg-background
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-foreground
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-muted
                  hover:shadow-md
                "
              >
                How it works

                <ArrowRight
                  className="
                    h-4
                    w-4
                    text-muted-foreground
                    transition-all
                    duration-200
                    group-hover:translate-x-1
                    group-hover:text-foreground
                  "
                />
              </ScrollLink>
            </motion.div>
          </motion.div>

          {/* ================================================== */}
          {/* TRUST INDICATORS */}
          {/* ================================================== */}

          <motion.div
            variants={heroItem}
            className="
              mt-10
              flex
              flex-wrap
              gap-x-6
              gap-y-3
              text-xs
              text-muted-foreground
            "
          >
            <TrustItem
              icon={<ScanSearch className="h-4 w-4" />}
              text="AI Damage Detection"
            />

            <TrustItem
              icon={<MapPin className="h-4 w-4" />}
              text="Location Intelligence"
            />

            <TrustItem
              icon={<CircleAlert className="h-4 w-4" />}
              text="Risk Prioritization"
            />
          </motion.div>
        </motion.div>

        {/* ================================================== */}
        {/* RIGHT VISUALIZATION */}
        {/* ================================================== */}

        <InfrastructurePreview />
      </div>
    </section>
  );
}

/* ========================================================== */
/* TRUST ITEM */
/* ========================================================== */

function TrustItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="flex cursor-default items-center gap-2"
    >
      {icon}
      {text}
    </motion.div>
  );
}

/* ========================================================== */
/* INFRASTRUCTURE PREVIEW */
/* ========================================================== */

function InfrastructurePreview() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 40,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        delay: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      {/* Main card */}
      <motion.div
        whileHover={{
          y: -4,
          boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 25,
        }}
        className="
          overflow-hidden
          rounded-xl
          border
          border-border
          bg-card
          shadow-2xl
          shadow-black/5
          dark:shadow-black/30
        "
      >
        {/* Application header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-border
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="h-2 w-2 rounded-full bg-emerald-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <span className="text-xs font-medium">
              Live infrastructure scan
            </span>
          </div>

          <span className="text-[10px] text-muted-foreground">
            PAVEXA / AI
          </span>
        </div>

        {/* Map */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {/* Roads */}
          <div
            className="
              absolute
              left-[15%]
              top-1/2
              h-[2px]
              w-[75%]
              rotate-[-12deg]
              bg-foreground/20
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-[5%]
              h-[90%]
              w-[2px]
              rotate-[18deg]
              bg-foreground/20
            "
          />

          <div
            className="
              absolute
              left-[5%]
              top-[35%]
              h-[2px]
              w-[90%]
              rotate-[8deg]
              bg-foreground/10
            "
          />

          {/* Blocks */}
          <MapBlock className="left-[10%] top-[12%] h-16 w-20" />

          <MapBlock className="right-[12%] top-[18%] h-20 w-24" />

          <MapBlock className="bottom-[15%] left-[14%] h-20 w-24" />

          <MapBlock className="bottom-[10%] right-[15%] h-16 w-20" />

          {/* Detection points */}
          <DetectionPoint
            className="left-[35%] top-[32%]"
            severity="critical"
            delay={0}
          />

          <DetectionPoint
            className="right-[30%] top-[46%]"
            severity="high"
            delay={0.4}
          />

          <DetectionPoint
            className="left-[48%] bottom-[24%]"
            severity="medium"
            delay={0.8}
          />

          {/* Detection overlay */}
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.8,
              duration: 0.4,
            }}
            className="
              absolute
              left-4
              top-4
              rounded-lg
              border
              border-border
              bg-background/90
              px-3
              py-2
              shadow-sm
              backdrop-blur
            "
          >
            <p className="text-[10px] font-medium text-muted-foreground">
              DETECTION
            </p>

            <p className="mt-0.5 text-xs font-semibold">
              3 road issues identified
            </p>
          </motion.div>

          {/* Animated scan line */}
          <motion.div
            className="
              pointer-events-none
              absolute
              left-0
              right-0
              h-px
              bg-foreground/10
            "
            initial={{
              top: "0%",
            }}
            animate={{
              top: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Metrics */}
        <div
          className="
            grid
            grid-cols-3
            divide-x
            divide-border
            border-t
            border-border
          "
        >
          <Metric label="Detected" value="03" />
          <Metric label="High Risk" value="01" />
          <Metric label="Coverage" value="98%" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ========================================================== */
/* MAP BLOCK */
/* ========================================================== */

function MapBlock({ className }: { className: string }) {
  return (
    <motion.div
      className={`
        absolute
        rounded
        border
        border-border
        bg-background/70
        ${className}
      `}
      whileHover={{
        scale: 1.03,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    />
  );
}

/* ========================================================== */
/* DETECTION POINT */
/* ========================================================== */

function DetectionPoint({
  className,
  severity,
  delay,
}: {
  className: string;
  severity: "critical" | "high" | "medium";
  delay: number;
}) {
  const colors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
  };

  return (
    <div className={`absolute ${className}`}>
      {/* Pulse */}
      <motion.div
        className={`
          absolute
          -inset-2
          rounded-full
          ${colors[severity]}
          opacity-20
        `}
        animate={{
          scale: [0.8, 1.8],
          opacity: [0.35, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
          ease: "easeOut",
        }}
      />

      {/* Point */}
      <motion.div
        className={`
          relative
          h-4
          w-4
          rounded-full
          ${colors[severity]}
          ring-4
          ring-white/70
          dark:ring-black/30
        `}
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

/* ========================================================== */
/* METRIC */
/* ========================================================== */

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{
        backgroundColor: "var(--muted)",
      }}
      className="px-4 py-3 transition-colors"
    >
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </motion.div>
  );
}
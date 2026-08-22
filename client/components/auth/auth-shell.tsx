"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  description: string;
  type?: "user" | "admin";
}

export function AuthShell({
  children,
  title,
  description,
  type = "user",
}: AuthShellProps) {
  const isAdmin = type === "admin";

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">


        <section
          className={`
            relative
            hidden
            overflow-hidden
            lg:flex
            ${isAdmin ? "bg-zinc-950" : "bg-foreground"}
            text-background
          `}
        >

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />


          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/4 blur-3xl"
          />

          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Logo */}
            <Link
              href="/"
              className="group inline-flex w-fit items-center gap-3"
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotate: -3,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-background text-foreground"
              >
                <ShieldCheck className="h-4 w-4" />
              </motion.div>

              <span className="text-lg font-bold tracking-tight">
                PaveXa
              </span>
            </Link>


            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-lg"
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-background/50">
                  {isAdmin
                    ? "Infrastructure command"
                    : "Infrastructure intelligence"}
                </span>
              </div>

              <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.045em] xl:text-6xl">
                {isAdmin ? (
                  <>
                    Manage roads.
                    <br />
                    <span className="text-background/45">
                      Prioritize repairs.
                    </span>
                  </>
                ) : (
                  <>
                    Smarter roads.
                    <br />
                    <span className="text-background/45">
                      Safer communities.
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-background/55">
                {isAdmin
                  ? "A centralized workspace for reviewing infrastructure reports, understanding risk, and prioritizing critical repairs."
                  : "Report road damage and help build a smarter, safer infrastructure network with AI-powered road intelligence."}
              </p>


              <div className="mt-10 flex items-center gap-3 text-xs text-background/45">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                PaveXa infrastructure network
              </div>
            </motion.div>

            {/* Footer */}
            <div className="text-xs text-background/30">
              © {new Date().getFullYear()} PaveXa
            </div>
          </div>
        </section>



        {/* FORM SIDE */}
        <section className="relative flex min-h-screen flex-col">

          {/* Mobile header */}
          <div className="flex items-center justify-between p-6 lg:hidden">
            <Link
              href="/"
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <span className="text-lg font-bold tracking-tight">
                PaveXa
              </span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
          </div>

          {/* Form container */}
          <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-20">
            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-md"
            >
              {/* Mobile eyebrow */}
              <div className="mb-8 lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {isAdmin ? "Officer access" : "Public access"}
                </p>
              </div>

              {/* Heading */}
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.035em]">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Form */}
              <div className="mt-8">
                {children}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
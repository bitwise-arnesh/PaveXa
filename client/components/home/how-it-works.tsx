"use client";

import { motion } from "motion/react";
import {
  Camera,
  ScanSearch,
  ShieldAlert,
  ListFilter,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Capture",
    description:
      "Citizens or dedicated vehicles capture images of road conditions.",
    icon: Camera,
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "Our models detect road damage and infrastructure anomalies from submitted images.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Risk Assessment",
    description:
      "Detected issues are evaluated based on severity and potential safety impact.",
    icon: ShieldAlert,
  },
  {
    number: "04",
    title: "Prioritization",
    description:
      "Reports are ranked so authorities can focus on the most critical problems first.",
    icon: ListFilter,
  },
  {
    number: "05",
    title: "Task Assignment",
    description:
      "High-priority issues can be assigned to appropriate maintenance teams.",
    icon: ClipboardCheck,
  },
  {
    number: "06",
    title: "Verification",
    description:
      "Completed repairs can be verified and the report status updated.",
    icon: CheckCircle2,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-transparent text-foreground"
    >
      

      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            From detection to resolution
          </div>

          <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
            How PaveXa works
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            An intelligent workflow that transforms road observations into
            actionable infrastructure decisions.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* Desktop timeline */}
          <div className="absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 md:block">
            <div className="h-full w-full bg-border" />

            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
              style={{
                transformOrigin: "top",
              }}
              className="absolute inset-x-0 top-0 h-full w-px bg-foreground/25"
            />
          </div>

          {/* Mobile timeline */}
          <div className="absolute bottom-8 left-4.5 top-8 w-px bg-border md:hidden" />

          <div className="space-y-10 md:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 32,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.04,
                    ease: "easeOut",
                  }}
                  className="relative"
                >
                  {/* Desktop layout */}
                  <div
                    className={`hidden md:flex ${
                      isLeft ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className="relative w-[calc(50%-48px)]">
                      <StepCard
                        step={step}
                        icon={Icon}
                        align={isLeft ? "left" : "right"}
                      />

                      {/* Connector to center */}
                      <div
                        className={`absolute top-1/2 h-px w-12 -translate-y-1/2 bg-border ${
                          isLeft ? "-right-12" : "-left-12"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Desktop center node */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.6,
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.3,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.04 + 0.15,
                      ease: "easeOut",
                    }}
                    className="absolute left-1/2 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background md:flex"
                  >
                    <span className="h-2 w-2 rounded-full bg-foreground" />
                  </motion.div>

                  {/* Mobile layout */}
                  <div className="relative flex gap-6 md:hidden">
                    {/* Mobile node */}
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                      <span className="h-2 w-2 rounded-full bg-foreground" />
                    </div>

                    <StepCard step={step} icon={Icon} align="left" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mt-20 flex justify-center"
        >
          <div className="flex items-center gap-3 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
              <CheckCircle2 className="h-3 w-3" />
            </span>
            From road observation to verified repair
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  icon: Icon,
  align,
}: {
  step: (typeof steps)[number];
  icon: React.ElementType;
  align: "left" | "right";
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 group-hover:shadow-md dark:group-hover:shadow-black/20">
        {/* Top */}
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground transition-colors duration-300 group-hover:bg-foreground group-hover:text-background">
              <Icon className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Step {step.number}
              </p>

              <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em]">
                {step.title}
              </h3>
            </div>
          </div>

          <span className="font-mono text-xs text-muted-foreground/50">
            {step.number}
          </span>
        </div>

        {/* Description */}
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          {step.description}
        </p>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
      </div>
    </motion.div>
  );
}

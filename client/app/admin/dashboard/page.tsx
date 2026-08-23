import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Map,
  MapPin,
  TriangleAlert,
} from "lucide-react";

import { desc, eq, sql } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/db";
import { report } from "@/db/schemas/schema";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ThemeToggle } from "@/components/theme-toggle";

import { ReportStatusSelect } from "@/components/admin/report-status-select";
import { AdminReportMap } from "@/components/admin/admin-report-map";
import { AdminAiChat } from "@/components/admin/admin-ai-chat";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

function formatRelativeTime(date: Date) {
  const diff = Math.max(
    0,
    Date.now() - date.getTime(),
  );

  const minutes = Math.floor(
    diff / (1000 * 60),
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(
    hours / 24,
  );

  if (days < 30) {
    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  return date.toLocaleDateString();
}

function getRiskClass(
  riskLevel: string,
) {
  switch (
    riskLevel.toUpperCase()
  ) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-600 dark:text-red-400";

    case "HIGH":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";

    case "MEDIUM":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "LOW":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    default:
      return "bg-muted text-muted-foreground";
  }
}

export default async function AdminDashboardPage() {
  const session =
    await requireAdmin();

  const [
    totalReportsResult,
    highPriorityResult,
    underReviewResult,
    resolvedResult,
    confidenceResult,
    activeReportsResult,
    priorityReports,
    activeMapReports,
  ] = await Promise.all([
    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(report),

    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(report)
      .where(
        sql`
          upper(${report.riskLevel}) IN ('CRITICAL', 'HIGH')
          AND upper(${report.status}) <> 'RESOLVED'
        `,
      ),

    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(report)
      .where(
        eq(
          report.status,
          "UNDER_REVIEW",
        ),
      ),

    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(report)
      .where(
        eq(
          report.status,
          "RESOLVED",
        ),
      ),

    db
      .select({
        average:
          sql<number | null>`
            avg(${report.confidence})
          `,
      })
      .from(report),

    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(report)
      .where(
        sql`
          upper(${report.status}) <> 'RESOLVED'
        `,
      ),

    db
      .select({
        id: report.id,
        latitude:
          report.latitude,
        longitude:
          report.longitude,
        riskLevel:
          report.riskLevel,
        riskScore:
          report.riskScore,
        createdAt:
          report.createdAt,
        status:
          report.status,
      })
      .from(report)
      .where(
        sql`
          upper(${report.status}) <> 'RESOLVED'
        `,
      )
      .orderBy(
        desc(report.riskScore),
        desc(report.createdAt),
      )
      .limit(8),

    db
      .select({
        id: report.id,
        latitude:
          report.latitude,
        longitude:
          report.longitude,
        riskLevel:
          report.riskLevel,
        riskScore:
          report.riskScore,
        status:
          report.status,
      })
      .from(report)
      .where(
        sql`
          upper(${report.status}) <> 'RESOLVED'
        `,
      )
      .orderBy(
        desc(report.riskScore),
        desc(report.createdAt),
      ),
  ]);

  // CALCULATIONS

  const totalReports =
    Number(
      totalReportsResult[0]?.count ??
        0,
    );

  const highPriority =
    Number(
      highPriorityResult[0]?.count ??
        0,
    );

  const underReview =
    Number(
      underReviewResult[0]?.count ??
        0,
    );

  const resolved =
    Number(
      resolvedResult[0]?.count ??
        0,
    );

  const averageConfidenceDecimal =
    Number(
      confidenceResult[0]?.average ??
        0,
    );

  const averageConfidence =
    averageConfidenceDecimal * 100;

  const activeReports =
    Number(
      activeReportsResult[0]?.count ??
        0,
    );

  const resolutionRate =
    totalReports > 0
      ? (resolved /
          totalReports) *
        100
      : 0;

  const stats = [
    {
      label: "Total reports",
      value: totalReports,
      icon: Activity,
      description:
        "All submitted reports",
    },
    {
      label: "High priority",
      value: highPriority,
      icon: AlertTriangle,
      description:
        "Critical or high risk",
    },
    {
      label: "Under review",
      value: underReview,
      icon: Clock3,
      description:
        "Awaiting maintenance action",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: CheckCircle2,
      description:
        "Successfully resolved",
    },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar
        userName={
          session.user.name
        }
      />

      <SidebarInset>
        <main className="min-h-screen bg-background text-foreground">
          {/* MOBILE / TOP HEADER */}

          <div className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8" />

                <div className="hidden h-5 w-px bg-border sm:block" />

                <div>
                  <p className="text-sm font-semibold">
                    PaveXa Command Center
                  </p>

                  <p className="hidden text-[10px] text-muted-foreground sm:block">
                    Infrastructure
                    monitoring
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-medium sm:flex">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />

                    <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                  </span>

                  <span className="text-muted-foreground">
                    Operational
                  </span>
                </div>

                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* CONTENT */}

          <div className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
            <header
              id="dashboard"
              className="scroll-mt-24"
            >
              <div className="flex flex-col justify-between gap-6 border-b border-border pb-7 xl:flex-row xl:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Admin Dashboard
                    </span>

                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Operational
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    Infrastructure
                    overview
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Welcome,{" "}
                    <span className="font-medium text-foreground">
                      {
                        session
                          .user
                          .name
                      }
                    </span>
                    . Monitor road
                    reports,
                    infrastructure
                    risk and
                    maintenance
                    activity from
                    one command
                    center.
                  </p>
                </div>

                <div className="hidden xl:block">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />

                      <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                    </span>

                    <div>
                      <p className="text-xs font-medium">
                        System status
                      </p>

                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        All services
                        operational
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* STATS */}

            <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon =
                  stat.icon;

                return (
                  <div
                    key={
                      stat.label
                    }
                    className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          {
                            stat.label
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-muted-foreground/70">
                          {
                            stat.description
                          }
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-foreground group-hover:text-background">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <p className="mt-6 text-3xl font-semibold tracking-tight">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* MAP */}

            <section
              id="infrastructure-map"
              className="mt-7 scroll-mt-20"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Map className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">
                        Infrastructure
                        map
                      </h2>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Active
                        infrastructure
                        reports across
                        monitored areas.
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                    {
                      activeMapReports.length
                    }{" "}
                    active
                  </span>
                </div>

                <AdminReportMap
                  reports={
                    activeMapReports
                  }
                />
              </div>
            </section>

            {/* REPORTS + OVERVIEW */}

            <section
              id="reports"
              className="mt-7 scroll-mt-20"
            >
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <TriangleAlert className="h-4 w-4" />
                      </div>

                      <div>
                        <h2 className="text-sm font-semibold">
                          Repair
                          priority
                        </h2>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Highest-risk
                          reports
                          requiring
                          attention.
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                      {
                        priorityReports.length
                      }{" "}
                      reports
                    </span>
                  </div>

                  {priorityReports.length ===
                  0 ? (
                    <div className="flex min-h-64 items-center justify-center px-6 text-center">
                      <div>
                        <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-500" />

                        <p className="mt-3 text-sm font-medium">
                          No active
                          reports
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          All reported
                          infrastructure
                          issues have
                          been
                          resolved.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {priorityReports.map(
                        (item) => (
                          <div
                            key={
                              item.id
                            }
                            className="group flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                          >
                            <Link
                              href={`/report/${item.id}`}
                              className="flex min-w-0 flex-1 items-start gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
                            >
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                                <MapPin className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
                                    Report #
                                    {
                                      item.id
                                    }
                                  </p>

                                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>

                                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                                  {item.latitude.toFixed(
                                    4,
                                  )}
                                  {" , "}
                                  {item.longitude.toFixed(
                                    4,
                                  )}
                                </p>

                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {formatRelativeTime(
                                    item.createdAt,
                                  )}
                                </p>
                              </div>
                            </Link>

                            <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getRiskClass(
                                    item.riskLevel,
                                  )}`}
                                >
                                  {
                                    item.riskLevel
                                  }
                                </span>

                                <span className="text-[10px] font-medium text-muted-foreground">
                                  Score{" "}
                                  {item.riskScore.toFixed(
                                    1,
                                  )}
                                </span>
                              </div>

                              <ReportStatusSelect
                                reportId={
                                  item.id
                                }
                                status={
                                  item.status
                                }
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </section>

                {/* OVERVIEW */}

                <aside className="space-y-4">
                  {/* AI confidence */}

                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          AI analysis
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Detection
                          confidence
                        </p>
                      </div>

                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <p className="mt-5 text-3xl font-semibold tracking-tight">
                      {averageConfidence.toFixed(
                        1,
                      )}
                      %
                    </p>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              averageConfidence,
                            ),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Active reports */}

                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          Active
                          reports
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Not yet
                          resolved
                        </p>
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <p className="mt-5 text-3xl font-semibold">
                      {activeReports.toLocaleString()}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      Requires
                      monitoring
                    </div>
                  </div>

                  {/* Resolution */}

                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Resolution
                      rate
                    </p>

                    <p className="mt-4 text-3xl font-semibold tracking-tight">
                      {resolutionRate.toFixed(
                        1,
                      )}
                      %
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {resolved.toLocaleString()}{" "}
                      of{" "}
                      {totalReports.toLocaleString()}{" "}
                      resolved
                    </p>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            resolutionRate,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </aside>
              </div>
            </section>

            {/* AI ASSISTANT */}

            <section
              id="ai-assistant"
              className="mt-7 scroll-mt-24"
            >
              <AdminAiChat />
            </section>

            <div className="h-16" />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
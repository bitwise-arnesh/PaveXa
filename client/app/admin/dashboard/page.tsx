import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { desc, eq, sql } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/db";
import { report } from "@/db/schemas/schema";
import { ThemeToggle } from "@/components/theme-toggle";
import { ReportStatusSelect } from "@/components/admin/report-status-select";
import { AdminReportMap } from "@/components/admin/admin-report-map";

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

function getRiskClass(riskLevel: string) {
  switch (riskLevel.toUpperCase()) {
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
  const session = await requireAdmin();

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
        average: sql<number | null>`
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
        latitude: report.latitude,
        longitude: report.longitude,
        riskLevel: report.riskLevel,
        riskScore: report.riskScore,
        createdAt: report.createdAt,
        status: report.status,
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
        latitude: report.latitude,
        longitude: report.longitude,
        riskLevel: report.riskLevel,
        riskScore: report.riskScore,
        status: report.status,
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

  const totalReports = Number(
    totalReportsResult[0]?.count ?? 0,
  );

  const highPriority = Number(
    highPriorityResult[0]?.count ?? 0,
  );

  const underReview = Number(
    underReviewResult[0]?.count ?? 0,
  );

  const resolved = Number(
    resolvedResult[0]?.count ?? 0,
  );

  const averageConfidenceDecimal =
    Number(
      confidenceResult[0]?.average ?? 0,
    );


  const averageConfidence =
    averageConfidenceDecimal * 100;

  const activeReports = Number(
    activeReportsResult[0]?.count ?? 0,
  );

  const resolutionRate =
    totalReports > 0
      ? (resolved / totalReports) * 100
      : 0;

  const stats = [
    {
      label: "Total reports",
      value: totalReports,
      icon: Activity,
    },
    {
      label: "High priority",
      value: highPriority,
      icon: AlertTriangle,
    },
    {
      label: "Under review",
      value: underReview,
      icon: Clock3,
    },
    {
      label: "Resolved",
      value: resolved,
      icon: CheckCircle2,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* Header */}

        <header className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
                <ShieldCheck className="h-4 w-4" />
              </span>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                PaveXa Command Center
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Infrastructure overview
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Welcome, {session.user.name}.
              Monitor reports, risk and
              maintenance activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />

                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-muted-foreground">
                System status
              </span>

              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Operational
              </span>
            </div>
          </div>
        </header>

        {/* Stats */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-foreground group-hover:text-background">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-tight">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </section>

        {/* Map */}

        <div className="mt-8">
          <AdminReportMap
            reports={activeMapReports}
          />
        </div>

        {/* Main content */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Priority queue */}

          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-semibold">
                  Priority queue
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Highest-risk infrastructure
                  reports requiring attention.
                </p>
              </div>

              <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {priorityReports.length} reports
              </span>
            </div>

            {priorityReports.length === 0 ? (
              <div className="flex min-h-56 items-center justify-center px-6 text-center">
                <div>
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />

                  <p className="mt-3 text-sm font-medium">
                    No active reports
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    All reported infrastructure
                    issues have been resolved.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {priorityReports.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-5 px-6 py-5 transition-colors hover:bg-muted/40"
                    >
                      {/* Report details */}

                      <Link
                        href={`/report/${item.id}`}
                        className="group flex min-w-0 flex-1 items-start gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                          <MapPin className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
                              Report #{item.id}
                            </p>

                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.latitude.toFixed(
                              4,
                            )}
                            ,{" "}
                            {item.longitude.toFixed(
                              4,
                            )}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatRelativeTime(
                              item.createdAt,
                            )}
                          </p>
                        </div>
                      </Link>

                      {/* Risk + status */}

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRiskClass(
                              item.riskLevel,
                            )}`}
                          >
                            {item.riskLevel}
                          </span>

                          <span className="text-[10px] font-medium text-muted-foreground">
                            Score{" "}
                            {item.riskScore.toFixed(
                              1,
                            )}
                          </span>
                        </div>

                        <ReportStatusSelect
                          reportId={item.id}
                          status={item.status}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {/* Overview */}

          <aside className="space-y-4">
            {/* AI confidence */}

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  AI analysis
                </p>

                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>

              <p className="mt-4 text-4xl font-semibold tracking-tight">
                {averageConfidence.toFixed(
                  1,
                )}
                %
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Average detection confidence
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
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

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Active reports
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Reports not yet resolved
                  </p>
                </div>

                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <p className="mt-5 text-3xl font-semibold">
                {activeReports.toLocaleString()}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Requires monitoring
              </div>
            </div>

            {/* Resolution rate */}

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Resolution rate
              </p>

              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {resolutionRate.toFixed(1)}%
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {resolved.toLocaleString()} of{" "}
                {totalReports.toLocaleString()}{" "}
                reports resolved
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
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
      </div>
    </main>
  );
}
import {
  Activity,
  CheckCircle2,
  Clock3,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

import { requireSession } from "@/lib/auth-guard";
import { ReportButton } from "@/components/report/report-button";
import { DeleteReportButton } from "@/components/report/delete-report-button";
import { db } from "@/db";
import { report } from "@/db/schemas/schema";
import { desc, eq } from "drizzle-orm";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const session = await requireSession();

  const reports = await db
    .select()
    .from(report)
    .where(eq(report.userId, session.user.id))
    .orderBy(desc(report.createdAt));

  const totalReports = reports.length;

  const underReview = reports.filter(
    (item) => item.status === "UNDER_REVIEW",
  ).length;

  const resolved = reports.filter((item) => item.status === "RESOLVED").length;

  const recentReports = reports;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Citizen dashboard
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Welcome back, {session.user.name}.
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Track your infrastructure reports and help improve your local
              roads.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ReportButton />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {/* Reports submitted */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Reports submitted
              </span>

              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {String(totalReports).padStart(2, "0")}
            </p>
          </div>

          {/* Under review */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Under review
              </span>

              <Clock3 className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {String(underReview).padStart(2, "0")}
            </p>
          </div>

          {/* Resolved */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resolved</span>

              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {String(resolved).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Recent reports */}
          <section className="rounded-xl border border-border bg-card shadow-sm">
            {/* Section header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-semibold">Recent reports</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your latest infrastructure submissions.
                </p>
              </div>
            </div>

            {/* Scrollable report list */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
              {recentReports.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium">No reports yet</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Submit your first road damage report.
                  </p>
                </div>
              ) : (
                recentReports.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-muted/40"
                  >
                    {/* Report information */}
                    <Link
                      href={`/report/${item.id}`}
                      className="flex min-w-0 flex-1 items-start gap-3"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <MapPin className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          Report #{item.id}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.latitude.toFixed(7)},{" "}
                          {item.longitude.toFixed(7)}
                          {" · "}
                          {item.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </Link>

                    {/* Right side */}
                    <div className="flex shrink-0 items-center gap-3">
                      {/* Status */}
                      <span
                        className={
                          item.status === "RESOLVED"
                            ? "hidden rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 sm:inline-block"
                            : item.status === "IN_PROGRESS"
                              ? "hidden rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 sm:inline-block"
                              : "hidden rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400 sm:inline-block"
                        }
                      >
                        {item.status.replaceAll("_", " ")}
                      </span>

                      {/* Delete
                          Only UNDER_REVIEW reports can be deleted.
                      */}
                      {item.status === "UNDER_REVIEW" && (
                        <DeleteReportButton reportId={item.id} />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Quick action */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Quick action
              </p>

              <h3 className="mt-3 text-lg font-semibold">
                Spotted road damage?
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Submit a photo and location. PaveXa will analyze the issue and
                send it into the infrastructure workflow.
              </p>

              <ReportButton variant="link" className="mt-5" />
            </div>

            {/* Community impact */}
            <div className="rounded-xl border border-border bg-muted/40 p-6">
              <div className="flex items-center gap-2">
                <TriangleAlert className="h-4 w-4" />

                <span className="text-sm font-semibold">Community impact</span>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your reports help authorities identify and prioritize
                infrastructure problems faster.
              </p>
            </div>
          </aside>
        </div>
        {/* Logout */}

        <div className="mt-8 flex justify-end border-t border-border pt-6">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}

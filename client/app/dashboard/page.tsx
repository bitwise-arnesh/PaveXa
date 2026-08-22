import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  TriangleAlert,
} from "lucide-react";

import { requireSession } from "@/lib/auth-guard";
import { ReportButton } from "@/components/report/report-button";

const stats = [
  {
    label: "Reports submitted",
    value: "08",
    icon: Activity,
  },
  {
    label: "Under review",
    value: "03",
    icon: Clock3,
  },
  {
    label: "Resolved",
    value: "05",
    icon: CheckCircle2,
  },
];

const recentReports = [
  {
    location: "Salt Lake Road",
    type: "Pothole",
    status: "Under review",
    date: "Today",
  },
  {
    location: "Park Street",
    type: "Road damage",
    status: "Resolved",
    date: "Yesterday",
  },
  {
    location: "EM Bypass",
    type: "Broken road sign",
    status: "Under review",
    date: "Aug 19",
  },
];

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Citizen dashboard
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Welcome back, {session.user.name}.
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Track your infrastructure reports and help improve your
              local roads.
            </p>
          </div>

          <ReportButton />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>

                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>

                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-semibold">
                  Recent reports
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your latest infrastructure submissions.
                </p>
              </div>

              <button className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                View all
              </button>
            </div>

            <div className="divide-y divide-border">
              {recentReports.map((report) => (
                <div
                  key={`${report.location}-${report.date}`}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {report.type}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {report.location} · {report.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className={
                      report.status === "Resolved"
                        ? "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        : "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400"
                    }
                  >
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Quick action
              </p>

              <h3 className="mt-3 text-lg font-semibold">
                Spotted road damage?
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Submit a photo and location. PaveXa will analyze the
                issue and send it into the infrastructure workflow.
              </p>

              <ReportButton
                variant="link"
                className="mt-5"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-6">
              <div className="flex items-center gap-2">
                <TriangleAlert className="h-4 w-4" />

                <span className="text-sm font-semibold">
                  Community impact
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your reports help authorities identify and prioritize
                infrastructure problems faster.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
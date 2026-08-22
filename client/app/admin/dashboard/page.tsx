import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

const stats = [
  {
    label: "Total reports",
    value: "124",
    icon: Activity,
  },
  {
    label: "High priority",
    value: "18",
    icon: AlertTriangle,
  },
  {
    label: "Under review",
    value: "31",
    icon: Clock3,
  },
  {
    label: "Resolved",
    value: "75",
    icon: CheckCircle2,
  },
];

const priorityReports = [
  {
    location: "EM Bypass",
    issue: "Severe pothole cluster",
    risk: "Critical",
    reported: "12 min ago",
  },
  {
    location: "Salt Lake",
    issue: "Damaged road surface",
    risk: "High",
    reported: "34 min ago",
  },
  {
    location: "Park Street",
    issue: "Broken traffic sign",
    risk: "Medium",
    reported: "1 hr ago",
  },
];

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
                <ShieldCheck className="h-4 w-4" />
              </span>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                PaveXa Command Center
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Infrastructure overview
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Welcome, {session.user.name}. Monitor reports, risk and
              maintenance activity.
            </p>
          </div>

          <div className="rounded-md border border-border bg-card px-4 py-2.5 text-sm shadow-sm">
            <span className="text-muted-foreground">
              System status
            </span>

            <span className="ml-2 font-medium text-emerald-600 dark:text-emerald-400">
              Operational
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
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

        {/* Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Priority queue */}
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    Priority queue
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Infrastructure issues requiring attention.
                  </p>
                </div>

                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  View all
                </button>
              </div>
            </div>

            <div className="divide-y divide-border">
              {priorityReports.map((report) => (
                <div
                  key={report.location}
                  className="flex items-center justify-between gap-5 px-6 py-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {report.issue}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {report.location} · {report.reported}
                      </p>
                    </div>
                  </div>

                  <span
                    className={
                      report.risk === "Critical"
                        ? "rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400"
                        : report.risk === "High"
                        ? "rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400"
                        : "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400"
                    }
                  >
                    {report.risk}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Overview */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                AI analysis
              </p>

              <p className="mt-4 text-4xl font-semibold tracking-tight">
                96.4%
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Average detection confidence
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[96.4%] rounded-full bg-foreground" />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Active reports
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Across monitored areas
                  </p>
                </div>

                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <p className="mt-5 text-3xl font-semibold">
                49
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
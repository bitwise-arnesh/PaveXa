import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  ImageIcon,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth-guard";
import { db } from "@/db";
import { report } from "@/db/schemas/schema";
import { and, eq } from "drizzle-orm";

interface NearbyLocation {
  type: string;
  name: string;
  distance_m: number;
  latitude: number;
  longitude: number;
  osm_id?: number;
}

interface InfrastructureData {
  available?: boolean;
  radius?: number;
  counts?: Record<string, number>;
  nearby?: NearbyLocation[];
}

function parseInfrastructureData(
  data: string | null,
): InfrastructureData | null {
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function getRiskClass(level: string) {
  switch (level) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-600 dark:text-red-400";

    case "HIGH":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";

    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";

    default:
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }
}

function getUniqueNearbyLocations(
  nearby: NearbyLocation[],
) {
  const unique = new Map<string, NearbyLocation>();

  for (const item of nearby) {
    if (!item.name || item.name === "Unnamed") {
      continue;
    }

    const key = item.name.trim().toLowerCase();
    const existing = unique.get(key);

    if (
      !existing ||
      item.distance_m < existing.distance_m
    ) {
      unique.set(key, item);
    }
  }

  return Array.from(unique.values()).sort(
    (a, b) => a.distance_m - b.distance_m,
  );
}

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();

  const { id } = await params;

  const [reportData] = await db
    .select()
    .from(report)
    .where(
      and(
        eq(report.id, id),
        eq(report.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!reportData) {
    notFound();
  }

  const infrastructure = parseInfrastructureData(
    reportData.infrastructureData,
  );

  const counts = infrastructure?.counts ?? {};
  const nearby = infrastructure?.nearby ?? [];
  const uniqueNearby = getUniqueNearbyLocations(nearby);

  const riskLevel = reportData.riskLevel;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mt-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Infrastructure report
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight capitalize">
                {reportData.damageType.replaceAll("_", " ")}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Report ID: {reportData.id}
              </p>
            </div>

            <span
              className={
                reportData.status === "RESOLVED"
                  ? "w-fit rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                  : "w-fit rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
              }
            >
              {reportData.status.replaceAll("_", " ")}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {reportData.imageUrl ? (
              <img
                src={reportData.imageUrl}
                alt="Reported road damage"
                className="h-[360px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[360px] items-center justify-center bg-muted/30">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium">
                    No image available
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    This report was submitted without a stored image.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />

              <h2 className="font-semibold">
                Risk assessment
              </h2>
            </div>

            <div className="mt-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight">
                  {reportData.riskScore}
                </span>

                <span className="pb-2 text-sm text-muted-foreground">
                  / 100
                </span>
              </div>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getRiskClass(
                  riskLevel,
                )}`}
              >
                {riskLevel}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                <span className="text-sm text-muted-foreground">
                  Infrastructure risk
                </span>

                <span className="text-sm font-semibold">
                  {reportData.infrastructureRisk ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                <span className="text-sm text-muted-foreground">
                  Confidence
                </span>

                <span className="text-sm font-semibold">
                  {reportData.confidence !== null
                    ? `${(
                        reportData.confidence * 100
                      ).toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />

              <h2 className="font-semibold">
                Location
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">
                  Latitude
                </p>

                <p className="mt-1 font-mono text-sm">
                  {reportData.latitude}
                </p>
              </div>

              <div className="rounded-lg bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">
                  Longitude
                </p>

                <p className="mt-1 font-mono text-sm">
                  {reportData.longitude}
                </p>
              </div>

              <a
                href={`https://www.google.com/maps?q=${reportData.latitude},${reportData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              >
                Open in Google Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />

              <h2 className="font-semibold">
                Report information
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
                <span className="text-sm text-muted-foreground">
                  Damage type
                </span>

                <span className="text-sm font-medium capitalize">
                  {reportData.damageType.replaceAll("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
                <span className="text-sm text-muted-foreground">
                  Submitted
                </span>

                <span className="text-sm font-medium">
                  {reportData.createdAt.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
                <span className="text-sm text-muted-foreground">
                  Last updated
                </span>

                <span className="text-sm font-medium">
                  {reportData.updatedAt.toLocaleString()}
                </span>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h2 className="font-semibold">
              Description
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {reportData.description ||
                "No description was provided for this report."}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold">
                Nearby infrastructure
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                OpenStreetMap infrastructure detected around the
                reported location.
              </p>
            </div>

            <span className="text-xs text-muted-foreground">
              Radius: {infrastructure?.radius ?? 500} m
            </span>
          </div>

          {!infrastructure ? (
            <div className="mt-6 rounded-lg bg-muted/40 p-5 text-sm text-muted-foreground">
              Infrastructure data was not available for this report.
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InfrastructureCount
                  label="Schools"
                  value={counts.schools}
                />

                <InfrastructureCount
                  label="Hospitals"
                  value={counts.hospitals}
                />

                <InfrastructureCount
                  label="Clinics"
                  value={counts.clinics}
                />

                <InfrastructureCount
                  label="Bus stops"
                  value={counts.bus_stops}
                />

                <InfrastructureCount
                  label="Railway"
                  value={counts.railway_stations}
                />

                <InfrastructureCount
                  label="Major roads"
                  value={counts.major_roads}
                />

                <InfrastructureCount
                  label="Police"
                  value={counts.police_stations}
                />

                <InfrastructureCount
                  label="Fire stations"
                  value={counts.fire_stations}
                />

                <InfrastructureCount
                  label="Traffic signals"
                  value={counts.traffic_signals}
                />

                <InfrastructureCount
                  label="Crossings"
                  value={counts.crossings}
                />
              </div>

              {uniqueNearby.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold">
                    Nearby locations
                  </h3>

                  <div className="mt-3 divide-y divide-border rounded-lg border border-border">
                    {uniqueNearby.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="flex items-center justify-between gap-4 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs capitalize text-muted-foreground">
                            {item.type.replaceAll("_", " ")}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs text-muted-foreground">
                          {item.distance_m} m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function InfrastructureCount({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  return (
    <div className="rounded-lg bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value ?? 0}
      </p>
    </div>
  );
}
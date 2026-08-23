"use client";

import Link from "next/link";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface AdminReportMapItem {
  id: string;
  latitude: number;
  longitude: number;
  riskLevel: string;
  riskScore: number;
  status: string;
}

interface AdminReportMapProps {
  reports: AdminReportMapItem[];
}

const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapBounds({
  reports,
}: {
  reports: AdminReportMapItem[];
}) {
  const map = useMap();

  useEffect(() => {
    if (reports.length === 0) {
      return;
    }

    if (reports.length === 1) {
      map.setView(
        [reports[0].latitude, reports[0].longitude],
        15,
      );

      return;
    }

    const bounds = L.latLngBounds(
      reports.map((item) => [
        item.latitude,
        item.longitude,
      ]),
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 15,
    });
  }, [map, reports]);

  return null;
}

function getRiskClass(riskLevel: string) {
  switch (riskLevel.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-600";

    case "HIGH":
      return "bg-orange-500/10 text-orange-600";

    case "MEDIUM":
      return "bg-amber-500/10 text-amber-600";

    case "LOW":
      return "bg-emerald-500/10 text-emerald-600";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export function AdminReportMap({
  reports,
}: AdminReportMapProps) {
  const defaultCenter: [number, number] = [
    22.5726,
    88.3639,
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <h2 className="font-semibold">
            Report locations
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Active infrastructure reports across monitored areas.
          </p>
        </div>

        <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {reports.length} active
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="flex h-[420px] items-center justify-center bg-muted/20 px-6 text-center">
          <div>
            <p className="text-sm font-medium">
              No active reports
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Resolved reports are removed from the active map.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[420px] w-full">
          <MapContainer
            center={defaultCenter}
            zoom={12}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapBounds reports={reports} />

            {reports.map((item) => (
              <Marker
                key={item.id}
                position={[
                  item.latitude,
                  item.longitude,
                ]}
                icon={markerIcon}
              >
                <Popup>
                  <div className="min-w-[210px]">
                    <p className="text-sm font-semibold">
                      Report #{item.id}
                    </p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-muted-foreground">
                          Risk
                        </span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getRiskClass(
                            item.riskLevel,
                          )}`}
                        >
                          {item.riskLevel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-muted-foreground">
                          Risk score
                        </span>

                        <span className="text-xs font-medium">
                          {item.riskScore.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-muted-foreground">
                          Status
                        </span>

                        <span className="text-xs font-medium">
                          {formatStatus(item.status)}
                        </span>
                      </div>

                      <div className="pt-2">
                        <Link
                          href={`/report/${item.id}`}
                          className="inline-flex w-full items-center justify-center rounded-md bg-foreground px-3 py-2 text-xs font-semibold text-background transition hover:opacity-90"
                        >
                          View report
                        </Link>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </section>
  );
}
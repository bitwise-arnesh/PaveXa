"use client";

import dynamic from "next/dynamic";
import {
  FormEvent,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  MapPin,
  MapPinned,
  X,
} from "lucide-react";

import { toast } from "sonner";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

interface Detection {
  type: string;
  confidence: number;
  bbox?: number[];
}

interface RiskBreakdown {
  infrastructure_risk?: number;
  report_density?: number;
}

interface RiskResult {
  risk_score: number;
  risk_level: string;
  breakdown?: RiskBreakdown;
  infrastructure_risk?: number;
  report_density_risk?: number;
  nearby_report_count?: number;
}

interface InfrastructureResult {
  available?: boolean;
  radius?: number;
  counts?: Record<string, number>;

  nearest?: Record<
    string,
    {
      name: string;
      distance_m: number;
      latitude: number;
      longitude: number;
      osm_id?: number;
    } | null
  >;

  nearby?: {
    type: string;
    name: string;
    distance_m: number;
    latitude: number;
    longitude: number;
    osm_id?: number;
  }[];
}

interface DetectionResponse {
  message?: string;
  filename?: string;
  detections?: Detection[];
  gis?: InfrastructureResult;
  risk?: RiskResult;
  detail?: string;
}

interface ReportResponse {
  message?: string;

  report?: {
    id: string;
    riskScore?: number;
    riskLevel?: string;
    infrastructureRisk?: number;
    infrastructureData?: string | null;
    imageUrl?: string | null;
  };

  risk?: RiskResult;
  error?: string;
}

const LocationPicker = dynamic(
  () => import("./location-picker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[350px] items-center justify-center rounded-lg border border-border bg-muted/30">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />

          <p className="mt-2 text-sm text-muted-foreground">
            Loading map...
          </p>
        </div>
      </div>
    ),
  },
);

export function ReportModal({
  open,
  onClose,
}: ReportModalProps) {
  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showMap, setShowMap] =
    useState(false);

  const [detections, setDetections] =
    useState<Detection[]>([]);

  const [risk, setRisk] =
    useState<RiskResult | null>(null);

  const [infrastructure, setInfrastructure] =
    useState<InfrastructureResult | null>(
      null,
    );

  if (!open) return null;

  const resetForm = () => {
    setImage(null);
    setPreview(null);

    setLatitude("");
    setLongitude("");

    setDescription("");

    setShowMap(false);

    setDetections([]);
    setRisk(null);
    setInfrastructure(null);
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose();
  };

  const handleImage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid image", {
        description:
          "Please select a valid image file.",
      });

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      toast.error("Image is too large", {
        description:
          "Please choose an image smaller than 10 MB.",
      });

      return;
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file),
    );

    setDetections([]);
    setRisk(null);
    setInfrastructure(null);
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location unavailable", {
        description:
          "Geolocation is not supported by your browser.",
      });

      return;
    }

    toast.loading(
      "Getting accurate location...",
      {
        id: "location",
      },
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords;

        setLatitude(
          String(latitude),
        );

        setLongitude(
          String(longitude),
        );

        toast.success(
          "Location detected",
          {
            id: "location",
            description: `Accuracy approximately ${Math.round(
              accuracy,
            )} meters.`,
          },
        );
      },

      (error) => {
        toast.error(
          "Unable to get your location",
          {
            id: "location",

            description:
              error.code === 1
                ? "Please allow location access."
                : "Please try again or select the location on the map.",
          },
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
  };

  const handleMapLocation = (
    lat: number,
    lon: number,
  ) => {
    /*
     * IMPORTANT:
     *
     * Do NOT use toFixed() here.
     *
     * Leaflet gives us the full JavaScript
     * number. String() preserves the useful
     * precision without intentionally
     * truncating the coordinates.
     */

    setLatitude(
      String(lat),
    );

    setLongitude(
      String(lon),
    );

    toast.success(
      "Location selected",
      {
        description:
          "The selected map coordinates have been added.",
      },
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!image) {
      toast.error("Image required", {
        description:
          "Please upload a road image.",
      });

      return;
    }

    if (
      !latitude ||
      !longitude
    ) {
      toast.error(
        "Location required",
        {
          description:
            "Please provide the road location or choose a point on the map.",
        },
      );

      return;
    }

    const lat =
      Number(latitude);

    const lon =
      Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      toast.error(
        "Invalid location",
        {
          description:
            "Please enter valid latitude and longitude.",
        },
      );

      return;
    }

    setLoading(true);

    setDetections([]);
    setRisk(null);
    setInfrastructure(null);

    try {
      const apiUrl =
        process.env
          .NEXT_PUBLIC_API_URL ||
        "http://localhost:8000";

      /*
       * Nearby reports
       */

      const reportCountResponse =
        await fetch(
          `/api/reports?latitude=${encodeURIComponent(
            latitude,
          )}&longitude=${encodeURIComponent(
            longitude,
          )}&radius=500`,
        );

      if (
        !reportCountResponse.ok
      ) {
        throw new Error(
          "Failed to calculate nearby report count.",
        );
      }

      const reportCountData =
        await reportCountResponse.json();

      const reportCount =
        Number(
          reportCountData.count,
        ) || 0;

      console.log(
        "SELECTED LATITUDE:",
        latitude,
      );

      console.log(
        "SELECTED LONGITUDE:",
        longitude,
      );

      console.log(
        "PREVIOUS REPORT COUNT:",
        reportCount,
      );

      /*
       * Send image to AI backend
       */

      const detectionFormData =
        new FormData();

      detectionFormData.append(
        "image",
        image,
      );

      detectionFormData.append(
        "latitude",
        latitude,
      );

      detectionFormData.append(
        "longitude",
        longitude,
      );

      detectionFormData.append(
        "report_count",
        reportCount.toString(),
      );

      const detectionResponse =
        await fetch(
          `${apiUrl}/api/detect`,
          {
            method: "POST",
            body: detectionFormData,
          },
        );

      let detectionData: DetectionResponse;

      try {
        detectionData =
          await detectionResponse.json();
      } catch {
        throw new Error(
          "The backend returned an invalid response.",
        );
      }

      if (
        !detectionResponse.ok
      ) {
        throw new Error(
          detectionData.detail ||
            "Failed to analyze the image.",
        );
      }

      const result =
        detectionData.detections ??
        [];

      if (
        result.length === 0
      ) {
        toast.error(
          "No road damage detected",
          {
            description:
              "The model found no road damage, so the report was not saved.",
          },
        );

        return;
      }

      const primaryDetection =
        [...result].sort(
          (a, b) =>
            b.confidence -
            a.confidence,
        )[0];

      setDetections(
        result,
      );

      /*
       * GIS
       */

      const gisResult =
        detectionData.gis ??
        null;

      setInfrastructure(
        gisResult,
      );

      /*
       * Risk
       */

      const calculatedRisk =
        detectionData.risk;

      if (!calculatedRisk) {
        throw new Error(
          "Risk calculation was not returned by the backend.",
        );
      }

      setRisk(
        calculatedRisk,
      );

      const infrastructureRisk =
        calculatedRisk
          .breakdown
          ?.infrastructure_risk ??
        0;

      console.log(
        "GIS RESULT:",
        gisResult,
      );

      console.log(
        "INFRASTRUCTURE RISK:",
        infrastructureRisk,
      );

      console.log(
        "REPORT DENSITY:",
        calculatedRisk
          .breakdown
          ?.report_density ??
          0,
      );

      console.log(
        "FINAL RISK:",
        calculatedRisk,
      );

      /*
       * Save report
       */

      const reportFormData =
        new FormData();

      reportFormData.append(
        "latitude",
        latitude,
      );

      reportFormData.append(
        "longitude",
        longitude,
      );

      reportFormData.append(
        "damageType",
        primaryDetection.type,
      );

      reportFormData.append(
        "confidence",
        primaryDetection.confidence.toString(),
      );

      reportFormData.append(
        "riskScore",
        calculatedRisk.risk_score.toString(),
      );

      reportFormData.append(
        "riskLevel",
        calculatedRisk.risk_level,
      );

      reportFormData.append(
        "infrastructureRisk",
        infrastructureRisk.toString(),
      );

      reportFormData.append(
        "gis",
        JSON.stringify(
          gisResult,
        ),
      );

      reportFormData.append(
        "description",
        description.trim(),
      );

      reportFormData.append(
        "image",
        image,
      );

      const reportResponse =
        await fetch(
          "/api/reports",
          {
            method: "POST",
            body: reportFormData,
          },
        );

      let reportData: ReportResponse;

      try {
        reportData =
          await reportResponse.json();
      } catch {
        throw new Error(
          "The database API returned an invalid response.",
        );
      }

      if (
        !reportResponse.ok
      ) {
        throw new Error(
          reportData.error ||
            "Failed to save the report.",
        );
      }

      console.log(
        "SAVED REPORT:",
        reportData.report,
      );

      toast.success(
        "Report submitted",
        {
          description: `Risk ${calculatedRisk.risk_level} · Score ${calculatedRisk.risk_score}`,
        },
      );

      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error(
        "Report submission error:",
        error,
      );

      toast.error(
        "Unable to submit report",
        {
          description:
            error instanceof Error
              ? error.message
              : "Could not complete the report.",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const infrastructureCounts =
    infrastructure?.counts ??
    {};

  const nearby =
    infrastructure?.nearby ??
    [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !loading
        ) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background shadow-2xl">
        {/* Header */}

        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold">
              Report road damage
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload a photo and location for analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Image */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Road image
            </label>

            <label className="relative flex min-h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 transition hover:bg-muted/50">
              {preview ? (
                <img
                  src={preview}
                  alt="Selected road"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <p className="text-sm font-medium">
                    Choose an image
                  </p>

                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or WEBP · Max 10 MB
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImage}
                disabled={loading}
                className="sr-only"
              />
            </label>

            {image && (
              <p className="mt-2 truncate text-xs text-muted-foreground">
                {image.name}
              </p>
            )}
          </div>

          {/* Location */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">
                Location
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowMap(
                      (value) =>
                        !value,
                    )
                  }
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-xs font-medium transition hover:opacity-70 disabled:opacity-50"
                >
                  <MapPinned className="h-3.5 w-3.5" />

                  {showMap
                    ? "Hide map"
                    : "Choose on map"}
                </button>

                <button
                  type="button"
                  onClick={handleLocation}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-xs font-medium transition hover:opacity-70 disabled:opacity-50"
                >
                  <MapPin className="h-3.5 w-3.5" />

                  Use my location
                </button>
              </div>
            </div>

            {showMap && (
              <div className="mb-3">
                <LocationPicker
                  latitude={
                    latitude
                      ? Number(
                          latitude,
                        )
                      : null
                  }
                  longitude={
                    longitude
                      ? Number(
                          longitude,
                        )
                      : null
                  }
                  onSelect={
                    handleMapLocation
                  }
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Click anywhere on the map to select the exact road location.
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                inputMode="decimal"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) =>
                  setLatitude(
                    e.target.value,
                  )
                }
                disabled={loading}
                className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-foreground/10"
              />

              <input
                type="text"
                inputMode="decimal"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) =>
                  setLongitude(
                    e.target.value,
                  )
                }
                disabled={loading}
                className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-foreground/10"
              />
            </div>

            {latitude &&
              longitude && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Selected:{" "}
                  <span className="font-mono text-foreground">
                    {latitude},{" "}
                    {longitude}
                  </span>
                </p>
              )}
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
              <span className="ml-1 font-normal text-muted-foreground">
                (optional)
              </span>
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              disabled={loading}
              placeholder="Describe the road damage..."
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          {/* Detections */}

          {detections.length >
            0 && (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm font-semibold">
                Detected damage
              </p>

              <div className="mt-3 space-y-2">
                {detections.map(
                  (
                    detection,
                    index,
                  ) => (
                    <div
                      key={`${detection.type}-${index}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="capitalize">
                        {
                          detection.type
                        }
                      </span>

                      <span className="font-medium">
                        {(
                          detection.confidence *
                          100
                        ).toFixed(
                          1,
                        )}
                        %
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Infrastructure */}

          {infrastructure && (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  Nearby infrastructure
                </p>

                <span className="text-xs text-muted-foreground">
                  {infrastructure.radius ??
                    500}{" "}
                  m
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-background p-2">
                  Schools

                  <span className="float-right font-medium">
                    {
                      infrastructureCounts.schools ??
                      0
                    }
                  </span>
                </div>

                <div className="rounded-md bg-background p-2">
                  Hospitals

                  <span className="float-right font-medium">
                    {
                      infrastructureCounts.hospitals ??
                      0
                    }
                  </span>
                </div>

                <div className="rounded-md bg-background p-2">
                  Clinics

                  <span className="float-right font-medium">
                    {
                      infrastructureCounts.clinics ??
                      0
                    }
                  </span>
                </div>

                <div className="rounded-md bg-background p-2">
                  Bus stops

                  <span className="float-right font-medium">
                    {
                      infrastructureCounts.bus_stops ??
                      0
                    }
                  </span>
                </div>

                <div className="rounded-md bg-background p-2">
                  Railway

                  <span className="float-right font-medium">
                    {
                      infrastructureCounts.railway_stations ??
                      0
                    }
                  </span>
                </div>

                <div className="rounded-md bg-background p-2">
                  Major roads

                  <span className="float-right font-medium">
                    {
                      infrastructureCounts.major_roads ??
                      0
                    }
                  </span>
                </div>

                <div className="rounded-md bg-background p-2">
                  Police

                  <span className="float-right font-medium">
                    {
                      infrastructureCounts.police_stations ??
                      0
                    }
                  </span>
                </div>

                <div className="rounded-md bg-background p-2">
                  Fire stations

                  <span className="float-right font-medium">
                    {
                      infrastructureCounts.fire_stations ??
                      0
                    }
                  </span>
                </div>
              </div>

              {nearby.length >
                0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Nearest
                  </p>

                  {nearby
                    .slice(
                      0,
                      5,
                    )
                    .map(
                      (
                        item,
                        index,
                      ) => (
                        <div
                          key={`${item.osm_id ?? item.name}-${index}`}
                          className="flex items-center justify-between gap-3 text-xs"
                        >
                          <span className="truncate capitalize">
                            {item.name !==
                            "Unnamed"
                              ? item.name
                              : item.type}
                          </span>

                          <span className="shrink-0 text-muted-foreground">
                            {
                              item.distance_m
                            }{" "}
                            m
                          </span>
                        </div>
                      ),
                    )}
                </div>
              )}
            </div>
          )}

          {/* Risk */}

          {risk && (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  Risk assessment
                </p>

                <span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold">
                  {
                    risk.risk_level
                  }
                </span>
              </div>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-semibold tracking-tight">
                  {
                    risk.risk_score
                  }
                </span>

                <span className="pb-1 text-xs text-muted-foreground">
                  / 100
                </span>
              </div>

              {risk.breakdown && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {risk
                    .breakdown
                    .infrastructure_risk !==
                    undefined && (
                    <div className="rounded-md bg-background p-2">
                      Infrastructure

                      <span className="float-right font-medium">
                        {
                          risk
                            .breakdown
                            .infrastructure_risk
                        }
                      </span>
                    </div>
                  )}

                  {risk
                    .breakdown
                    .report_density !==
                    undefined && (
                    <div className="rounded-md bg-background p-2">
                      Previous reports

                      <span className="float-right font-medium">
                        {
                          risk
                            .breakdown
                            .report_density
                        }
                      </span>
                    </div>
                  )}
                </div>
              )}

              {risk.nearby_report_count !==
                undefined && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Previous reports within
                  500 m:{" "}
                  <span className="font-medium text-foreground">
                    {
                      risk.nearby_report_count
                    }
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Buttons */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="h-10 rounded-md border border-border px-5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Analyzing..."
                : "Analyze report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
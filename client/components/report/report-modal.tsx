"use client";

import { FormEvent, useState } from "react";
import {
  ImagePlus,
  Loader2,
  MapPin,
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
}

export function ReportModal({
  open,
  onClose,
}: ReportModalProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);

  if (!open) return null;

  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setLatitude("");
    setLongitude("");
    setDescription("");
    setDetections([]);
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose();
  };

  const handleImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid image", {
        description: "Please select a valid image file.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image is too large", {
        description: "Please choose an image smaller than 10 MB.",
      });
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setDetections([]);
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location unavailable", {
        description:
          "Geolocation is not supported by your browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());

        toast.success("Location detected", {
          description: "Your current coordinates have been added.",
        });
      },
      () => {
        toast.error("Unable to get your location", {
          description:
            "Please allow location access or enter the coordinates manually.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!image) {
      toast.error("Image required", {
        description: "Please upload a road image.",
      });
      return;
    }

    if (!latitude || !longitude) {
      toast.error("Location required", {
        description: "Please provide the road location.",
      });
      return;
    }

    setLoading(true);
    setDetections([]);

    try {
      const formData = new FormData();

      formData.append("image", image);

      // These will be consumed by the backend
      // when we extend /api/detect.
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("description", description);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8000";

      const response = await fetch(
        `${apiUrl}/api/detect`,
        {
          method: "POST",
          body: formData,
        }
      );

      let data: {
        message?: string;
        filename?: string;
        detections?: Detection[];
        detail?: string;
      };

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to analyze the image."
        );
      }

      const result = data.detections ?? [];

      setDetections(result);

      toast.success("Image analyzed successfully", {
        description:
          result.length > 0
            ? `${result.length} road damage detection${
                result.length === 1 ? "" : "s"
              } found.`
            : "No road damage was detected.",
      });

      console.log("YOLO response:", data);
    } catch (error) {
      console.error("Report submission error:", error);

      toast.error("Unable to analyze image", {
        description:
          error instanceof Error
            ? error.message
            : "Could not connect to the PaveXa backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
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

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) =>
                  setLatitude(e.target.value)
                }
                disabled={loading}
                className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-foreground/10"
              />

              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) =>
                  setLongitude(e.target.value)
                }
                disabled={loading}
                className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-foreground/10"
              />
            </div>
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
                setDescription(e.target.value)
              }
              disabled={loading}
              placeholder="Describe the road damage..."
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          {/* Detection result */}
          {detections.length > 0 && (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm font-semibold">
                Detected damage
              </p>

              <div className="mt-3 space-y-2">
                {detections.map((detection, index) => (
                  <div
                    key={`${detection.type}-${index}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="capitalize">
                      {detection.type}
                    </span>

                    <span className="font-medium">
                      {(detection.confidence * 100).toFixed(
                        1
                      )}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
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
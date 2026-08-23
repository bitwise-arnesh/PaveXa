"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "UNDER_REVIEW",
  "IN_PROGRESS",
  "RESOLVED",
] as const;

interface ReportStatusSelectProps {
  reportId: string;
  status: string;
}

export function ReportStatusSelect({
  reportId,
  status,
}: ReportStatusSelectProps) {
  const router = useRouter();

  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const nextStatus = event.target.value;
    const previousStatus = value;

    setValue(nextStatus);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/reports/${reportId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      if (!response.ok) {
        let message = "Failed to update report status.";

        try {
          const data = await response.json();

          if (data?.error) {
            message = data.error;
          }
        } catch {
          // Ignore invalid JSON responses.
        }

        throw new Error(message);
      }

      /*
       * The dashboard is a Server Component.
       *
       * Refresh causes all database queries in the dashboard
       * to execute again.
       *
       * Therefore:
       *
       * - Under review count updates
       * - Resolved count updates
       * - Active reports updates
       * - Resolution rate updates
       * - Priority queue updates
       *
       * If the report was changed to RESOLVED,
       * it disappears from the priority queue because
       * the dashboard query excludes resolved reports.
       */
      router.refresh();
    } catch (error) {
      console.error(
        "REPORT STATUS UPDATE ERROR:",
        error,
      );

      setValue(previousStatus);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to update report status.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={loading}
      aria-label={`Change status for report ${reportId}`}
      className="
        h-8
        min-w-[130px]
        rounded-md
        border
        border-border
        bg-background
        px-2
        text-xs
        font-medium
        text-foreground
        outline-none
        transition-colors
        hover:bg-muted
        focus:border-foreground/40
        focus:ring-2
        focus:ring-foreground/10
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {STATUSES.map((statusOption) => (
        <option
          key={statusOption}
          value={statusOption}
        >
          {statusOption.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}
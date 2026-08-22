"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { ReportModal } from "./report-modal";

interface ReportButtonProps {
  variant?: "button" | "link";
  className?: string;
}

export function ReportButton({
  variant = "button",
  className = "",
}: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      {variant === "button" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:shadow-md ${className}`}
        >
          <Plus className="h-4 w-4" />
          Report road damage
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center gap-2 text-sm font-semibold hover:underline ${className}`}
        >
          Submit a report
          <ArrowUpRight className="h-4 w-4" />
        </button>
      )}

      <ReportModal
        open={open}
        onClose={handleClose}
      />
    </>
  );
}
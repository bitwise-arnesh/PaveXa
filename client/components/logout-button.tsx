"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await authClient.signOut();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="
        inline-flex
        items-center
        gap-2
        rounded-lg
        border
        border-border
        bg-card
        px-4
        py-2.5
        text-sm
        font-medium
        text-muted-foreground
        transition-colors
        hover:bg-muted
        hover:text-foreground
        disabled:pointer-events-none
        disabled:opacity-50
      "
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}

      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
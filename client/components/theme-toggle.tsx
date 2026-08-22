"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted"
      aria-label="Toggle theme"
    >
      {/* Light mode icon */}
      <Sun className="h-4 w-4 dark:hidden" />

      {/* Dark mode icon */}
      <Moon className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
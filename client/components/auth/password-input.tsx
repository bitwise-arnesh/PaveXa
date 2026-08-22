"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function PasswordInput({
  error,
  className = "",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          {...props}
          type={visible ? "text" : "password"}
          className={`
            h-11
            w-full
            rounded-md
            border
            border-input
            bg-background
            px-3
            pr-11
            text-sm
            outline-none
            transition-all
            placeholder:text-muted-foreground
            focus:border-foreground/40
            focus:ring-2
            focus:ring-foreground/10
            ${error ? "border-destructive" : ""}
            ${className}
          `}
        />

        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="
            absolute
            right-0
            top-0
            flex
            h-11
            w-11
            items-center
            justify-center
            text-muted-foreground
            transition-colors
            hover:text-foreground
          "
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
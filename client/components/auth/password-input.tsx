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
            border-zinc-300
            bg-white
            px-3
            pr-11
            text-sm
            text-zinc-950
            outline-none
            transition-all
            placeholder:text-zinc-400
            focus:border-zinc-500
            focus:ring-2
            focus:ring-zinc-950/10
            disabled:cursor-not-allowed
            disabled:bg-zinc-100
            disabled:opacity-60
            ${error ? "border-red-500 focus:border-red-500" : ""}
            ${className}
          `}
        />

        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          className="
            absolute
            right-0
            top-0
            flex
            h-11
            w-11
            items-center
            justify-center
            text-zinc-400
            transition-colors
            hover:text-zinc-950
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
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PasswordInput } from "./password-input";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function UserLoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const { data: session, error } =
        await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

      if (error) {
        console.error("User login error:", error);

        toast.error("Unable to sign in", {
          description: getLoginErrorMessage(
            error.message,
            error.status
          ),
        });

        return;
      }

      if (!session) {
        toast.error("Unable to sign in", {
          description:
            "No authenticated session was created. Please try again.",
        });

        return;
      }

      toast.success("Welcome back!", {
        description: "You have been signed in successfully.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Unexpected login error:", error);

      toast.error("Something went wrong", {
        description:
          "We couldn't sign you in. Please try again.",
      });
    } finally {
      // Clear the form after every submission attempt.
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={
            errors.email ? "email-error" : undefined
          }
          {...register("email")}
          className="
            h-11
            w-full
            rounded-md
            border
            border-input
            bg-background
            px-3
            text-sm
            outline-none
            transition-all
            placeholder:text-muted-foreground
            focus:border-foreground/40
            focus:ring-2
            focus:ring-foreground/10
            aria-[invalid=true]:border-destructive
            aria-[invalid=true]:focus:ring-destructive/10
          "
        />

        {errors.email && (
          <p
            id="email-error"
            className="mt-1.5 text-xs text-destructive"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium"
          >
            Password
          </label>

          <Link
            href="/forgot-password"
            className="
              text-xs
              text-muted-foreground
              transition-colors
              hover:text-foreground
              hover:underline
              underline-offset-4
            "
          >
            Forgot password?
          </Link>
        </div>

        <PasswordInput
          id="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          group
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-md
          bg-foreground
          text-sm
          font-semibold
          text-background
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:shadow-md
          active:translate-y-0
          disabled:pointer-events-none
          disabled:opacity-60
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign in

            <ArrowRight
              className="
                h-4 w-4
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
            />
          </>
        )}
      </button>

      {/* Register */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="
            font-semibold
            text-foreground
            underline-offset-4
            transition-colors
            hover:underline
          "
        >
          Create account
        </Link>
      </p>
    </form>
  );
}

/**
 * Convert Better Auth errors into
 * user-friendly messages.
 */
function getLoginErrorMessage(
  message?: string,
  status?: number
): string {
  const normalized = message?.toLowerCase() ?? "";

  // Don't expose detailed authentication information.
  if (
    normalized.includes("invalid") ||
    normalized.includes("incorrect") ||
    normalized.includes("password") ||
    normalized.includes("credential") ||
    status === 401
  ) {
    return "The email or password is incorrect.";
  }

  if (status === 403) {
    return "Your account is not authorized to sign in.";
  }

  if (status === 429) {
    return "Too many login attempts. Please wait a moment and try again.";
  }

  if (status && status >= 500) {
    return "The authentication service is temporarily unavailable. Please try again.";
  }

  return (
    message ||
    "Unable to sign in. Please check your credentials and try again."
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PasswordInput } from "./password-input";
import { authClient } from "@/lib/auth-client";

const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginForm) => {
    try {
      /*
       * Admin authentication uses the normal
       * Better Auth email/password flow.
       *
       * Authorization is handled separately by
       * the protected /admin/dashboard route.
       */
      const { data: session, error } =
        await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

      if (error) {
        console.error("Admin login error:", error);

        toast.error("Unable to sign in", {
          description: getAdminLoginErrorMessage(
            error.message,
            error.status
          ),
        });

        return;
      }

      /*
       * Make sure Better Auth actually created
       * an authenticated session.
       */
      if (!session) {
        toast.error("Unable to sign in", {
          description:
            "No authenticated session was created. Please try again.",
        });

        return;
      }

      /*
       * Do NOT trust the client to determine whether
       * this user is an administrator.
       *
       * /admin/dashboard must perform the actual
       * server-side role check.
       */
      toast.success("Welcome to Command Center", {
        description:
          "You have been signed in successfully.",
      });

      router.push("/admin/dashboard");
    } catch (error) {
      console.error(
        "Unexpected admin authentication error:",
        error
      );

      toast.error("Something went wrong", {
        description:
          "The authentication service could not process your request.",
      });
    } finally {
      /*
       * Always clear the form after submission,
       * whether authentication succeeds or fails.
       */
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
          placeholder="admin@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={
            errors.email
              ? "admin-email-error"
              : undefined
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
            aria-invalid:border-destructive
            aria-invalid:focus:ring-destructive/10
          "
        />

        {errors.email && (
          <p
            id="admin-email-error"
            className="mt-1.5 text-xs text-destructive"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium"
        >
          Password
        </label>

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
            Sign in to command center

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

      {/* Security note */}
      <p className="text-center text-xs leading-5 text-muted-foreground">
        Authorized PaveXa infrastructure personnel only.
      </p>
    </form>
  );
}

/**
 * Convert Better Auth errors into safe,
 * user-friendly messages.
 *
 * We intentionally avoid exposing sensitive
 * authentication information.
 */
function getAdminLoginErrorMessage(
  message?: string,
  status?: number
): string {
  const normalized = message?.toLowerCase() ?? "";

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
    return "This account is not authorized to access the command center.";
  }

  if (status === 429) {
    return "Too many login attempts. Please wait a moment and try again.";
  }

  if (status && status >= 500) {
    return "The authentication service is temporarily unavailable.";
  }

  return (
    message ||
    "Unable to sign in. Please check your credentials and try again."
  );
}
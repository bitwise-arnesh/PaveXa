"use client";

import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";

import { PasswordInput } from "./password-input";
import { authClient } from "@/lib/auth-client";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error(
          "Better Auth registration error:",
          error
        );

        const errorMessage =
          getRegistrationErrorMessage(
            error.message,
            error.status
          );

        toast.error("Unable to create account", {
          description: errorMessage,
        });

        return;
      }

      toast.success("Account created successfully", {
        description: "Welcome to PaveXa.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Unexpected registration error:",
        error
      );

      toast.error("Something went wrong", {
        description:
          "We couldn't create your account. Please try again.",
      });
    } finally {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      {/* Full name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-zinc-950"
        >
          Full name
        </label>

        <input
          id="name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={
            errors.name ? "name-error" : undefined
          }
          {...register("name")}
          className="
            h-11
            w-full
            rounded-md
            border
            border-zinc-300
            bg-white
            px-3
            text-sm
            text-zinc-950
            outline-none
            transition-all
            placeholder:text-zinc-400
            focus:border-zinc-500
            focus:ring-2
            focus:ring-zinc-950/10
            aria-invalid:border-red-500
            aria-invalid:focus:ring-red-500/10
          "
        />

        {errors.name && (
          <p
            id="name-error"
            className="mt-1.5 text-xs text-red-600"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-zinc-950"
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
            border-zinc-300
            bg-white
            px-3
            text-sm
            text-zinc-950
            outline-none
            transition-all
            placeholder:text-zinc-400
            focus:border-zinc-500
            focus:ring-2
            focus:ring-zinc-950/10
            aria-invalid:border-red-500
            aria-invalid:focus:ring-red-500/10
          "
        />

        {errors.email && (
          <p
            id="email-error"
            className="mt-1.5 text-xs text-red-600"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-zinc-950"
        >
          Password
        </label>

        <PasswordInput
          id="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
        />
      </div>

      {/* Confirm password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-zinc-950"
        >
          Confirm password
        </label>

        <PasswordInput
          id="confirmPassword"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
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
          bg-zinc-950
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-zinc-800
          hover:shadow-md
          active:translate-y-0
          disabled:pointer-events-none
          disabled:opacity-60
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Create account

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

      {/* Login */}
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}

        <Link
          href="/login"
          className="
            font-semibold
            text-zinc-950
            underline-offset-4
            transition-colors
            hover:underline
          "
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

function getRegistrationErrorMessage(
  message?: string,
  status?: number
): string {
  const normalized =
    message?.toLowerCase() ?? "";

  if (
    normalized.includes("already exists") ||
    normalized.includes("already registered") ||
    normalized.includes("unique")
  ) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (
    normalized.includes("invalid email") ||
    normalized.includes("email")
  ) {
    return "Please check that your email address is valid.";
  }

  if (
    normalized.includes("password") &&
    normalized.includes("short")
  ) {
    return "Your password must be at least 8 characters long.";
  }

  if (status === 400) {
    return "Some of the information provided is invalid. Please check the form and try again.";
  }

  if (status === 409) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (status && status >= 500) {
    return "Our authentication service is temporarily unavailable. Please try again in a moment.";
  }

  return (
    message ||
    "Please check your information and try again."
  );
}
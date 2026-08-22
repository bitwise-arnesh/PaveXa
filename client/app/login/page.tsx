"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { UserLoginForm } from "@/components/auth/user-login-form";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending || session) {
    return null;
  }

  return (
    <AuthShell
      title="Welcome back."
      description="Sign in to report infrastructure issues and track your submitted reports."
    >
      <UserLoginForm />
    </AuthShell>
  );
}
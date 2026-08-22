import { AuthShell } from "@/components/auth/auth-shell";
import { UserLoginForm } from "@/components/auth/user-login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back."
      description="Sign in to report infrastructure issues and track your submitted reports."
    >
      <UserLoginForm />
    </AuthShell>
  );
}
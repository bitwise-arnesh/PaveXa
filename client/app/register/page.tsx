import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account."
      description="Join PaveXa and help build a smarter, safer road infrastructure network."
    >
      <RegisterForm />
    </AuthShell>
  );
}
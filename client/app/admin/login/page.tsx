import { AuthShell } from "@/components/auth/auth-shell";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export default function AdminLoginPage() {
  return (
    <AuthShell
      type="admin"
      title="Officer access."
      description="Sign in to the PaveXa infrastructure command center."
    >
      <AdminLoginForm />
    </AuthShell>
  );
}
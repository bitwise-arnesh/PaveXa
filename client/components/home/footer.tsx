export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div className="font-semibold text-slate-950">
          🛡 PaveXa
        </div>

        <p>
          © 2026 PaveXa. Intelligent Road Infrastructure.
        </p>

        <div className="flex gap-5">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
}
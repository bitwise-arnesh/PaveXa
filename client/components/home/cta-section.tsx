import Link from "next/link";

export function CtaSection() {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Make Every Road Safer
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          Join the initiative to improve civic infrastructure through
          intelligent data.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Enter Public Portal
          </Link>

          <Link
            href="/admin/login"
            className="rounded-md border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Officer Login
          </Link>
        </div>
      </div>
    </section>
  );
}
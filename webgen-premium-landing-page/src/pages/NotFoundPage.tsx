import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0d0d0f,#050505_48%,#0b0b0d)] p-6 text-white">
      <div className="w-full max-w-lg rounded-[2rem] border border-[#2a2a2d] bg-[#111214]/90 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#a1a1aa]">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm text-[#d4d4d8]">
          The route you tried to open does not exist.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/auth"
            className="rounded-full bg-[#f5f5f5] px-5 py-3 text-sm font-semibold text-[#111214] transition hover:bg-white"
          >
            Go to login
          </Link>
          <Link
            to="/diary/home"
            className="rounded-full border border-[#303036] bg-[#17181b] px-5 py-3 text-sm font-semibold text-[#e5e7eb] transition hover:border-[#8b5cf6]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

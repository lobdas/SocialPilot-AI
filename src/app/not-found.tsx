import Link from "next/link";
import { ArrowLeft, Home, Compass, LifeBuoy } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans flex flex-col justify-between">
      <MarketingNavbar />

      <main className="max-w-3xl mx-auto px-6 py-24 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        {/* Glowing 404 Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121A2B] border border-[#D4FF32]/20 text-[#D4FF32] text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(212,255,50,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#D4FF32] animate-pulse" />
          Error 404 • Destination Unknown
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Lost in the Social Stream?
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you are looking for doesn&apos;t exist, has been relocated, or is currently under scheduled maintenance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4FF32] text-[#070B14] font-bold text-xs hover:bg-[#c2ed2b] transition-all shadow-[0_0_25px_rgba(212,255,50,0.25)] hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#121A2B] border border-white/10 text-white font-semibold text-xs hover:bg-[#18233a] hover:border-[#D4FF32]/40 transition-all"
          >
            <Compass className="w-4 h-4 text-[#D4FF32]" />
            Open Dashboard
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-white/10 text-slate-400 font-semibold text-xs hover:text-white hover:border-white/20 transition-all"
          >
            <LifeBuoy className="w-4 h-4" />
            Contact Support
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

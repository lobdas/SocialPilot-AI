"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Zap, Menu, X, ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";
import { SocialPilotLogo } from "@/components/ui/logo";

export function MarketingNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Integrations", href: "/integrations" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="border-b border-[rgba(255,255,255,0.08)] bg-[#0B1020]/80 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group">
          <SocialPilotLogo size="sm" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "hover:text-white transition-colors relative py-1",
                  isActive ? "text-[#D4FF32] font-semibold" : "text-slate-300"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4FF32] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                Hi, <strong className="text-white">{user?.name.split(" ")[0]}</strong>
              </span>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_20px_rgba(212,255,50,0.3)] hover:bg-[#C2ED25] transition-all flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Go to Dashboard</span>
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_20px_rgba(212,255,50,0.3)] hover:bg-[#C2ED25] transition-all transform hover:scale-[1.02] flex items-center gap-1.5"
              >
                <span>Start Creating Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#182238] transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[rgba(255,255,255,0.08)] bg-[#0B1020]/95 backdrop-blur-xl px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#D4FF32] font-medium py-1 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs text-center flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#121A2B] text-white font-semibold text-xs text-center border border-[rgba(255,255,255,0.08)]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs text-center"
                >
                  Start Creating Free →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, CheckCircle2, ArrowLeft, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { SocialPilotLogo } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("alex@apexgrowth.io");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex items-center justify-center p-6 bg-grid-pattern">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <SocialPilotLogo size="lg" />
          </Link>
          <h1 className="text-xl font-bold text-white">Recover Password</h1>
          <p className="text-xs text-slate-400">Enter your email to receive recovery instructions</p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-5">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Account Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@agency.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Generating recovery token..." : "Send Recovery Instructions"}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center py-2 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-[#D4FF32]/10 text-[#D4FF32] flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">Recovery Token Generated</h3>
                <p className="text-xs text-slate-400">
                  Target: <span className="text-white font-medium">{email}</span>
                </p>
              </div>

              {/* Explicit Staging / Demo Disclaimer */}
              <div className="p-3 rounded-xl bg-[#182238] border border-amber-500/30 text-amber-300 text-left text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo Environment Notice</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  In production, a signed JWT token is securely dispatched via Amazon SES or Resend. In this preview environment, live SMTP dispatch is staged. You can test the password reset flow directly using the simulated token below:
                </p>
              </div>

              <Link
                href="/reset-password?token=demo-reset-token-2026"
                className="w-full py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2"
              >
                <span>Simulate Reset Link Flow →</span>
              </Link>
            </div>
          )}

          <div className="text-center pt-2 border-t border-[rgba(255,255,255,0.06)]">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

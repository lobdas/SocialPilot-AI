"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { SocialPilotLogo } from "@/components/ui/logo";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validate token existence
  const isTokenValid = token && token.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    // Simulate token update
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login?reset=success");
    }, 600);
  };

  if (!isTokenValid) {
    return (
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-white">Invalid or Expired Reset Token</h2>
        <p className="text-xs text-slate-400">
          This password reset token is either missing, has expired, or was already consumed.
        </p>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25]"
          >
            Request a New Recovery Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <SocialPilotLogo size="lg" />
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">Set New Password</h1>
        <p className="text-xs text-slate-400">Enter a secure new password for your account</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-5">
        <div className="p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] text-slate-400">
          <span>Token Verified</span>
          <span className="font-mono text-[#D4FF32] text-[10px]">{token.slice(0, 14)}...</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,255,50,0.2)] disabled:opacity-50"
          >
            {isLoading ? "Saving changes..." : "Update Password & Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex items-center justify-center p-6 bg-grid-pattern">
      <Suspense fallback={<div className="text-xs text-slate-400">Verifying token...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { SocialPilotLogo } from "@/components/ui/logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const resetSuccess = searchParams.get("reset") === "success";

  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState("alex@apexgrowth.io");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push(redirectTarget);
    } else {
      setErrorMsg(res.error || "Failed to sign in. Please verify your credentials.");
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
    router.push(redirectTarget);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <SocialPilotLogo size="lg" />
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">Welcome Back</h1>
        <p className="text-xs text-slate-400">Sign in to your agency or creator workspace</p>
      </div>

      {resetSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Password reset successful! You may now sign in with your new credentials.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-5">
        {/* Instant Demo Access Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#182238] to-[#121A2B] border border-[rgba(212,255,50,0.25)] flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4FF32]" />
              <span>Instant Demo Mode</span>
            </div>
            <div className="text-[10px] text-slate-400">Pre-seeded with 6 accounts & channels</div>
          </div>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="px-3 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] text-xs font-bold hover:bg-[#C2ED25] transition-all shadow-[0_0_12px_rgba(212,255,50,0.25)] whitespace-nowrap"
          >
            1-Click Demo →
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@agency.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-[10px] text-slate-400 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-[#0B1020] border-[rgba(255,255,255,0.12)] text-[#D4FF32] focus:ring-0"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,255,50,0.2)] disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Button with Honest Staging Indicator */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => alert("Google OAuth requires configuring GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local. Use 1-Click Demo or email sign in to proceed.")}
            className="w-full py-2 px-3 rounded-xl bg-[#0B1020] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-slate-300 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c-.2-.7-.4-1.5-.4-2.4z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
              />
            </svg>
            <span>Continue with Google</span>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">OAuth</span>
          </button>
        </div>

        <div className="text-center text-xs text-slate-400 pt-3 border-t border-[rgba(255,255,255,0.06)]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#D4FF32] font-semibold hover:underline">
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex items-center justify-center p-6 bg-grid-pattern">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

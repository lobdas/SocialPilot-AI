"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, CheckCircle2, ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { SocialPilotLogo } from "@/components/ui/logo";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendNotice("Verification link re-sent! (Simulated)");
      setTimeout(() => setResendNotice(null), 3500);
    }, 800);
  };

  const handleDemoBypass = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex items-center justify-center p-6 bg-grid-pattern">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <SocialPilotLogo size="lg" />
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">Verify Your Email</h1>
          <p className="text-xs text-slate-400">
            We sent a verification link to <strong className="text-white">{user?.email || "your email address"}</strong>
          </p>
        </div>

        {resendNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{resendNotice}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D4FF32]/10 text-[#D4FF32] flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              Please click the link in your email to confirm your account and activate your agency workspace.
            </p>
            <p className="text-[11px] text-slate-500">
              Can&apos;t find the email? Check your spam folder or request a new code.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 rounded-xl bg-[#182238] hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending email...</span>
                </>
              ) : (
                <span>Resend Verification Email</span>
              )}
            </button>

            {/* Demo Mode Instant Bypass */}
            <button
              onClick={handleDemoBypass}
              className="w-full py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,255,50,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Continue to Workspace (Demo Mode) →</span>
            </button>
          </div>

          <div className="text-center pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <Link href="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
              Sign in with a different account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

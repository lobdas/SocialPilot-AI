"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { SocialPilotLogo } from "@/components/ui/logo";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password strength evaluation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg("You must accept the Terms of Service to create a workspace.");
      return;
    }

    setIsLoading(true);
    const res = await register({
      name,
      workspaceName,
      email,
      pass: password,
    });
    setIsLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setErrorMsg(res.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex items-center justify-center p-6 bg-grid-pattern">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <SocialPilotLogo size="lg" />
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">Create Your Workspace</h1>
          <p className="text-xs text-slate-400">14-day free trial • No credit card required</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Company / Agency Name</label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Apex Growth Digital"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="sarah@apexgrowth.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Create Password</label>
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

              {/* Password strength bar */}
              {password && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1 w-full bg-[#182238] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength <= 25
                          ? "w-1/4 bg-rose-500"
                          : strength <= 50
                          ? "w-2/4 bg-amber-500"
                          : strength <= 75
                          ? "w-3/4 bg-blue-400"
                          : "w-full bg-[#D4FF32]"
                      }`}
                    />
                  </div>
                  <div className="text-[9px] text-slate-400">
                    {strength <= 25 && "Weak (add letters & numbers)"}
                    {strength === 50 && "Fair (add uppercase/symbols)"}
                    {strength === 75 && "Good password"}
                    {strength === 100 && "Strong password"}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 text-slate-300 cursor-pointer text-[11px] leading-tight">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-[#0B1020] border-[rgba(255,255,255,0.12)] text-[#D4FF32] focus:ring-0"
                />
                <span>
                  I agree to the <span className="text-white hover:underline">Terms of Service</span> and acknowledge the <span className="text-white hover:underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,255,50,0.2)] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Setting up workspace...</span>
              ) : (
                <>
                  <span>Create Workspace & Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-[rgba(255,255,255,0.06)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#D4FF32] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

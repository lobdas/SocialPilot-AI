import Link from "next/link";
import { Cookie, Settings, CheckCircle2, Info } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <MarketingNavbar />

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-10">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Privacy &amp; Tracking</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Cookie Policy</h1>
          <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Version 1.0</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-8 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cookie className="w-4 h-4 text-[#D4FF32]" />
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you visit websites. They help web applications remember your preferences, keep you securely authenticated across browser sessions, and analyze platform performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#D4FF32]" />
              2. Categories of Cookies We Use
            </h2>
            
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-1.5">
                <h3 className="font-semibold text-white">A. Strictly Necessary &amp; Security Cookies (Essential)</h3>
                <p className="text-slate-400">
                  These cookies are vital for the core functionality of SocialPilot AI. They handle secure authentication (NextAuth / JWT session tokens), CSRF token verification, and multi-tenant workspace routing. These cannot be disabled without breaking the platform.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-1.5">
                <h3 className="font-semibold text-white">B. Preference &amp; Functional Cookies</h3>
                <p className="text-slate-400">
                  These cookies store your UI settings, such as active workspace selection, theme preference (Dark Mode), calendar view filters, and draft editor layout options.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-1.5">
                <h3 className="font-semibold text-white">C. Performance &amp; Analytics Cookies</h3>
                <p className="text-slate-400">
                  We collect aggregated, anonymized telemetry on feature adoption, AI generation latency, and error rates to monitor platform stability and enhance workflow speed.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-[#D4FF32]" />
              3. Third-Party Cookies
            </h2>
            <p>
              When you interact with third-party social integrations (Meta OAuth, Google Sign-In, Stripe Checkout), these services may set cookies for cross-site authentication and payment fraud prevention in accordance with their respective privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
              4. Managing Your Cookie Preferences
            </h2>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you disable strictly necessary cookies, key features of SocialPilot AI (such as staying signed in or syncing social scheduling queues) will cease to function properly.
            </p>
            <p className="text-slate-400">
              For any questions regarding our use of cookies or tracking mechanisms, please reach out to <a href="mailto:privacy@socialpilot.ai" className="text-[#D4FF32] underline">privacy@socialpilot.ai</a>.
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

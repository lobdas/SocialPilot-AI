import Link from "next/link";
import { Zap, ShieldCheck } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <MarketingNavbar />

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-10">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Legal Agreements</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Version 1.2</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the SocialPilot AI software platform (&quot;Service&quot;), provided by SocialPilot Technologies Inc. (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white">2. Platform Usage & Content Responsibilities</h2>
            <p>
              You retain all ownership of the briefs, brand assets, and creative prompts you provide to SocialPilot AI. You are solely responsible for ensuring that content generated and published through the Service complies with the terms of service of third-party platforms (including Meta, LinkedIn, and X).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white">3. Third-Party Social API Tokens</h2>
            <p>
              Connecting third-party social media accounts grants SocialPilot AI authorization to publish posts, retrieve performance analytics, and ingest comments on your behalf. Access tokens are stored encrypted using AES-256-GCM. You may revoke API access at any time through your social account settings or the SocialPilot dashboard.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white">4. Fair Use & Rate Limits</h2>
            <p>
              Usage of AI generation features is subject to monthly quota metering determined by your subscription tier. Automated abuse, scrapers, or attempts to bypass rate limits will result in suspension.
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

import Link from "next/link";
import { Zap, Lock, ShieldCheck } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <MarketingNavbar />

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-10">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Privacy & Security</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Version 1.2</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when creating an account, including your name, email address, company name, and encrypted social authentication tokens. We also collect usage metrics to enforce AI generation quotas and ensure platform availability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white">2. Token Encryption & Security</h2>
            <p>
              Your security is foundational to SocialPilot AI. All OAuth 2.0 access and refresh tokens are encrypted at rest using AES-256-GCM with randomized 12-byte initialization vectors and 16-byte authentication tags. Decryption occurs only at the moment of publishing dispatch inside our isolated workers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white">3. Multi-Tenant Data Isolation</h2>
            <p>
              SocialPilot enforces strict relational workspace isolation in PostgreSQL. Your drafts, analytics, client feedback, and Brand Brain parameters are inaccessible to other tenants.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white">4. Your Data Rights</h2>
            <p>
              You may request an export of your workspace data or deletion of your account and associated social connection tokens at any time by contacting our security team.
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

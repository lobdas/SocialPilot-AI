"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const PLANS = [
  {
    name: "Starter",
    priceMonthly: "$29",
    priceAnnual: "$24",
    desc: "For solo creators and independent founders building organic authority.",
    features: [
      "5 Connected social accounts",
      "2,500 AI text generations / mo",
      "50 AI image renders / mo",
      "Unified Social Inbox (1 seat)",
      "Interactive Content Calendar",
      "10 GB media asset storage",
    ],
    highlight: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    priceMonthly: "$79",
    priceAnnual: "$64",
    desc: "For growing brands and marketing teams scaling multi-channel output.",
    features: [
      "15 Connected social accounts",
      "10,000 AI text generations / mo",
      "250 AI image renders / mo",
      "Brand Brain Intelligence (3 brands)",
      "Zero-login client approval links",
      "Cross-channel unified analytics",
      "3 Team member seats",
      "25 GB media asset storage",
    ],
    highlight: true,
    cta: "Start Free Trial",
  },
  {
    name: "Agency",
    priceMonthly: "$199",
    priceAnnual: "$159",
    desc: "For digital agencies and multi-brand operators requiring full white-label capabilities.",
    features: [
      "50 Connected social accounts",
      "Unlimited AI text generations",
      "1,000 AI image renders / mo",
      "Unlimited Brand Brain workspaces",
      "Custom branded client approval portals",
      "Priority 24/7 API publishing queues",
      "Unlimited team seats & role permissions",
      "100 GB media asset storage",
    ],
    highlight: false,
    cta: "Start Free Trial",
  },
];

const FAQS = [
  {
    q: "Is payment active right now?",
    a: "No. SocialPilot AI is currently operating in an open preview state with live Demo Mode enabled. All registered accounts receive full Professional tier capabilities without entering credit card details.",
  },
  {
    q: "What platforms can I actually publish to?",
    a: "Tier 1 live integrations are fully supported for Meta (Facebook Pages & Instagram Business) and LinkedIn. Other networks such as X, Threads, and Pinterest are staged behind feature flags and available in simulated mode.",
  },
  {
    q: "How do passwordless client approvals work?",
    a: "For any draft post, you can generate an encrypted signed token link. Your external clients can open the page on mobile or desktop, review multi-platform previews, submit revision notes, or approve the post with a single click—no login or account creation required.",
  },
  {
    q: "Can I enforce medical, financial, or regulatory guardrails?",
    a: "Yes. In the Brand Brain settings, you can define 'Prohibited Claims'. The AI generation pipeline rejects forbidden claims and guarantees strict brand voice alignment before drafts reach your calendar.",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <MarketingNavbar />

      <main className="py-20 px-6 max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Predictable Pricing</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Invest in Velocity, Not Overhead.
          </h1>
          <p className="text-sm text-slate-400">
            Simple, honest tiers designed to scale with your agency or content pipeline.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs ${billingCycle === "monthly" ? "text-white font-bold" : "text-slate-400"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="w-12 h-6 rounded-full bg-[#182238] border border-[rgba(255,255,255,0.12)] p-1 relative transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#D4FF32] transition-transform ${
                  billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs flex items-center gap-1.5 ${billingCycle === "annual" ? "text-white font-bold" : "text-slate-400"}`}>
              <span>Annual Billing</span>
              <span className="text-[10px] bg-[#D4FF32]/15 text-[#D4FF32] font-mono px-2 py-0.2 rounded-full font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Honest Staging Notice */}
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-[#182238] border border-[rgba(212,255,50,0.25)] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-[#D4FF32]/10 text-[#D4FF32] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span>Billing Gateway in Staging (Demo Mode Active)</span>
            </div>
            <p className="text-[11px] text-slate-300">
              We do not accept live credit card payments in this preview environment. You can create an account and immediately access the full platform for free without entering billing information.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-3xl bg-[#121A2B] border flex flex-col justify-between space-y-8 relative ${
                plan.highlight
                  ? "border-[#D4FF32]/50 shadow-[0_0_40px_rgba(212,255,50,0.15)]"
                  : "border-[rgba(255,255,255,0.08)]"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#D4FF32] text-[#0B1020] text-[10px] font-black uppercase tracking-wider">
                  Recommended for Agencies
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnual}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-[#D4FF32] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/register"
                className={`w-full py-3 rounded-xl font-bold text-xs text-center transition-all ${
                  plan.highlight
                    ? "bg-[#D4FF32] text-[#0B1020] hover:bg-[#C2ED25] shadow-[0_0_25px_rgba(212,255,50,0.25)]"
                    : "bg-[#182238] text-white hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)]"
                }`}
              >
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-8 pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about our preview architecture.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.06)] space-y-2"
              >
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#D4FF32] flex-shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

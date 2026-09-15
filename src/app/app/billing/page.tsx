"use client";

import { useState } from "react";
import { CreditCard, Check, Zap, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Starter",
    priceUsd: "$29",
    priceInr: "₹2,499",
    period: "/month",
    description: "For solo creators and small businesses growing single brands.",
    features: [
      "Up to 5 connected channels",
      "2,500 AI text generations / mo",
      "50 AI image renders / mo",
      "Unified Social Inbox",
      "10 GB media storage",
      "Standard Analytics",
    ],
    isCurrent: false,
    cta: "Downgrade to Starter",
  },
  {
    name: "Professional",
    priceUsd: "$79",
    priceInr: "₹6,499",
    period: "/month",
    description: "For scaling marketing teams and multiple brands.",
    features: [
      "Up to 15 connected channels",
      "10,000 AI text generations / mo",
      "250 AI image renders / mo",
      "Brand Brain (3 brands)",
      "Client Approval links",
      "Priority API publishing queues",
      "25 GB media storage",
    ],
    isCurrent: false,
    cta: "Select Pro",
  },
  {
    name: "Agency",
    priceUsd: "$199",
    priceInr: "₹16,499",
    period: "/month",
    description: "For digital marketing agencies managing multiple client workspaces.",
    features: [
      "Up to 50 connected channels",
      "Unlimited AI generations",
      "1,000 AI image renders / mo",
      "Unlimited Brand Brains",
      "Custom tokenized client approval portals",
      "Dedicated multi-workspace switcher",
      "100 GB media storage",
      "WhatsApp Cloud API integration",
    ],
    isCurrent: true,
    badge: "CURRENT ACTIVE PLAN",
    cta: "Manage Plan",
  },
];

export default function BillingPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Billing & Subscriptions</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              Agency Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your subscription tier, billing gateway (Stripe / Razorpay), and monthly usage limits.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center bg-[#121A2B] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
          <button
            onClick={() => setCurrency("USD")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-colors",
              currency === "USD" ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
            )}
          >
            Stripe (USD)
          </button>
          <button
            onClick={() => setCurrency("INR")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-colors",
              currency === "INR" ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
            )}
          >
            Razorpay (INR)
          </button>
        </div>
      </div>

      {/* Usage Meters */}
      <div className="p-6 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Monthly Quota Consumption
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>AI Generations</span>
              <span className="text-white font-mono font-semibold">3,420 / 10,000</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#182238] overflow-hidden">
              <div className="w-[34%] h-full bg-[#D4FF32] rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>AI Creatives</span>
              <span className="text-white font-mono font-semibold">84 / 250</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#182238] overflow-hidden">
              <div className="w-[33%] h-full bg-[#C4B5FD] rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Connected Channels</span>
              <span className="text-white font-mono font-semibold">6 / 50</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#182238] overflow-hidden">
              <div className="w-[12%] h-full bg-emerald-400 rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Object Storage</span>
              <span className="text-white font-mono font-semibold">4.2 GB / 100 GB</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#182238] overflow-hidden">
              <div className="w-[4%] h-full bg-sky-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "p-6 rounded-2xl border flex flex-col justify-between transition-all relative",
              tier.isCurrent
                ? "bg-[#182238] border-[#D4FF32] shadow-[0_0_30px_rgba(212,255,50,0.12)]"
                : "bg-[#121A2B] border-[rgba(255,255,255,0.08)]"
            )}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-6 text-[9px] font-extrabold bg-[#D4FF32] text-[#0B1020] px-2.5 py-0.5 rounded-full tracking-wider">
                {tier.badge}
              </span>
            )}

            <div>
              <h3 className="text-base font-bold text-white">{tier.name}</h3>
              <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{tier.description}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">
                  {currency === "USD" ? tier.priceUsd : tier.priceInr}
                </span>
                <span className="text-xs text-slate-400">{tier.period}</span>
              </div>

              <div className="space-y-2 mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)] text-xs text-slate-300">
                {tier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4FF32] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={cn(
                "w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-all",
                tier.isCurrent
                  ? "bg-[#121A2B] text-slate-300 border border-[rgba(255,255,255,0.1)] hover:bg-[#1E2A44]"
                  : "bg-[#D4FF32] text-[#0B1020] hover:bg-[#C2ED25]"
              )}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

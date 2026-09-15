"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap,
  Sparkles,
  Share2,
  Calendar,
  Inbox,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  ChevronRight,
  Sliders,
  Star,
  Clock,
  Send,
  AlertTriangle,
  Building2,
  Users,
  Check,
  LayoutDashboard,
  BrainCircuit,
  MessageSquare,
  ImageIcon,
} from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { SocialPilotIcon } from "@/components/ui/logo";

export default function LandingPage() {
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<"editor" | "calendar" | "inbox" | "brand">("editor");

  const PLATFORMS_STRIP = [
    { name: "LinkedIn", status: "Active Tier 1", color: "#0A66C2" },
    { name: "Facebook", status: "Active Tier 1", color: "#1877F2" },
    { name: "Instagram", status: "Active Tier 1", color: "#E4405F" },
    { name: "X (Twitter)", status: "Staged / In Dev", color: "#FFFFFF" },
    { name: "WhatsApp Business", status: "Cloud API Staged", color: "#25D366" },
    { name: "Threads", status: "Staged / In Dev", color: "#FFFFFF" },
    { name: "Pinterest", status: "Coming Soon", color: "#BD081C" },
    { name: "YouTube", status: "Coming Soon", color: "#FF0000" },
    { name: "TikTok", status: "Coming Soon", color: "#00F2FE" },
  ];

  const CORE_FEATURES = [
    {
      icon: Sparkles,
      title: "AI Content Studio",
      desc: "One prompt adapts into native posts for every platform, automatically adhering to custom character counts, hashtags, and visual hooks.",
      badge: "Core",
    },
    {
      icon: ImageIcon,
      title: "AI Image Studio",
      desc: "Generate brand-aligned social graphics formatted for 1:1 square feeds, 4:5 portrait, 9:16 vertical stories, and 16:9 banners in seconds.",
      badge: "Visual",
    },
    {
      icon: Calendar,
      title: "Content Calendar",
      desc: "Interactive multi-brand calendar with drag-and-drop scheduling, cross-channel time slot optimization, and scheduled publishing workers.",
      badge: "Planner",
    },
    {
      icon: Share2,
      title: "One-Click Publishing",
      desc: "Idempotent job queue with lease locking and automatic status verification prevents duplicate publishes and verifies delivery.",
      badge: "Reliability",
    },
    {
      icon: Inbox,
      title: "Unified Inbox & AI Copilot",
      desc: "Centralize customer comments and direct messages across all accounts with AI-suggested replies guarded against regulatory claims.",
      badge: "Inbox",
    },
    {
      icon: BrainCircuit,
      title: "Brand Brain Intelligence",
      desc: "Store distinct tone profiles, target demographics, and strictly prohibited claims per brand to guarantee total voice consistency.",
      badge: "Guardrails",
    },
    {
      icon: BarChart3,
      title: "Cross-Platform Analytics",
      desc: "Consolidated engagement rates, audience reach breakdown, and conversion tracking across all connected accounts in real time.",
      badge: "Insights",
    },
    {
      icon: Building2,
      title: "Agency Multi-Tenant Workspaces",
      desc: "Manage dozens of client brands with separate asset buckets, granular team roles, and zero-login client approval portals.",
      badge: "Agencies",
    },
  ];

  const HOW_IT_WORKS_STEPS = [
    {
      step: "01",
      title: "Connect Your Social Accounts",
      desc: "Link your Facebook Pages, Instagram Business, and LinkedIn accounts with encrypted OAuth tokens.",
    },
    {
      step: "02",
      title: "Create Content with AI",
      desc: "Enter a brief or campaign idea. SocialPilot adapts tone, hooks, and hashtags natively for each network.",
    },
    {
      step: "03",
      title: "Review & Customize",
      desc: "Fine-tune captions, attach multi-ratio AI graphics, or send a passwordless review link to external clients.",
    },
    {
      step: "04",
      title: "Schedule or Publish",
      desc: "Publish immediately or schedule across timezones with guaranteed idempotency and concurrency locking.",
    },
    {
      step: "05",
      title: "Track Performance & Engage",
      desc: "Monitor consolidated analytics and reply to customer comments from a single unified social inbox.",
    },
  ];

  const USE_CASES = [
    {
      title: "Digital Marketing Agencies",
      desc: "Manage 20+ clients from one dashboard with zero cross-tenant contamination and client approval links.",
      highlight: "Saves 25+ hours / client / month",
    },
    {
      title: "Content Creators",
      desc: "Repurpose ideas into native threads, carousels, and LinkedIn thought leadership without manual copy-pasting.",
      highlight: "4x publishing velocity",
    },
    {
      title: "High-Growth Startups",
      desc: "Build an authoritative omni-channel presence without needing a dedicated 5-person social team.",
      highlight: "Consolidated organic reach",
    },
    {
      title: "Small Businesses",
      desc: "Maintain active, engaging presence across Instagram, Facebook, and WhatsApp with effortless AI generation.",
      highlight: "Zero marketing overhead",
    },
    {
      title: "Enterprise Marketing Teams",
      desc: "Enforce strict regulatory compliance, prohibited claims, and brand safety across global marketing tiers.",
      highlight: "100% Brand Brain compliance",
    },
  ];

  const PRICING_PREVIEW = [
    {
      name: "Starter",
      price: "$29",
      desc: "For solopreneurs and independent creators scaling organic reach.",
      features: [
        "5 Connected social accounts",
        "2,500 AI text generations / mo",
        "50 AI image generations / mo",
        "Unified social inbox",
        "Content calendar & scheduling",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      price: "$79",
      popular: true,
      desc: "For fast-moving marketing teams and high-velocity brands.",
      features: [
        "15 Connected social accounts",
        "10,000 AI text generations / mo",
        "250 AI image generations / mo",
        "Brand Brain (up to 3 brands)",
        "Zero-login client approval links",
        "Cross-channel analytics",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Agency",
      price: "$199",
      desc: "For agencies managing multi-brand client pipelines.",
      features: [
        "50 Connected social accounts",
        "Unlimited AI generations",
        "1,000 AI image generations / mo",
        "Unlimited Brand Brain workspaces",
        "Custom branded client portals",
        "WhatsApp Business Cloud API",
      ],
      cta: "Start Free Trial",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 selection:bg-[#D4FF32] selection:text-[#0B1020] font-sans">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 overflow-hidden bg-grid-pattern">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D4FF32]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-[#C4B5FD]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182238] border border-[rgba(212,255,50,0.3)] text-[#D4FF32] text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Midnight Intelligence SaaS Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Create once. Publish everywhere.{" "}
            <span className="text-[#D4FF32]">Manage everything.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The all-in-one AI social media management platform combining multi-channel distribution, built-in visual generation, and native platform psychology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-extrabold text-sm shadow-[0_0_30px_rgba(212,255,50,0.35)] hover:bg-[#C2ED25] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Start Creating Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.12)] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" /> Zero-login client approval links
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" /> Free instant Demo Mode
            </span>
          </div>
        </div>

        {/* Hero Interactive UI Showcase */}
        <div className="max-w-6xl mx-auto mt-14 p-2.5 rounded-3xl bg-[#182238]/60 border border-[rgba(255,255,255,0.1)] shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="rounded-2xl overflow-hidden bg-[#0B1020] border border-[rgba(255,255,255,0.06)] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 pl-2">
                  socialpilot.ai/app/content-studio
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  ● REALISTIC PREVIEW MODE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.06)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Sparkles className="w-4 h-4 text-[#D4FF32]" />
                  <span>1. Single Brief</span>
                </div>
                <p className="text-xs text-slate-300">
                  Topic: &quot;Why omni-channel native distribution outperforms cross-posting in 2026&quot;
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Tone: Authoritative • Brand: Apex Growth
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#182238] border border-[#D4FF32]/40 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>2. Native Adaptations</span>
                  <span className="text-[#D4FF32] text-[10px]">Generated in 0.8s</span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>• <strong>LinkedIn:</strong> Line-spaced essay with engagement hook.</div>
                  <div>• <strong>Instagram:</strong> Carousel hook & visual aesthetic.</div>
                  <div>• <strong>X:</strong> Punchy thread opener under 280 chars.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.06)] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>3. Client Portal Review</span>
                  <span className="text-emerald-400 text-[10px] font-bold">Approved</span>
                </div>
                <p className="text-xs text-slate-300">
                  Horizon Client clicked &quot;Approve&quot; from passwordless link.
                </p>
                <div className="text-[10px] text-[#D4FF32] font-mono">
                  Scheduled for Friday at 2:00 PM EST
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Platform Integration Strip */}
      <section className="py-10 border-y border-[rgba(255,255,255,0.06)] bg-[#070B14]">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <div className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            Engineered for Omni-Channel Social Distribution
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {PLATFORMS_STRIP.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] text-xs"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="font-semibold text-white">{p.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    p.status.includes("Active")
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            The Modern Bottleneck Isn&apos;t Ideation. <br />
            <span className="text-[#D4FF32]">It&apos;s Multi-Channel Friction.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Marketing teams waste over 15 hours every week reformatting text, adjusting image aspect ratios, and switching between 8 different browser tabs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Old Way */}
          <div className="p-8 rounded-3xl bg-[#121A2B]/40 border border-rose-500/20 space-y-6">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-rose-500/15 flex items-center justify-center text-xs">✕</span>
              <span>The Fragmented Old Workflow</span>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Copy-pasting identical captions across LinkedIn, X, and Instagram, leading to collapsed reach from non-native formatting.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Manually resizing graphics in separate design tools for 1:1, 4:5, and 16:9 aspect ratios.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Cluttered email chains and Slack messages chasing clients for post approvals.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Missed comments and lead inquiries scattered across 6 distinct social app inboxes.</span>
              </li>
            </ul>
          </div>

          {/* SocialPilot Way */}
          <div className="p-8 rounded-3xl bg-[#182238] border border-[#D4FF32]/30 space-y-6 shadow-[0_0_40px_rgba(212,255,50,0.1)]">
            <div className="flex items-center gap-2 text-[#D4FF32] font-bold text-sm">
              <CheckCircle2 className="w-6 h-6 text-[#D4FF32]" />
              <span>The SocialPilot AI Unified Engine</span>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-200">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#D4FF32] flex-shrink-0 mt-0.5" />
                <span>Single input brief automatically translates into native formatting, line breaks, and hooks for each platform.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#D4FF32] flex-shrink-0 mt-0.5" />
                <span>AI Image Studio presets assets for Feeds, Stories, Carousels, and Banners in one click.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#D4FF32] flex-shrink-0 mt-0.5" />
                <span>Zero-login tokenized links allow external clients to preview live mockups and approve instantly.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#D4FF32] flex-shrink-0 mt-0.5" />
                <span>Unified Social Inbox consolidates customer interactions with context-aware AI reply suggestions.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Features Section (8 Pillars) */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-14" id="features">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">The Intelligent Platform</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">8 Pillars of SocialPilot AI</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Designed to replace 5 disconnected subscriptions with a unified, brand-aware operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CORE_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[#D4FF32]/40 transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#182238] text-[#D4FF32] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono bg-[#0B1020] text-slate-400 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)]">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#D4FF32] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-[#070B14] border-y border-[rgba(255,255,255,0.06)]" id="how-it-works">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Streamlined Operations</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">How SocialPilot AI Works</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              From creative spark to cross-channel engagement in 5 simple, automated steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-3 relative"
              >
                <div className="text-2xl font-black text-[#D4FF32]/30 font-mono">
                  {step.step}
                </div>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase with Realistic Mockups */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-12" id="showcase">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#C4B5FD] uppercase tracking-wider">Product Showcase</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Explore the Interface</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Inspect our production-grade tools loaded with realistic multi-channel agency demo data.
          </p>
        </div>

        {/* Showcase Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveShowcaseTab("editor")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeShowcaseTab === "editor"
                ? "bg-[#D4FF32] text-[#0B1020] shadow-[0_0_15px_rgba(212,255,50,0.25)]"
                : "bg-[#121A2B] text-slate-300 hover:text-white"
            }`}
          >
            AI Content Studio
          </button>
          <button
            onClick={() => setActiveShowcaseTab("calendar")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeShowcaseTab === "calendar"
                ? "bg-[#D4FF32] text-[#0B1020] shadow-[0_0_15px_rgba(212,255,50,0.25)]"
                : "bg-[#121A2B] text-slate-300 hover:text-white"
            }`}
          >
            Content Calendar
          </button>
          <button
            onClick={() => setActiveShowcaseTab("inbox")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeShowcaseTab === "inbox"
                ? "bg-[#D4FF32] text-[#0B1020] shadow-[0_0_15px_rgba(212,255,50,0.25)]"
                : "bg-[#121A2B] text-slate-300 hover:text-white"
            }`}
          >
            Unified Social Inbox
          </button>
          <button
            onClick={() => setActiveShowcaseTab("brand")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeShowcaseTab === "brand"
                ? "bg-[#D4FF32] text-[#0B1020] shadow-[0_0_15px_rgba(212,255,50,0.25)]"
                : "bg-[#121A2B] text-slate-300 hover:text-white"
            }`}
          >
            Brand Brain Guardrails
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4 text-xs">
            <span className="font-mono text-slate-400">
              socialpilot.ai/app/{activeShowcaseTab}
            </span>
            <span className="bg-[#D4FF32]/10 text-[#D4FF32] px-2.5 py-0.5 rounded-full font-bold text-[10px]">
              INTERACTIVE DEMO PREVIEW
            </span>
          </div>

          {activeShowcaseTab === "editor" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-2">
                <span className="text-[10px] text-[#D4FF32] font-mono uppercase">LinkedIn Thought Leadership</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  &quot;The biggest bottleneck in modern social growth isn&apos;t creativity. It&apos;s the friction between creation and native multi-channel distribution...&quot;
                </p>
                <div className="text-[10px] text-slate-500">220 chars • #MarketingStrategy #Leadership</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-2">
                <span className="text-[10px] text-[#D4FF32] font-mono uppercase">X (Twitter) Hook</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  &quot;Most marketing teams waste 15+ hours weekly reformatting captions. Here is what changes with native multi-channel adaptation: 4x dwell time.&quot;
                </p>
                <div className="text-[10px] text-slate-500">195 chars • #Growth #MarketingAI</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-2">
                <span className="text-[10px] text-[#D4FF32] font-mono uppercase">Instagram Visual Hook</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  &quot;Stop copying &amp; pasting your captions across platforms 🛑✨ Native psychology matters. Swipe through to learn how to scale your brand reach...&quot;
                </p>
                <div className="text-[10px] text-slate-500">180 chars • #SocialMediaTips</div>
              </div>
            </div>
          )}

          {activeShowcaseTab === "calendar" && (
            <div className="p-6 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white">September 2026 Schedule</span>
                <span>Timezone: America/New_York (EST)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs space-y-1">
                  <div className="text-[10px] text-[#D4FF32] font-mono">FRIDAY • 2:00 PM EST</div>
                  <div className="font-bold text-white">Quarterly Growth Report Snapshot</div>
                  <div className="text-slate-400 text-[11px]">Targets: LinkedIn • Status: Scheduled</div>
                </div>
                <div className="p-3 rounded-lg bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs space-y-1">
                  <div className="text-[10px] text-emerald-400 font-mono">TOMORROW • 4:30 PM EST</div>
                  <div className="font-bold text-white">AI Image Studio Featurette</div>
                  <div className="text-slate-400 text-[11px]">Targets: X, Instagram • Status: Ready</div>
                </div>
                <div className="p-3 rounded-lg bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs space-y-1">
                  <div className="text-[10px] text-amber-400 font-mono">MONDAY • 10:00 AM EST</div>
                  <div className="font-bold text-white">Agency Case Study Rollout</div>
                  <div className="text-slate-400 text-[11px]">Targets: LinkedIn, Threads • Pending Sign-off</div>
                </div>
              </div>
            </div>
          )}

          {activeShowcaseTab === "inbox" && (
            <div className="p-6 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>David Chen (LinkedIn Comment)</span>
                </div>
                <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] px-2 py-0.5 rounded font-mono">
                  HIGH-INTENT LEAD
                </span>
              </div>
              <p className="text-xs text-slate-300 italic">
                &quot;We manage 12 FinTech accounts. How does the Brand Brain guarantee AI output never violates strict regulatory restrictions?&quot;
              </p>
              <div className="p-3 rounded-lg bg-[#182238] border border-[#D4FF32]/20 text-xs text-slate-200">
                <div className="text-[10px] text-[#D4FF32] font-semibold mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Copilot Suggestion (Brand-Safe):
                </div>
                &quot;Thanks for reaching out, David! SocialPilot features strict negative prompt guardrails that prevent unverified claims or specific financial figures before publishing.&quot;
              </div>
            </div>
          )}

          {activeShowcaseTab === "brand" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Brand Tone & Voice Profile</span>
                </div>
                <div className="text-xs text-slate-300">
                  Authoritative, bold, analytical, yet approachable and empowering. Crisp sentences with zero fluff.
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B1020] border border-rose-500/20 space-y-2">
                <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Prohibited Claims Guardrail</span>
                </div>
                <div className="text-xs text-slate-300">
                  Never guarantee exact ROI percentages; never promise 100% automated virality without human review.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Tailored Workflows</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Built for High-Agency Teams</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            See how different organizations streamline their distribution engine with SocialPilot AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">{uc.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{uc.desc}</p>
              </div>
              <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] text-[10px] font-bold text-[#D4FF32]">
                {uc.highlight}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview Section with Honest Staging Notice */}
      <section className="py-24 px-6 bg-[#070B14] border-t border-[rgba(255,255,255,0.06)]" id="pricing">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Transparent Investment</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Simple, Predictable Plans</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Choose the tier that fits your agency or brand velocity.
            </p>
          </div>

          {/* Honest Staging Notice */}
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-[#182238] border border-[rgba(212,255,50,0.2)] text-center space-y-1">
            <div className="text-xs font-bold text-[#D4FF32] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Free Unrestricted Preview Active</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Live payment processing is currently staged. All newly registered workspaces immediately receive full Pro demo access with zero credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PREVIEW.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-3xl bg-[#121A2B] border flex flex-col justify-between space-y-6 relative ${
                  plan.popular ? "border-[#D4FF32]/50 shadow-[0_0_30px_rgba(212,255,50,0.15)]" : "border-[rgba(255,255,255,0.08)]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#D4FF32] text-[#0B1020] text-[10px] font-black uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4FF32] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/register"
                  className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-all ${
                    plan.popular
                      ? "bg-[#D4FF32] text-[#0B1020] hover:bg-[#C2ED25] shadow-[0_0_20px_rgba(212,255,50,0.2)]"
                      : "bg-[#182238] text-white hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)]"
                  }`}
                >
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final High-Converting CTA */}
      <section className="py-24 px-6 relative overflow-hidden bg-grid-pattern border-t border-[rgba(255,255,255,0.06)]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4FF32]/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
          <div className="flex items-center justify-center mx-auto">
            <SocialPilotIcon size={52} className="shadow-[0_0_35px_rgba(212,255,50,0.45)]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Your entire social workflow, in one intelligent workspace.
          </h2>

          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Stop losing hours to manual caption reformatting and disconnected browser tabs. Scale your reach effortlessly with SocialPilot AI.
          </p>

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#D4FF32] text-[#0B1020] font-black text-sm shadow-[0_0_35px_rgba(212,255,50,0.35)] hover:bg-[#C2ED25] transition-all transform hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

import Link from "next/link";
import {
  Sparkles,
  Share2,
  Calendar,
  Inbox,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowRight,
  ImageIcon,
  BrainCircuit,
  Building2,
  Lock,
  Cpu,
} from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function FeaturesPage() {
  const PILLARS = [
    {
      id: "content-studio",
      title: "AI Content Studio",
      icon: Sparkles,
      tagline: "One brief. Native cross-network adaptations.",
      description:
        "Generic cross-posting kills algorithm reach. SocialPilot adapts your single concept into native LinkedIn narratives with line spacing, punchy X hooks under 280 characters, Instagram carousel openers, Facebook community updates, Threads, and Pinterest pins.",
      features: [
        "Channel-specific character enforcement",
        "Hashtag cluster generation & relevance scoring",
        "Configurable tone: Authoritative, Bold, Educational, Inspiring",
        "Contextual call-to-actions tailored per network",
      ],
    },
    {
      id: "image-studio",
      title: "AI Image Studio & Creative Suite",
      icon: ImageIcon,
      tagline: "Instant multi-aspect ratio visual generation.",
      description:
        "No need to bounce out to external graphic design software. Produce photorealistic, brand-aligned creative assets preset for 1:1 feeds, 4:5 Instagram portraits, 9:16 vertical stories, and 16:9 LinkedIn landscape headers in seconds.",
      features: [
        "Native aspect ratio exports (1:1, 4:5, 9:16, 16:9)",
        "Pre-configured style prompts (SaaS Minimalist, Cyberpunk, 3D Isometric)",
        "Integrated media library with tagging and asset reuse",
        "Cloud storage integration with media validation safeguards",
      ],
    },
    {
      id: "calendar",
      title: "Interactive Content Calendar",
      icon: Calendar,
      tagline: "Total timeline visibility across all client brands.",
      description:
        "Manage scheduling with drag-and-drop agility. View scheduled, published, and pending approval posts across month, week, and day views with timezone-aware background publishing.",
      features: [
        "Drag-and-drop date rescheduling",
        "Filter by brand, channel, and publication state",
        "Timezone-aware queue execution",
        "Visual preview cards on each calendar cell",
      ],
    },
    {
      id: "publishing",
      title: "One-Click Publishing & Distributed Queue",
      icon: Share2,
      tagline: "Zero duplicate posts with distributed lease locking.",
      description:
        "Built on an idempotent database architecture with SHA-256 payload hashing and concurrency lease locks. If a network blip occurs, SocialPilot retries with exponential backoff without double-posting.",
      features: [
        "Deterministic idempotency keys per publishing job",
        "Distributed lease locks preventing concurrent execution",
        "Asynchronous publishing status verification",
        "Full audit logging of every dispatch attempt",
      ],
    },
    {
      id: "inbox",
      title: "Unified Social Inbox & AI Copilot",
      icon: Inbox,
      tagline: "Consolidated conversations with brand-safe AI replies.",
      description:
        "Never miss a high-intent prospect or customer question. Pull comments and direct messages from LinkedIn, Instagram, X, and Facebook into a single unified workspace, complete with AI response suggestions.",
      features: [
        "Unified multi-platform conversation stream",
        "Sentiment tagging (High Intent Lead, Positive, Inquiry)",
        "Brand Brain guardrails preventing false pricing promises",
        "1-click suggested response adoption",
      ],
    },
    {
      id: "brand-brain",
      title: "Brand Brain Intelligence",
      icon: BrainCircuit,
      tagline: "Guaranteed brand DNA and regulatory safety.",
      description:
        "Store custom tone guidelines, approved copy samples, target demographics, and strictly prohibited claims. Every AI generation is dynamically filtered against your Brand Brain before appearing in drafts.",
      features: [
        "Negative prompt guardrails blocking forbidden claims",
        "Primary and secondary brand hex color integration",
        "Target demographic and audience persona modeling",
        "Golden sample reference storage",
      ],
    },
    {
      id: "analytics",
      title: "Cross-Channel Analytics",
      icon: BarChart3,
      tagline: "Holistic organic performance across networks.",
      description:
        "Track reach, engagement rates, follower velocity, and top-performing content formats across all your social properties in a single consolidated analytics view.",
      features: [
        "Aggregated reach and engagement rate metrics",
        "Platform distribution breakdown charts",
        "Top-performing post leaderboards",
        "Configurable 7-day, 30-day, and 90-day timeframes",
      ],
    },
    {
      id: "approvals",
      title: "Passwordless Client Approvals",
      icon: ShieldCheck,
      tagline: "Frictionless sign-off links for agency clients.",
      description:
        "Deliver professional review links (/client/approval/[token]) to your clients. Clients can preview authentic multi-channel mockups, leave feedback comments, or click approve without ever creating a login.",
      features: [
        "Secure signed tokenized access links",
        "Interactive desktop and mobile post previews",
        "Threaded feedback comments between agency and client",
        "Automatic scheduling upon client sign-off",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <MarketingNavbar />

      <main className="py-20 px-6 max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Features Overview</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Every Social Workflow, Reimagined by AI.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Engineered from first principles for multi-platform velocity, complete brand compliance, and zero copy-paste fatigue.
          </p>
        </div>

        {/* Pillars List */}
        <div className="space-y-12">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isEven = idx % 2 === 0;
            return (
              <div
                key={pillar.id}
                id={pillar.id}
                className="p-8 sm:p-10 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col lg:flex-row items-center gap-10 hover:border-[#D4FF32]/30 transition-all"
              >
                <div className="flex-1 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#182238] text-[#D4FF32] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{pillar.title}</h2>
                    <p className="text-xs sm:text-sm text-[#D4FF32] font-semibold mt-0.5">{pillar.tagline}</p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {pillar.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4FF32] flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full lg:w-96 p-5 rounded-2xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-3 flex-shrink-0">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pb-2 border-b border-[rgba(255,255,255,0.06)]">
                    <span>CAPABILITY MATRIX</span>
                    <span className="text-[#D4FF32]">ACTIVE</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Workspace Isolation:</span>
                      <span className="text-white font-mono">100% Tenant Boundary</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Concurrency Locks:</span>
                      <span className="text-white font-mono">Lease Expiry Safe</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">AI Latency:</span>
                      <span className="text-white font-mono">&lt; 1,000ms</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#182238] to-[#121A2B] border border-[#D4FF32]/30 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Experience SocialPilot AI in Live Demo Mode
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Test our content studio, approval portals, and Brand Brain guardrails with pre-seeded multi-channel data.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all shadow-[0_0_20px_rgba(212,255,50,0.2)]"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-white font-semibold text-xs hover:bg-[#182238]"
            >
              Launch Live App
            </Link>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

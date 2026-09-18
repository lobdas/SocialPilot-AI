"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, CheckCircle2, Clock, AlertTriangle, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

interface IntegrationItem {
  id: string;
  name: string;
  category: "AVAILABLE" | "IN_DEVELOPMENT" | "COMING_SOON";
  desc: string;
  color: string;
  capabilities: string[];
  protocol: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  // Available Tier 1
  {
    id: "google-business",
    name: "Google Business Profile (GMB)",
    category: "AVAILABLE",
    desc: "Publish local SEO updates, offers, events, and photos directly to Google Maps & Search. Ingest customer reviews and drive high-intent local storefront traffic.",
    color: "#4285F4",
    capabilities: ["Local Search Posts", "Offers & Events", "Maps Photo Upload", "Google Reviews", "Multi-Location Sync", "CTA Buttons"],
    protocol: "Google My Business API v4 / OAuth 2.0",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "AVAILABLE",
    desc: "Publish company updates, personal profile thought leadership, carousels, and single-image posts with official OAuth 2.0 API.",
    color: "#0A66C2",
    capabilities: ["Text Posts", "Single Image", "Carousels", "Analytics", "Comment Ingestion"],
    protocol: "REST API v2 (Member & Organization)",
  },
  {
    id: "meta-facebook",
    name: "Facebook Pages",
    category: "AVAILABLE",
    desc: "Full Facebook Graph API publishing for company pages, business groups, link previews, and follower insights.",
    color: "#1877F2",
    capabilities: ["Feed Posts", "Photos & Videos", "Reels", "Page Analytics", "Messenger DMs"],
    protocol: "Graph API v21.0 (Page Access Tokens)",
  },
  {
    id: "meta-instagram",
    name: "Instagram Business",
    category: "AVAILABLE",
    desc: "Direct single photo, carousel, and reel publishing for creator and business accounts with comment moderation.",
    color: "#E4405F",
    capabilities: ["Single Image (1:1 & 4:5)", "Carousels", "Reels (9:16)", "Direct Comments", "Audience Insights"],
    protocol: "Instagram Graph API v21.0",
  },
  {
    id: "threads",
    name: "Threads by Meta",
    category: "AVAILABLE",
    desc: "Publish conversational text threads, quotes, and images to Meta's fast-growing microblogging network.",
    color: "#FFFFFF",
    capabilities: ["Text Threads (500 chars)", "Single Image", "Reply Feeds", "OAuth 2.0 Direct Connect"],
    protocol: "Threads Publishing API v1.0",
  },

  {
    id: "x-twitter",
    name: "X (Twitter)",
    category: "AVAILABLE",
    desc: "Single tweets, multi-tweet threads, and media attachments. Direct OAuth 2.0 publishing via official X API v2.",
    color: "#FFFFFF",
    capabilities: ["Tweets under 280 chars", "Thread Sequencing", "Media Attachments", "Quote Tweets"],
    protocol: "X API v2 (OAuth 2.0)",
  },
  {
    id: "youtube",
    name: "YouTube & Shorts",
    category: "AVAILABLE",
    desc: "Scheduled YouTube Shorts and long-form video dispatch with automatic thumbnail upload and tag management.",
    color: "#FF0000",
    capabilities: ["YouTube Shorts (9:16)", "Video Uploads", "Custom Thumbnails", "Channel Analytics"],
    protocol: "YouTube Data API v3 (OAuth 2.0)",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    category: "AVAILABLE",
    desc: "Scheduled visual pin automation, board curation, and destination link mapping for e-commerce brands.",
    color: "#BD081C",
    capabilities: ["Standard Pins (2:3 aspect)", "Board Organization", "Rich Link Attributes"],
    protocol: "Pinterest API v5 (OAuth 2.0)",
  },
];

export default function IntegrationsPage() {
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "IN_DEVELOPMENT" | "COMING_SOON">("ALL");

  const availableCount = INTEGRATIONS.filter((i) => i.category === "AVAILABLE").length;
  const inDevCount = INTEGRATIONS.filter((i) => i.category === "IN_DEVELOPMENT").length;
  const comingSoonCount = INTEGRATIONS.filter((i) => i.category === "COMING_SOON").length;

  const filtered = INTEGRATIONS.filter((item) => {
    if (filter === "ALL") return true;
    return item.category === filter;
  });

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <MarketingNavbar />

      <main className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Social Ecosystem</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Supported Social Channels
          </h1>
          <p className="text-sm text-slate-400">
            SocialPilot AI connects to the industry’s leading social networks with strict capability detection and AES-256-GCM token encryption.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "ALL"
                  ? "bg-[#D4FF32] text-[#0B1020]"
                  : "bg-[#121A2B] text-slate-300 hover:text-white"
              }`}
            >
              All Channels ({INTEGRATIONS.length})
            </button>
            <button
              onClick={() => setFilter("AVAILABLE")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "AVAILABLE"
                  ? "bg-emerald-400 text-[#0B1020]"
                  : "bg-[#121A2B] text-slate-300 hover:text-white"
              }`}
            >
              Available Now ({availableCount})
            </button>
            <button
              onClick={() => setFilter("IN_DEVELOPMENT")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "IN_DEVELOPMENT"
                  ? "bg-amber-400 text-[#0B1020]"
                  : "bg-[#121A2B] text-slate-300 hover:text-white"
              }`}
            >
              In Development ({inDevCount})
            </button>
            <button
              onClick={() => setFilter("COMING_SOON")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "COMING_SOON"
                  ? "bg-purple-400 text-[#0B1020]"
                  : "bg-[#121A2B] text-slate-300 hover:text-white"
              }`}
            >
              Coming Soon ({comingSoonCount})
            </button>
          </div>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between space-y-6 hover:border-[#D4FF32]/30 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <h3 className="text-base font-bold text-white">{item.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      item.category === "AVAILABLE"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : item.category === "IN_DEVELOPMENT"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                    }`}
                  >
                    {item.category === "AVAILABLE" ? "Active Tier 1" : item.category.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>

                <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Capabilities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] bg-[#0B1020] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono border-t border-[rgba(255,255,255,0.06)] pt-3 flex items-center justify-between">
                <span>Protocol:</span>
                <span className="text-slate-300">{item.protocol}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Token Storage Callout */}
        <div className="p-8 rounded-3xl bg-[#070B14] border border-[rgba(255,255,255,0.06)] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4FF32]" />
            <span>Enterprise Token Encryption Architecture</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All OAuth 2.0 access and refresh tokens are encrypted at rest using AES-256-GCM with unique cryptographic initialization vectors (IVs) and 128-bit authentication tags. Secret keys are strictly masked and never returned in client DTO responses.
          </p>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

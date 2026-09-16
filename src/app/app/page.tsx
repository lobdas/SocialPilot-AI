"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Share2,
  MessageSquare,
  Eye,
  Heart,
  Plus,
  Zap,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { formatDate, formatNumber } from "@/lib/utils";

export default function DashboardOverview() {
  const { data, activeBrand, mounted } = useDemoStore();

  const scheduledPosts = data.posts.filter((p) => p.status === "SCHEDULED");
  const publishedPosts = data.posts.filter((p) => p.status === "PUBLISHED");
  const pendingApprovals = data.posts.filter((p) => p.status === "PENDING_APPROVAL");

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Good morning, Apex Growth Team
            </h1>
            <span className="text-[11px] bg-[#D4FF32]/15 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/30">
              Agency Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Managing brand intelligence for <strong className="text-white">{activeBrand.name}</strong> • 6 channels connected
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/calendar"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Content Calendar</span>
          </Link>
          <Link
            href="/app/content-studio"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_20px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Create with AI</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Scheduled Posts</span>
            <Clock className="w-4 h-4 text-[#D4FF32]" />
          </div>
          <div className="text-2xl font-extrabold text-white">{scheduledPosts.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">Next: Tomorrow at 2:00 PM</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Published This Month</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{publishedPosts.length + 18}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">+24% velocity</span> vs last month
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Avg Engagement Rate</span>
            <TrendingUp className="w-4 h-4 text-[#C4B5FD]" />
          </div>
          <div className="text-2xl font-extrabold text-white">4.82%</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-[#C4B5FD] font-medium">+1.4%</span> across LinkedIn & X
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Pending Client Sign-Off</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{pendingApprovals.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Link href="/app/approvals" className="text-amber-400 hover:underline">
              Review token links →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled Queue & Platform Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Pipeline & Upcoming Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Schedule */}
          <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">Upcoming Publishing Pipeline</h2>
                <p className="text-xs text-slate-400">Scheduled multi-platform posts ready for deployment</p>
              </div>
              <Link
                href="/app/calendar"
                className="text-xs text-[#D4FF32] hover:underline flex items-center gap-1"
              >
                <span>View Full Calendar</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {data.posts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    {post.mediaUrls[0] ? (
                      <img
                        src={post.mediaUrls[0]}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-[rgba(255,255,255,0.1)]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#0B1020] flex items-center justify-center flex-shrink-0 text-slate-500">
                        <Share2 className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{post.title}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            post.status === "PUBLISHED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : post.status === "SCHEDULED"
                              ? "bg-[#D4FF32]/10 text-[#D4FF32] border border-[#D4FF32]/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {post.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {post.basePrompt || Object.values(post.variants)[0]?.caption}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {post.targetPlatforms.map((p) => (
                          <span
                            key={p}
                            className="text-[9px] bg-[#0B1020] text-slate-300 px-1.5 py-0.2 rounded border border-[rgba(255,255,255,0.06)]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:flex-shrink-0 text-[11px] text-slate-400" suppressHydrationWarning>
                    <div>
                      {mounted
                        ? post.scheduledAt
                          ? formatDate(post.scheduledAt)
                          : formatDate(post.createdAt)
                        : "Recently"}
                    </div>
                    <Link
                      href="/app/content-studio"
                      className="text-slate-300 hover:text-white hover:underline mt-1 inline-block"
                    >
                      Edit Post →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)]">
            <h2 className="text-sm font-bold text-white mb-3">Quick Operational Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/app/content-studio"
                className="p-3 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.06)] hover:border-[#D4FF32]/40 transition-all text-left group"
              >
                <Sparkles className="w-5 h-5 text-[#D4FF32] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-white">Create AI Post</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Adapt across 7 platforms</div>
              </Link>
              <Link
                href="/app/media"
                className="p-3 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.06)] hover:border-[#C4B5FD]/40 transition-all text-left group"
              >
                <Zap className="w-5 h-5 text-[#C4B5FD] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-white">AI Image Studio</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Presets for 1:1, 9:16, 16:9</div>
              </Link>
              <Link
                href="/app/social-accounts"
                className="p-3 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.06)] hover:border-emerald-400/40 transition-all text-left group"
              >
                <Share2 className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-white">Connect Channels</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Meta, LinkedIn, X, WA</div>
              </Link>
              <Link
                href="/app/brand-brain"
                className="p-3 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.06)] hover:border-sky-400/40 transition-all text-left group"
              >
                <AlertCircle className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-white">Brand Brain</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Voice & guardrails</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col: AI Strategic Recommendations & Inbox Activity */}
        <div className="space-y-6">
          {/* AI Growth Intelligence */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#182238] to-[#121A2B] border border-[rgba(212,255,50,0.15)] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#D4FF32] text-[#0B1020] flex items-center justify-center font-bold">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                AI Growth Recommendations
              </h2>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-[#0B1020]/60 border border-[rgba(255,255,255,0.05)]">
                <div className="font-semibold text-white text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF32]" />
                  Optimal LinkedIn Timing
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Agency audiences show highest engagement on Tuesday & Thursday between 8:30 AM – 10:00 AM EST.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0B1020]/60 border border-[rgba(255,255,255,0.05)]">
                <div className="font-semibold text-white text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD]" />
                  Carousel Engagement Lift
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Carousels adapt 3.4x higher save rate on Instagram compared to single image posts for case studies.
                </p>
              </div>
            </div>
            <Link
              href="/app/content-studio"
              className="mt-4 block w-full text-center py-2 rounded-lg bg-[#D4FF32]/10 hover:bg-[#D4FF32]/20 border border-[#D4FF32]/30 text-[#D4FF32] text-xs font-bold transition-colors"
            >
              Draft Optimized Post Now
            </Link>
          </div>

          {/* Social Inbox Leads */}
          <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#D4FF32]" />
                Recent Inbox Leads
              </h2>
              <Link href="/app/inbox" className="text-[11px] text-[#D4FF32] hover:underline">
                View all ({data.conversations.length})
              </Link>
            </div>

            <div className="divide-y divide-[rgba(255,255,255,0.05)]">
              {data.conversations.slice(0, 3).map((conv) => (
                <Link
                  key={conv.id}
                  href="/app/inbox"
                  className="py-3 flex items-start gap-3 hover:bg-[#182238]/50 rounded-lg px-2 -mx-2 transition-colors block"
                >
                  <img
                    src={conv.customerAvatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate">
                        {conv.customerName}
                      </span>
                      <span className="text-[10px] text-slate-500">{conv.platform}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{conv.snippet}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

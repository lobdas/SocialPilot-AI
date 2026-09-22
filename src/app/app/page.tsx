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
  BrainCircuit,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { formatDate, formatNumber } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/components/ui/platform-badge";
import { NoBrandState } from "@/components/brand/no-brand-state";

export default function DashboardOverview() {
  const { data, activeBrand, activeWorkspace, mounted } = useDemoStore();

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  // If no brand exists yet, render first-time brand creation onboarding
  if (!activeBrand) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.06)]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white" suppressHydrationWarning>
                {greeting}, {activeWorkspace?.name || "Apex Growth Team"}
              </h1>
              <span className="text-[11px] bg-[#D4FF32]/15 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/30">
                Setup Required
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Welcome to SocialPilot AI. Please create your first brand to launch your content studio, channels, and inbox.
            </p>
          </div>
        </div>

        <NoBrandState
          title="Welcome to SocialPilot AI — Let's Create Your First Brand"
          description="Every post, schedule, social channel, and Brand Brain guideline in SocialPilot AI is organized by brand. Create your brand below to immediately begin generating and scheduling native content."
        />
      </div>
    );
  }

  // Strict Brand-level data scoping
  const brandPosts = data.posts.filter((p) => p.brandId === activeBrand.id);
  const activeAccounts = data.socialAccounts.filter(
    (a) => a.brandId === activeBrand.id && a.status === "ACTIVE"
  );
  const brandConversations = data.conversations.filter(
    (c) => c.brandId === activeBrand.id || brandPosts.some((p) => p.id === c.postId)
  );

  const scheduledPosts = brandPosts.filter((p) => p.status === "SCHEDULED");
  const publishedPosts = brandPosts.filter((p) => p.status === "PUBLISHED");
  const pendingApprovals = brandPosts.filter((p) => p.status === "PENDING_APPROVAL");

  // Filter and sort upcoming scheduled pipeline posts by date (nearest first)
  const pipelinePosts = brandPosts
    .filter((p) => p.status === "SCHEDULED" || p.status === "PENDING_APPROVAL")
    .sort((a, b) => {
      const dateA = new Date(a.scheduledAt || a.createdAt).getTime();
      const dateB = new Date(b.scheduledAt || b.createdAt).getTime();
      return dateA - dateB;
    });

  const nextScheduled = pipelinePosts.find(
    (p) => p.status === "SCHEDULED" && p.scheduledAt
  );

  const displayPipelinePosts = pipelinePosts;

  // Dynamic comments and lead engagement from real brand data
  const totalComments = brandPosts.reduce(
    (acc, p) => acc + (p.commentsCount || p.comments?.length || 0),
    0
  );
  const totalInboundMessages = brandConversations.reduce(
    (acc, c) => acc + (c.messages?.length || 1),
    0
  );
  const totalInteractions = totalComments + totalInboundMessages;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white" suppressHydrationWarning>
              {greeting}, {activeWorkspace?.name || "Apex Growth Team"}
            </h1>
            <span className="text-[11px] bg-[#D4FF32]/15 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/30">
              Agency Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Managing brand intelligence for <strong className="text-white">{activeBrand.name}</strong> • {activeAccounts.length} channels connected
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
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1" suppressHydrationWarning>
            {nextScheduled?.scheduledAt ? (
              <span className="text-emerald-400 font-medium truncate">
                Next: {mounted ? formatDate(nextScheduled.scheduledAt, "short") : "Upcoming"}
              </span>
            ) : (
              <span className="text-slate-500">No scheduled queue</span>
            )}
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Published Posts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{publishedPosts.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">
              {publishedPosts.length > 0 ? `${publishedPosts.length} live on channels` : "No posts published yet"}
            </span>
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
            <span className="text-[#C4B5FD] font-medium">{totalInteractions} interactions</span> across {activeAccounts.length || 6} channels
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
            {pendingApprovals.length > 0 ? (
              <Link href="/app/approvals" className="text-amber-400 hover:underline">
                Review {pendingApprovals.length} pending items →
              </Link>
            ) : (
              <span className="text-emerald-400">All approvals cleared ✓</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled Queue & Platform Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Pipeline & Upcoming Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Schedule with bounded height */}
          <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">Upcoming Publishing Pipeline</h2>
                  <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
                    {pipelinePosts.length} Upcoming
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Scheduled multi-platform posts ready for deployment</p>
              </div>
              <Link
                href="/app/calendar"
                className="text-xs text-[#D4FF32] hover:underline flex items-center gap-1 shrink-0 font-medium"
              >
                <span>Full Calendar</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Scrollable container with fixed max height to prevent page blow-up */}
            <div className="max-h-[320px] overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
              {displayPipelinePosts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-[#0B1020]/40 border border-white/[0.04]">
                  No upcoming scheduled posts for {activeBrand.name}. Click &ldquo;Create with AI&rdquo; to schedule a post!
                </div>
              ) : (
                displayPipelinePosts.map((post) => {
                  const isScheduled = post.status === "SCHEDULED";
                  const timeDate = post.scheduledAt || post.createdAt;

                  return (
                    <div
                      key={post.id}
                      className="p-2.5 sm:p-3 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.14)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {post.mediaUrls[0] ? (
                          <img
                            src={post.mediaUrls[0]}
                            alt=""
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover flex-shrink-0 border border-[rgba(255,255,255,0.1)]"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#0B1020] flex items-center justify-center flex-shrink-0 text-slate-500 border border-white/5">
                            <Share2 className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs group-hover:text-[#D4FF32] transition-colors">
                              {post.title}
                            </span>
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
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
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {post.basePrompt || Object.values(post.variants)[0]?.caption}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 overflow-x-auto scrollbar-none">
                            {post.targetPlatforms.map((p) => {
                              const cfg = PLATFORM_CONFIG[p];
                              return (
                                <span
                                  key={p}
                                  className="text-[9px] bg-[#0B1020] text-slate-300 px-1.5 py-0.2 rounded border border-[rgba(255,255,255,0.06)] flex items-center gap-1 shrink-0"
                                >
                                  {cfg ? cfg.icon("w-2.5 h-2.5 text-[#D4FF32]") : null}
                                  <span>{cfg?.shortName || p}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right sm:flex-shrink-0 text-[10px] text-slate-400 flex sm:flex-col items-center sm:items-end justify-between gap-1 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-white/[0.04]" suppressHydrationWarning>
                        <div className="font-semibold text-slate-200">
                          {mounted && timeDate ? formatDate(timeDate, "medium") : "Recently"}
                        </div>
                        {isScheduled ? (
                          <Link
                            href={`/app/content-studio?edit=${post.id}`}
                            className="text-[#D4FF32] hover:text-[#C2ED25] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                          >
                            <span>Edit Post →</span>
                          </Link>
                        ) : (
                          <Link
                            href="/app/posts"
                            className="text-slate-400 hover:text-white hover:underline text-[10px]"
                          >
                            <span>View Post →</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {displayPipelinePosts.length > 3 && (
              <div className="pt-2.5 mt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] text-slate-400">
                <span>Showing {displayPipelinePosts.length} posts in pipeline</span>
                <Link href="/app/calendar" className="text-[#D4FF32] hover:underline flex items-center gap-1 font-medium">
                  <span>View All in Calendar</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            )}
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
                href="/app/calendar"
                className="p-3 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.06)] hover:border-[#C4B5FD]/40 transition-all text-left group"
              >
                <Calendar className="w-5 h-5 text-[#C4B5FD] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-white">Content Calendar</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Visual drag & drop schedule</div>
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
                <BrainCircuit className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
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
                View all ({brandConversations.length})
              </Link>
            </div>

            <div className="divide-y divide-[rgba(255,255,255,0.05)]">
              {brandConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No inbox leads for {activeBrand.name} yet.
                </div>
              ) : (
                brandConversations.slice(0, 3).map((conv) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

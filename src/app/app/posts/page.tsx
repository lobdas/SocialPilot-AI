"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Eye,
  ChevronRight,
  Share2,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { ContentItem, ContentStatus, PlatformType } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const PLATFORM_COLORS: Record<PlatformType, { bg: string; text: string; border: string; name: string }> = {
  FACEBOOK: { bg: "bg-[#1877F2]/10", text: "text-[#1877F2]", border: "border-[#1877F2]/30", name: "Facebook" },
  LINKEDIN: { bg: "bg-[#0A66C2]/10", text: "text-[#0A66C2]", border: "border-[#0A66C2]/30", name: "LinkedIn" },
  INSTAGRAM: { bg: "bg-[#E4405F]/10", text: "text-[#E4405F]", border: "border-[#E4405F]/30", name: "Instagram" },
  X: { bg: "bg-white/10", text: "text-white", border: "border-white/20", name: "X (Twitter)" },
  THREADS: { bg: "bg-white/10", text: "text-slate-200", border: "border-white/20", name: "Threads" },
  PINTEREST: { bg: "bg-[#BD081C]/10", text: "text-[#BD081C]", border: "border-[#BD081C]/30", name: "Pinterest" },
  YOUTUBE: { bg: "bg-[#FF0000]/10", text: "text-[#FF0000]", border: "border-[#FF0000]/30", name: "YouTube" },
  TIKTOK: { bg: "bg-[#00F2FE]/10", text: "text-[#00F2FE]", border: "border-[#00F2FE]/30", name: "TikTok" },
  GOOGLE_BUSINESS: { bg: "bg-[#4285F4]/10", text: "text-[#4285F4]", border: "border-[#4285F4]/30", name: "Google Business" },
};

export default function PostsManagementPage() {
  const { data, store, mounted } = useDemoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ContentStatus>("ALL");
  const [platformFilter, setPlatformFilter] = useState<"ALL" | PlatformType>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeVariantTab, setActiveVariantTab] = useState<Record<string, PlatformType>>({});

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopyCaption = (postId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(postId);
    showToast("📋 Caption copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePost = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete post "${title}"?`)) {
      store.deletePost(id);
      showToast("🗑️ Post deleted successfully!");
    }
  };

  // Filter posts
  const filteredPosts = data.posts.filter((post) => {
    // Status filter
    if (statusFilter !== "ALL" && post.status !== statusFilter) return false;

    // Platform filter
    if (platformFilter !== "ALL" && !post.targetPlatforms?.includes(platformFilter)) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchCaptions = Object.values(post.variants || {}).some(
        (v) => v.caption?.toLowerCase().includes(q) || v.hashtags?.some((h) => h.toLowerCase().includes(q))
      );
      return matchTitle || matchCaptions;
    }

    return true;
  });

  const publishedCount = data.posts.filter((p) => p.status === "PUBLISHED").length;
  const scheduledCount = data.posts.filter((p) => p.status === "SCHEDULED").length;
  const draftCount = data.posts.filter((p) => p.status === "DRAFT" || p.status === "PENDING_APPROVAL").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Published & Scheduled Posts</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              {data.posts.length} Posts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track which social platforms, dates, and exact times your posts were published or scheduled.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/content-studio"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4FF32] text-[#0B1020] text-xs font-bold shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create New Post</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={cn(
            "p-4 rounded-xl bg-[#121A2B] border cursor-pointer transition-all",
            statusFilter === "ALL"
              ? "border-[#D4FF32]/60 shadow-[0_0_15px_rgba(212,255,50,0.15)]"
              : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
          )}
        >
          <div className="text-[11px] font-medium text-slate-400">Total Created</div>
          <div className="text-2xl font-bold text-white mt-1">{data.posts.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across all channels</div>
        </div>

        <div
          onClick={() => setStatusFilter("PUBLISHED")}
          className={cn(
            "p-4 rounded-xl bg-[#121A2B] border cursor-pointer transition-all",
            statusFilter === "PUBLISHED"
              ? "border-emerald-400/60 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
              : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
          )}
        >
          <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Published Posts</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{publishedCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Live on platforms</div>
        </div>

        <div
          onClick={() => setStatusFilter("SCHEDULED")}
          className={cn(
            "p-4 rounded-xl bg-[#121A2B] border cursor-pointer transition-all",
            statusFilter === "SCHEDULED"
              ? "border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
              : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
          )}
        >
          <div className="text-[11px] font-medium text-amber-400 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>Scheduled</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{scheduledCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Ready for auto-publish</div>
        </div>

        <div
          onClick={() => setStatusFilter("DRAFT")}
          className={cn(
            "p-4 rounded-xl bg-[#121A2B] border cursor-pointer transition-all",
            statusFilter === "DRAFT"
              ? "border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
              : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
          )}
        >
          <div className="text-[11px] font-medium text-sky-400 flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            <span>Drafts / In Review</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{draftCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Drafts & Approvals</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, caption, or hashtag..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/60"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Status Filter */}
          <div className="flex items-center bg-[#0B1020] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
            {(["ALL", "PUBLISHED", "SCHEDULED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer",
                  statusFilter === s ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
                )}
              >
                {s === "ALL" ? "All" : s === "PUBLISHED" ? "Published" : "Scheduled"}
              </button>
            ))}
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60 cursor-pointer"
          >
            <option value="ALL">All Platforms</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="X">X (Twitter)</option>
            <option value="THREADS">Threads</option>
            <option value="GOOGLE_BUSINESS">Google Business (GMB)</option>
            <option value="PINTEREST">Pinterest</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#182238] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mx-auto text-slate-400">
            <Send className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-sm font-bold text-white">No posts match your filters</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or create a new multi-platform post in Content Studio.
          </p>
          <div className="pt-2">
            <Link
              href="/app/content-studio"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4FF32] text-[#0B1020] text-xs font-bold hover:bg-[#C2ED25] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Post in Studio</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
            const primaryPlatform = post.targetPlatforms?.[0] || "FACEBOOK";
            const currentSelectedPlatform = activeVariantTab[post.id] || primaryPlatform;
            const currentVariant = post.variants?.[currentSelectedPlatform] || post.variants?.[primaryPlatform];

            // Formatted date
            const timeDate = post.publishedAt || post.scheduledAt || post.createdAt;
            const isPublished = post.status === "PUBLISHED";
            const isScheduled = post.status === "SCHEDULED";

            return (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all space-y-4"
              >
                {/* Top Row: Platforms + Status + Date/Time */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.06)]">
                  {/* Platforms Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {post.targetPlatforms?.map((plat) => {
                      const cfg = PLATFORM_COLORS[plat] || PLATFORM_COLORS.FACEBOOK;
                      const isSelected = currentSelectedPlatform === plat;
                      return (
                        <button
                          key={plat}
                          onClick={() =>
                            setActiveVariantTab((prev) => ({
                              ...prev,
                              [post.id]: plat,
                            }))
                          }
                          className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1",
                            cfg.bg,
                            cfg.text,
                            isSelected ? "ring-1 ring-white border-white" : cfg.border
                          )}
                          title={`Click to view ${cfg.name} version`}
                        >
                          <span>{cfg.name}</span>
                          {isSelected && <span className="text-[8px]">●</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Status & Timestamp */}
                  <div className="flex items-center gap-3 text-xs">
                    {isPublished ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Published Live
                      </span>
                    ) : isScheduled ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Scheduled
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 font-semibold text-[10px]">
                        Draft
                      </span>
                    )}

                    {/* Exact Date and Time */}
                    <div className="text-slate-400 flex items-center gap-1 text-[11px]" suppressHydrationWarning>
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium text-slate-300">
                        {mounted && timeDate ? formatDate(timeDate, "medium") : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Body: Image + Caption */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* Image Attachment (if any) */}
                  {hasMedia && (
                    <div className="md:col-span-3">
                      <div className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#0B1020] group aspect-square">
                        <img
                          src={post.mediaUrls[0]}
                          alt="Post attachment"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a
                            href={post.mediaUrls[0]}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-black/60 text-white hover:text-[#D4FF32]"
                            title="View full image"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Caption & Post Content */}
                  <div className={cn(hasMedia ? "md:col-span-9" : "md:col-span-12", "space-y-3")}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">{post.title}</h3>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                        Viewing: {currentSelectedPlatform}
                      </span>
                    </div>

                    {/* Formatted Caption */}
                    <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto pr-2">
                      {currentVariant?.caption || "No caption for this platform."}
                    </div>

                    {/* Hashtags */}
                    {currentVariant?.hashtags && currentVariant.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {currentVariant.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20"
                          >
                            {tag.startsWith("#") ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">
                      Chars: {currentVariant?.caption?.length || 0}
                    </span>
                    {post.contentType && (
                      <span className="text-[11px] text-slate-500">
                        Type: {post.contentType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy Caption */}
                    <button
                      onClick={() => handleCopyCaption(post.id, currentVariant?.caption || "")}
                      className="px-2.5 py-1 rounded-lg bg-[#0B1020] hover:bg-[#182238] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)] flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                      title="Copy caption to clipboard"
                    >
                      {copiedId === post.id ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Edit in Studio */}
                    <Link
                      href="/app/content-studio"
                      className="px-2.5 py-1 rounded-lg bg-[#0B1020] hover:bg-[#182238] text-slate-300 hover:text-[#D4FF32] border border-[rgba(255,255,255,0.08)] flex items-center gap-1.5 transition-colors text-[11px]"
                    >
                      <Sparkles className="w-3 h-3 text-[#D4FF32]" />
                      <span>Studio</span>
                    </Link>

                    {/* Delete Post */}
                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="px-2 py-1 rounded-lg bg-[#0B1020] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-[rgba(255,255,255,0.08)] hover:border-rose-500/30 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                      title="Delete post"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

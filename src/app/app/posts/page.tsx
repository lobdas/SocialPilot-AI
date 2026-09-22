"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  Calendar,
  Sparkles,
  Search,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
  MessageSquare,
  X,
  Maximize2,
  Layers,
  Hash,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { ContentItem, ContentStatus, PlatformType } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/components/ui/platform-badge";
import { NoBrandState } from "@/components/brand/no-brand-state";

export default function PostsManagementPage() {
  const { data, store, activeBrand, mounted } = useDemoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ContentStatus>("ALL");
  const [platformFilter, setPlatformFilter] = useState<"ALL" | PlatformType>("ALL");
  const [campaignFilter, setCampaignFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeVariantTab, setActiveVariantTab] = useState<Record<string, PlatformType>>({});
  const [selectedPostModal, setSelectedPostModal] = useState<ContentItem | null>(null);
  const [modalPlatform, setModalPlatform] = useState<PlatformType | null>(null);

  const openPostModal = (post: ContentItem, platform?: PlatformType) => {
    setSelectedPostModal(post);
    setModalPlatform(platform || post.targetPlatforms?.[0] || "FACEBOOK");
  };

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
      if (selectedPostModal?.id === id) {
        setSelectedPostModal(null);
      }
      showToast("🗑️ Post deleted successfully!");
    }
  };

  if (!activeBrand) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <NoBrandState featureName="Posts Management" />
      </div>
    );
  }

  // Filter posts strictly for activeBrand
  const brandPosts = data.posts.filter(
    (p) => p.brandId === activeBrand.id
  );

  const filteredPosts = brandPosts.filter((post) => {
    // Status filter
    if (statusFilter !== "ALL" && post.status !== statusFilter) return false;

    // Platform filter
    if (platformFilter !== "ALL" && !post.targetPlatforms.includes(platformFilter)) return false;

    // Campaign filter
    if (campaignFilter === "NONE" && post.campaignId) return false;
    if (campaignFilter !== "ALL" && campaignFilter !== "NONE" && post.campaignId !== campaignFilter) return false;

    // Search query (title or captions)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchCaptions = Object.values(post.variants || {}).some((v) =>
        v?.caption?.toLowerCase().includes(q)
      );
      return matchTitle || matchCaptions;
    }

    return true;
  });

  const publishedCount = brandPosts.filter((p) => p.status === "PUBLISHED").length;
  const scheduledCount = brandPosts.filter((p) => p.status === "SCHEDULED").length;
  const draftCount = brandPosts.filter((p) => p.status === "DRAFT" || p.status === "PENDING_APPROVAL").length;

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
            <h1 className="text-xl font-bold text-white tracking-tight">Posts Management — {activeBrand.name}</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              {brandPosts.length} Posts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Managing published, scheduled, and draft posts specifically for <strong className="text-white">{activeBrand.name}</strong>. Click any post to view details.
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
              ? "border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
          )}
        >
          <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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

          {/* Campaign Filter */}
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60 cursor-pointer"
          >
            <option value="ALL">All Campaigns</option>
            <option value="NONE">No Campaign (Standalone)</option>
            {data.campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                🎯 {c.name}
              </option>
            ))}
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
        <div className="space-y-3">
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
                className="p-3.5 sm:p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[#D4FF32]/40 transition-all space-y-2.5 group shadow-sm"
              >
                {/* Top Row: Mini Platform pills + Status + Date/Time */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {post.targetPlatforms?.map((plat) => {
                      const cfg = PLATFORM_CONFIG[plat] || PLATFORM_CONFIG.FACEBOOK;
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
                            "h-6 px-2 rounded-md text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border",
                            isSelected
                              ? cfg.activeClass
                              : "bg-[#0B1020] text-slate-400 hover:text-white border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]"
                          )}
                          title={`View ${cfg.name} version`}
                        >
                          <span className={isSelected ? "text-current" : cfg.iconColor}>
                            {cfg.icon("w-3 h-3")}
                          </span>
                          <span>{cfg.shortName}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    {isPublished ? (
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Published
                      </span>
                    ) : isScheduled ? (
                      <span className="px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-[10px] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        Scheduled
                      </span>
                    ) : (
                      <span className="px-2 py-0.2 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 font-semibold text-[10px]">
                        Draft
                      </span>
                    )}

                    {post.campaignId && (
                      <Link
                        href="/app/campaigns"
                        className="px-2 py-0.2 rounded-full bg-[#D4FF32]/10 text-[#D4FF32] border border-[#D4FF32]/25 font-semibold text-[10px] hover:bg-[#D4FF32]/20 transition-all truncate max-w-[120px]"
                        title="View in Campaigns"
                      >
                        🎯 {data.campaigns.find((c) => c.id === post.campaignId)?.name || "Campaign"}
                      </Link>
                    )}

                    <div className="text-slate-400 flex items-center gap-1.5 text-[10px]" suppressHydrationWarning>
                      <Calendar className="w-3 h-3 text-[#D4FF32]" />
                      <span className="font-medium text-slate-300">
                        {isScheduled ? "Scheduled: " : isPublished ? "Published: " : ""}
                        {mounted && timeDate ? formatDate(timeDate, "medium") : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Compact Row: Thumbnail + Title/Caption + Actions on Right */}
                <div className="flex items-center gap-3.5">
                  {/* Compact Image Thumbnail (Click opens popup) */}
                  {hasMedia && (
                    <div
                      onClick={() => openPostModal(post, currentSelectedPlatform)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-white/10 bg-[#0B1020] flex-shrink-0 cursor-pointer relative group/thumb shadow-sm"
                      title="Click to view full image and post"
                    >
                      <img
                        src={post.mediaUrls[0]}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-[#D4FF32]" />
                      </div>
                    </div>
                  )}

                  {/* Title & Caption preview (Click opens popup) */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        onClick={() => openPostModal(post, currentSelectedPlatform)}
                        className="text-xs sm:text-sm font-bold text-white hover:text-[#D4FF32] transition-colors cursor-pointer truncate tracking-tight"
                        title="Click to view full post details"
                      >
                        {post.title}
                      </h3>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono flex-shrink-0 hidden sm:inline">
                        {currentSelectedPlatform}
                      </span>
                    </div>

                    <p
                      onClick={() => openPostModal(post, currentSelectedPlatform)}
                      className="text-xs text-slate-300 line-clamp-2 leading-relaxed hover:text-white transition-colors cursor-pointer"
                      title="Click to view full post details"
                    >
                      {currentVariant?.caption || "No caption for this platform."}
                    </p>

                    {/* Meta tags & Comments link */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
                      {currentVariant?.hashtags && currentVariant.hashtags.length > 0 && (
                        <span className="text-sky-400 font-medium truncate max-w-[200px]">
                          {currentVariant.hashtags.slice(0, 3).map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")}
                        </span>
                      )}

                      <Link
                        href="/app/inbox"
                        className="text-slate-400 hover:text-[#D4FF32] flex items-center gap-1 transition-colors"
                        title="View in Unified Social Inbox"
                      >
                        <MessageSquare className="w-3 h-3 text-[#D4FF32]" />
                        <span>{post.comments?.length || post.commentsCount || 0} Comments</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right-hand side Action Bar (Click opens popup or quick actions) */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => openPostModal(post, currentSelectedPlatform)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#182238] hover:bg-[#D4FF32] hover:text-[#0B1020] text-[#D4FF32] border border-[#D4FF32]/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      title="View full post details in popup"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View Post</span>
                    </button>

                    <button
                      onClick={() => handleCopyCaption(post.id, currentVariant?.caption || "")}
                      className="p-1.5 rounded-lg bg-[#0B1020] hover:bg-[#182238] text-slate-400 hover:text-white border border-[rgba(255,255,255,0.08)] transition-colors cursor-pointer text-xs"
                      title="Copy caption"
                    >
                      {copiedId === post.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isScheduled && (
                      <Link
                        href={`/app/content-studio?edit=${post.id}`}
                        className="p-1.5 rounded-lg bg-[#0B1020] hover:bg-[#182238] text-[#D4FF32] hover:text-[#C2ED25] border border-[rgba(255,255,255,0.08)] hover:border-[#D4FF32]/30 transition-colors text-xs flex items-center gap-1"
                        title="Edit scheduled post in Studio"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#D4FF32]" />
                      </Link>
                    )}

                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="p-1.5 rounded-lg bg-[#0B1020] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-[rgba(255,255,255,0.08)] hover:border-rose-500/30 transition-colors cursor-pointer text-xs"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Post Details Modal */}
      {selectedPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121A2B] border border-[rgba(255,255,255,0.12)] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-[rgba(255,255,255,0.08)] bg-[#182238]/60 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {selectedPostModal.title}
                  </h3>
                  {selectedPostModal.status === "PUBLISHED" ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px]">
                      Published
                    </span>
                  ) : selectedPostModal.status === "SCHEDULED" ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-[10px]">
                      Scheduled
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 font-semibold text-[10px]">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5" suppressHydrationWarning>
                  {mounted && (selectedPostModal.publishedAt || selectedPostModal.scheduledAt || selectedPostModal.createdAt)
                    ? `${selectedPostModal.status === "SCHEDULED" ? "Scheduled for: " : "Published on: "}${formatDate(selectedPostModal.scheduledAt || selectedPostModal.publishedAt || selectedPostModal.createdAt, "medium")}`
                    : "Recently"}
                </p>
              </div>

              <button
                onClick={() => setSelectedPostModal(null)}
                className="p-1.5 rounded-lg bg-[#0B1020] text-slate-400 hover:text-white border border-[rgba(255,255,255,0.08)] cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Switcher Tabs inside Modal */}
            <div className="px-5 py-3 bg-[#0B1020]/95 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0 flex items-center gap-1.5 mr-1">
                <Layers className="w-3.5 h-3.5 text-[#D4FF32]" />
                <span>Platform:</span>
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                {selectedPostModal.targetPlatforms?.map((plat) => {
                  const cfg = PLATFORM_CONFIG[plat] || PLATFORM_CONFIG.FACEBOOK;
                  const isSelected = modalPlatform === plat;
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setModalPlatform(plat)}
                      className={cn(
                        "h-8 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 border",
                        isSelected
                          ? cfg.activeClass
                          : "bg-[#121A2B] hover:bg-[#182238] text-slate-300 hover:text-white border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]"
                      )}
                    >
                      <span className={cn("transition-colors", isSelected ? "text-current" : cfg.iconColor)}>
                        {cfg.icon("w-3.5 h-3.5")}
                      </span>
                      <span>{cfg.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Full Image Preview if exists */}
              {selectedPostModal.mediaUrls && selectedPostModal.mediaUrls.length > 0 && (
                <div className="relative rounded-xl overflow-hidden bg-black/50 border border-[rgba(255,255,255,0.08)] max-h-80 flex items-center justify-center group">
                  <img
                    src={selectedPostModal.mediaUrls[0]}
                    alt={selectedPostModal.title}
                    className="w-full max-h-80 object-contain"
                  />
                  <a
                    href={selectedPostModal.mediaUrls[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 text-white hover:text-[#D4FF32] transition-colors"
                    title="Open full resolution image in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Full Caption */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">Caption</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#D4FF32]/10 text-[#D4FF32] text-[11px] font-mono border border-[#D4FF32]/20 font-semibold">
                      {PLATFORM_CONFIG[modalPlatform || "FACEBOOK"]?.name || modalPlatform}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {(selectedPostModal.variants?.[modalPlatform || "FACEBOOK"] || selectedPostModal.variants?.[selectedPostModal.targetPlatforms[0]])?.caption?.length || 0} characters
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                  {(selectedPostModal.variants?.[modalPlatform || "FACEBOOK"] || selectedPostModal.variants?.[selectedPostModal.targetPlatforms[0]])?.caption || "No caption provided."}
                </div>
              </div>

              {/* Hashtags */}
              {((selectedPostModal.variants?.[modalPlatform || "FACEBOOK"] || selectedPostModal.variants?.[selectedPostModal.targetPlatforms[0]])?.hashtags?.length || 0) > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Hashtags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedPostModal.variants?.[modalPlatform || "FACEBOOK"] || selectedPostModal.variants?.[selectedPostModal.targetPlatforms[0]])?.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-md border border-sky-500/20"
                      >
                        {tag.startsWith("#") ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Comments Section */}
              {selectedPostModal.comments && selectedPostModal.comments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#D4FF32]" />
                      <span>Comments on this Post ({selectedPostModal.comments.length})</span>
                    </span>
                    <Link
                      href="/app/inbox"
                      className="text-[11px] text-[#D4FF32] hover:underline"
                    >
                      Reply in Social Inbox →
                    </Link>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedPostModal.comments.map((comm) => (
                      <div key={comm.id} className="p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{comm.authorName}</span>
                          <span className="text-[10px] text-slate-500" suppressHydrationWarning>
                            {mounted ? formatDate(comm.sentAt, "time") : ""}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{comm.content}</p>
                        {comm.replies && comm.replies.map((rep) => (
                          <div key={rep.id} className="ml-3 pl-2.5 border-l border-[#D4FF32]/40 text-[11px] text-[#D4FF32] bg-[#D4FF32]/5 p-1.5 rounded-r">
                            <span className="font-semibold">{rep.authorName}: </span>
                            <span className="text-slate-200">{rep.content}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-3.5 border-t border-[rgba(255,255,255,0.08)] bg-[#182238]/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCaption(
                    selectedPostModal.id,
                    (selectedPostModal.variants?.[modalPlatform || "FACEBOOK"] || selectedPostModal.variants?.[selectedPostModal.targetPlatforms[0]])?.caption || ""
                  )}
                  className="px-3 py-1.5 rounded-lg bg-[#0B1020] hover:bg-[#182238] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Caption</span>
                </button>

                <Link
                  href="/app/inbox"
                  className="px-3 py-1.5 rounded-lg bg-[#0B1020] hover:bg-[#182238] text-slate-300 hover:text-[#D4FF32] border border-[rgba(255,255,255,0.08)] text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4FF32]" />
                  <span>Open in Inbox</span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                {selectedPostModal.status === "SCHEDULED" ? (
                  <Link
                    href={`/app/content-studio?edit=${selectedPostModal.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] text-xs font-bold hover:bg-[#C2ED25] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,255,50,0.25)]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Edit in Studio</span>
                  </Link>
                ) : (
                  <span className="text-[11px] text-slate-500 italic px-2 select-none">
                    Live on social platforms
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

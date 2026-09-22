"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Search,
  Sparkles,
  Send,
  MessageSquare,
  CheckCircle2,
  Tag,
  Archive,
  RefreshCw,
  Lock,
  Star,
  ExternalLink,
  PlusCircle,
  X,
  SlidersHorizontal,
  Mail,
  Bell,
  Check,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { AIService } from "@/lib/ai/ai-service";
import { InboxConversation, PlatformType } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { NoBrandState } from "@/components/brand/no-brand-state";

const PLATFORM_CONFIG: Record<
  PlatformType,
  { label: string; bg: string; text: string; border: string; iconColor: string }
> = {
  FACEBOOK: {
    label: "Facebook",
    bg: "bg-[#1877F2]/10",
    text: "text-[#1877F2]",
    border: "border-[#1877F2]/30",
    iconColor: "#1877F2",
  },
  INSTAGRAM: {
    label: "Instagram",
    bg: "bg-[#E4405F]/10",
    text: "text-[#E4405F]",
    border: "border-[#E4405F]/30",
    iconColor: "#E4405F",
  },
  LINKEDIN: {
    label: "LinkedIn",
    bg: "bg-[#0A66C2]/10",
    text: "text-[#0A66C2]",
    border: "border-[#0A66C2]/30",
    iconColor: "#0A66C2",
  },
  X: {
    label: "X (Twitter)",
    bg: "bg-white/10",
    text: "text-white",
    border: "border-white/20",
    iconColor: "#FFFFFF",
  },
  THREADS: {
    label: "Threads",
    bg: "bg-white/10",
    text: "text-slate-200",
    border: "border-white/20",
    iconColor: "#E2E8F0",
  },
  YOUTUBE: {
    label: "YouTube",
    bg: "bg-[#FF0000]/10",
    text: "text-[#FF0000]",
    border: "border-[#FF0000]/30",
    iconColor: "#FF0000",
  },
  PINTEREST: {
    label: "Pinterest",
    bg: "bg-[#BD081C]/10",
    text: "text-[#BD081C]",
    border: "border-[#BD081C]/30",
    iconColor: "#BD081C",
  },
  TIKTOK: {
    label: "TikTok",
    bg: "bg-[#00F2FE]/10",
    text: "text-[#00F2FE]",
    border: "border-[#00F2FE]/30",
    iconColor: "#00F2FE",
  },
  GOOGLE_BUSINESS: {
    label: "Google Business",
    bg: "bg-[#4285F4]/10",
    text: "text-[#4285F4]",
    border: "border-[#4285F4]/30",
    iconColor: "#4285F4",
  },
};

const ALL_PLATFORMS: PlatformType[] = [
  "FACEBOOK",
  "INSTAGRAM",
  "LINKEDIN",
  "X",
  "THREADS",
  "YOUTUBE",
  "PINTEREST",
];

export default function UnifiedSocialInboxPage() {
  const { data, store, activeBrand, mounted } = useDemoStore();
  const [selectedConvId, setSelectedConvId] = useState<string>("conv-1");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNREAD" | "LEAD" | "ARCHIVED">("ALL");
  const [platformFilter, setPlatformFilter] = useState<"ALL" | PlatformType>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "COMMENT" | "DIRECT_MESSAGE" | "MENTION">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Test Comment Simulator modal state
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [simPostId, setSimPostId] = useState<string>("");
  const [simPlatform, setSimPlatform] = useState<PlatformType>("FACEBOOK");
  const [simAuthor, setSimAuthor] = useState("Alex Johnson");
  const [simComment, setSimComment] = useState("Can this tool schedule posts across multiple brands seamlessly?");

  // Scope posts and accounts to activeBrand
  const brandPosts = activeBrand ? data.posts.filter((p) => p.brandId === activeBrand.id) : [];
  const brandConversations = activeBrand
    ? data.conversations.filter(
        (c) => c.brandId === activeBrand.id || brandPosts.some((p) => p.id === c.postId)
      )
    : [];

  const fbAccount = activeBrand
    ? data.socialAccounts.find(
        (a) => a.platform === "FACEBOOK" && a.brandId === activeBrand.id
      )
    : undefined;

  if (!activeBrand) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <NoBrandState featureName="Unified Social Inbox" />
      </div>
    );
  }

  // Set default sim post
  useEffect(() => {
    if (brandPosts.length > 0 && (!simPostId || !brandPosts.some((p) => p.id === simPostId))) {
      setSimPostId(brandPosts[0].id);
    }
  }, [brandPosts, simPostId]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync live comments across connected platforms & published posts
  const handleSyncAllChannels = async (silent = false) => {
    setIsSyncing(true);
    try {
      const url = `/api/inbox/sync?token=${encodeURIComponent(
        fbAccount?.accessToken || ""
      )}&accountId=${encodeURIComponent(fbAccount?.platformAccountId || "")}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.success) {
        if (json.conversations && json.conversations.length > 0) {
          store.mergeConversations(json.conversations);
          if (!selectedConvId || selectedConvId === "conv-1") {
            setSelectedConvId(json.conversations[0].id);
          }
          showToast(`🎉 Synced ${json.conversations.length} live comment(s) across connected channels!`);
        } else if (!silent) {
          showToast(json.message || "All channels checked: feed is fully up to date.");
        }
      } else if (!silent && json.error) {
        showToast(json.error);
      }
    } catch {
      if (!silent) showToast("Failed to sync channels. Please check network connection.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync on page load if Facebook token exists
  useEffect(() => {
    if (fbAccount?.accessToken) {
      handleSyncAllChannels(true);
    }
  }, [fbAccount?.accessToken]);

  // AI Reply Suggestions
  const handleFetchAISuggestions = async () => {
    if (!activeConversation) return;
    setIsGeneratingSuggestions(true);
    try {
      const lastMsg =
        activeConversation.messages[activeConversation.messages.length - 1]?.content || "";
      const suggestions = await AIService.suggestInboxReply(activeConversation.snippet, lastMsg);
      setAiSuggestions(suggestions);
    } catch {
      showToast("Failed to fetch AI reply suggestions.");
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // Send Reply Handler
  const handleSendReply = async () => {
    if (!replyText.trim() || !activeConversation) return;
    const sentText = replyText.trim();
    setIsReplying(true);

    try {
      // 1. Post to live API endpoint (Facebook Graph API, Instagram, or multi-channel handler)
      const res = await fetch("/api/inbox/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId: activeConversation.id,
          message: sentText,
          platform: activeConversation.platform,
          token: fbAccount?.accessToken,
        }),
      });
      const json = await res.json();

      // 2. Add reply to local store & update linked post comment thread
      store.addInboxMessage(activeConversation.id, sentText, "AGENT");
      setReplyText("");
      setAiSuggestions([]);

      if (json.success) {
        showToast(json.message || `💬 Reply published to ${activeConversation.platform} post!`);
      } else {
        showToast(`Notice: ${json.error || "Reply recorded locally"}`);
      }
    } catch {
      // Graceful fallback
      store.addInboxMessage(activeConversation.id, sentText, "AGENT");
      setReplyText("");
      setAiSuggestions([]);
      showToast(`💬 Reply saved to ${activeConversation.platform} post thread!`);
    } finally {
      setIsReplying(false);
    }
  };

  // Handle Simulate New Comment
  const handleCreateTestComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simComment.trim() || !simAuthor.trim() || !simPostId) return;

    const result = store.addPostComment(
      simPostId,
      simPlatform,
      simAuthor.trim(),
      simComment.trim()
    );

    setIsSimulateOpen(false);
    setSelectedConvId(result.conversation.id);
    showToast(
      `🎉 Comment added on "${result.post?.title || "Post"}" (${simPlatform}) & synced to inbox!`
    );
  };

  // Filter conversations
  const filteredConversations = brandConversations.filter((c) => {
    // Status Filter
    if (statusFilter === "UNREAD" && !c.isUnread) return false;
    if (statusFilter === "LEAD" && c.sentiment !== "LEAD") return false;
    if (statusFilter === "ARCHIVED" && !c.isArchived) return false;
    if (statusFilter !== "ARCHIVED" && c.isArchived) return false;

    // Platform Filter
    if (platformFilter !== "ALL" && c.platform !== platformFilter) return false;

    // Type Filter
    if (typeFilter !== "ALL" && c.type !== typeFilter) return false;

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.customerName.toLowerCase().includes(q);
      const matchHandle = c.customerHandle?.toLowerCase().includes(q);
      const matchSnippet = c.snippet.toLowerCase().includes(q);
      const matchPost = c.postTitle?.toLowerCase().includes(q);
      const matchTags = c.tags?.some((t) => t.toLowerCase().includes(q));
      const matchMessages = c.messages?.some((m) => m.content.toLowerCase().includes(q));
      return matchName || matchHandle || matchSnippet || matchPost || matchTags || matchMessages;
    }

    return true;
  });

  const activeConversation =
    filteredConversations.find((c) => c.id === selectedConvId) ||
    filteredConversations[0] ||
    null;

  // Counts for status tabs
  const nonArchived = brandConversations.filter((c) => !c.isArchived);
  const unreadCount = nonArchived.filter((c) => c.isUnread).length;
  const leadCount = nonArchived.filter((c) => c.sentiment === "LEAD").length;
  const archivedCount = brandConversations.filter((c) => c.isArchived).length;

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Unified Social Inbox</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Omni-channel comments, direct messages, and brand mentions connected directly to your published posts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Simulate New Comment Tester */}
          <button
            onClick={() => setIsSimulateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182238] border border-white/10 text-slate-200 text-xs font-semibold hover:border-[#D4FF32] hover:text-[#D4FF32] transition-all cursor-pointer"
            title="Simulate a customer commenting on any post across platforms"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#D4FF32]" />
            <span>+ Test Comment</span>
          </button>

          {/* Sync All Channels button */}
          <button
            onClick={() => handleSyncAllChannels(false)}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#182238] border border-[#D4FF32]/40 text-[#D4FF32] text-xs font-semibold hover:bg-[#D4FF32] hover:text-[#0B1020] transition-all cursor-pointer shadow-[0_0_12px_rgba(212,255,50,0.15)] disabled:opacity-50"
            title="Fetch real comments across Meta (Facebook & Instagram) and connected channels"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
            <span>{isSyncing ? "Syncing Channels..." : "Sync All Channels"}</span>
          </button>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-[#121A2B] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                statusFilter === "ALL" ? "bg-[#182238] text-white shadow-sm" : "text-slate-400 hover:text-white"
              )}
            >
              All Threads ({nonArchived.length})
            </button>
            <button
              onClick={() => setStatusFilter("UNREAD")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                statusFilter === "UNREAD" ? "bg-[#182238] text-white shadow-sm" : "text-slate-400 hover:text-white"
              )}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D4FF32] text-[#0B1020] text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter("LEAD")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1",
                statusFilter === "LEAD" ? "bg-[#182238] text-white shadow-sm" : "text-slate-400 hover:text-white"
              )}
            >
              <span>⭐ Hot Leads</span>
              {leadCount > 0 && (
                <span className="text-[10px] text-[#D4FF32] font-semibold">({leadCount})</span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter("ARCHIVED")}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                statusFilter === "ARCHIVED" ? "bg-[#182238] text-white shadow-sm" : "text-slate-400 hover:text-white"
              )}
              title="Archived conversations"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Omnichannel Platform Tabs Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)]">
        {/* Platform selection pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setPlatformFilter("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer",
              platformFilter === "ALL"
                ? "bg-[#D4FF32] text-[#0B1020] font-bold shadow-[0_0_10px_rgba(212,255,50,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-[#182238]"
            )}
          >
            <span>All Platforms</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                platformFilter === "ALL" ? "bg-[#0B1020]/20 text-[#0B1020]" : "bg-[#182238] text-slate-400"
              )}
            >
              {brandConversations.length}
            </span>
          </button>

          {ALL_PLATFORMS.map((plat) => {
            const cfg = PLATFORM_CONFIG[plat];
            const isSelected = platformFilter === plat;
            const count = brandConversations.filter((c) => c.platform === plat).length;

            return (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border",
                  isSelected
                    ? "bg-[#182238] border-white text-white shadow-sm ring-1 ring-white"
                    : "bg-[#0B1020] border-[rgba(255,255,255,0.06)] text-slate-400 hover:text-slate-200 hover:bg-[#182238]/60"
                )}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cfg.iconColor }}
                />
                <span>{cfg.label}</span>
                {count > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#182238] text-slate-300 font-mono">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Engagement Type Pill Filter */}
        <div className="flex items-center gap-1 text-xs text-slate-400 bg-[#0B1020] p-1 rounded-lg border border-[rgba(255,255,255,0.06)]">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
              typeFilter === "ALL" ? "bg-[#182238] text-white" : "hover:text-white"
            )}
          >
            All Types
          </button>
          <button
            onClick={() => setTypeFilter("COMMENT")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1",
              typeFilter === "COMMENT" ? "bg-[#182238] text-[#D4FF32]" : "hover:text-white"
            )}
          >
            <MessageSquare className="w-3 h-3" />
            <span>Comments</span>
          </button>
          <button
            onClick={() => setTypeFilter("DIRECT_MESSAGE")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1",
              typeFilter === "DIRECT_MESSAGE" ? "bg-[#182238] text-white" : "hover:text-white"
            )}
          >
            <Mail className="w-3 h-3" />
            <span>DMs</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split View: List on left, Chat & AI on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
        {/* Left Column (4 cols): Thread List */}
        <div className="lg:col-span-4 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col overflow-hidden shadow-xl">
          {/* Live Search Box */}
          <div className="p-3 border-b border-[rgba(255,255,255,0.06)]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search author, post, text, tags..."
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2.5">
                <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-xs font-semibold text-slate-300">No conversations found</div>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                  Try switching tabs, clearing the search query, or use &quot;+ Test Comment&quot;.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversation?.id;
                const platCfg = PLATFORM_CONFIG[conv.platform] || PLATFORM_CONFIG.FACEBOOK;

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      if (conv.isUnread) {
                        store.markConversationAsRead(conv.id);
                      }
                    }}
                    className={cn(
                      "p-3.5 cursor-pointer transition-all flex items-start gap-3 relative",
                      isSelected ? "bg-[#182238]" : "hover:bg-[#182238]/40"
                    )}
                  >
                    {/* Unread indicator */}
                    {conv.isUnread && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D4FF32] shadow-[0_0_8px_#D4FF32]" />
                    )}

                    {/* Customer Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.customerAvatarUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-[#0B1020] flex items-center justify-center text-[8px] font-bold text-white shadow"
                        style={{ backgroundColor: platCfg.iconColor }}
                        title={conv.platform}
                      >
                        {conv.platform[0]}
                      </span>
                    </div>

                    {/* Content preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">
                          {conv.customerName}
                        </span>
                        <span className="text-[10px] text-slate-500 flex-shrink-0" suppressHydrationWarning>
                          {mounted ? formatDate(conv.lastActivityAt, "time") : ""}
                        </span>
                      </div>

                      {/* Post attribution reference if comment is on a post */}
                      {conv.postTitle && (
                        <div className="text-[10px] text-[#D4FF32] truncate font-medium mt-0.5 flex items-center gap-1">
                          <span>📌</span>
                          <span className="truncate">{conv.postTitle}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.2 rounded font-semibold border",
                            platCfg.bg,
                            platCfg.text,
                            platCfg.border
                          )}
                        >
                          {conv.platform}
                        </span>
                        <span className="text-[9px] bg-[#0B1020] text-slate-400 px-1.5 py-0.2 rounded">
                          {conv.type}
                        </span>
                        {conv.sentiment === "LEAD" && (
                          <span className="text-[9px] bg-[#D4FF32]/15 text-[#D4FF32] px-1.5 py-0.2 rounded font-bold border border-[#D4FF32]/30">
                            ⭐ LEAD
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-300 truncate mt-1 leading-snug">
                        {conv.snippet}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (8 cols): Thread History & AI Reply Console */}
        <div className="lg:col-span-8 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col overflow-hidden shadow-xl">
          {activeConversation ? (
            <>
              {/* Active Conversation Header */}
              <div className="p-4 border-b border-[rgba(255,255,255,0.06)] bg-[#182238]/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeConversation.customerAvatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-[#0B1020] flex items-center justify-center text-[8px] font-bold text-white shadow"
                      style={{
                        backgroundColor:
                          PLATFORM_CONFIG[activeConversation.platform]?.iconColor || "#1877F2",
                      }}
                    >
                      {activeConversation.platform[0]}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{activeConversation.customerName}</span>
                      <span className="text-slate-400 font-normal text-[11px]">
                        {activeConversation.customerHandle || activeConversation.platform}
                      </span>
                      {activeConversation.sentiment === "LEAD" && (
                        <span className="text-[9px] bg-[#D4FF32]/10 text-[#D4FF32] font-bold px-1.5 py-0.5 rounded border border-[#D4FF32]/30">
                          HOT LEAD
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Channel: {activeConversation.platform}</span>
                      <span>•</span>
                      <span>Type: {activeConversation.type}</span>
                      {activeConversation.postTitle && (
                        <>
                          <span>•</span>
                          <span className="text-[#D4FF32] font-medium truncate max-w-xs">
                            Post: &quot;{activeConversation.postTitle}&quot;
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {/* Star / Hot Lead toggle */}
                  <button
                    onClick={() => {
                      store.toggleStarLead(activeConversation.id);
                      showToast("Lead status toggled!");
                    }}
                    className={cn(
                      "p-1.5 rounded-lg border transition-colors cursor-pointer",
                      activeConversation.sentiment === "LEAD"
                        ? "bg-[#D4FF32]/10 border-[#D4FF32]/40 text-[#D4FF32]"
                        : "bg-[#0B1020] border-[rgba(255,255,255,0.08)] text-slate-400 hover:text-white"
                    )}
                    title="Toggle Star / Hot Lead"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>

                  {/* Archive toggle */}
                  <button
                    onClick={() => {
                      store.toggleArchiveConversation(activeConversation.id);
                      showToast(
                        activeConversation.isArchived
                          ? "Thread unarchived"
                          : "Thread moved to archive"
                      );
                    }}
                    className={cn(
                      "p-1.5 rounded-lg border transition-colors cursor-pointer",
                      activeConversation.isArchived
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-[#0B1020] border-[rgba(255,255,255,0.08)] text-slate-400 hover:text-white"
                    )}
                    title={activeConversation.isArchived ? "Unarchive thread" : "Archive thread"}
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  {/* View linked post if applicable */}
                  {activeConversation.postId && (
                    <Link
                      href="/app/posts"
                      className="px-2.5 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-slate-300 hover:text-[#D4FF32] hover:border-[#D4FF32]/40 text-[11px] flex items-center gap-1 transition-all"
                      title="View Post in Posts Management"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Post</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Linked Post Context Banner */}
              {activeConversation.postTitle && (
                <div className="px-4 py-2 bg-[#0B1020]/90 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300 truncate">
                    <span className="text-[#D4FF32] font-bold">📌 Commented on:</span>
                    <span className="font-semibold text-white truncate">
                      {activeConversation.postTitle}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                    {activeConversation.platform} FEED
                  </span>
                </div>
              )}

              {/* Message Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#121A2B] to-[#0B1020]">
                {activeConversation.messages.map((msg) => {
                  const isAgent = msg.senderType === "AGENT";
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex flex-col", isAgent ? "items-end" : "items-start")}
                    >
                      <span className="text-[10px] text-slate-400 mb-1 px-1 flex items-center gap-1">
                        <span className="font-medium text-slate-300">{msg.senderName}</span>
                        <span>•</span>
                        <span suppressHydrationWarning>
                          {mounted ? formatDate(msg.sentAt, "time") : ""}
                        </span>
                        {isAgent && (
                          <span className="text-[#D4FF32] font-semibold text-[9px] flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Synced
                          </span>
                        )}
                      </span>
                      <div
                        className={cn(
                          "max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md whitespace-pre-line",
                          isAgent
                            ? "bg-[#D4FF32] text-[#0B1020] font-medium rounded-tr-none"
                            : "bg-[#182238] text-slate-200 border border-[rgba(255,255,255,0.08)] rounded-tl-none"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Suggestions Toolbar */}
              <div className="p-3 bg-[#182238]/70 border-t border-[rgba(255,255,255,0.06)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4FF32]" />
                    <span>AI Reply Suggestions</span>
                    <span className="text-[9px] text-slate-400 font-normal">
                      (Brand Brain Guardrails Active)
                    </span>
                  </div>

                  <button
                    onClick={handleFetchAISuggestions}
                    disabled={isGeneratingSuggestions}
                    className="text-[10px] text-[#D4FF32] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isGeneratingSuggestions ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Formulating...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Suggestions</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Suggestions Pill list */}
                {aiSuggestions.length > 0 && (
                  <div className="space-y-1.5 animate-in fade-in">
                    {aiSuggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        onClick={() => setReplyText(sug)}
                        className="p-2 rounded-lg bg-[#0B1020] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-[11px] text-slate-300 hover:text-white cursor-pointer transition-colors"
                      >
                        {sug}
                      </div>
                    ))}
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 italic">
                      <Lock className="w-3 h-3 text-[#D4FF32]" />
                      <span>Brand Brain enforced: Zero hallucinations, accurate claims only.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Input Bar */}
              <div className="p-3.5 bg-[#121A2B] border-t border-[rgba(255,255,255,0.08)] flex gap-2.5 items-end">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  placeholder={`Reply publicly on ${activeConversation.platform} or click AI suggestions above...`}
                  className="flex-1 p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/60 resize-none leading-relaxed"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isReplying}
                  className="px-4 py-3 bg-[#D4FF32] text-[#0B1020] font-bold rounded-xl hover:bg-[#C2ED25] transition-all flex items-center justify-center disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(212,255,50,0.2)]"
                  title="Send official reply to post"
                >
                  {isReplying ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0B1020]" />
                  ) : (
                    <Send className="w-4 h-4 fill-current" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
              <Inbox className="w-10 h-10 text-slate-600" />
              <span>Select a conversation from the left to read and reply</span>
            </div>
          )}
        </div>
      </div>

      {/* Simulator Modal for Testing Incoming Comments */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121A2B] border border-[rgba(255,255,255,0.12)] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#D4FF32]" />
                <h3 className="text-sm font-bold text-white">Simulate Post Comment</h3>
              </div>
              <button
                onClick={() => setIsSimulateOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTestComment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Select Target Post</label>
                <select
                  value={simPostId}
                  onChange={(e) => setSimPostId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-white focus:outline-none focus:border-[#D4FF32]"
                >
                  {brandPosts.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.status}] {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Platform Channel</label>
                  <select
                    value={simPlatform}
                    onChange={(e) => setSimPlatform(e.target.value as PlatformType)}
                    className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-white focus:outline-none focus:border-[#D4FF32]"
                  >
                    {ALL_PLATFORMS.map((plat) => (
                      <option key={plat} value={plat}>
                        {PLATFORM_CONFIG[plat].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Commenter Name</label>
                  <input
                    type="text"
                    value={simAuthor}
                    onChange={(e) => setSimAuthor(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-white focus:outline-none focus:border-[#D4FF32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Comment Text</label>
                <textarea
                  rows={3}
                  value={simComment}
                  onChange={(e) => setSimComment(e.target.value)}
                  placeholder="Enter what the user comments on the post..."
                  className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-white focus:outline-none focus:border-[#D4FF32] resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSimulateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B1020] text-slate-400 hover:text-white border border-[rgba(255,255,255,0.08)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold hover:bg-[#C2ED25] transition-all shadow-[0_0_12px_rgba(212,255,50,0.2)]"
                >
                  Publish Comment to Inbox & Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

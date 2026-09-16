"use client";

import { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  Sparkles,
  Send,
  MessageSquare,
  CheckCircle2,
  Tag,
  UserCheck,
  Archive,
  RefreshCw,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { AIService } from "@/lib/ai/ai-service";
import { InboxConversation } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export default function UnifiedSocialInboxPage() {
  const { data, store } = useDemoStore();
  const [selectedConvId, setSelectedConvId] = useState<string>("conv-1");
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "LEAD">("ALL");
  const [replyText, setReplyText] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fbAccount = data.socialAccounts.find((a) => a.platform === "FACEBOOK");

  const activeConversation =
    data.conversations.find((c) => c.id === selectedConvId) || data.conversations[0];

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync live comments from Facebook Graph API
  const handleSyncFacebookComments = async (silent = false) => {
    if (!fbAccount) {
      if (!silent) showToast("Please connect Facebook in Social Accounts first.");
      return;
    }
    setIsSyncing(true);
    try {
      const url = `/api/inbox/sync?token=${encodeURIComponent(
        fbAccount.accessToken || ""
      )}&accountId=${encodeURIComponent(fbAccount.platformAccountId || "")}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.conversations) {
        if (json.conversations.length > 0) {
          store.mergeConversations(json.conversations);
          if (!selectedConvId || selectedConvId === "conv-1") {
            setSelectedConvId(json.conversations[0].id);
          }
          showToast(`🎉 Synced ${json.count} live Facebook comment(s)!`);
        } else if (!silent) {
          showToast("Checked Facebook: No new comments found on recent posts.");
        }
      } else if (!silent && json.error) {
        showToast(json.error);
      }
    } catch {
      if (!silent) showToast("Failed to sync Facebook comments.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync on page load if Facebook is connected
  useEffect(() => {
    if (fbAccount?.accessToken) {
      handleSyncFacebookComments(true);
    }
  }, [fbAccount?.accessToken]);

  const handleFetchAISuggestions = async () => {
    if (!activeConversation) return;
    setIsGeneratingSuggestions(true);
    try {
      const lastMsg = activeConversation.messages[activeConversation.messages.length - 1]?.content || "";
      const suggestions = await AIService.suggestInboxReply(activeConversation.snippet, lastMsg);
      setAiSuggestions(suggestions);
    } catch {
      showToast("Failed to fetch AI reply suggestions.");
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeConversation) return;
    const sentText = replyText;
    store.addInboxMessage(activeConversation.id, sentText, "AGENT");
    setReplyText("");
    setAiSuggestions([]);

    // If this is a real Facebook comment, post reply directly to Facebook Graph API
    if (activeConversation.id.startsWith("fb_")) {
      try {
        const res = await fetch("/api/inbox/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            commentId: activeConversation.id,
            message: sentText,
            token: fbAccount?.accessToken,
          }),
        });
        const json = await res.json();
        if (json.success) {
          showToast("💬 Live reply published to Facebook comment!");
        } else {
          showToast(`Facebook Reply Notice: ${json.error || "Could not publish to Facebook"}`);
        }
      } catch {
        showToast("Error sending reply to Facebook Graph API.");
      }
    } else {
      showToast("💬 Reply sent successfully!");
    }
  };

  const filteredConversations = data.conversations.filter((c) => {
    if (filter === "UNREAD") return c.isUnread;
    if (filter === "LEAD") return c.sentiment === "LEAD";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {notification && (
        <div className="fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Unified Social Inbox</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Omni-channel comments, direct messages, and brand mentions with Brand Brain-grounded AI copilot.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sync Facebook Comments button */}
          <button
            onClick={() => handleSyncFacebookComments(false)}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182238] border border-[#D4FF32]/40 text-[#D4FF32] text-xs font-semibold hover:bg-[#D4FF32] hover:text-[#0B1020] transition-all cursor-pointer shadow-[0_0_12px_rgba(212,255,50,0.15)] disabled:opacity-50"
            title="Fetch real comments from your connected Facebook Page"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
            <span>{isSyncing ? "Syncing..." : "Sync Facebook Comments"}</span>
          </button>

          {/* Filter Pills */}
          <div className="flex items-center bg-[#121A2B] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
            <button
              onClick={() => setFilter("ALL")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                filter === "ALL" ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
              )}
            >
            All Threads ({data.conversations.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              filter === "UNREAD" ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
            )}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("LEAD")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              filter === "LEAD" ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
            )}
          >
            ⭐ Hot Leads
          </button>
          </div>
        </div>
      </div>

      {/* 2-Column Split View: List on left, Chat & AI on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px]">
        {/* Left Column (4 cols): Thread List */}
        <div className="lg:col-span-4 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-[rgba(255,255,255,0.06)]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    "p-3.5 cursor-pointer transition-colors flex items-start gap-3",
                    isSelected ? "bg-[#182238]" : "hover:bg-[#182238]/40"
                  )}
                >
                  <img
                    src={conv.customerAvatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        {conv.customerName}
                      </span>
                      <span className="text-[10px] text-slate-500" suppressHydrationWarning>
                        {formatDate(conv.lastActivityAt, "time")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] bg-[#0B1020] text-slate-400 px-1.5 py-0.2 rounded font-mono">
                        {conv.platform}
                      </span>
                      {conv.sentiment === "LEAD" && (
                        <span className="text-[9px] bg-[#D4FF32]/10 text-[#D4FF32] px-1.5 py-0.2 rounded font-bold">
                          LEAD
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mt-1">{conv.snippet}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): Thread History & AI Reply Console */}
        <div className="lg:col-span-8 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col overflow-hidden">
          {activeConversation ? (
            <>
              {/* Active Conversation Header */}
              <div className="p-4 border-b border-[rgba(255,255,255,0.06)] bg-[#182238]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConversation.customerAvatarUrl}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      {activeConversation.customerName}
                      <span className="text-slate-500 font-normal">
                        ({activeConversation.customerHandle || activeConversation.platform})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Channel: {activeConversation.platform} • Type: {activeConversation.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast("Conversation archived")}
                    className="p-1.5 rounded hover:bg-[#182238] text-slate-400 hover:text-white"
                    title="Archive thread"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {activeConversation.messages.map((msg) => {
                  const isAgent = msg.senderType === "AGENT";
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex flex-col", isAgent ? "items-end" : "items-start")}
                    >
                      <span className="text-[10px] text-slate-500 mb-1 px-1" suppressHydrationWarning>
                        {msg.senderName} • {formatDate(msg.sentAt, "time")}
                      </span>
                      <div
                        className={cn(
                          "max-w-[80%] p-3.5 rounded-xl text-xs leading-relaxed",
                          isAgent
                            ? "bg-[#D4FF32] text-[#0B1020] font-medium"
                            : "bg-[#182238] text-slate-200 border border-[rgba(255,255,255,0.08)]"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Suggestions Toolbar */}
              <div className="p-3 bg-[#182238]/60 border-t border-[rgba(255,255,255,0.06)] space-y-2">
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
                    className="text-[10px] text-[#D4FF32] hover:underline flex items-center gap-1"
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
                      <span>Strict safety: Never invents fake pricing, discounts, or guarantees.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Input Bar */}
              <div className="p-3.5 bg-[#121A2B] border-t border-[rgba(255,255,255,0.08)] flex gap-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your official reply or click an AI suggestion above..."
                  className="flex-1 p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/60 resize-none leading-relaxed"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="px-4 bg-[#D4FF32] text-[#0B1020] font-bold rounded-lg hover:bg-[#C2ED25] transition-all flex items-center justify-center disabled:opacity-40"
                >
                  <Send className="w-4 h-4 fill-current" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Select a conversation to start replying
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

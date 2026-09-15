"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Check,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { ProviderFactory } from "@/lib/providers/provider-factory";
import { PlatformType, SocialAccount } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const PLATFORMS_CATALOG: { id: PlatformType; name: string; desc: string; iconColor: string }[] = [
  { id: "LINKEDIN", name: "LinkedIn", desc: "Company Pages & Personal Profiles", iconColor: "#0A66C2" },
  { id: "X", name: "X (Twitter)", desc: "Direct Posts, Threads & Media", iconColor: "#FFFFFF" },
  { id: "INSTAGRAM", name: "Instagram", desc: "Business & Creator Accounts (Feed & Stories)", iconColor: "#E4405F" },
  { id: "FACEBOOK", name: "Facebook", desc: "Pages & Business Groups", iconColor: "#1877F2" },
  { id: "WHATSAPP", name: "WhatsApp", desc: "WhatsApp Cloud API for Business", iconColor: "#25D366" },
  { id: "THREADS", name: "Threads", desc: "Conversational Threads by Meta", iconColor: "#FFFFFF" },
  { id: "PINTEREST", name: "Pinterest", desc: "Pins & Board Automation", iconColor: "#BD081C" },
  { id: "YOUTUBE", name: "YouTube", desc: "Shorts & Video Community Posts", iconColor: "#FF0000" },
  { id: "TIKTOK", name: "TikTok", desc: "Short-form Video Publishing", iconColor: "#00F2FE" },
];

export default function SocialAccountsPage() {
  const { data, store } = useDemoStore();
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformType | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSimulateOAuth = (platform: PlatformType) => {
    setConnectingPlatform(platform);
    setTimeout(() => {
      setConnectingPlatform(null);
      showToast(`🎉 Connected ${platform} account successfully in Demo Mode!`);
    }, 1200);
  };

  const handleToggleStatus = (id: string) => {
    store.toggleAccountStatus(id);
    showToast("Account status toggled.");
  };

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
            <h1 className="text-xl font-bold text-white tracking-tight">Social Accounts & Channels</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              OAuth 2.0 Layer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage channel authorizations, token health, and API capabilities for all connected platforms.
          </p>
        </div>
      </div>

      {/* Connected Accounts Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Connected Channels ({data.socialAccounts.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.socialAccounts.map((acc) => {
            const isActive = acc.status === "ACTIVE";
            return (
              <div
                key={acc.id}
                className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-[#0B1020] text-slate-400 font-mono px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)]">
                      {acc.platform}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {acc.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <img
                      src={acc.avatarUrl}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border border-[rgba(255,255,255,0.1)]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white truncate">{acc.accountName}</div>
                      <div className="text-[10px] text-slate-400">{acc.handle || acc.accountType}</div>
                    </div>
                  </div>

                  {/* Capability Badges */}
                  <div className="grid grid-cols-3 gap-1 mt-3.5 text-[9px] text-center">
                    <span
                      className={cn(
                        "py-1 rounded font-medium",
                        acc.capabilities.canPublishText
                          ? "bg-[#182238] text-slate-300"
                          : "bg-[#0B1020] text-slate-600"
                      )}
                    >
                      Text: {acc.capabilities.canPublishText ? "✓" : "✗"}
                    </span>
                    <span
                      className={cn(
                        "py-1 rounded font-medium",
                        acc.capabilities.canPublishImage
                          ? "bg-[#182238] text-slate-300"
                          : "bg-[#0B1020] text-slate-600"
                      )}
                    >
                      Image: {acc.capabilities.canPublishImage ? "✓" : "✗"}
                    </span>
                    <span
                      className={cn(
                        "py-1 rounded font-medium",
                        acc.capabilities.canReadAnalytics
                          ? "bg-[#182238] text-slate-300"
                          : "bg-[#0B1020] text-slate-600"
                      )}
                    >
                      Metrics: {acc.capabilities.canReadAnalytics ? "✓" : "✗"}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[10px] text-slate-400">
                  <span>Synced {formatDate(acc.lastSyncAt, "time")}</span>
                  <button
                    onClick={() => handleToggleStatus(acc.id)}
                    className="hover:text-white hover:underline text-slate-400"
                  >
                    {isActive ? "Revoke Access" : "Reconnect"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Platforms Catalog */}
      <div className="space-y-3 pt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Available Social Platforms
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PLATFORMS_CATALOG.map((p) => {
            const isConnected = data.socialAccounts.some((acc) => acc.platform === p.id);
            const isConnecting = connectingPlatform === p.id;

            return (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-3 hover:bg-[#182238]/40 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.iconColor }} />
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                </div>

                <button
                  onClick={() => handleSimulateOAuth(p.id)}
                  disabled={isConnecting}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0",
                    isConnected
                      ? "bg-[#182238] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)]"
                      : "bg-[#D4FF32] text-[#0B1020] hover:bg-[#C2ED25]"
                  )}
                >
                  {isConnecting ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : isConnected ? (
                    "Manage"
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

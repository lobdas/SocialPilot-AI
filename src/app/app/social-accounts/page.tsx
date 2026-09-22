"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Check,
  ExternalLink,
  Settings,
  Sparkles,
  Layers,
  Pencil,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { PlatformType, SocialAccount } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { NoBrandState } from "@/components/brand/no-brand-state";

const PLATFORMS_CATALOG: { id: PlatformType; name: string; desc: string; iconColor: string }[] = [
  { id: "LINKEDIN", name: "LinkedIn", desc: "Company Pages & Personal Profiles", iconColor: "#0A66C2" },
  { id: "FACEBOOK", name: "Facebook", desc: "Pages & Business Groups", iconColor: "#1877F2" },
  { id: "INSTAGRAM", name: "Instagram", desc: "Business & Creator Accounts (Feed & Stories)", iconColor: "#E4405F" },
  { id: "GOOGLE_BUSINESS", name: "Google Business Profile", desc: "Local Search, Maps & Store Updates (GMB)", iconColor: "#4285F4" },
  { id: "THREADS", name: "Threads", desc: "Conversational Threads by Meta", iconColor: "#FFFFFF" },
  { id: "X", name: "X (Twitter)", desc: "Direct Posts, Threads & Media", iconColor: "#FFFFFF" },
  { id: "YOUTUBE", name: "YouTube", desc: "YouTube Shorts & Video Publishing", iconColor: "#FF0000" },
  { id: "PINTEREST", name: "Pinterest", desc: "Pins & Board Automation", iconColor: "#BD081C" },
];

export default function SocialAccountsPage() {
  const { data, store, activeBrand, mounted } = useDemoStore();
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformType | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);

  // Direct editing state for connected accounts
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [tempHandle, setTempHandle] = useState("");
  const [tempToken, setTempToken] = useState("");

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4500);
  };

  // Listen for OAuth callback params (?connected=FACEBOOK or ?error=...)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const accountName = params.get("accountName");
    const handle = params.get("handle");
    const avatarUrl = params.get("avatarUrl");
    const token = params.get("token");
    const accountId = params.get("accountId");
    const error = params.get("error");

    if (connected) {
      const plat = connected.toUpperCase() as PlatformType;
      store.connectAccount(
        plat,
        accountName || undefined,
        handle || undefined,
        avatarUrl || undefined,
        token || undefined,
        accountId || undefined
      );
      showToast(`🎉 ${plat} connected successfully! Button switched to Manage.`, "success");

      // Inform parent window if this was opened in a popup/new tab
      if (window.opener && window.opener !== window) {
        try {
          window.opener.postMessage(
            { type: "OAUTH_CONNECTED", platform: plat, accountName, handle, avatarUrl, token, accountId },
            window.location.origin
          );
        } catch {}
      }
      window.history.replaceState({}, "", "/app/social-accounts");
    } else if (error) {
      showToast(`Notice: ${decodeURIComponent(error)}`, "error");
      window.history.replaceState({}, "", "/app/social-accounts");
    }

    // Cross-tab / popup communication listener
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "OAUTH_CONNECTED" && event.data?.platform) {
        const plat = event.data.platform as PlatformType;
        store.connectAccount(
          plat,
          event.data.accountName,
          event.data.handle,
          event.data.avatarUrl,
          event.data.token,
          event.data.accountId
        );
        showToast(`🎉 ${plat} successfully connected! Button updated to Manage.`, "success");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [store]);

  const handleConnect = (platform: PlatformType) => {
    setConnectingPlatform(platform);

    // If live OAuth endpoint is available for any of our 8 channels
    const livePlatforms: PlatformType[] = [
      "FACEBOOK",
      "INSTAGRAM",
      "LINKEDIN",
      "THREADS",
      "GOOGLE_BUSINESS",
      "X",
      "YOUTUBE",
      "PINTEREST",
    ];
    const isLive = livePlatforms.includes(platform) && process.env.NEXT_PUBLIC_DEMO_MODE !== "true";

    if (isLive) {
      const url = `/api/oauth/connect/${platform.toLowerCase()}`;
      window.open(url, "_blank", "noopener,noreferrer");
      showToast(`🚀 Opening official ${platform} OAuth in a new tab... Complete login there.`, "info");
      setTimeout(() => setConnectingPlatform(null), 800);
      return;
    }

    // Simulation / Quick connect for development & non-OAuth channels
    setTimeout(() => {
      if (platform === "GOOGLE_BUSINESS") {
        store.connectAccount(
          "GOOGLE_BUSINESS",
          "Apex Growth (Google Business Profile)",
          "@apexgrowth_maps",
          "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80"
        );
      } else {
        store.connectAccount(platform);
      }
      setConnectingPlatform(null);
      showToast(`🎉 ${platform} connected! Button updated to Manage.`, "success");
    }, 700);
  };

  const handleManage = (platform: PlatformType) => {
    const el = document.getElementById(`account-card-${platform}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-[#D4FF32]", "shadow-lg");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-[#D4FF32]", "shadow-lg");
      }, 2000);
      showToast(`Focused on active ${platform} channel.`, "info");
    } else {
      showToast(`Managing ${platform} channel settings.`, "info");
    }
  };

  const handleDisconnect = (accountId: string, platformName: string) => {
    store.disconnectAccount(accountId);
    showToast(`Disconnected ${platformName}. Button switched back to Connect.`, "info");
  };

  const handleToggleStatus = (id: string) => {
    store.toggleAccountStatus(id);
    showToast("Channel sync status updated.", "info");
  };

  const handleResetChannels = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("socialpilot_demo_store_v1");
      localStorage.removeItem("socialpilot_demo_store_v2");
      localStorage.removeItem("socialpilot_demo_store_v3");
      localStorage.removeItem("socialpilot_demo_store_v4");
      store.resetToDefault();
      window.location.reload();
    }
  };

  if (!activeBrand) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <NoBrandState featureName="Social Accounts" />
      </div>
    );
  }

  const brandAccounts = data.socialAccounts.filter(
    (a) => a.brandId === activeBrand.id
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div
          className={cn(
            "fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl text-white text-xs shadow-2xl flex items-center gap-2 border transition-all animate-in slide-in-from-top-2",
            notification.type === "success" && "bg-[#182238] border-[#D4FF32] text-white",
            notification.type === "error" && "bg-[#28151E] border-rose-500 text-rose-200",
            notification.type === "info" && "bg-[#182238] border-sky-400 text-slate-200"
          )}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#D4FF32] flex-shrink-0" />
          ) : notification.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Social Accounts — {activeBrand.name}</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              {brandAccounts.length} Connected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Connect and authenticate social channels specifically for <strong className="text-white">{activeBrand.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChannels}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-[#182238] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clean storage cache and reset channels"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Channels</span>
          </button>
        </div>
      </div>

      {/* Connected Accounts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span>Connected Channels for {activeBrand.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#182238] text-slate-300 border border-[rgba(255,255,255,0.08)]">
              {brandAccounts.length}
            </span>
          </h2>
        </div>

        {brandAccounts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#121A2B]/70 border border-dashed border-[rgba(255,255,255,0.1)] text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mx-auto text-[#D4FF32]">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">No Connected Channels for {activeBrand.name}</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Select any channel from <strong className="text-slate-300">Available Social Platforms</strong> below and click <span className="text-[#D4FF32] font-semibold">Connect</span> to link an account for this brand.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandAccounts.map((acc) => {
              const isActive = acc.status === "ACTIVE";
              return (
                <div
                  key={acc.id}
                  id={`account-card-${acc.platform}`}
                  className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-[#0B1020] text-slate-300 font-mono px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)]">
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

                    <div className="flex items-start gap-3 mt-3">
                      <img
                        src={acc.avatarUrl}
                        alt=""
                        className="w-11 h-11 rounded-full object-cover border border-[rgba(255,255,255,0.1)] flex-shrink-0 mt-0.5"
                      />
                      {editingId === acc.id ? (
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Page name"
                            className="w-full px-2 py-1 rounded bg-[#0B1020] border border-[#D4FF32]/60 text-xs text-white focus:outline-none"
                            autoFocus
                          />
                          <input
                            type="text"
                            value={tempHandle}
                            onChange={(e) => setTempHandle(e.target.value)}
                            placeholder="@handle"
                            className="w-full px-2 py-0.5 rounded bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-[10px] text-slate-300 focus:outline-none"
                          />
                          <input
                            type="password"
                            value={tempToken}
                            onChange={(e) => setTempToken(e.target.value)}
                            placeholder="Page Access Token (EAAB...)"
                            className="w-full px-2 py-0.5 rounded bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-[10px] text-slate-300 focus:outline-none"
                          />
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (tempName.trim()) {
                                  store.updateSocialAccount(acc.id, {
                                    accountName: tempName.trim(),
                                    handle: tempHandle.trim() || undefined,
                                  });
                                }
                                if (tempToken.trim()) {
                                  store.updateAccountToken(acc.id, tempToken.trim());
                                }
                                showToast("Page settings updated!", "success");
                                setEditingId(null);
                              }}
                              className="px-2 py-0.5 rounded bg-[#D4FF32] text-[#0B1020] font-bold text-[10px] cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-2 py-0.5 rounded bg-[#182238] text-slate-400 text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <div className="text-xs font-bold text-white truncate">{acc.accountName}</div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(acc.id);
                                setTempName(acc.accountName);
                                setTempHandle(acc.handle || "");
                                setTempToken(acc.accessToken || "");
                              }}
                              className="text-slate-500 hover:text-[#D4FF32] transition-colors p-0.5 cursor-pointer"
                              title="Edit page name or token"
                            >
                              <Pencil className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 truncate">{acc.handle || acc.accountType}</span>
                            {acc.accessToken ? (
                              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20 font-medium">
                                Token ✓
                              </span>
                            ) : (
                              <span className="text-[9px] text-amber-400/80 bg-amber-500/10 px-1 rounded border border-amber-500/20 font-medium">
                                Reconnect needed
                              </span>
                            )}
                          </div>
                        </div>
                      )}
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
                    <span suppressHydrationWarning>Synced {mounted ? formatDate(acc.lastSyncAt, "time") : "Recently"}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(acc.id)}
                        className="hover:text-white underline text-slate-400 cursor-pointer"
                        title={isActive ? "Pause publishing permissions" : "Re-activate account"}
                      >
                        {isActive ? "Pause" : "Activate"}
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        onClick={() => handleDisconnect(acc.id, acc.accountName)}
                        className="hover:text-rose-400 text-slate-400 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Disconnect channel"
                      >
                        <Trash2 className="w-2.5 h-2.5" /> Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Platforms Catalog */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Available Social Platforms
          </h2>
          <span className="text-[11px] text-slate-400">
            Click Connect to authorize. Connected accounts show Manage.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PLATFORMS_CATALOG.map((p) => {
            const isConnected = brandAccounts.some((acc) => acc.platform === p.id && acc.status === "ACTIVE");
            const isConnecting = connectingPlatform === p.id;

            return (
              <div
                key={p.id}
                className={cn(
                  "p-4 rounded-xl bg-[#121A2B] border transition-all flex items-center justify-between gap-3",
                  isConnected
                    ? "border-[#D4FF32]/30 bg-[#121A2B]/90 shadow-sm"
                    : "border-[rgba(255,255,255,0.06)] hover:bg-[#182238]/40"
                )}
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.iconColor }} />
                    <span className="truncate">{p.name}</span>
                    {isConnected && (
                      <span className="text-[9px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-1.5 py-0.2 rounded border border-[#D4FF32]/20">
                        Connected
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{p.desc}</div>
                </div>

                {isConnected ? (
                  /* When connected, button says Manage */
                  <button
                    onClick={() => handleManage(p.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 bg-[#182238] text-slate-200 hover:text-white hover:border-[#D4FF32]/50 border border-[rgba(255,255,255,0.12)] cursor-pointer"
                    title={`Manage connected ${p.name} account`}
                  >
                    <Check className="w-3.5 h-3.5 text-[#D4FF32]" />
                    <span>Manage</span>
                  </button>
                ) : (
                  /* When not connected, button says Connect */
                  <button
                    onClick={() => handleConnect(p.id)}
                    disabled={isConnecting}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 bg-[#D4FF32] text-[#0B1020] hover:bg-[#C2ED25] shadow-md shadow-[#D4FF32]/10 cursor-pointer disabled:opacity-70"
                    title={`Connect ${p.name}`}
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

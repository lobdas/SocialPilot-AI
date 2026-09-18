"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  Download,
  Trash2,
  Share2,
  Check,
  AlertTriangle,
  Lock,
  User,
  Mail,
  Send,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { activeWorkspace, data, store } = useDemoStore();
  const { user, updateUser } = useAuth();

  // User Account States (from Signup)
  const [userName, setUserName] = useState(user?.name || "Alex Rivera");
  const userEmail = user?.email || "alex@apexgrowth.io";

  // Workspace Profile States
  const [workspaceName, setWorkspaceName] = useState(activeWorkspace?.name || "Apex Growth Agency");
  const [timezone, setTimezone] = useState(activeWorkspace?.timezone || "America/New_York");
  const [industry, setIndustry] = useState(activeWorkspace?.industry || "Digital Marketing & Growth");
  const [defaultLang, setDefaultLang] = useState(activeWorkspace?.language || "en");

  // Publishing & UTM Tracking States
  const [enableUtm, setEnableUtm] = useState(true);
  const [utmSource, setUtmSource] = useState("socialpilot");
  const [utmMedium, setUtmMedium] = useState("social");
  const [enableLinkShortening, setEnableLinkShortening] = useState(true);

  // Notification Preferences States
  const [notifyPostPublished, setNotifyPostPublished] = useState(true);
  const [notifyPostScheduled, setNotifyPostScheduled] = useState(true);
  const [notifyClientApproval, setNotifyClientApproval] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(true);

  // Email Testing States
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [isSendingDigestSample, setIsSendingDigestSample] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    try {
      const res = await fetch("/api/notifications/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TEST",
          to: userEmail,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        showToast(`✅ Test email sent successfully to ${userEmail}!`);
      } else {
        showToast(`❌ ${resData.error || "Failed to send test email"}`);
      }
    } catch (err: any) {
      showToast("❌ Network error connecting to email service");
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleSendDigestSample = async () => {
    setIsSendingDigestSample(true);
    try {
      const res = await fetch("/api/notifications/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "WEEKLY_DIGEST",
          to: userEmail,
          data: {
            workspaceName: workspaceName || "My Workspace",
          },
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        showToast(`📊 Sample weekly digest sent to ${userEmail}!`);
      } else {
        showToast(`❌ ${resData.error || "Could not send sample digest"}`);
      }
    } catch (err: any) {
      showToast("❌ Network error connecting to email service");
    } finally {
      setIsSendingDigestSample(false);
    }
  };


  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user?.name]);

  useEffect(() => {
    if (activeWorkspace) {
      setWorkspaceName(activeWorkspace.name);
      setTimezone(activeWorkspace.timezone);
      setIndustry(activeWorkspace.industry || "Digital Marketing & Growth");
      setDefaultLang(activeWorkspace.language || "en");
    }
  }, [activeWorkspace?.id, activeWorkspace?.name, activeWorkspace?.timezone, activeWorkspace?.industry, activeWorkspace?.language]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    if (activeWorkspace) {
      store.updateWorkspace(activeWorkspace.id, {
        name: workspaceName.trim() || activeWorkspace.name,
        timezone,
        industry,
        language: defaultLang,
      });
    }
    if (updateUser && user) {
      updateUser({
        name: userName.trim() || user.name,
        workspaceName: workspaceName.trim() || activeWorkspace?.name,
      });
    }
    showToast("⚙️ Profile and workspace settings updated successfully!");
  };

  const handleExportData = () => {
    const exportBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(exportBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(workspaceName || "workspace").toLowerCase().replace(/\s+/g, "_")}_export_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("📦 Workspace archive exported successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {notification && (
        <div className="fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Workspace & Organization Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your company profile, timezone, publishing defaults, and team notifications.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* 1. Company Profile (Workspace Identity) */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#182238] flex items-center justify-center border border-white/5 text-[#D4FF32]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Company & Workspace Profile
            </h2>
            <p className="text-[11px] text-slate-400">
              The primary organization account identity for your team and client portals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Account Owner Name */}
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Account Owner / Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Your name as registered during signup. Displayed on team activity and reports.
            </p>
          </div>

          {/* Primary Login Email (Immutable / Read-only) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-slate-300">
                Primary Login Email
              </label>
              <span className="text-[9px] text-amber-300/90 font-mono bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.2 rounded flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Cannot be changed
              </span>
            </div>
            <input
              type="email"
              value={userEmail}
              readOnly
              disabled
              className="w-full px-3 py-2 rounded-lg bg-[#0B1020]/60 border border-[rgba(255,255,255,0.06)] text-xs text-slate-400 cursor-not-allowed select-none opacity-90 font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Set during signup. Used for sign-in and security notifications.
            </p>
          </div>

          {/* Company / Workspace Name */}
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Company / Workspace Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="e.g. Apex Growth Agency"
              className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Your company or organization name set at signup.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Default Timezone <span className="text-rose-400">*</span>
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="Asia/Dhaka">Dhaka, Bangladesh (UTC+06:00)</option>
              <option value="Asia/Kolkata">India Standard Time (UTC+05:30)</option>
              <option value="America/New_York">Eastern Time (US & Canada) (UTC-04:00)</option>
              <option value="America/Chicago">Central Time (US & Canada) (UTC-05:00)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada) (UTC-07:00)</option>
              <option value="Europe/London">London, UK (UTC+01:00)</option>
              <option value="Europe/Stockholm">Stockholm, Paris, Berlin (UTC+02:00)</option>
              <option value="Asia/Dubai">Dubai, UAE (UTC+04:00)</option>
              <option value="Asia/Singapore">Singapore (UTC+08:00)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Industry / Business Category
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="Digital Marketing & Growth">Digital Marketing & Growth Agency</option>
              <option value="E-Commerce & DTC">E-Commerce & DTC Retail</option>
              <option value="SaaS & Technology">SaaS & B2B Technology</option>
              <option value="Media & Creator Network">Media & Creator Network</option>
              <option value="Real Estate & Property">Real Estate & Property</option>
              <option value="Healthcare & Wellness">Healthcare & Wellness</option>
              <option value="Consulting & Professional Services">Consulting & Professional Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Default Content Language
            </label>
            <select
              value={defaultLang}
              onChange={(e) => setDefaultLang(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="bn">বাংলা (Bengali)</option>
              <option value="en">English (US/UK)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="es">Español (Spanish)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Publishing & Link Tracking (UTM Automation) */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#182238] flex items-center justify-center border border-white/5 text-[#D4FF32]">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Publishing & Link Tracking (UTM)
            </h2>
            <p className="text-[11px] text-slate-400">
              Configure campaign analytics tracking for all external links posted to social channels.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {/* UTM Tracking Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.05)]">
            <div>
              <div className="text-xs font-semibold text-white">
                Auto-Append UTM Parameters
              </div>
              <div className="text-[11px] text-slate-400">
                Automatically add campaign attribution parameters (utm_source, utm_medium) for Google Analytics.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnableUtm(!enableUtm)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                enableUtm ? "bg-[#D4FF32]" : "bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full bg-[#0B1020] absolute top-1 transition-transform",
                  enableUtm ? "left-6" : "left-1"
                )}
              />
            </button>
          </div>

          {enableUtm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Default UTM Source</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="socialpilot"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Default UTM Medium</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="social"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Link Shortener */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.05)]">
            <div>
              <div className="text-xs font-semibold text-white">
                Native Clean Link Shortener
              </div>
              <div className="text-[11px] text-slate-400">
                Compress long destination links in posts to save character counts across X and Threads.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnableLinkShortening(!enableLinkShortening)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                enableLinkShortening ? "bg-[#D4FF32]" : "bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full bg-[#0B1020] absolute top-1 transition-transform",
                  enableLinkShortening ? "left-6" : "left-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#182238] flex items-center justify-center border border-white/5 text-[#D4FF32]">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Automated Email Alerts
            </h2>
            <p className="text-[11px] text-slate-400">
              Receive real-time notifications for live posts, scheduled campaigns, and weekly digest reports.
            </p>
          </div>
        </div>

        {/* Recipient & Quick Test Box */}
        <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4FF32]" />
                <span className="text-xs font-bold text-white">Target Notification Recipient:</span>
                <span className="text-xs font-mono text-[#D4FF32] font-semibold">{userEmail}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                All publishing confirmations, scheduled calendar alerts, and weekly performance digests are sent here.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTestEmail}
                className="px-3 py-1.5 rounded-lg bg-[#182238] hover:bg-[#1F2C4A] border border-[rgba(255,255,255,0.1)] text-xs text-white font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                title="Send a verified test email to check delivery"
              >
                {isSendingTestEmail ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4FF32]" />
                    <span>Sending Test...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#D4FF32]" />
                    <span>Send Test Email</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendDigestSample}
                disabled={isSendingDigestSample}
                className="px-3 py-1.5 rounded-lg bg-[#182238] hover:bg-[#1F2C4A] border border-[rgba(255,255,255,0.1)] text-xs text-white font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                title="Send a sample weekly performance report to your inbox"
              >
                {isSendingDigestSample ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>Sending Digest...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Sample Weekly Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Granular Notification Triggers */}
        <div className="space-y-2.5 pt-1">
          {/* 1. Post Published */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.05)]">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>🚀 Instant Post Published Notification</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4FF32]/15 text-[#D4FF32] font-mono font-bold">Real-time</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Receive an immediate email with live post preview and channels whenever content is published live.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifyPostPublished(!notifyPostPublished)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                notifyPostPublished ? "bg-[#D4FF32]" : "bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full bg-[#0B1020] absolute top-1 transition-transform",
                  notifyPostPublished ? "left-6" : "left-1"
                )}
              />
            </button>
          </div>

          {/* 2. Post Scheduled */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.05)]">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>📅 Post Scheduled Confirmation Alert</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-400/15 text-sky-400 font-mono font-bold">Calendar</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Receive an email confirming the exact release date, scheduled time, and destination channels.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifyPostScheduled(!notifyPostScheduled)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                notifyPostScheduled ? "bg-[#D4FF32]" : "bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full bg-[#0B1020] absolute top-1 transition-transform",
                  notifyPostScheduled ? "left-6" : "left-1"
                )}
              />
            </button>
          </div>

          {/* 3. Weekly Digest */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.05)]">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>📊 Weekly Performance Digest Report</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-400/15 text-purple-400 font-mono font-bold">Every Monday</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Receive an executive Monday morning summary of impressions, follower growth, and top-performing posts.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifyWeeklyDigest(!notifyWeeklyDigest)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                notifyWeeklyDigest ? "bg-[#D4FF32]" : "bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full bg-[#0B1020] absolute top-1 transition-transform",
                  notifyWeeklyDigest ? "left-6" : "left-1"
                )}
              />
            </button>
          </div>

          {/* 4. Client Approval */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.05)]">
            <div>
              <div className="text-xs font-semibold text-white">Client Approval & Feedback Notifications</div>
              <div className="text-[11px] text-slate-400">
                Get alerted when a client approves or requests revisions on draft social posts.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifyClientApproval(!notifyClientApproval)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                notifyClientApproval ? "bg-[#D4FF32]" : "bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full bg-[#0B1020] absolute top-1 transition-transform",
                  notifyClientApproval ? "left-6" : "left-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Data & Danger Zone */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-rose-500/20 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Workspace Data & Danger Zone
            </h2>
            <p className="text-[11px] text-slate-400">
              Export company data archives or manage workspace closure.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0B1020] border border-white/5">
          <div>
            <div className="text-xs font-semibold text-white">Export Workspace Archive</div>
            <div className="text-[11px] text-slate-400">
              Download complete backup containing your brands, scheduled posts, campaigns, and media references.
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#182238] hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)] text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#D4FF32]" />
            <span>Export JSON Archive</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
          <div>
            <div className="text-xs font-semibold text-rose-300">Delete Workspace</div>
            <div className="text-[11px] text-slate-400">
              Permanently delete this workspace and all linked brands, post queues, and media. This action is irreversible.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to permanently delete workspace "${workspaceName}"? This cannot be undone.`)) {
                store.resetToDefault();
                window.location.href = "/";
              }
            }}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}

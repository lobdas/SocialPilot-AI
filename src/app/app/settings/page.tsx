"use client";

import { useState } from "react";
import { Settings, Key, Database, Globe, Shield, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { useEffect } from "react";

export default function SettingsPage() {
  const { activeWorkspace } = useDemoStore();
  const [workspaceName, setWorkspaceName] = useState(activeWorkspace.name);
  const [timezone, setTimezone] = useState(activeWorkspace.timezone);
  const [demoMode, setDemoMode] = useState(true);
  const [openaiKey, setOpenaiKey] = useState("sk-proj-demo••••••••••••••••");
  const [geminiKey, setGeminiKey] = useState("AIzaSy••••••••••••••••");
  const [s3Bucket, setS3Bucket] = useState("socialpilot-agency-media");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setWorkspaceName(activeWorkspace.name);
    setTimezone(activeWorkspace.timezone);
  }, [activeWorkspace.name, activeWorkspace.timezone]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    showToast("⚙️ Settings updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {notification && (
        <div className="fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Workspace & Integration Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure workspace defaults, API credentials, storage providers, and mode toggles.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Mode Status Toggle */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF32] animate-pulse" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Operational Demo Mode
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            When Demo Mode is enabled, all social publishing and AI interactions are safely simulated without requiring third-party API keys or touching real social profiles.
          </p>
        </div>

        <button
          onClick={() => {
            setDemoMode(!demoMode);
            showToast(demoMode ? "Switched to Production Mode." : "Switched to Demo Mode.");
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
            demoMode
              ? "bg-[#D4FF32]/15 text-[#D4FF32] border-[#D4FF32]/30"
              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
          }`}
        >
          {demoMode ? "Demo Mode: ON" : "Production Mode: ON"}
        </button>
      </div>

      {/* Workspace Profile */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Workspace Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Workspace Name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Default Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none"
            >
              <option value="America/New_York">Eastern Time (US & Canada) (UTC-04:00)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada) (UTC-07:00)</option>
              <option value="Europe/London">London (UTC+01:00)</option>
              <option value="Europe/Stockholm">Stockholm, Paris, Berlin (UTC+02:00)</option>
              <option value="Asia/Kolkata">India Standard Time (UTC+05:30)</option>
              <option value="Asia/Singapore">Singapore (UTC+08:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Production API Credentials */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <Key className="w-4 h-4 text-[#D4FF32]" />
            <span>AI & Platform API Keys (AES-256 Encrypted)</span>
          </div>
          <span className="text-[10px] text-slate-400">Zero secrets stored client-side</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              OpenAI API Key (GPT-4o & DALL-E 3)
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              S3 / Cloudflare R2 Media Bucket
            </label>
            <input
              type="text"
              value={s3Bucket}
              onChange={(e) => setS3Bucket(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

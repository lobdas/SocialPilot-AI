"use client";

import { useState, useEffect } from "react";
import {
  BrainCircuit,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Mail,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { Brand } from "@/lib/types";
import { NoBrandState } from "@/components/brand/no-brand-state";

export default function BrandBrainPage() {
  const { data, activeBrand, store } = useDemoStore();
  const [form, setForm] = useState<Brand | null>(activeBrand);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (activeBrand) {
      setForm(activeBrand);
    }
  }, [activeBrand?.id]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    if (!form) return;
    store.updateBrand(form.id, form);
    showToast("🧠 Brand Brain guidelines saved! All future AI outputs and alerts will use these parameters.");
  };

  if (!activeBrand || !form) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <NoBrandState featureName="Brand Brain" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
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
            <h1 className="text-xl font-bold text-white tracking-tight">Brand Brain Intelligence</h1>
            <span className="text-[10px] bg-[#C4B5FD]/10 text-[#C4B5FD] font-semibold px-2 py-0.5 rounded-full border border-[#C4B5FD]/20">
              Guideline Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Teach AI how to write for your brand. Set writing rules, forbidden words, and sample posts so every AI output matches your brand identity.
          </p>
        </div>

        {/* Save Guidelines Button */}
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Guidelines</span>
        </button>
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Identity */}
        <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              1. Core Identity & Voice
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: form.primaryColor || "#D4FF32" }} />
              <span className="text-white font-medium">{form.name}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Brand Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
            />
          </div>

          {/* Brand Email field */}
          <div>
            <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between mb-1">
              <span>Brand Email (Alerts & Reports)</span>
              <span className="text-[10px] text-[#D4FF32] font-semibold">Active Recipient</span>
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={form.brandEmail || ""}
                onChange={(e) => setForm({ ...form, brandEmail: e.target.value })}
                placeholder="e.g. contact@brand.com"
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              All post published alerts, schedule confirmations, and performance reports for this brand will be dispatched to this email address.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline || ""}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Brand Voice & Personality
            </label>
            <textarea
              rows={3}
              value={form.brandVoice || ""}
              onChange={(e) => setForm({ ...form, brandVoice: e.target.value })}
              placeholder="e.g. Authoritative, bold, analytical, yet approachable..."
              className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Target Audience Personas
            </label>
            <textarea
              rows={3}
              value={form.targetAudience || ""}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              placeholder="Who are we writing for?"
              className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* 2. AI Content Rules & Writing Style */}
        <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4FF32]">
            <Sparkles className="w-4 h-4 text-[#D4FF32]" />
            <span>2. AI Content Rules & Writing Style</span>
          </div>

          {/* Negative Rules */}
          <div>
            <label className="text-[11px] font-semibold text-slate-200 block mb-1">
              🚫 What AI Must Avoid (Forbidden Topics & Claims)
            </label>
            <p className="text-[10px] text-slate-400 mb-2 leading-normal">
              List forbidden words, false guarantees, or sensitive topics that AI must <strong>NEVER</strong> mention in your posts.
            </p>
            <textarea
              rows={4}
              value={form.prohibitedClaims || ""}
              onChange={(e) => setForm({ ...form, prohibitedClaims: e.target.value })}
              placeholder="e.g. Never guarantee exact ROI percentages, never promise overnight results, avoid buzzwords like 'game-changer', never mention competitor pricing..."
              className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-amber-500/30 text-xs text-amber-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
            />
          </div>

          {/* Positive Style Examples */}
          <div>
            <label className="text-[11px] font-semibold text-slate-200 block mb-1">
              ✨ How AI Should Write (Best Sample Posts)
            </label>
            <p className="text-[10px] text-slate-400 mb-2 leading-normal">
              Paste 1-2 of your best past posts. AI will analyze the structure, hooks, and tone to write all future posts in this exact style.
            </p>
            <textarea
              rows={4}
              value={form.approvedExamples || ""}
              onChange={(e) => setForm({ ...form, approvedExamples: e.target.value })}
              placeholder="Paste 1-2 of your best posts here so AI learns your brand's unique writing rhythm, tone, and line formatting..."
              className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

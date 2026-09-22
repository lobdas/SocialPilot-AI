"use client";

import React, { useState } from "react";
import { Sparkles, Plus, Building2, Check, ArrowRight, ShieldCheck, Palette } from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { cn } from "@/lib/utils";

interface NoBrandStateProps {
  title?: string;
  description?: string;
  featureName?: string;
}

export function NoBrandState({
  title = "No Brand Selected",
  description = "Create your first brand to unlock AI content generation, multi-channel scheduling, and social analytics.",
  featureName,
}: NoBrandStateProps) {
  const { store } = useDemoStore();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [color, setColor] = useState("#D4FF32");
  const [brandEmail, setBrandEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    store.addBrand({
      workspaceId: "ws-1",
      name: name.trim(),
      slug: slug || `brand-${Date.now()}`,
      brandEmail: brandEmail.trim() || `contact@${slug || "brand"}.com`,
      tagline: tagline.trim() || "Empowering our audience with value and innovation.",
      description: `Official brand workspace for ${name.trim()}.`,
      primaryColor: color,
      secondaryColor: "#C4B5FD",
      brandVoice: "Authoritative, approachable, and value-driven",
      tone: "Innovative and empowering",
      preferredLanguage: "en",
      targetAudience: `Followers and clients of ${name.trim()}`,
      prohibitedClaims: "Never guarantee unrealistic financial returns without disclaimers.",
    });

    setIsSubmitting(false);
    setIsCreating(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-8 rounded-2xl bg-[#121A2B]/80 border border-[rgba(255,255,255,0.08)] shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
      {!isCreating ? (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#D4FF32]/10 border border-[#D4FF32]/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,255,50,0.15)]">
            <Building2 className="w-8 h-8 text-[#D4FF32]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {featureName ? `Create a Brand to Access ${featureName}` : title}
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-sm shadow-[0_0_25px_rgba(212,255,50,0.3)] hover:bg-[#c4ee24] transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Brand</span>
            </button>
          </div>

          <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4FF32]" /> Brand Brain
              </div>
              <p className="text-[11px] text-slate-400">Custom voice, tone rules, and AI compliance guardrails.</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" /> Isolated Channels
              </div>
              <p className="text-[11px] text-slate-400">Keep social accounts, posts, and analytics completely separated.</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <Palette className="w-3.5 h-3.5 text-[#FDA4AF]" /> Instant Publishing
              </div>
              <p className="text-[11px] text-slate-400">Schedule multi-platform variants with unified inbox management.</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full ring-2 ring-white/20"
                style={{ backgroundColor: color }}
              />
              <h3 className="text-lg font-bold text-white">Create New Brand</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Brand Name <span className="text-[#D4FF32]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Nova, Lumina Skincare, Acme Studio"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32] transition-colors"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tagline / Value Proposition
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Modern lifestyle essentials engineered for tomorrow"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Brand Contact Email <span className="text-slate-500 font-normal">(for automated reports)</span>
              </label>
              <input
                type="email"
                value={brandEmail}
                onChange={(e) => setBrandEmail(e.target.value)}
                placeholder="e.g. contact@brand.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Brand Accent Color
              </label>
              <div className="flex items-center gap-3">
                {["#D4FF32", "#38BDF8", "#FDA4AF", "#C4B5FD", "#F59E0B", "#10B981"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full border border-white/20 transition-all flex items-center justify-center cursor-pointer",
                      color === c && "ring-2 ring-white ring-offset-2 ring-offset-[#121A2B] scale-110"
                    )}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check className="w-4 h-4 text-black stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-lg hover:bg-[#c4ee24] disabled:opacity-40 transition-all cursor-pointer"
            >
              <span>Create Brand & Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

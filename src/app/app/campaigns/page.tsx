"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { formatDate } from "@/lib/utils";

export default function CampaignsPage() {
  const { data } = useDemoStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newObjective, setNewObjective] = useState<"AWARENESS" | "CONVERSIONS" | "ENGAGEMENT">("CONVERSIONS");

  const handleCreate = () => {
    if (!newCampaignName.trim()) return;
    const newCamp = {
      id: `camp-${Date.now()}`,
      workspaceId: data.activeWorkspaceId,
      brandId: data.activeBrandId,
      name: newCampaignName,
      objective: newObjective,
      description: "Omni-channel marketing campaign created from dashboard.",
      status: "ACTIVE" as const,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      postCount: 0,
      publishedCount: 0,
    };
    data.campaigns.unshift(newCamp);
    setShowCreateModal(false);
    setNewCampaignName("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Campaigns</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              {data.campaigns.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Orchestrate multi-week, cross-channel campaigns grouped by business objectives.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.campaigns.map((camp) => {
          const progress = camp.postCount > 0 ? Math.round((camp.publishedCount / camp.postCount) * 100) : 0;
          return (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4 hover:border-[rgba(255,255,255,0.15)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-[#182238] text-slate-300 px-2 py-0.5 rounded font-mono border border-[rgba(255,255,255,0.06)]">
                    {camp.objective}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {camp.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">{camp.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {camp.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Campaign Execution</span>
                    <span className="font-mono text-white font-semibold">
                      {camp.publishedCount} / {camp.postCount} Published ({progress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0B1020] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#182238] to-[#D4FF32] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {camp.startDate ? formatDate(camp.startDate, "short") : "Now"} –{" "}
                    {camp.endDate ? formatDate(camp.endDate, "short") : "Ongoing"}
                  </span>
                </div>
                <Link
                  href="/app/content-studio"
                  className="text-[#D4FF32] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Add Posts</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121A2B] border border-[rgba(255,255,255,0.12)] rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Create New Marketing Campaign</h3>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Campaign Name</label>
              <input
                type="text"
                placeholder="e.g. Q4 Black Friday Launch Blitz"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Primary Objective</label>
              <select
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none"
              >
                <option value="CONVERSIONS">Conversions & Sales</option>
                <option value="AWARENESS">Brand Awareness</option>
                <option value="ENGAGEMENT">Audience Engagement</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25]"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

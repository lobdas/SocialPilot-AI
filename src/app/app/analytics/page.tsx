"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Users,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { formatNumber } from "@/lib/utils";

export default function AnalyticsDashboardPage() {
  const { data } = useDemoStore();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const metrics = [
    { label: "Total Reach", value: 148200, change: "+24.8%", isPositive: true, icon: Eye },
    { label: "Total Engagements", value: 12450, change: "+18.2%", isPositive: true, icon: Heart },
    { label: "Followers Gained", value: 1840, change: "+32.1%", isPositive: true, icon: Users },
    { label: "Avg Engagement Rate", value: "4.82%", change: "+0.9%", isPositive: true, icon: TrendingUp },
  ];

  const platformBreakdown = [
    { platform: "LinkedIn", percentage: 44, reach: "65,200", color: "#0A66C2" },
    { platform: "X (Twitter)", percentage: 28, reach: "41,500", color: "#FFFFFF" },
    { platform: "Instagram", percentage: 20, reach: "29,600", color: "#E4405F" },
    { platform: "Facebook", percentage: 8, reach: "11,900", color: "#1877F2" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Cross-Channel Analytics</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              Live Insights
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated performance metrics, platform comparisons, and AI growth recommendations.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#121A2B] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1 text-xs rounded-md ${timeRange === "7d" ? "bg-[#182238] text-white" : "text-slate-400"}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1 text-xs rounded-md ${timeRange === "30d" ? "bg-[#182238] text-white" : "text-slate-400"}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange("90d")}
              className={`px-3 py-1 text-xs rounded-md ${timeRange === "90d" ? "bg-[#182238] text-white" : "text-slate-400"}`}
            >
              90 Days
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{m.label}</span>
                <Icon className="w-4 h-4 text-[#D4FF32]" />
              </div>
              <div className="text-2xl font-black text-white">
                {typeof m.value === "number" ? formatNumber(m.value) : m.value}
              </div>
              <div className="text-[11px] flex items-center gap-1 text-emerald-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{m.change}</span>
                <span className="text-slate-500 font-normal">vs previous period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Trends Chart Placeholder (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Audience Growth & Reach Curve</h2>
              <p className="text-xs text-slate-400">Aggregated organic trajectory across 6 channels</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Normalized UTC</span>
          </div>

          {/* Simulated Visual Chart Bars */}
          <div className="h-56 flex items-end justify-between gap-2 pt-8 px-2 border-b border-[rgba(255,255,255,0.06)]">
            {[35, 42, 48, 40, 58, 65, 72, 68, 85, 92, 88, 100].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[#182238] to-[#D4FF32] opacity-80 group-hover:opacity-100 transition-all cursor-pointer relative"
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#0B1020] text-[#D4FF32] text-[9px] font-mono py-0.5 px-1.5 rounded border border-[#D4FF32]/40 whitespace-nowrap z-10">
                    {val * 148} Reach
                  </div>
                </div>
                <span className="text-[9px] text-slate-500">W{idx + 1}</span>
              </div>
            ))}
          </div>

          {/* Platform Distribution Bar */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-slate-300">Channel Share Breakdown</div>
            <div className="h-3 w-full rounded-full overflow-hidden flex">
              {platformBreakdown.map((p) => (
                <div
                  key={p.platform}
                  style={{ width: `${p.percentage}%`, backgroundColor: p.color }}
                  title={`${p.platform}: ${p.percentage}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px]">
              {platformBreakdown.map((p) => (
                <div key={p.platform} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-slate-300 font-medium">{p.platform}</span>
                  <span className="text-slate-500">({p.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-b from-[#182238] to-[#121A2B] border border-[rgba(212,255,50,0.15)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#D4FF32]" />
            <span>AI Analytical Recommendations</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-[#0B1020]/70 border border-[rgba(255,255,255,0.06)]">
              <div className="font-bold text-white text-xs text-[#D4FF32]">
                1. Double Down on LinkedIn Carousels
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Your B2B case studies generated 3.8x higher reshares than text-only updates. Recommend publishing 2 multi-slide carousels weekly.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1020]/70 border border-[rgba(255,255,255,0.06)]">
              <div className="font-bold text-white text-xs text-[#C4B5FD]">
                2. Shift X Publishing to Morning Window
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Posts scheduled between 8:00 AM – 9:30 AM EST experienced 44% higher initial impressions than evening posts.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1020]/70 border border-[rgba(255,255,255,0.06)]">
              <div className="font-bold text-white text-xs text-emerald-400">
                3. Lead Response Velocity
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Average reply time in Unified Inbox is 18 minutes. Leads responded to within 30 minutes showed a 62% conversion to demo calls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

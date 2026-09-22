"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
  Printer,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Zap,
  CheckCircle2,
  Layers,
  Send,
  Sliders,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { formatNumber, formatDate, cn } from "@/lib/utils";
import { PlatformType } from "@/lib/types";
import { NoBrandState } from "@/components/brand/no-brand-state";

interface DataPoint {
  label: string;
  reach: number;
  engagements: number;
  followers: number;
  date: string;
}

const TIME_RANGE_DATA: Record<
  "7d" | "30d" | "90d",
  {
    metrics: {
      reach: { value: number; change: string; isPositive: boolean };
      engagements: { value: number; change: string; isPositive: boolean };
      followers: { value: number; change: string; isPositive: boolean };
      engagementRate: { value: string; change: string; isPositive: boolean };
    };
    chartPoints: DataPoint[];
    platformBreakdown: {
      platform: string;
      id: PlatformType;
      percentage: number;
      reach: number;
      engagements: number;
      growth: string;
      color: string;
      topFormat: string;
    }[];
  }
> = {
  "7d": {
    metrics: {
      reach: { value: 38450, change: "+14.2%", isPositive: true },
      engagements: { value: 3120, change: "+9.8%", isPositive: true },
      followers: { value: 460, change: "+18.5%", isPositive: true },
      engagementRate: { value: "5.14%", change: "+0.6%", isPositive: true },
    },
    chartPoints: [
      { label: "Mon", reach: 4800, engagements: 390, followers: 52, date: "Sep 15" },
      { label: "Tue", reach: 5200, engagements: 440, followers: 64, date: "Sep 16" },
      { label: "Wed", reach: 6100, engagements: 510, followers: 78, date: "Sep 17" },
      { label: "Thu", reach: 5600, engagements: 460, followers: 60, date: "Sep 18" },
      { label: "Fri", reach: 6800, engagements: 590, followers: 85, date: "Sep 19" },
      { label: "Sat", reach: 4950, engagements: 340, followers: 49, date: "Sep 20" },
      { label: "Sun", reach: 5000, engagements: 390, followers: 72, date: "Sep 21" },
    ],
    platformBreakdown: [
      { platform: "LinkedIn", id: "LINKEDIN", percentage: 46, reach: 17680, engagements: 1435, growth: "+16.2%", color: "#0A66C2", topFormat: "Multi-Slide PDF Carousel" },
      { platform: "X (Twitter)", id: "X", percentage: 27, reach: 10380, engagements: 842, growth: "+11.4%", color: "#FFFFFF", topFormat: "Insight Thread Hooks" },
      { platform: "Instagram", id: "INSTAGRAM", percentage: 19, reach: 7300, engagements: 592, growth: "+8.9%", color: "#E4405F", topFormat: "Visual Reel / 4:5 Carousel" },
      { platform: "Facebook", id: "FACEBOOK", percentage: 8, reach: 3090, engagements: 251, growth: "+3.2%", color: "#1877F2", topFormat: "Community Discussion Post" },
    ],
  },
  "30d": {
    metrics: {
      reach: { value: 148200, change: "+24.8%", isPositive: true },
      engagements: { value: 12450, change: "+18.2%", isPositive: true },
      followers: { value: 1840, change: "+32.1%", isPositive: true },
      engagementRate: { value: "4.82%", change: "+0.9%", isPositive: true },
    },
    chartPoints: [
      { label: "W1", reach: 9800, engagements: 810, followers: 110, date: "Aug 24 - Aug 30" },
      { label: "W2", reach: 10400, engagements: 890, followers: 135, date: "Aug 31 - Sep 06" },
      { label: "W3", reach: 12600, engagements: 1080, followers: 165, date: "Sep 07 - Sep 13" },
      { label: "W4", reach: 11900, engagements: 980, followers: 145, date: "Sep 14 - Sep 20" },
      { label: "W5", reach: 14500, engagements: 1240, followers: 190, date: "Sep 21 - Sep 27" },
      { label: "W6", reach: 15800, engagements: 1350, followers: 210, date: "Sep 28 - Oct 04" },
      { label: "W7", reach: 17200, engagements: 1490, followers: 235, date: "Oct 05 - Oct 11" },
      { label: "W8", reach: 16400, engagements: 1380, followers: 205, date: "Oct 12 - Oct 18" },
      { label: "W9", reach: 18900, engagements: 1620, followers: 250, date: "Oct 19 - Oct 25" },
      { label: "W10", reach: 20400, engagements: 1780, followers: 280, date: "Oct 26 - Nov 01" },
      { label: "W11", reach: 19800, engagements: 1710, followers: 260, date: "Nov 02 - Nov 08" },
      { label: "W12", reach: 22500, engagements: 1920, followers: 310, date: "Nov 09 - Nov 15" },
    ],
    platformBreakdown: [
      { platform: "LinkedIn", id: "LINKEDIN", percentage: 44, reach: 65200, engagements: 5478, growth: "+28.4%", color: "#0A66C2", topFormat: "Multi-Slide PDF Carousel" },
      { platform: "X (Twitter)", id: "X", percentage: 28, reach: 41500, engagements: 3486, growth: "+19.1%", color: "#FFFFFF", topFormat: "Insight Thread Hooks" },
      { platform: "Instagram", id: "INSTAGRAM", percentage: 20, reach: 29600, engagements: 2490, growth: "+14.7%", color: "#E4405F", topFormat: "Visual Reel / 4:5 Carousel" },
      { platform: "Facebook", id: "FACEBOOK", percentage: 8, reach: 11900, engagements: 996, growth: "+6.5%", color: "#1877F2", topFormat: "Community Discussion Post" },
    ],
  },
  "90d": {
    metrics: {
      reach: { value: 432600, change: "+38.4%", isPositive: true },
      engagements: { value: 37800, change: "+29.6%", isPositive: true },
      followers: { value: 5480, change: "+44.2%", isPositive: true },
      engagementRate: { value: "4.56%", change: "+1.2%", isPositive: true },
    },
    chartPoints: [
      { label: "Jun", reach: 85000, engagements: 7400, followers: 1050, date: "Month 1 (June)" },
      { label: "Jul", reach: 120000, engagements: 10600, followers: 1540, date: "Month 2 (July)" },
      { label: "Aug", reach: 145000, engagements: 12800, followers: 1890, date: "Month 3 (August)" },
      { label: "Sep", reach: 182600, engagements: 16000, followers: 2450, date: "Month 4 (September)" },
    ],
    platformBreakdown: [
      { platform: "LinkedIn", id: "LINKEDIN", percentage: 48, reach: 207648, engagements: 18144, growth: "+41.5%", color: "#0A66C2", topFormat: "Multi-Slide PDF Carousel" },
      { platform: "X (Twitter)", id: "X", percentage: 26, reach: 112476, engagements: 9828, growth: "+26.2%", color: "#FFFFFF", topFormat: "Insight Thread Hooks" },
      { platform: "Instagram", id: "INSTAGRAM", percentage: 18, reach: 77868, engagements: 6804, growth: "+22.0%", color: "#E4405F", topFormat: "Visual Reel / 4:5 Carousel" },
      { platform: "Facebook", id: "FACEBOOK", percentage: 8, reach: 34608, engagements: 3024, growth: "+11.3%", color: "#1877F2", topFormat: "Community Discussion Post" },
    ],
  },
};

export default function AnalyticsDashboardPage() {
  const { data, activeBrand } = useDemoStore();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [activeMetricTab, setActiveMetricTab] = useState<"reach" | "engagements" | "followers">("reach");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState([
    {
      id: "rec-1",
      title: "Double Down on LinkedIn Document Carousels",
      description: `Your ${activeBrand.name} thought leadership carousels generated 3.8x higher reshares than standalone text. Schedule 2 multi-slide carousels weekly.`,
      lift: "+42% Engagement",
      actionLink: "/app/content-studio",
      actionText: "Create Carousel",
    },
    {
      id: "rec-2",
      title: "Shift X (Twitter) Publishing to 8:30 AM Window",
      description: "Posts scheduled between 8:00 AM – 9:30 AM EST experienced 44% higher initial impressions compared to evening distributions.",
      lift: "+28% Initial Velocity",
      actionLink: "/app/calendar",
      actionText: "Adjust Schedule",
    },
    {
      id: "rec-3",
      title: "Lead Response Velocity Benchmark",
      description: "Average reply time in Unified Inbox is under 12 minutes. Fast responder threads yielded 62% higher sales call conversions.",
      lift: "+62% Conversion",
      actionLink: "/app/inbox",
      actionText: "Open Inbox",
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const currentDataset = TIME_RANGE_DATA[timeRange];
  const chartPoints = currentDataset.chartPoints;

  // Compute SVG coordinates for Area Chart
  const svgMetrics = useMemo(() => {
    const width = 800;
    const height = 220;
    const paddingBottom = 30;
    const paddingTop = 20;
    const paddingX = 40;

    const values = chartPoints.map((p) => p[activeMetricTab]);
    const maxVal = Math.max(...values) * 1.15;
    const minVal = 0;

    const points = chartPoints.map((pt, i) => {
      const x = paddingX + (i / (chartPoints.length - 1)) * (width - paddingX * 2);
      const ratio = (pt[activeMetricTab] - minVal) / (maxVal - minVal || 1);
      const y = height - paddingBottom - ratio * (height - paddingTop - paddingBottom);
      return { x, y, data: pt };
    });

    // Create SVG Path for line and area
    if (points.length < 2) return { pathD: "", areaD: "", points, maxVal };

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

    return { pathD, areaD, points, maxVal };
  }, [chartPoints, activeMetricTab]);

  // Handle Export CSV
  const handleExportCsv = () => {
    const headers = "Platform,AudienceReach,Engagements,SharePercentage,VelocityGrowth,TopFormat\n";
    const rows = currentDataset.platformBreakdown
      .map((p) => `"${p.platform}",${p.reach},${p.engagements},"${p.percentage}%","${p.growth}","${p.topFormat}"`)
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `SocialPilot_Analytics_Report_${timeRange}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("📥 Analytics CSV report downloaded successfully!");
  };

  // Refresh AI Insights
  const handleRefreshAi = () => {
    const variations = [
      [
        {
          id: `rec-${Date.now()}-1`,
          title: `Scale Native Video Reels for ${activeBrand.name}`,
          description: "Video content delivered 2.9x more profile visits. Repurpose your highest-dwell LinkedIn posts into 9:16 vertical shorts.",
          lift: "+55% Profile Visits",
          actionLink: "/app/content-studio",
          actionText: "Open Studio",
        },
        {
          id: `rec-${Date.now()}-2`,
          title: "Audience Dwell Time Sweetspot",
          description: "Longer captions (200-280 words) with structured whitespace are ranking in the top 5% algorithm tier this month.",
          lift: "+33% Algorithmic Push",
          actionLink: "/app/content-studio",
          actionText: "Draft Post",
        },
        {
          id: `rec-${Date.now()}-3`,
          title: "Cross-Pollinate Top Performers",
          description: "Your best performing post this week has zero X (Twitter) distribution. Repost with a concise hook thread.",
          lift: "+18k Impressions",
          actionLink: "/app/posts",
          actionText: "View Posts",
        },
      ],
      [
        {
          id: `rec-${Date.now()}-4`,
          title: "Double Down on LinkedIn Document Carousels",
          description: `Your ${activeBrand.name} thought leadership carousels generated 3.8x higher reshares than standalone text. Schedule 2 multi-slide carousels weekly.`,
          lift: "+42% Engagement",
          actionLink: "/app/content-studio",
          actionText: "Create Carousel",
        },
        {
          id: `rec-${Date.now()}-5`,
          title: "Shift X Publishing to 8:30 AM Window",
          description: "Posts scheduled between 8:00 AM – 9:30 AM EST experienced 44% higher initial impressions compared to evening distributions.",
          lift: "+28% Initial Velocity",
          actionLink: "/app/calendar",
          actionText: "Adjust Schedule",
        },
        {
          id: `rec-${Date.now()}-6`,
          title: "Lead Response Velocity Benchmark",
          description: "Average reply time in Unified Inbox is under 12 minutes. Fast responder threads yielded 62% higher sales call conversions.",
          lift: "+62% Conversion",
          actionLink: "/app/inbox",
          actionText: "Open Inbox",
        },
      ],
    ];

    const pick = variations[Math.floor(Math.random() * variations.length)];
    setAiRecommendations(pick);
    showToast("✨ Fresh AI growth recommendations generated!");
  };

  // Real brand posts from store for Content Leaderboard
  const brandPosts = useMemo(() => {
    if (!activeBrand) return [];
    return data.posts.filter((p) => p.brandId === activeBrand.id);
  }, [data.posts, activeBrand?.id]);

  const postsLeaderboard = useMemo(() => {
    return brandPosts.slice(0, 5).map((post, idx) => {
      const multiplier = timeRange === "90d" ? 3.2 : timeRange === "30d" ? 1.0 : 0.35;
      const baseReach = 18400 - idx * 2800;
      const reach = Math.round(baseReach * multiplier);
      const engagements = Math.round(reach * (0.054 - idx * 0.005));
      const rate = ((engagements / reach) * 100).toFixed(2);

      return {
        ...post,
        reach,
        engagements,
        rate: `${rate}%`,
      };
    });
  }, [brandPosts, timeRange]);

  if (!activeBrand) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <NoBrandState featureName="Cross-Channel Analytics" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#121A2B] border border-[#D4FF32]/40 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-[0_0_25px_rgba(212,255,50,0.2)] flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4FF32]/10 border border-[#D4FF32]/30 flex items-center justify-center text-[#D4FF32]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Cross-Channel Analytics</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2.5 py-0.5 rounded-full border border-[#D4FF32]/25">
              Live Insights
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated performance metrics, platform comparisons, and AI growth recommendations for{" "}
            <span className="text-white font-medium">{activeBrand.name}</span>.
          </p>
        </div>

        {/* Action Buttons & Time Range Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-[#D4FF32]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Print Executive Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Report</span>
          </button>

          <div className="flex items-center bg-[#0B1020] rounded-xl p-0.5 border border-[rgba(255,255,255,0.08)]">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                  timeRange === range
                    ? "bg-[#D4FF32] text-[#0B1020] font-bold shadow-[0_0_10px_rgba(212,255,50,0.2)]"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveMetricTab("reach")}
          className={cn(
            "p-4 rounded-xl bg-[#121A2B] border transition-all cursor-pointer space-y-2",
            activeMetricTab === "reach"
              ? "border-[#D4FF32]/60 shadow-[0_0_20px_rgba(212,255,50,0.15)] ring-1 ring-[#D4FF32]/30"
              : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]"
          )}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Reach</span>
            <Eye className="w-4 h-4 text-[#D4FF32]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatNumber(currentDataset.metrics.reach.value)}
          </div>
          <div className="text-[11px] flex items-center gap-1 text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{currentDataset.metrics.reach.change}</span>
            <span className="text-slate-500 font-normal">vs previous period</span>
          </div>
        </div>

        <div
          onClick={() => setActiveMetricTab("engagements")}
          className={cn(
            "p-4 rounded-xl bg-[#121A2B] border transition-all cursor-pointer space-y-2",
            activeMetricTab === "engagements"
              ? "border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-400/30"
              : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]"
          )}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Engagements</span>
            <Heart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatNumber(currentDataset.metrics.engagements.value)}
          </div>
          <div className="text-[11px] flex items-center gap-1 text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{currentDataset.metrics.engagements.change}</span>
            <span className="text-slate-500 font-normal">vs previous period</span>
          </div>
        </div>

        <div
          onClick={() => setActiveMetricTab("followers")}
          className={cn(
            "p-4 rounded-xl bg-[#121A2B] border transition-all cursor-pointer space-y-2",
            activeMetricTab === "followers"
              ? "border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/30"
              : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]"
          )}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Followers Gained</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatNumber(currentDataset.metrics.followers.value)}
          </div>
          <div className="text-[11px] flex items-center gap-1 text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{currentDataset.metrics.followers.change}</span>
            <span className="text-slate-500 font-normal">vs previous period</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Engagement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {currentDataset.metrics.engagementRate.value}
          </div>
          <div className="text-[11px] flex items-center gap-1 text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{currentDataset.metrics.engagementRate.change}</span>
            <span className="text-slate-500 font-normal">vs industry baseline</span>
          </div>
        </div>
      </div>

      {/* Main Charts & AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Curve Chart Area (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Audience Growth & Reach Curve</span>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono bg-[#D4FF32]/10 text-[#D4FF32] border border-[#D4FF32]/25">
                  {activeMetricTab.toUpperCase()}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated organic trajectory across all active channels
              </p>
            </div>

            {/* Metric Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#0B1020] p-1 rounded-lg border border-[rgba(255,255,255,0.06)]">
              {(
                [
                  { id: "reach", label: "Reach" },
                  { id: "engagements", label: "Engagements" },
                  { id: "followers", label: "Followers" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMetricTab(tab.id)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] rounded-md font-semibold transition-all cursor-pointer",
                    activeMetricTab === tab.id
                      ? "bg-[#182238] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="relative pt-2">
            <svg
              viewBox="0 0 800 220"
              className="w-full h-56 overflow-visible select-none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4FF32" stopOpacity="0.32" />
                  <stop offset="85%" stopColor="#D4FF32" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#D4FF32" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              {[40, 85, 130, 175].map((yLine, idx) => (
                <line
                  key={idx}
                  x1="30"
                  y1={yLine}
                  x2="770"
                  y2={yLine}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area Fill */}
              {svgMetrics.areaD && (
                <path d={svgMetrics.areaD} fill="url(#areaGradient)" className="transition-all duration-300" />
              )}

              {/* Glowing Line */}
              {svgMetrics.pathD && (
                <path
                  d={svgMetrics.pathD}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="transition-all duration-300 filter drop-shadow-[0_0_8px_rgba(212,255,50,0.4)]"
                />
              )}

              {/* Interactive Points */}
              {svgMetrics.points.map((pt, idx) => {
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g key={idx} className="cursor-pointer">
                    {/* Hover hotspot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill="transparent"
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    />
                    {/* Visual dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? "6" : "3.5"}
                      fill="#0B1020"
                      stroke={isHovered ? "#FFFFFF" : "#D4FF32"}
                      strokeWidth={isHovered ? "3" : "2"}
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip overlay */}
            {hoveredPointIndex !== null && svgMetrics.points[hoveredPointIndex] && (
              <div
                className="absolute pointer-events-none -top-1 bg-[#0B1020] border border-[#D4FF32]/50 text-white p-2.5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] text-xs z-20 transition-all -translate-x-1/2 space-y-1"
                style={{
                  left: `${(svgMetrics.points[hoveredPointIndex].x / 800) * 100}%`,
                }}
              >
                <div className="text-[10px] text-slate-400 font-medium">
                  {svgMetrics.points[hoveredPointIndex].data.date}
                </div>
                <div className="font-bold text-[#D4FF32] font-mono text-sm">
                  {formatNumber(svgMetrics.points[hoveredPointIndex].data[activeMetricTab])}{" "}
                  <span className="text-[10px] text-slate-300 font-sans uppercase">
                    {activeMetricTab}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-0.5 border-t border-[rgba(255,255,255,0.06)]">
                  <span>Reach: {formatNumber(svgMetrics.points[hoveredPointIndex].data.reach)}</span>
                  <span>•</span>
                  <span>Eng: {formatNumber(svgMetrics.points[hoveredPointIndex].data.engagements)}</span>
                </div>
              </div>
            )}

            {/* X-axis Labels */}
            <div className="flex justify-between px-6 pt-1 text-[10px] text-slate-400 font-mono">
              {chartPoints.map((pt, idx) => (
                <span key={idx} className={cn(hoveredPointIndex === idx && "text-[#D4FF32] font-bold")}>
                  {pt.label}
                </span>
              ))}
            </div>
          </div>

          {/* Platform Distribution Bar & Legend */}
          <div className="space-y-2.5 pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Channel Share Breakdown</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentDataset.platformBreakdown.length} Active Channels
              </span>
            </div>

            {/* Stacked Percentage Bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-[#0B1020] p-0.5 border border-[rgba(255,255,255,0.06)]">
              {currentDataset.platformBreakdown.map((p) => (
                <div
                  key={p.platform}
                  style={{ width: `${p.percentage}%`, backgroundColor: p.color }}
                  className="h-full rounded-sm transition-all duration-500"
                  title={`${p.platform}: ${p.percentage}% share`}
                />
              ))}
            </div>

            {/* Legend Pills */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px]">
              {currentDataset.platformBreakdown.map((p) => (
                <div key={p.platform} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-white font-medium">{p.platform}</span>
                  <span className="text-slate-400 font-mono">
                    {formatNumber(p.reach)} ({p.percentage}%)
                  </span>
                  <span className="text-emerald-400 text-[10px] font-semibold">{p.growth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analytical Recommendations (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-b from-[#182238]/90 to-[#121A2B] border border-[rgba(212,255,50,0.2)] space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#D4FF32]" />
                <span>AI Growth Copilot</span>
              </div>
              <button
                onClick={handleRefreshAi}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                title="Generate fresh insights"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Live algorithmic optimizations tailored for {activeBrand.name}.
            </p>

            {/* Recommendations List */}
            <div className="space-y-3 pt-1">
              {aiRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl bg-[#0B1020]/80 border border-[rgba(255,255,255,0.08)] hover:border-[#D4FF32]/40 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white text-xs group-hover:text-[#D4FF32] transition-colors">
                      {rec.title}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#D4FF32]/10 text-[#D4FF32] border border-[#D4FF32]/20 shrink-0">
                      {rec.lift}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{rec.description}</p>

                  <div className="pt-1 flex justify-end">
                    <Link
                      href={rec.actionLink}
                      className="text-[11px] font-semibold text-[#D4FF32] hover:underline flex items-center gap-1"
                    >
                      <span>{rec.actionText}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <Link
              href="/app/content-studio"
              className="w-full py-2 px-3 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(212,255,50,0.2)]"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Apply AI Insights in Studio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Channel Performance Matrix Table */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Channel Performance Matrix</h3>
            <p className="text-xs text-slate-400">
              Detailed breakdown of reach, engagement velocity, and top converting formats
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Normalized Period: {timeRange.toUpperCase()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)] text-slate-400 text-[11px]">
                <th className="pb-3 font-medium">Channel / Network</th>
                <th className="pb-3 font-medium">Impressions & Reach</th>
                <th className="pb-3 font-medium">Engagements</th>
                <th className="pb-3 font-medium">Velocity Lift</th>
                <th className="pb-3 font-medium">Top Performing Format</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {currentDataset.platformBreakdown.map((row) => (
                <tr key={row.platform} className="hover:bg-[#182238]/40 transition-colors">
                  <td className="py-3.5 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                    <span>{row.platform}</span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-200">
                    {formatNumber(row.reach)}
                    <span className="text-slate-500 text-[10px] ml-1">({row.percentage}%)</span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-200">{formatNumber(row.engagements)}</td>
                  <td className="py-3.5 font-semibold text-emerald-400">{row.growth}</td>
                  <td className="py-3.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-[#0B1020] border border-[rgba(255,255,255,0.06)] text-[11px] font-mono">
                      {row.topFormat}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href="/app/content-studio"
                      className="text-[#D4FF32] hover:underline font-semibold text-xs inline-flex items-center gap-1"
                    >
                      <span>Compose</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Content Leaderboard */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Top Performing Content Leaderboard</h3>
            <p className="text-xs text-slate-400">
              Benchmark content pieces generating the highest audience dwell time and pipeline conversions
            </p>
          </div>
          <Link
            href="/app/posts"
            className="text-xs font-semibold text-[#D4FF32] hover:underline flex items-center gap-1"
          >
            <span>View All Posts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {postsLeaderboard.map((post, index) => (
            <div
              key={post.id}
              className="p-3.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.14)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-[#182238] font-mono font-bold text-xs text-[#D4FF32] flex items-center justify-center shrink-0 border border-[rgba(255,255,255,0.06)]">
                  #{index + 1}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/20 uppercase">
                      {post.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {post.contentType || "General"}
                    </span>
                    {post.campaignId && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4FF32]/10 text-[#D4FF32] font-semibold border border-[#D4FF32]/20">
                        🎯 Campaign Linked
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Reach</div>
                  <div className="font-mono font-bold text-white">{formatNumber(post.reach)}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Engagements</div>
                  <div className="font-mono font-bold text-white">{formatNumber(post.engagements)}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Rate</div>
                  <div className="font-mono font-bold text-emerald-400">{post.rate}</div>
                </div>

                <Link
                  href="/app/posts"
                  className="p-1.5 rounded-lg bg-[#182238] hover:bg-[#22304e] text-slate-300 hover:text-white transition-all"
                  title="View post"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

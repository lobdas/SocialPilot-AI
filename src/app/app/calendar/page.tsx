"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Layers,
  Sparkles,
  Share2,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { ContentItem, PlatformType, ContentStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type CalendarViewMode = "month" | "week" | "list";

export default function ContentCalendarPage() {
  const { data, mounted } = useDemoStore();
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 15)); // September 2026

  const filteredPosts = data.posts.filter((post) => {
    if (selectedPlatform !== "ALL" && !post.targetPlatforms.includes(selectedPlatform as PlatformType)) {
      return false;
    }
    if (selectedStatus !== "ALL" && post.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  // Simple Month Matrix calculation
  const daysInMonth = 30; // September has 30 days
  const startDayOffset = 2; // Starts on Tuesday for Sept 2026

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Content Calendar</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              {filteredPosts.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Drag, reschedule, and orchestrate campaigns across all connected social channels.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#121A2B] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
            <button
              onClick={() => setViewMode("month")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                viewMode === "month" ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                viewMode === "week" ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                viewMode === "list" ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
              )}
            >
              List
            </button>
          </div>

          {/* New Post Button */}
          <Link
            href="/app/content-studio"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)]">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date(2026, 7, 1))}
            className="p-1 rounded hover:bg-[#182238] text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white tracking-wide">
            September 2026
          </span>
          <button
            onClick={() => setCurrentDate(new Date(2026, 9, 1))}
            className="p-1 rounded hover:bg-[#182238] text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Platforms</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="X">X (Twitter)</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="THREADS">Threads</option>
            <option value="PINTEREST">Pinterest</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="DRAFT">Drafts</option>
          </select>
        </div>
      </div>

      {/* Month Grid View */}
      {viewMode === "month" && (
        <div className="rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-[rgba(255,255,255,0.06)] bg-[#182238]/60 text-[11px] font-semibold text-slate-400 text-center py-2.5">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-[120px] divide-x divide-y divide-[rgba(255,255,255,0.04)]">
            {/* Blank leading days */}
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-[#0B1020]/20 p-2" />
            ))}

            {/* Month Days */}
            {daysArray.map((day) => {
              // Simulate posts assigned to days 14, 16, 18
              const isToday = day === 15;
              const dayPosts = filteredPosts.filter((_, idx) => {
                if (day === 14 && idx === 0) return true;
                if (day === 16 && idx === 1) return true;
                if (day === 18 && idx === 2) return true;
                return false;
              });

              return (
                <div
                  key={day}
                  className={cn(
                    "p-2 flex flex-col justify-between hover:bg-[#182238]/30 transition-colors group relative",
                    isToday && "bg-[#182238]/50"
                  )}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={cn(
                        "w-5 h-5 flex items-center justify-center rounded-full font-medium",
                        isToday
                          ? "bg-[#D4FF32] text-[#0B1020] font-bold shadow-[0_0_10px_rgba(212,255,50,0.3)]"
                          : "text-slate-400"
                      )}
                    >
                      {day}
                    </span>
                    <Link
                      href="/app/content-studio"
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-opacity p-0.5"
                      title="Schedule post on this day"
                    >
                      <Plus className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Render Day Posts */}
                  <div className="space-y-1 overflow-hidden mt-1">
                    {dayPosts.map((p) => (
                      <Link
                        key={p.id}
                        href="/app/content-studio"
                        className={cn(
                          "block p-1.5 rounded text-[10px] font-medium truncate border transition-all",
                          p.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                            : p.status === "SCHEDULED"
                            ? "bg-[#D4FF32]/10 text-[#D4FF32] border-[#D4FF32]/30"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        )}
                      >
                        <div className="flex items-center gap-1 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span className="truncate">{p.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-600 font-mono">
                    {dayPosts.length > 0 && `${dayPosts.length} post`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] divide-y divide-[rgba(255,255,255,0.06)] overflow-hidden">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#182238]/50 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                {post.mediaUrls[0] ? (
                  <img
                    src={post.mediaUrls[0]}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-[rgba(255,255,255,0.1)]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-[#0B1020] flex items-center justify-center flex-shrink-0 text-slate-500">
                    <Share2 className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{post.title}</span>
                    <span
                      className={cn(
                        "text-[9px] font-bold px-1.5 py-0.2 rounded uppercase",
                        post.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : post.status === "SCHEDULED"
                          ? "bg-[#D4FF32]/10 text-[#D4FF32] border border-[#D4FF32]/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      )}
                    >
                      {post.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                    {post.basePrompt || Object.values(post.variants)[0]?.caption}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {post.targetPlatforms.map((p) => (
                      <span
                        key={p}
                        className="text-[9px] bg-[#0B1020] text-slate-300 px-1.5 py-0.2 rounded border border-[rgba(255,255,255,0.06)]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:text-right">
                <div className="text-[11px] text-slate-400" suppressHydrationWarning>
                  <div className="font-medium text-slate-200">
                    {mounted
                      ? post.scheduledAt
                        ? formatDate(post.scheduledAt)
                        : formatDate(post.createdAt)
                      : "Recently"}
                  </div>
                  <span className="text-[10px] text-slate-500">UTC-04 (EDT)</span>
                </div>
                <Link
                  href="/app/content-studio"
                  className="px-3 py-1 rounded-lg bg-[#182238] hover:bg-[#1E2A44] text-xs text-slate-200 border border-[rgba(255,255,255,0.08)] transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

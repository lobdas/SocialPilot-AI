"use client";

import { useState, useMemo } from "react";
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
  Search,
  Eye,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  X as CloseIcon,
  MessageSquare,
  GripVertical,
  CalendarDays,
  List as ListIcon,
  Columns3,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { demoStore } from "@/lib/demo-store";
import { ContentItem, PlatformType, ContentStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/components/ui/platform-badge";
import { NoBrandState } from "@/components/brand/no-brand-state";

type CalendarViewMode = "month" | "week" | "list";

const PLATFORM_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  LINKEDIN: { bg: "bg-[#0A66C2]/15", text: "text-[#0A66C2]", dot: "bg-[#0A66C2]" },
  X: { bg: "bg-white/10", text: "text-slate-200", dot: "bg-white" },
  INSTAGRAM: { bg: "bg-[#E4405F]/15", text: "text-[#E4405F]", dot: "bg-[#E4405F]" },
  FACEBOOK: { bg: "bg-[#1877F2]/15", text: "text-[#1877F2]", dot: "bg-[#1877F2]" },
  THREADS: { bg: "bg-white/10", text: "text-slate-200", dot: "bg-white" },
  GOOGLE_BUSINESS: { bg: "bg-[#4285F4]/15", text: "text-[#4285F4]", dot: "bg-[#4285F4]" },
  YOUTUBE: { bg: "bg-[#FF0000]/15", text: "text-[#FF0000]", dot: "bg-[#FF0000]" },
  PINTEREST: { bg: "bg-[#BD081C]/15", text: "text-[#BD081C]", dot: "bg-[#BD081C]" },
};

function getPostEffectiveDate(post: ContentItem): Date {
  const dateStr = post.scheduledAt || post.publishedAt || post.createdAt;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default function ContentCalendarPage() {
  const { data, activeBrand, mounted } = useDemoStore();
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Current viewed date in calendar (starts on September 2026)
  const [viewDate, setViewDate] = useState<Date>(() => new Date(2026, 8, 15));

  // Modal states
  const [selectedPostModal, setSelectedPostModal] = useState<ContentItem | null>(null);
  const [modalActivePlatform, setModalActivePlatform] = useState<PlatformType>("LINKEDIN");
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Reschedule state inside modal
  const [modalScheduleDate, setModalScheduleDate] = useState<string>("");
  const [modalScheduleTime, setModalScheduleTime] = useState<string>("14:00");

  // Drag & Drop feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter posts strictly for activeBrand
  const brandPosts = useMemo(() => {
    if (!activeBrand) return [];
    return data.posts.filter((p) => p.brandId === activeBrand.id);
  }, [data.posts, activeBrand?.id]);

  // Filter posts based on platform, status, and search query
  const filteredPosts = useMemo(() => {
    return brandPosts.filter((post) => {
      if (selectedPlatform !== "ALL" && !post.targetPlatforms.includes(selectedPlatform as PlatformType)) {
        return false;
      }
      if (selectedStatus !== "ALL" && post.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = post.title.toLowerCase().includes(q);
        const promptMatch = post.basePrompt?.toLowerCase().includes(q);
        const captionMatch = Object.values(post.variants || {}).some((v) =>
          v.caption.toLowerCase().includes(q)
        );
        if (!titleMatch && !promptMatch && !captionMatch) return false;
      }
      return true;
    });
  }, [data.posts, selectedPlatform, selectedStatus, searchQuery]);

  // Calendar calculations
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Month calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOffset = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Week calculations (Sunday - Saturday for current viewDate)
  const weekDays = useMemo(() => {
    const currentDayOfWeek = viewDate.getDay();
    const sunday = new Date(viewDate);
    sunday.setDate(viewDate.getDate() - currentDayOfWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d;
    });
  }, [viewDate]);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === "month") {
      setViewDate(new Date(currentYear, currentMonth - 1, 1));
    } else if (viewMode === "week") {
      const next = new Date(viewDate);
      next.setDate(next.getDate() - 7);
      setViewDate(next);
    } else {
      const next = new Date(viewDate);
      next.setMonth(next.getMonth() - 1);
      setViewDate(next);
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setViewDate(new Date(currentYear, currentMonth + 1, 1));
    } else if (viewMode === "week") {
      const next = new Date(viewDate);
      next.setDate(next.getDate() + 7);
      setViewDate(next);
    } else {
      const next = new Date(viewDate);
      next.setMonth(next.getMonth() + 1);
      setViewDate(next);
    }
  };

  const handleToday = () => {
    setViewDate(new Date(2026, 8, 15)); // Jump to current active demo date
  };

  // Open post details modal
  const openPostModal = (post: ContentItem) => {
    setSelectedPostModal(post);
    setModalActivePlatform(post.targetPlatforms[0] || "LINKEDIN");
    setCopiedCaption(false);
    const pDate = getPostEffectiveDate(post);
    setModalScheduleDate(pDate.toISOString().split("T")[0]);
    setModalScheduleTime(
      `${String(pDate.getHours()).padStart(2, "0")}:${String(pDate.getMinutes()).padStart(2, "0")}`
    );
  };

  // Quick reschedule save from modal
  const handleModalSaveReschedule = () => {
    if (!selectedPostModal || !modalScheduleDate) return;
    const scheduledDateTime = new Date(`${modalScheduleDate}T${modalScheduleTime || "14:00"}`);
    if (isNaN(scheduledDateTime.getTime())) {
      showToast("Invalid date or time selected.");
      return;
    }

    demoStore.updatePost(selectedPostModal.id, {
      scheduledAt: scheduledDateTime.toISOString(),
      status: "SCHEDULED",
      updatedAt: new Date().toISOString(),
    });

    setSelectedPostModal((prev) =>
      prev
        ? {
            ...prev,
            scheduledAt: scheduledDateTime.toISOString(),
            status: "SCHEDULED",
          }
        : null
    );

    showToast(`📅 Post rescheduled to ${formatDate(scheduledDateTime.toISOString(), "medium")}!`);
  };

  // Delete post handler
  const handleDeletePost = (postId: string) => {
    demoStore.deletePost(postId);
    setSelectedPostModal(null);
    showToast("🗑️ Post removed from calendar.");
  };

  // Drag and Drop Handler
  const handleDropOnDay = (targetYear: number, targetMonth: number, targetDay: number) => {
    if (!draggedPostId) return;
    const post = data.posts.find((p) => p.id === draggedPostId);
    if (!post) return;

    const originalDate = getPostEffectiveDate(post);
    const newScheduled = new Date(
      targetYear,
      targetMonth,
      targetDay,
      originalDate.getHours() || 14,
      originalDate.getMinutes() || 0
    );

    demoStore.updatePost(post.id, {
      scheduledAt: newScheduled.toISOString(),
      status: post.status === "PUBLISHED" ? "PUBLISHED" : "SCHEDULED",
      updatedAt: new Date().toISOString(),
    });

    setDraggedPostId(null);
    showToast(`✨ Rescheduled "${post.title}" to ${formatDate(newScheduled.toISOString(), "short")}!`);
  };

  if (!activeBrand) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <NoBrandState featureName="Content Calendar" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Content Calendar — {activeBrand.name}</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              {filteredPosts.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Drag, reschedule, and orchestrate campaigns specifically for <strong className="text-white">{activeBrand.name}</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#121A2B] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
            <button
              onClick={() => setViewMode("month")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === "month"
                  ? "bg-[#182238] text-[#D4FF32] font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === "week"
                  ? "bg-[#182238] text-[#D4FF32] font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === "list"
                  ? "bg-[#182238] text-[#D4FF32] font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* New Post Button connected to Content Studio */}
          <Link
            href="/app/content-studio"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Filter & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)]">
        {/* Navigation & Month Picker */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0B1020] rounded-lg border border-[rgba(255,255,255,0.08)] p-0.5">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded hover:bg-[#182238] text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-[#182238] rounded transition-colors cursor-pointer"
              title="Jump to Today"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded hover:bg-[#182238] text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-bold text-white tracking-wide px-2" suppressHydrationWarning>
            {viewMode === "week"
              ? `Week of ${formatDate(weekDays[0].toISOString(), "short")} - ${formatDate(weekDays[6].toISOString(), "short")}`
              : viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Search & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 w-36 sm:w-48"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-slate-300 focus:outline-none focus:border-[#D4FF32]/50 cursor-pointer"
          >
            <option value="ALL">All Platforms</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="X">X (Twitter)</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="THREADS">Threads</option>
            <option value="GOOGLE_BUSINESS">Google Business (GMB)</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="PINTEREST">Pinterest</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-slate-300 focus:outline-none focus:border-[#D4FF32]/50 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="DRAFT">Drafts</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE 1: MONTH GRID VIEW */}
      {viewMode === "month" && (
        <div className="rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-xl">
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
          <div className="grid grid-cols-7 auto-rows-[125px] divide-x divide-y divide-[rgba(255,255,255,0.04)]">
            {/* Blank leading days */}
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-[#0B1020]/30 p-2 opacity-30 select-none" />
            ))}

            {/* Month Days */}
            {daysArray.map((day) => {
              const cellDate = new Date(currentYear, currentMonth, day);
              const dateStr = cellDate.toISOString().split("T")[0];

              // Check if cell is today
              const today = new Date();
              const isToday =
                cellDate.getFullYear() === today.getFullYear() &&
                cellDate.getMonth() === today.getMonth() &&
                cellDate.getDate() === today.getDate();

              // Get all posts matching this specific day
              const dayPosts = filteredPosts.filter((p) => {
                const pDate = getPostEffectiveDate(p);
                return (
                  pDate.getFullYear() === currentYear &&
                  pDate.getMonth() === currentMonth &&
                  pDate.getDate() === day
                );
              });

              return (
                <div
                  key={day}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDropOnDay(currentYear, currentMonth, day)}
                  className={cn(
                    "p-2 flex flex-col justify-between hover:bg-[#182238]/40 transition-colors group relative",
                    isToday && "bg-[#182238]/50"
                  )}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={cn(
                        "w-5 h-5 flex items-center justify-center rounded-full font-medium text-[11px]",
                        isToday
                          ? "bg-[#D4FF32] text-[#0B1020] font-bold shadow-[0_0_10px_rgba(212,255,50,0.4)]"
                          : "text-slate-400"
                      )}
                    >
                      {day}
                    </span>

                    {/* Quick Schedule Button connected to Content Studio with pre-filled date */}
                    <Link
                      href={`/app/content-studio?date=${dateStr}`}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#D4FF32] transition-opacity p-0.5 rounded hover:bg-[#0B1020]"
                      title={`Schedule post on ${dateStr}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Render Day Posts with drag and modal click */}
                  <div className="space-y-1 overflow-y-auto max-h-[80px] mt-1 pr-0.5 scrollbar-thin">
                    {dayPosts.map((p) => {
                      const firstPlatform = p.targetPlatforms[0] || "LINKEDIN";
                      const platStyle = PLATFORM_COLORS[firstPlatform] || {
                        bg: "bg-slate-800",
                        text: "text-slate-200",
                        dot: "bg-slate-400",
                      };

                      return (
                        <div
                          key={p.id}
                          draggable
                          onDragStart={() => setDraggedPostId(p.id)}
                          onClick={() => openPostModal(p)}
                          className={cn(
                            "p-1.5 rounded-md text-[10px] font-medium truncate border transition-all cursor-pointer select-none hover:scale-[1.02] shadow-sm flex items-center justify-between gap-1",
                            p.status === "PUBLISHED"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/60"
                              : p.status === "SCHEDULED"
                              ? "bg-[#D4FF32]/10 text-[#D4FF32] border-[#D4FF32]/30 hover:border-[#D4FF32]/60"
                              : "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:border-amber-500/60"
                          )}
                          title={`${p.title} (Click to view/edit, drag to reschedule)`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", platStyle.dot)} />
                            <span className="truncate">{p.title}</span>
                          </div>
                          {p.scheduledAt && (
                            <span className="text-[8px] opacity-70 font-mono flex-shrink-0" suppressHydrationWarning>
                              {mounted ? formatDate(p.scheduledAt, "time") : ""}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Post count badge */}
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                    {dayPosts.length > 0 && `${dayPosts.length} ${dayPosts.length === 1 ? "post" : "posts"}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: WEEK VIEW */}
      {viewMode === "week" && (
        <div className="rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-xl">
          {/* Week Headers */}
          <div className="grid grid-cols-7 border-b border-[rgba(255,255,255,0.08)] bg-[#182238]/70">
            {weekDays.map((wDate) => {
              const isToday =
                wDate.toDateString() === new Date().toDateString();
              const dateStr = wDate.toISOString().split("T")[0];

              return (
                <div
                  key={wDate.toISOString()}
                  className={cn(
                    "p-3 text-center border-r border-[rgba(255,255,255,0.04)] last:border-r-0 flex flex-col items-center justify-between gap-1",
                    isToday && "bg-[#D4FF32]/5"
                  )}
                >
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {wDate.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      isToday
                        ? "bg-[#D4FF32] text-[#0B1020] shadow-[0_0_10px_rgba(212,255,50,0.3)]"
                        : "text-white"
                    )}
                  >
                    {wDate.getDate()}
                  </span>
                  <Link
                    href={`/app/content-studio?date=${dateStr}`}
                    className="mt-1 text-[10px] text-slate-500 hover:text-[#D4FF32] flex items-center gap-0.5 transition-colors"
                    title={`Schedule post for ${dateStr}`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Week Columns */}
          <div className="grid grid-cols-7 min-h-[420px] divide-x divide-[rgba(255,255,255,0.04)]">
            {weekDays.map((wDate) => {
              const dayPosts = filteredPosts.filter((p) => {
                const pDate = getPostEffectiveDate(p);
                return pDate.toDateString() === wDate.toDateString();
              });

              return (
                <div
                  key={`col-${wDate.toISOString()}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() =>
                    handleDropOnDay(
                      wDate.getFullYear(),
                      wDate.getMonth(),
                      wDate.getDate()
                    )
                  }
                  className="p-2 space-y-2.5 bg-[#0B1020]/20 hover:bg-[#182238]/20 transition-colors"
                >
                  {dayPosts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[11px] text-slate-600 italic select-none py-12">
                      No posts
                    </div>
                  ) : (
                    dayPosts.map((p) => (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={() => setDraggedPostId(p.id)}
                        onClick={() => openPostModal(p)}
                        className="p-2.5 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[#D4FF32]/40 transition-all cursor-pointer shadow-md space-y-2 group"
                      >
                        {p.mediaUrls[0] && (
                          <img
                            src={p.mediaUrls[0]}
                            alt=""
                            className="w-full h-20 object-cover rounded-lg border border-[rgba(255,255,255,0.08)]"
                          />
                        )}

                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                                p.status === "PUBLISHED"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : p.status === "SCHEDULED"
                                  ? "bg-[#D4FF32]/10 text-[#D4FF32]"
                                  : "bg-amber-500/10 text-amber-400"
                              )}
                            >
                              {p.status}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono" suppressHydrationWarning>
                              {mounted ? formatDate(getPostEffectiveDate(p), "time") : ""}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#D4FF32] transition-colors">
                            {p.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                            {p.basePrompt || Object.values(p.variants)[0]?.caption}
                          </p>
                        </div>

                        {/* Platforms */}
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-[rgba(255,255,255,0.04)]">
                          {p.targetPlatforms.map((plat) => (
                            <span
                              key={plat}
                              className="text-[8px] font-medium px-1 py-0.5 rounded bg-[#0B1020] text-slate-300 border border-[rgba(255,255,255,0.06)]"
                            >
                              {plat}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: LIST VIEW */}
      {viewMode === "list" && (
        <div className="rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] divide-y divide-[rgba(255,255,255,0.06)] overflow-hidden shadow-xl">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No scheduled or published posts matching current filters.
            </div>
          ) : (
            filteredPosts.map((post) => {
              const pDate = getPostEffectiveDate(post);

              return (
                <div
                  key={post.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#182238]/40 transition-colors"
                >
                  {/* Left: Thumbnail + Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {post.mediaUrls[0] ? (
                      <img
                        src={post.mediaUrls[0]}
                        alt=""
                        onClick={() => openPostModal(post)}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-[rgba(255,255,255,0.1)] cursor-pointer hover:opacity-90"
                      />
                    ) : (
                      <div
                        onClick={() => openPostModal(post)}
                        className="w-16 h-16 rounded-xl bg-[#0B1020] flex items-center justify-center flex-shrink-0 text-slate-500 border border-[rgba(255,255,255,0.08)] cursor-pointer"
                      >
                        <Share2 className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          onClick={() => openPostModal(post)}
                          className="text-xs font-bold text-white hover:text-[#D4FF32] transition-colors cursor-pointer truncate"
                        >
                          {post.title}
                        </span>
                        <span
                          className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
                            post.status === "PUBLISHED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : post.status === "SCHEDULED"
                              ? "bg-[#D4FF32]/10 text-[#D4FF32] border border-[#D4FF32]/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          )}
                        >
                          {post.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        {post.basePrompt || Object.values(post.variants)[0]?.caption}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {post.targetPlatforms.map((p) => (
                          <span
                            key={p}
                            className="text-[9px] bg-[#0B1020] text-slate-300 px-2 py-0.5 rounded-md border border-[rgba(255,255,255,0.06)]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Date & Actions */}
                  <div className="flex flex-wrap items-center gap-3 md:text-right">
                    <div className="text-[11px] text-slate-400" suppressHydrationWarning>
                      <div className="font-semibold text-slate-200">
                        {mounted ? formatDate(pDate, "long") : "Recently"}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {post.status === "PUBLISHED" ? "Published" : "Scheduled"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openPostModal(post)}
                        className="px-3 py-1.5 rounded-lg bg-[#182238] hover:bg-[#1E2A44] text-xs text-slate-200 hover:text-white border border-[rgba(255,255,255,0.08)] transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      <Link
                        href={`/app/content-studio?edit=${post.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] text-xs font-bold hover:bg-[#C2ED25] transition-all flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* FULL POST DETAILS & RESCHEDULE MODAL */}
      {selectedPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121A2B] border border-[rgba(255,255,255,0.12)] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-[rgba(255,255,255,0.08)] bg-[#182238]/60 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {selectedPostModal.title}
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full font-bold text-[10px] uppercase border",
                      selectedPostModal.status === "PUBLISHED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : selectedPostModal.status === "SCHEDULED"
                        ? "bg-[#D4FF32]/10 text-[#D4FF32] border-[#D4FF32]/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    )}
                  >
                    {selectedPostModal.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5" suppressHydrationWarning>
                  Effective Date: {formatDate(getPostEffectiveDate(selectedPostModal), "long")}
                </p>
              </div>

              <button
                onClick={() => setSelectedPostModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182238] transition-colors cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
              {/* Platform Variant Switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[rgba(255,255,255,0.06)]">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0 flex items-center gap-1.5 mr-1">
                  <Layers className="w-3.5 h-3.5 text-[#D4FF32]" />
                  <span>Platform:</span>
                </span>
                <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                  {selectedPostModal.targetPlatforms.map((plat) => {
                    const cfg = PLATFORM_CONFIG[plat] || PLATFORM_CONFIG.FACEBOOK;
                    const isSelected = modalActivePlatform === plat;
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setModalActivePlatform(plat)}
                        className={cn(
                          "h-8 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 border",
                          isSelected
                            ? cfg.activeClass
                            : "bg-[#121A2B] hover:bg-[#182238] text-slate-300 hover:text-white border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]"
                        )}
                      >
                        <span className={cn("transition-colors", isSelected ? "text-current" : cfg.iconColor)}>
                          {cfg.icon("w-3.5 h-3.5")}
                        </span>
                        <span>{cfg.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Media Preview (if exists) */}
              {selectedPostModal.mediaUrls[0] && (
                <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] bg-[#0B1020] max-h-56 relative group">
                  <img
                    src={selectedPostModal.mediaUrls[0]}
                    alt="Post Media"
                    className="w-full h-56 object-cover"
                  />
                  <a
                    href={selectedPostModal.mediaUrls[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-medium flex items-center gap-1 hover:bg-black transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Media</span>
                  </a>
                </div>
              )}

              {/* Caption Text Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">Caption</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#D4FF32]/10 text-[#D4FF32] text-[11px] font-mono border border-[#D4FF32]/20 font-semibold">
                      {PLATFORM_CONFIG[modalActivePlatform]?.name || modalActivePlatform}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {selectedPostModal.variants[modalActivePlatform]?.characterCount ||
                      selectedPostModal.variants[modalActivePlatform]?.caption?.length ||
                      0}{" "}
                    chars
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.08)] font-sans text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedPostModal.variants[modalActivePlatform]?.caption ||
                    selectedPostModal.basePrompt ||
                    "No specific caption written."}
                </div>
              </div>

              {/* Hashtags */}
              {selectedPostModal.variants[modalActivePlatform]?.hashtags &&
                selectedPostModal.variants[modalActivePlatform].hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPostModal.variants[modalActivePlatform].hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#182238] text-[#D4FF32] border border-[#D4FF32]/20 font-mono text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

              {/* Quick Reschedule Form */}
              <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.08)] space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Clock className="w-3.5 h-3.5 text-[#D4FF32]" />
                  <span>Quick Reschedule on Calendar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">New Date</label>
                    <input
                      type="date"
                      value={modalScheduleDate}
                      onChange={(e) => setModalScheduleDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#121A2B] border border-[rgba(255,255,255,0.1)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">New Time</label>
                    <input
                      type="time"
                      value={modalScheduleTime}
                      onChange={(e) => setModalScheduleTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#121A2B] border border-[rgba(255,255,255,0.1)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleModalSaveReschedule}
                    className="px-3 py-1.5 rounded-lg bg-[#182238] hover:bg-[#1E2A44] text-[#D4FF32] border border-[#D4FF32]/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Save New Schedule</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#182238]/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const txt = selectedPostModal.variants[modalActivePlatform]?.caption || "";
                    navigator.clipboard.writeText(txt);
                    setCopiedCaption(true);
                    setTimeout(() => setCopiedCaption(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0B1020] hover:bg-[#182238] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5 text-[#D4FF32]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCaption ? "Copied!" : "Copy Caption"}</span>
                </button>

                <button
                  onClick={() => handleDeletePost(selectedPostModal.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#0B1020] hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Remove post from calendar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              {/* Edit in Content Studio Button */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/app/content-studio?edit=${selectedPostModal.id}`}
                  className="px-4 py-2 rounded-xl bg-[#D4FF32] text-[#0B1020] text-xs font-bold hover:bg-[#C2ED25] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,255,50,0.25)]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Edit in Content Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

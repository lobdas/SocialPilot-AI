"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Target,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  Send,
  ExternalLink,
  ChevronRight,
  X,
  AlertCircle,
  FileText,
  DollarSign,
  Share2,
  Zap,
  Check,
  PauseCircle,
  PlayCircle,
  BarChart3,
  Copy,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { Campaign, ContentItem, PlatformType } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { NoBrandState } from "@/components/brand/no-brand-state";

const PLATFORM_COLORS: Record<PlatformType, { bg: string; text: string; name: string }> = {
  LINKEDIN: { bg: "bg-[#0A66C2]/15 text-[#0A66C2] border-[#0A66C2]/30", text: "text-[#0A66C2]", name: "LinkedIn" },
  INSTAGRAM: { bg: "bg-[#E4405F]/15 text-[#E4405F] border-[#E4405F]/30", text: "text-[#E4405F]", name: "Instagram" },
  FACEBOOK: { bg: "bg-[#1877F2]/15 text-[#1877F2] border-[#1877F2]/30", text: "text-[#1877F2]", name: "Facebook" },
  X: { bg: "bg-white/10 text-white border-white/20", text: "text-white", name: "X" },
  THREADS: { bg: "bg-white/10 text-slate-200 border-white/20", text: "text-slate-200", name: "Threads" },
  PINTEREST: { bg: "bg-[#BD081C]/15 text-[#BD081C] border-[#BD081C]/30", text: "text-[#BD081C]", name: "Pinterest" },
  YOUTUBE: { bg: "bg-[#FF0000]/15 text-[#FF0000] border-[#FF0000]/30", text: "text-[#FF0000]", name: "YouTube" },
  TIKTOK: { bg: "bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/30", text: "text-[#00F2FE]", name: "TikTok" },
  GOOGLE_BUSINESS: { bg: "bg-[#4285F4]/15 text-[#4285F4] border-[#4285F4]/30", text: "text-[#4285F4]", name: "Google Biz" },
};

const OBJECTIVE_STYLES: Record<string, { label: string; color: string; border: string }> = {
  CONVERSIONS: { label: "Conversions & Sales", color: "text-[#D4FF32] bg-[#D4FF32]/10", border: "border-[#D4FF32]/25" },
  AWARENESS: { label: "Brand Awareness", color: "text-sky-400 bg-sky-500/10", border: "border-sky-500/25" },
  ENGAGEMENT: { label: "Audience Engagement", color: "text-purple-400 bg-purple-500/10", border: "border-purple-500/25" },
  TRAFFIC: { label: "Traffic & Inbound", color: "text-amber-400 bg-amber-500/10", border: "border-amber-500/25" },
};

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ACTIVE: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  PAUSED: { label: "Paused", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25" },
  COMPLETED: { label: "Completed", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/25" },
  DRAFT: { label: "Draft", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/25" },
  ARCHIVED: { label: "Archived", color: "text-slate-500", bg: "bg-slate-800/40", border: "border-slate-700/30" },
};

export default function CampaignsPage() {
  const { data, store, activeBrand } = useDemoStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [selectedObjectiveFilter, setSelectedObjectiveFilter] = useState<string>("ALL");

  // Modals & Drawers
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedCampaignForDetail, setSelectedCampaignForDetail] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [activeMenuCampaignId, setActiveMenuCampaignId] = useState<string | null>(null);
  const [showLinkPostModal, setShowLinkPostModal] = useState(false);

  // Form State for Manual Create / Edit
  const [formData, setFormData] = useState({
    name: "",
    objective: "CONVERSIONS" as Campaign["objective"],
    description: "",
    status: "ACTIVE" as Campaign["status"],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
    budgetNotes: "",
  });

  // AI Architect State
  const [aiForm, setAiForm] = useState({
    topic: "",
    objective: "CONVERSIONS" as Campaign["objective"],
    targetAudience: "Marketing agencies, business founders, and creators",
    durationWeeks: 4,
    postCount: 4,
    language: "en",
    platforms: ["LINKEDIN", "X", "INSTAGRAM", "FACEBOOK"] as PlatformType[],
  });
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Toast Notification
  const [notification, setNotification] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Compute live stats for a campaign based on actual posts
  const getCampaignStats = (camp: Campaign) => {
    const linkedPosts = data.posts.filter((p) => p.campaignId === camp.id);
    const postCount = linkedPosts.length > 0 ? linkedPosts.length : camp.postCount || 0;
    const publishedCount =
      linkedPosts.length > 0
        ? linkedPosts.filter((p) => p.status === "PUBLISHED").length
        : camp.publishedCount || 0;
    const scheduledCount = linkedPosts.filter((p) => p.status === "SCHEDULED").length;
    const draftCount = linkedPosts.filter((p) => p.status === "DRAFT" || p.status === "PENDING_APPROVAL").length;
    const progress = postCount > 0 ? Math.min(100, Math.round((publishedCount / postCount) * 100)) : 0;

    // Determine platforms used in this campaign
    const usedPlatforms = Array.from(
      new Set(linkedPosts.flatMap((p) => p.targetPlatforms || []))
    ) as PlatformType[];

    return {
      linkedPosts,
      postCount,
      publishedCount,
      scheduledCount,
      draftCount,
      progress,
      usedPlatforms: usedPlatforms.length > 0 ? usedPlatforms : (["LINKEDIN", "X", "INSTAGRAM"] as PlatformType[]),
    };
  };

  // Strict Brand Scoping
  const brandCampaigns = useMemo(() => {
    if (!activeBrand) return [];
    return data.campaigns.filter((c) => c.brandId === activeBrand.id);
  }, [data.campaigns, activeBrand?.id]);

  const brandPosts = useMemo(() => {
    if (!activeBrand) return [];
    return data.posts.filter((p) => p.brandId === activeBrand.id);
  }, [data.posts, activeBrand?.id]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return brandCampaigns.filter((camp) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (camp.description && camp.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status
      const matchesStatus = selectedStatusFilter === "ALL" || camp.status === selectedStatusFilter;

      // Objective
      const matchesObjective = selectedObjectiveFilter === "ALL" || camp.objective === selectedObjectiveFilter;

      return matchesSearch && matchesStatus && matchesObjective;
    });
  }, [brandCampaigns, searchQuery, selectedStatusFilter, selectedObjectiveFilter]);

  // Overall brand campaign metrics
  const totalCampaigns = brandCampaigns.length;
  const activeCampaignsCount = brandCampaigns.filter((c) => c.status === "ACTIVE").length;
  const totalPostsInCampaigns = brandPosts.filter((p) => p.campaignId).length;
  const totalPublishedInCampaigns = brandPosts.filter((p) => p.campaignId && p.status === "PUBLISHED").length;

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      objective: "CONVERSIONS",
      description: "",
      status: "ACTIVE",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
      budgetNotes: "$2,000 Organic & Paid Boost",
    });
    setEditingCampaign(null);
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (camp: Campaign) => {
    setEditingCampaign(camp);
    setFormData({
      name: camp.name,
      objective: camp.objective,
      description: camp.description || "",
      status: camp.status,
      startDate: camp.startDate ? camp.startDate.split("T")[0] : new Date().toISOString().split("T")[0],
      endDate: camp.endDate
        ? camp.endDate.split("T")[0]
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
      budgetNotes: camp.budgetNotes || "",
    });
    setShowCreateModal(true);
    setActiveMenuCampaignId(null);
  };

  // Handle Save (Create or Update)
  const handleSaveCampaign = () => {
    if (!formData.name.trim()) {
      showToast("⚠️ Please enter a campaign name!");
      return;
    }

    if (editingCampaign) {
      store.updateCampaign(editingCampaign.id, {
        name: formData.name,
        objective: formData.objective,
        description: formData.description,
        status: formData.status,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        budgetNotes: formData.budgetNotes,
      });
      showToast("✅ Campaign updated successfully!");
      if (selectedCampaignForDetail?.id === editingCampaign.id) {
        setSelectedCampaignForDetail({
          ...selectedCampaignForDetail,
          name: formData.name,
          objective: formData.objective,
          description: formData.description,
          status: formData.status,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          budgetNotes: formData.budgetNotes,
        });
      }
    } else {
      const created = store.addCampaign({
        workspaceId: data.activeWorkspaceId,
        brandId: data.activeBrandId,
        name: formData.name,
        objective: formData.objective,
        description: formData.description || "Multi-channel campaign created from dashboard.",
        status: formData.status,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        budgetNotes: formData.budgetNotes,
      });
      showToast("🚀 New campaign created successfully!");
      setSelectedCampaignForDetail(created);
    }

    setShowCreateModal(false);
    setEditingCampaign(null);
  };

  // Delete Campaign
  const handleDeleteCampaign = (campId: string, name: string) => {
    if (confirm(`Are you sure you want to delete campaign "${name}"?`)) {
      store.deleteCampaign(campId);
      if (selectedCampaignForDetail?.id === campId) {
        setSelectedCampaignForDetail(null);
      }
      showToast("🗑️ Campaign deleted successfully.");
      setActiveMenuCampaignId(null);
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = (camp: Campaign, newStatus: Campaign["status"]) => {
    store.updateCampaign(camp.id, { status: newStatus });
    if (selectedCampaignForDetail?.id === camp.id) {
      setSelectedCampaignForDetail({ ...selectedCampaignForDetail, status: newStatus });
    }
    showToast(`🔄 Campaign status updated to: ${newStatus}`);
    setActiveMenuCampaignId(null);
  };

  // Unlink post from campaign
  const handleUnlinkPost = (postId: string) => {
    store.assignPostToCampaign(postId, null);
    showToast("📋 Post unlinked from campaign.");
  };

  // Link post to campaign
  const handleLinkExistingPost = (postId: string) => {
    if (!selectedCampaignForDetail) return;
    store.assignPostToCampaign(postId, selectedCampaignForDetail.id);
    showToast("✅ Post linked to campaign successfully!");
    setShowLinkPostModal(false);
  };

  // AI Campaign Architect Generator
  const handleGenerateAiCampaign = async () => {
    if (!aiForm.topic.trim()) {
      showToast("⚠️ Please enter a campaign concept or topic!");
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/ai/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: aiForm.topic,
          objective: aiForm.objective,
          targetAudience: aiForm.targetAudience,
          durationWeeks: aiForm.durationWeeks,
          postCount: aiForm.postCount,
          language: aiForm.language,
          brand: activeBrand,
          targetPlatforms: aiForm.platforms,
        }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || "Generation failed");
      }

      const generated = json.data;

      // 1. Create the new campaign
      const newCamp = store.addCampaign({
        workspaceId: data.activeWorkspaceId,
        brandId: data.activeBrandId,
        name: aiForm.topic,
        objective: aiForm.objective,
        description: generated.description,
        status: "ACTIVE",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * aiForm.durationWeeks).toISOString(),
        budgetNotes: generated.budgetNotes,
        postCount: generated.posts.length,
        publishedCount: 0,
      });

      // 2. Automatically generate and add the scheduled draft posts linked to this campaign!
      generated.posts.forEach((p: any, idx: number) => {
        const scheduledTime = new Date(Date.now() + 1000 * 60 * 60 * 24 * (p.dayOffset || (idx + 1) * 3));
        store.addPost({
          workspaceId: data.activeWorkspaceId,
          brandId: data.activeBrandId,
          title: p.title || `${aiForm.topic} - Post #${idx + 1}`,
          basePrompt: `${p.phase || "Campaign Post"}: ${aiForm.topic}`,
          contentType: p.contentType || "Campaign Deliverable",
          status: idx === 0 ? "SCHEDULED" : "DRAFT",
          scheduledAt: scheduledTime.toISOString(),
          targetPlatforms: aiForm.platforms,
          variants: p.variants as any,
          mediaUrls: [
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
          ],
          campaignId: newCamp.id,
        });
      });

      setShowAiModal(false);
      setSelectedCampaignForDetail(newCamp);
      showToast(`✨ AI Campaign generated successfully! (${generated.posts.length} posts scheduled)`);
    } catch (err: any) {
      console.error(err);
      showToast(`❌ Failed to generate campaign: ${err.message || "Unknown error"}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  if (!activeBrand) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <NoBrandState featureName="Campaigns" />
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4FF32]/10 border border-[#D4FF32]/30 flex items-center justify-center text-[#D4FF32]">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Campaigns</h1>
            <span className="text-[10px] bg-[#D4FF32]/15 text-[#D4FF32] font-bold px-2.5 py-0.5 rounded-full border border-[#D4FF32]/30">
              {activeCampaignsCount} Active
            </span>
            <span className="text-[10px] bg-slate-800/80 text-slate-300 font-mono px-2 py-0.5 rounded-full border border-slate-700/40">
              {totalCampaigns} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Orchestrate multi-week, cross-channel campaigns grouped by business objectives with AI guidance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-200 hover:text-white font-semibold text-xs shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:border-purple-400 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Campaign Architect</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#121A2B]/80 border border-[rgba(255,255,255,0.06)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Active Campaigns</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{activeCampaignsCount}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121A2B]/80 border border-[rgba(255,255,255,0.06)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#D4FF32]/10 border border-[#D4FF32]/20 flex items-center justify-center text-[#D4FF32] shrink-0">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Linked Posts</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{totalPostsInCampaigns}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121A2B]/80 border border-[rgba(255,255,255,0.06)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Published Rate</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              {totalPostsInCampaigns > 0
                ? `${Math.round((totalPublishedInCampaigns / totalPostsInCampaigns) * 100)}%`
                : "100%"}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121A2B]/80 border border-[rgba(255,255,255,0.06)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Active Brand</div>
            <div className="text-xs font-bold text-white truncate max-w-[120px] mt-0.5" title={activeBrand.name}>
              {activeBrand.name}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.06)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns by name, objective or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {["ALL", "ACTIVE", "PAUSED", "COMPLETED", "DRAFT"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border",
                selectedStatusFilter === st
                  ? "bg-[#D4FF32] text-[#0B1020] border-[#D4FF32]"
                  : "bg-[#0B1020] text-slate-400 border-[rgba(255,255,255,0.06)] hover:text-white"
              )}
            >
              {st === "ALL" ? "All Status" : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Objective Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.06)] md:pl-3 pt-2 md:pt-0">
          {["ALL", "CONVERSIONS", "AWARENESS", "ENGAGEMENT", "TRAFFIC"].map((obj) => (
            <button
              key={obj}
              onClick={() => setSelectedObjectiveFilter(obj)}
              className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer border",
                selectedObjectiveFilter === obj
                  ? "bg-white/15 text-white border-white/30"
                  : "bg-transparent text-slate-400 border-transparent hover:text-slate-300"
              )}
            >
              {obj === "ALL" ? "All Objectives" : obj}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121A2B]/60 border border-[rgba(255,255,255,0.06)] space-y-3">
          <Layers className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Campaigns Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No campaigns matched your current search or filter criteria. Create a new campaign or plan one with the AI Campaign Architect.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatusFilter("ALL");
                setSelectedObjectiveFilter("ALL");
              }}
              className="px-3 py-1.5 rounded-lg bg-[#182238] text-xs text-slate-300 hover:text-white"
            >
              Clear Filters
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-3.5 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25]"
            >
              + Create Campaign
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCampaigns.map((camp) => {
            const stats = getCampaignStats(camp);
            const statusConfig = STATUS_STYLES[camp.status] || STATUS_STYLES.ACTIVE;
            const objectiveConfig = OBJECTIVE_STYLES[camp.objective] || OBJECTIVE_STYLES.CONVERSIONS;

            return (
              <div
                key={camp.id}
                className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] transition-all flex flex-col justify-between group shadow-lg relative"
              >
                <div>
                  {/* Top badges & action menu */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-md font-mono border font-medium",
                          objectiveConfig.color,
                          objectiveConfig.border
                        )}
                      >
                        {camp.objective}
                      </span>

                      {/* Status Dropdown Selector */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuCampaignId(activeMenuCampaignId === camp.id ? null : camp.id);
                          }}
                          className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded-md uppercase border flex items-center gap-1 cursor-pointer transition-all",
                            statusConfig.color,
                            statusConfig.bg,
                            statusConfig.border
                          )}
                        >
                          <span>{statusConfig.label}</span>
                          <span className="text-[8px]">▼</span>
                        </button>

                        {activeMenuCampaignId === camp.id && (
                          <div
                            className="absolute left-0 mt-1.5 w-32 bg-[#0B1020] border border-[rgba(255,255,255,0.15)] rounded-xl shadow-2xl p-1 z-30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {(["ACTIVE", "PAUSED", "COMPLETED", "DRAFT"] as Campaign["status"][]).map((st) => (
                              <button
                                key={st}
                                onClick={() => handleToggleStatus(camp, st)}
                                className={cn(
                                  "w-full text-left px-2.5 py-1.5 text-[11px] rounded-lg transition-colors flex items-center justify-between",
                                  camp.status === st ? "bg-[#182238] text-white font-bold" : "text-slate-300 hover:bg-white/5"
                                )}
                              >
                                <span>{st}</span>
                                {camp.status === st && <Check className="w-3 h-3 text-[#D4FF32]" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(camp)}
                        title="Edit Campaign"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182238] transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id, camp.name)}
                        title="Delete Campaign"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Campaign Title & Clickable to open details */}
                  <div
                    onClick={() => setSelectedCampaignForDetail(camp)}
                    className="cursor-pointer group-hover:text-[#D4FF32] transition-colors"
                  >
                    <h3 className="text-base font-bold text-white mt-3 flex items-center justify-between gap-2">
                      <span>{camp.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#D4FF32] group-hover:translate-x-0.5 transition-all" />
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {camp.description || "No description provided for this campaign."}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 mt-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span>Campaign Execution</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({stats.publishedCount} Published • {stats.scheduledCount} Scheduled • {stats.draftCount} Drafts)
                        </span>
                      </span>
                      <span className="font-mono text-white font-semibold">{stats.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0B1020] overflow-hidden border border-[rgba(255,255,255,0.04)]">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-[#D4FF32] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(212,255,50,0.3)]"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Platform icons */}
                  <div className="flex items-center gap-1.5 mt-3.5">
                    <span className="text-[10px] text-slate-400 mr-1">Channels:</span>
                    {stats.usedPlatforms.map((plt) => {
                      const cfg = PLATFORM_COLORS[plt] || { name: plt, bg: "bg-white/10 text-white" };
                      return (
                        <span
                          key={plt}
                          className={cn("text-[9px] px-2 py-0.5 rounded font-semibold border", cfg.bg)}
                        >
                          {cfg.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-3.5 mt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px]">
                      {camp.startDate ? formatDate(camp.startDate, "short") : "Now"} –{" "}
                      {camp.endDate ? formatDate(camp.endDate, "short") : "Ongoing"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCampaignForDetail(camp)}
                      className="text-xs text-slate-300 hover:text-white font-medium hover:underline flex items-center gap-1"
                    >
                      <span>Details ({stats.linkedPosts.length})</span>
                    </button>

                    <Link
                      href={`/app/content-studio?campaignId=${camp.id}`}
                      className="text-[#D4FF32] hover:text-[#C2ED25] font-semibold text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D4FF32]/10 border border-[#D4FF32]/25 hover:bg-[#D4FF32]/20 transition-all"
                    >
                      <span>Add Post</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CAMPAIGN DETAIL MODAL / DRAWER                                            */}
      {/* ========================================================================= */}
      {selectedCampaignForDetail && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-[#121A2B] border border-[rgba(255,255,255,0.14)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)] bg-[#0B1020]/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4FF32]/10 border border-[#D4FF32]/30 flex items-center justify-center text-[#D4FF32]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {selectedCampaignForDetail.name}
                    </h2>
                    <span
                      className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded uppercase border",
                        STATUS_STYLES[selectedCampaignForDetail.status]?.color,
                        STATUS_STYLES[selectedCampaignForDetail.status]?.bg,
                        STATUS_STYLES[selectedCampaignForDetail.status]?.border
                      )}
                    >
                      {selectedCampaignForDetail.status}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-mono border",
                        OBJECTIVE_STYLES[selectedCampaignForDetail.objective]?.color,
                        OBJECTIVE_STYLES[selectedCampaignForDetail.objective]?.border
                      )}
                    >
                      {selectedCampaignForDetail.objective}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedCampaignForDetail.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(selectedCampaignForDetail)}
                  className="px-3 py-1.5 rounded-lg bg-[#182238] hover:bg-[#202d4a] text-xs font-semibold text-slate-200 hover:text-white border border-[rgba(255,255,255,0.08)] flex items-center gap-1.5 transition-all"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedCampaignForDetail(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Campaign Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0E1524] border-b border-[rgba(255,255,255,0.06)] text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400">Timeline</div>
                <div className="text-white font-medium flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {selectedCampaignForDetail.startDate
                    ? formatDate(selectedCampaignForDetail.startDate, "short")
                    : "Now"}{" "}
                  –{" "}
                  {selectedCampaignForDetail.endDate
                    ? formatDate(selectedCampaignForDetail.endDate, "short")
                    : "Ongoing"}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400">Budget / Notes</div>
                <div className="text-white font-medium flex items-center gap-1 text-[11px] truncate">
                  <DollarSign className="w-3 h-3 text-[#D4FF32]" />
                  {selectedCampaignForDetail.budgetNotes || "Organic Distribution"}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400">Total Deliverables</div>
                <div className="text-white font-bold font-mono text-[11px]">
                  {getCampaignStats(selectedCampaignForDetail).postCount} Posts
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400">Completion Status</div>
                <div className="text-[#D4FF32] font-bold font-mono text-[11px]">
                  {getCampaignStats(selectedCampaignForDetail).progress}% Published
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Deliverables & Content Pipeline</h4>
                  <span className="text-[10px] bg-[#182238] text-slate-300 font-mono px-2 py-0.5 rounded-full">
                    {getCampaignStats(selectedCampaignForDetail).linkedPosts.length} Posts
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLinkPostModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#182238] text-xs text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)] flex items-center gap-1.5 transition-all"
                  >
                    <span>+ Link Existing Post</span>
                  </button>

                  <Link
                    href={`/app/content-studio?campaignId=${selectedCampaignForDetail.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] flex items-center gap-1.5 shadow-[0_0_12px_rgba(212,255,50,0.2)] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Post in Studio</span>
                  </Link>
                </div>
              </div>

              {/* Linked Posts List */}
              {getCampaignStats(selectedCampaignForDetail).linkedPosts.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#0B1020]/60 border border-[rgba(255,255,255,0.06)] space-y-2">
                  <FileText className="w-6 h-6 text-slate-500 mx-auto" />
                  <div className="text-xs font-semibold text-white">No posts linked to this campaign yet</div>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Create native posts from Content Studio or link existing drafts to track deliverables under this campaign.
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <Link
                      href={`/app/content-studio?campaignId=${selectedCampaignForDetail.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs"
                    >
                      + Create First Post
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {getCampaignStats(selectedCampaignForDetail).linkedPosts.map((p) => {
                    const statusClass =
                      p.status === "PUBLISHED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : p.status === "SCHEDULED"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : p.status === "PENDING_APPROVAL"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/20";

                    return (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded uppercase border", statusClass)}>
                              {p.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {p.contentType || "General Post"}
                            </span>
                            <span className="text-[10px] text-slate-500">•</span>
                            <span className="text-[10px] text-slate-400">
                              {p.status === "PUBLISHED" && p.publishedAt
                                ? `Published on ${formatDate(p.publishedAt, "short")}`
                                : p.scheduledAt
                                ? `Scheduled for ${formatDate(p.scheduledAt, "short")}`
                                : `Created ${formatDate(p.createdAt, "short")}`}
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-white truncate">{p.title}</h5>

                          {/* Preview snippet from first variant */}
                          {p.variants && Object.values(p.variants)[0]?.caption && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                              &ldquo;{Object.values(p.variants)[0]?.caption}&rdquo;
                            </p>
                          )}

                          {/* Platforms badges */}
                          <div className="flex items-center gap-1.5 pt-1">
                            {p.targetPlatforms?.map((plt) => {
                              const cfg = PLATFORM_COLORS[plt] || { name: plt, bg: "bg-white/10 text-white" };
                              return (
                                <span
                                  key={plt}
                                  className={cn("text-[9px] px-1.5 py-0.5 rounded font-semibold border", cfg.bg)}
                                >
                                  {cfg.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleUnlinkPost(p.id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                            title="Unlink from this campaign"
                          >
                            Unlink
                          </button>
                          <Link
                            href="/app/posts"
                            className="px-3 py-1 rounded-lg bg-[#182238] hover:bg-[#22304e] text-slate-200 text-xs font-semibold flex items-center gap-1 border border-[rgba(255,255,255,0.06)]"
                          >
                            <span>View</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0B1020]/90 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteCampaign(selectedCampaignForDetail.id, selectedCampaignForDetail.name)}
                  className="px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all"
                >
                  Delete Campaign
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCampaignForDetail(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#182238] text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LINK EXISTING POST MODAL                                                  */}
      {/* ========================================================================= */}
      {showLinkPostModal && selectedCampaignForDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121A2B] border border-[rgba(255,255,255,0.14)] rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Link Existing Post to Campaign</h3>
              <button
                onClick={() => setShowLinkPostModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select an existing post from your workspace to link with &ldquo;{selectedCampaignForDetail.name}&rdquo;:
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {data.posts
                .filter((p) => p.campaignId !== selectedCampaignForDetail.id)
                .map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handleLinkExistingPost(post.id)}
                    className="p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] hover:border-[#D4FF32]/50 hover:bg-[#182238] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-white truncate">{post.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span className="uppercase">{post.status}</span>
                        <span>•</span>
                        <span>{post.targetPlatforms?.join(", ")}</span>
                      </div>
                    </div>
                    <span className="text-xs text-[#D4FF32] font-semibold shrink-0">+ Link</span>
                  </div>
                ))}
              {data.posts.filter((p) => p.campaignId !== selectedCampaignForDetail.id).length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  No unlinked posts available in this workspace.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowLinkPostModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#182238] text-xs text-slate-300 hover:text-white font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE / EDIT CAMPAIGN MODAL                                              */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121A2B] border border-[rgba(255,255,255,0.14)] rounded-2xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {editingCampaign ? "Edit Marketing Campaign" : "Create New Marketing Campaign"}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Campaign Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Black Friday Launch Blitz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Primary Objective</label>
                  <select
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                  >
                    <option value="CONVERSIONS">Conversions & Sales</option>
                    <option value="AWARENESS">Brand Awareness</option>
                    <option value="ENGAGEMENT">Audience Engagement</option>
                    <option value="TRAFFIC">Traffic & Leads</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Campaign Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Budget / Distribution Notes</label>
                <input
                  type="text"
                  placeholder="e.g. $2,500 Paid Boost + Organic Influencers"
                  value={formData.budgetNotes}
                  onChange={(e) => setFormData({ ...formData, budgetNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Campaign Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the campaign goals, key deliverables, and distribution angle..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCampaign}
                className="px-4 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all shadow-[0_0_12px_rgba(212,255,50,0.2)]"
              >
                {editingCampaign ? "Update Campaign" : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI CAMPAIGN ARCHITECT MODAL                                               */}
      {/* ========================================================================= */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121A2B] border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-[0_0_40px_rgba(168,85,247,0.15)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Campaign Architect</h3>
                  <p className="text-[11px] text-purple-300">Multi-week campaign roadmap & native post generation</p>
                </div>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Campaign Concept / Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lumina Clean Beauty Q4 Launch or B2B SaaS Pipeline Surge"
                  value={aiForm.topic}
                  onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Primary Objective</label>
                  <select
                    value={aiForm.objective}
                    onChange={(e) => setAiForm({ ...aiForm, objective: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none"
                  >
                    <option value="CONVERSIONS">Conversions & Sales</option>
                    <option value="AWARENESS">Brand Awareness</option>
                    <option value="ENGAGEMENT">Audience Engagement</option>
                    <option value="TRAFFIC">Website Traffic</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Output Language</label>
                  <select
                    value={aiForm.language}
                    onChange={(e) => setAiForm({ ...aiForm, language: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none"
                  >
                    <option value="en">English (Default)</option>
                    <option value="bn">Bengali (বাংলা)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Campaign Duration</label>
                  <select
                    value={aiForm.durationWeeks}
                    onChange={(e) => setAiForm({ ...aiForm, durationWeeks: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none"
                  >
                    <option value={2}>2 Weeks (Sprint)</option>
                    <option value={4}>4 Weeks (Standard Month)</option>
                    <option value={6}>6 Weeks (Quarterly Push)</option>
                    <option value={8}>8 Weeks (Full Quarter)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Generated Posts Count</label>
                  <select
                    value={aiForm.postCount}
                    onChange={(e) => setAiForm({ ...aiForm, postCount: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none"
                  >
                    <option value={3}>3 Strategic Posts</option>
                    <option value={4}>4 Strategic Posts</option>
                    <option value={5}>5 Strategic Posts</option>
                    <option value={6}>6 Strategic Posts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Target Audience Profile</label>
                <input
                  type="text"
                  placeholder="e.g. Busy agency owners and creative directors"
                  value={aiForm.targetAudience}
                  onChange={(e) => setAiForm({ ...aiForm, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Target Platforms Picker */}
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1.5">Target Channels</label>
                <div className="flex flex-wrap gap-1.5">
                  {(["LINKEDIN", "X", "INSTAGRAM", "FACEBOOK"] as PlatformType[]).map((p) => {
                    const isSelected = aiForm.platforms.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (aiForm.platforms.length > 1) {
                              setAiForm({ ...aiForm, platforms: aiForm.platforms.filter((x) => x !== p) });
                            }
                          } else {
                            setAiForm({ ...aiForm, platforms: [...aiForm.platforms, p] });
                          }
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border cursor-pointer",
                          isSelected
                            ? "bg-purple-600/30 text-purple-200 border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.2)]"
                            : "bg-[#0B1020] text-slate-400 border-[rgba(255,255,255,0.06)] hover:text-white"
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(255,255,255,0.06)]">
              <button
                onClick={() => setShowAiModal(false)}
                disabled={isGeneratingAi}
                className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiCampaign}
                disabled={isGeneratingAi}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Architecting Campaign & Posts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate & Plan Campaign</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

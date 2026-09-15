"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  Send,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Copy,
  Hash,
  Wand2,
  Trash2,
  ExternalLink,
  Sliders,
  Check,
} from "lucide-react";
import { demoStore } from "@/lib/demo-store";
import { useDemoStore } from "@/lib/use-demo-store";
import { AIService } from "@/lib/ai/ai-service";
import { ProviderFactory } from "@/lib/providers/provider-factory";
import { ContentVariant, PlatformType } from "@/lib/types";
import { cn, generateToken } from "@/lib/utils";

const PLATFORMS: { id: PlatformType; name: string; color: string; limit: number }[] = [
  { id: "LINKEDIN", name: "LinkedIn", color: "#0A66C2", limit: 3000 },
  { id: "X", name: "X (Twitter)", color: "#FFFFFF", limit: 280 },
  { id: "INSTAGRAM", name: "Instagram", color: "#E4405F", limit: 2200 },
  { id: "FACEBOOK", name: "Facebook", color: "#1877F2", limit: 63206 },
  { id: "WHATSAPP", name: "WhatsApp", color: "#25D366", limit: 4096 },
  { id: "THREADS", name: "Threads", color: "#FFFFFF", limit: 500 },
  { id: "PINTEREST", name: "Pinterest", color: "#BD081C", limit: 500 },
];

const CONTENT_TYPES = [
  "Thought Leadership",
  "Product Launch",
  "Educational / How-To",
  "Promotional Post",
  "Customer Case Study",
  "Festival / Holiday",
  "WhatsApp Promo Message",
];

const TONES = ["Authoritative", "Conversational", "Playful", "Inspiring", "Bold", "Empathetic"];

export default function ContentStudioPage() {
  const { data, activeBrand, store } = useDemoStore();

  // Brief state
  const [topic, setTopic] = useState("Why omni-channel native distribution outperforms cross-posting in 2026");
  const [contentType, setContentType] = useState("Thought Leadership");
  const [tone, setTone] = useState("Authoritative");
  const [targetAudience, setTargetAudience] = useState("Founders, Agency Owners, and Marketing Heads");
  const [cta, setCta] = useState("Try SocialPilot free or schedule a walkthrough today.");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(["LINKEDIN", "X", "INSTAGRAM"]);

  // Active editing tab
  const [activeTab, setActiveTab] = useState<PlatformType>("LINKEDIN");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [notification, setNotification] = useState<string | null>(null);

  // Selected media for post
  const [selectedMedia, setSelectedMedia] = useState<string>(
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80"
  );

  // Platform variants
  const [variants, setVariants] = useState<Record<PlatformType, ContentVariant>>({
    LINKEDIN: {
      platform: "LINKEDIN",
      caption: `The biggest bottleneck in modern social growth isn't creativity.

It's the friction between creation and multi-channel distribution.

When we look at social algorithms in 2026, native syntax is non-negotiable. The companies scaling their organic pipeline aren't publishing more noise—they are adapting their core message with precision to every channel's native psychology.

Key takeaways:
1. Native formatting drives 3.2x higher dwell time.
2. Centralized brand intelligence prevents fragmented voice.
3. Rapid approvals prevent campaign logjams.

Try SocialPilot free or schedule a walkthrough today.

How does your team currently handle multi-platform distribution? Drop your workflow below.`,
      hashtags: ["#MarketingStrategy", "#Leadership", "#B2BGrowth", "#ContentStrategy"],
      ctaText: "Try Free",
      ctaUrl: "https://socialpilot.ai",
      characterCount: 650,
    },
    X: {
      platform: "X",
      caption: `Most marketing teams waste 15+ hours weekly reformatting captions.

Here is what changes when you automate native distribution:
• 4x higher publishing velocity
• Flawless brand consistency
• Zero manual copy-pasting

Try SocialPilot free or schedule a walkthrough today.`,
      hashtags: ["#SocialMediaAI", "#GrowthStrategy"],
      ctaText: "Try Free",
      ctaUrl: "https://socialpilot.ai",
      characterCount: 235,
    },
    INSTAGRAM: {
      platform: "INSTAGRAM",
      caption: `Stop copying & pasting your captions across platforms 🛑✨

Native psychology is everything. The way your audience consumes on Instagram is completely distinct from LinkedIn or X.

💡 Inside today's deep dive:
Why omni-channel native distribution outperforms cross-posting in 2026.

Swipe through to see the exact framework we use to turn a single concept into 7 platform-optimized assets in minutes 📲👇

Try SocialPilot free or schedule a walkthrough today.`,
      hashtags: [
        "#ContentCreator",
        "#SocialMediaGrowth",
        "#MarketingTips",
        "#DigitalMarketingAgency",
        "#AIContent",
        "#CreatorEconomy",
      ],
      ctaText: "Link in Bio",
      ctaUrl: "https://socialpilot.ai",
      characterCount: 420,
    },
    FACEBOOK: {
      platform: "FACEBOOK",
      caption: `Are you still spending hours every week adapting posts for different social networks?

Here is an easier way to think about distribution: establish your brand guidelines once, and let intelligent workflow tools handle the formatting, tone adjustment, and media sizing.

Check out how modern teams are saving 20+ hours a month:
👉 Try SocialPilot free or schedule a walkthrough today.`,
      hashtags: ["#SocialMediaTips", "#BusinessGrowth"],
      ctaText: "Learn More",
      ctaUrl: "https://socialpilot.ai",
      characterCount: 380,
    },
    WHATSAPP: {
      platform: "WHATSAPP",
      caption: `*Exclusive Update from SocialPilot AI* 🚀

Hi there! We just released our latest operational guide:
*Why omni-channel native distribution outperforms cross-posting in 2026*

Key Highlights:
• Streamlined multi-channel publishing
• Real-time team approvals
• Automated performance tracking

👉 Read the guide here:
Try SocialPilot free or schedule a walkthrough today.`,
      hashtags: [],
      ctaText: "Chat with Us",
      ctaUrl: "https://socialpilot.ai/connect",
      characterCount: 310,
    },
    THREADS: {
      platform: "THREADS",
      caption: `Unpopular opinion: If you are cross-posting identical captions to X, LinkedIn, and Instagram, you are hurting your reach.

Every platform algorithm rewards native format syntax.

Here is why omni-channel native distribution outperforms cross-posting in 2026 🧵👇`,
      hashtags: ["#SocialMedia", "#ContentTips"],
      ctaText: "Discuss",
      ctaUrl: "https://socialpilot.ai",
      characterCount: 240,
    },
    PINTEREST: {
      platform: "PINTEREST",
      caption: `Step-by-step strategy for omni-channel native distribution in 2026. Discover actionable marketing tactics, visual content templates, and social media scheduling best practices to grow your business online.`,
      hashtags: ["#MarketingStrategy", "#SocialMediaPlanner"],
      ctaText: "Visit Site",
      ctaUrl: "https://socialpilot.ai",
      characterCount: 220,
    },
  } as any);



  const togglePlatform = (p: PlatformType) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        const next = selectedPlatforms.filter((item) => item !== p);
        setSelectedPlatforms(next);
        if (activeTab === p) setActiveTab(next[0]);
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const generated = await AIService.generateMultiPlatformContent({
        topic,
        contentType,
        tone,
        targetAudience,
        callToAction: cta,
        brand: activeBrand,
        targetPlatforms: selectedPlatforms,
      });

      setVariants((prev) => ({
        ...prev,
        ...generated,
      }));
      showToast("✨ AI generated tailored variations for all selected platforms!");
    } catch (e) {
      showToast("AI generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateCurrentCaption = (newCaption: string) => {
    setVariants((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        caption: newCaption,
        characterCount: newCaption.length,
      },
    }));
  };

  const handleQuickRewrite = (mode: "shorten" | "expand" | "hook" | "urgency") => {
    const current = variants[activeTab]?.caption || "";
    let revised = current;
    if (mode === "shorten") {
      revised = current.split("\n\n").slice(0, 2).join("\n\n");
    } else if (mode === "hook") {
      revised = `🚨 Attention founders: Most teams are making this critical mistake with social distribution.\n\n` + current;
    } else if (mode === "urgency") {
      revised = current + `\n\n⚡ Don't wait—this framework is only effective before algorithms adapt further.`;
    } else if (mode === "expand") {
      revised = current + `\n\nBonus Tip: Always benchmark your top-performing hooks on X before expanding into long-form LinkedIn essays.`;
    }
    updateCurrentCaption(revised);
    showToast(`Caption revised with "${mode}" intent`);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handlePublishNow = async () => {
    setIsPublishing(true);
    const provider = ProviderFactory.getProvider(activeTab);
    const res = await provider.publishPost({
      accountId: "acc-demo",
      caption: variants[activeTab].caption,
      mediaUrls: [selectedMedia],
    });

    setIsPublishing(false);
    if (res.success) {
      demoStore.addPost({
        workspaceId: data.activeWorkspaceId,
        brandId: data.activeBrandId,
        title: topic.slice(0, 40) + "...",
        basePrompt: topic,
        contentType,
        status: "PUBLISHED",
        publishedAt: new Date().toISOString(),
        targetPlatforms: selectedPlatforms,
        variants,
        mediaUrls: [selectedMedia],
      });
      showToast("🚀 Published successfully! (Simulated via MockProvider in Demo Mode)");
    }
  };

  const handleSchedule = () => {
    const scheduledDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString();
    demoStore.addPost({
      workspaceId: data.activeWorkspaceId,
      brandId: data.activeBrandId,
      title: topic.slice(0, 40) + "...",
      basePrompt: topic,
      contentType,
      status: "SCHEDULED",
      scheduledAt: scheduledDate,
      targetPlatforms: selectedPlatforms,
      variants,
      mediaUrls: [selectedMedia],
    });
    showToast("📅 Post added to schedule for in 2 days at 2:00 PM!");
  };

  const handleSendApproval = () => {
    const token = generateToken(24);
    const newPost = demoStore.addPost({
      workspaceId: data.activeWorkspaceId,
      brandId: data.activeBrandId,
      title: topic.slice(0, 40) + "...",
      basePrompt: topic,
      contentType,
      status: "PENDING_APPROVAL",
      targetPlatforms: selectedPlatforms,
      variants,
      mediaUrls: [selectedMedia],
    });

    showToast("📋 Client approval request created! Link: /client/approval/" + token);
  };

  const currentVariant = variants[activeTab] || {
    caption: "",
    hashtags: [],
    characterCount: 0,
  };
  const activePlatformConfig = PLATFORMS.find((p) => p.id === activeTab) || PLATFORMS[0];
  const isOverLimit = currentVariant.characterCount > activePlatformConfig.limit;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">AI Content Studio</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] px-2 py-0.5 rounded-full font-bold border border-[#D4FF32]/20">
              Cross-Platform Adaptor
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create once. Tailor automatically. Publish with brand consistency.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSendApproval}
            className="px-3 py-1.5 rounded-lg bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>Client Approval</span>
          </button>
          <button
            onClick={handleSchedule}
            className="px-3 py-1.5 rounded-lg bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Schedule</span>
          </button>
          <button
            onClick={handlePublishNow}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>Publish Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (3.5 cols): Brief & AI Parameters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                1. Content Brief
              </span>
              <span className="text-[10px] text-slate-400">Brand: {activeBrand.name}</span>
            </div>

            {/* Core Topic / Prompt */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Post Topic or Raw Idea
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to talk about? (e.g. 5 tips for B2B growth)"
                className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] focus:border-[#D4FF32]/60 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Content Objective / Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 focus:outline-none"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Tone of Voice</label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={cn(
                      "text-[10px] px-2.5 py-1 rounded-md transition-colors",
                      tone === t
                        ? "bg-[#D4FF32] text-[#0B1020] font-bold"
                        : "bg-[#182238] text-slate-400 hover:text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience & CTA */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-[11px] text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">Call to Action</label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-[11px] text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Platform Checklist */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
                Adapt for Platforms:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PLATFORMS.map((p) => {
                  const isChecked = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all border text-left",
                        isChecked
                          ? "bg-[#182238] text-white border-[rgba(212,255,50,0.3)]"
                          : "bg-[#0B1020]/60 text-slate-500 border-transparent hover:text-slate-300"
                      )}
                    >
                      <span>{p.name}</span>
                      {isChecked && <Check className="w-3 h-3 text-[#D4FF32]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Brain Guardrail Notice */}
            {activeBrand.prohibitedClaims && (
              <div className="p-2.5 rounded-lg bg-[#182238]/60 border border-amber-500/20 text-[10px] text-amber-300/80">
                <span className="font-semibold text-amber-200">Brand Brain Active:</span> Guarded against: &quot;
                {activeBrand.prohibitedClaims}&quot;
              </div>
            )}

            {/* Generate Action Button */}
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_20px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Native Variations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate Multi-Platform Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center Column (4.5 cols): Platform Tabs & Editor */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col h-full space-y-3">
            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[rgba(255,255,255,0.06)]">
              {selectedPlatforms.map((p) => {
                const isCurrent = activeTab === p;
                return (
                  <button
                    key={p}
                    onClick={() => setActiveTab(p)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                      isCurrent
                        ? "bg-[#182238] text-white border border-[#D4FF32]/40"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#182238]/50"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* AI Assistant Quick Refinements */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase">AI Tools:</span>
              <button
                onClick={() => handleQuickRewrite("hook")}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap"
              >
                ⚡ Strong Hook
              </button>
              <button
                onClick={() => handleQuickRewrite("shorten")}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap"
              >
                ✂️ Shorten
              </button>
              <button
                onClick={() => handleQuickRewrite("expand")}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap"
              >
                ➕ Expand
              </button>
              <button
                onClick={() => handleQuickRewrite("urgency")}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap"
              >
                🔥 Urgency
              </button>
            </div>

            {/* Caption Text Area */}
            <div className="flex-1 flex flex-col min-h-[280px]">
              <textarea
                value={currentVariant.caption}
                onChange={(e) => updateCurrentCaption(e.target.value)}
                placeholder="Platform caption..."
                className="flex-1 w-full p-3 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Character Limit Meter */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">
                {activeTab} Character Limit:
              </span>
              <span
                className={cn(
                  "font-mono font-semibold",
                  isOverLimit ? "text-rose-400" : "text-slate-300"
                )}
              >
                {currentVariant.characterCount} / {activePlatformConfig.limit}
              </span>
            </div>

            {/* Hashtag Manager */}
            {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Hashtags</label>
                <div className="flex flex-wrap gap-1">
                  {currentVariant.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#182238] text-slate-300 px-2 py-0.5 rounded-full border border-[rgba(255,255,255,0.06)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Media Selector Strip */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Attached Media</label>
              <div className="flex items-center gap-2">
                {data.mediaAssets.map((asset) => (
                  <img
                    key={asset.id}
                    src={asset.url}
                    alt=""
                    onClick={() => setSelectedMedia(asset.url)}
                    className={cn(
                      "w-10 h-10 rounded-lg object-cover cursor-pointer border-2 transition-transform",
                      selectedMedia === asset.url ? "border-[#D4FF32] scale-105" : "border-transparent opacity-60"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Live Native Preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Preview
                </span>
                <span className="text-[9px] bg-[#0B1020] text-slate-400 px-1.5 py-0.2 rounded border border-[rgba(255,255,255,0.08)]">
                  Simulated
                </span>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center bg-[#0B1020] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={cn(
                    "p-1 rounded text-slate-400",
                    previewDevice === "desktop" && "bg-[#182238] text-white"
                  )}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={cn(
                    "p-1 rounded text-slate-400",
                    previewDevice === "mobile" && "bg-[#182238] text-white"
                  )}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Native Card Preview Container */}
            <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.08)] space-y-3 text-left">
              {/* Profile Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#182238] border border-[rgba(255,255,255,0.1)] flex items-center justify-center font-bold text-xs text-[#D4FF32]">SP</div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      {activeBrand.name}
                      {activeTab === "X" && (
                        <span className="text-[10px] text-sky-400 font-bold">✓</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {activeTab === "LINKEDIN" ? "14,800 followers • 2h" : "@" + activeBrand.slug}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{activeTab}</span>
              </div>

              {/* Caption Text with native line-breaks */}
              <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-1">
                {currentVariant.caption}
              </div>

              {/* Hashtag strip */}
              {currentVariant.hashtags?.length > 0 && (
                <div className="text-[11px] text-sky-400 font-medium">
                  {currentVariant.hashtags.join(" ")}
                </div>
              )}

              {/* Media Preview Box */}
              {selectedMedia && (
                <div className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#121A2B]">
                  <img
                    src={selectedMedia}
                    alt=""
                    className="w-full h-44 object-cover"
                  />
                </div>
              )}

              {/* Interactive Dummy Engagement Bar */}
              <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] text-slate-500">
                <span>👍 142 Likes</span>
                <span>💬 28 Comments</span>
                <span>🔁 12 Shares</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
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
  Upload,
  ImagePlus,
  Bot,
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
  "Behind The Scenes",
];

const TONES = ["Authoritative", "Conversational", "Playful", "Inspiring", "Bold", "Empathetic"];

const LANGUAGES = [
  { id: "bn", name: "বাংলা (Bengali)", short: "বাংলা", flag: "🇧🇩", promptLang: "Bengali (বাংলা)" },
  { id: "en", name: "English", short: "English", flag: "🇬🇧", promptLang: "English" },
  { id: "hi", name: "हिंदी (Hindi)", short: "हिंदी", flag: "🇮🇳", promptLang: "Hindi (हिंदी)" },
];

export default function ContentStudioPage() {
  const { data, activeBrand, store } = useDemoStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Brief state
  const [topic, setTopic] = useState("Why omni-channel native distribution outperforms cross-posting in 2026");
  const [contentType, setContentType] = useState("Thought Leadership");
  const [tone, setTone] = useState("Authoritative");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("bn");
  const [targetAudience, setTargetAudience] = useState("Founders, Agency Owners, and Marketing Heads");
  const [cta, setCta] = useState("Try SocialPilot free or schedule a walkthrough today.");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(["LINKEDIN", "X", "INSTAGRAM", "FACEBOOK"]);

  // Active editing tab
  const [activeTab, setActiveTab] = useState<PlatformType>("FACEBOOK");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);

  // Selected media for post (Empty by default, direct upload only)
  const [selectedMedia, setSelectedMedia] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileSize, setUploadedFileSize] = useState<string>("");

  // Platform variants
  const [variants, setVariants] = useState<Record<PlatformType, ContentVariant>>({
    LINKEDIN: {
      platform: "LINKEDIN",
      caption: `The biggest bottleneck in modern social growth isn't creativity.\n\nIt's the friction between creation and multi-channel distribution.\n\nWhen we look at social algorithms in 2026, native syntax is non-negotiable. The companies scaling their organic pipeline aren't publishing more noise—they are adapting their core message with precision to every channel's native psychology.\n\nKey takeaways:\n1. Native formatting drives 3.2x higher dwell time.\n2. Centralized brand intelligence prevents fragmented voice.\n3. Rapid approvals prevent campaign logjams.\n\nTry SocialPilot free or schedule a walkthrough today.\n\nHow does your team currently handle multi-platform distribution? Drop your workflow below.`,
      hashtags: ["#MarketingStrategy", "#Leadership", "#B2BGrowth", "#ContentStrategy"],
      ctaText: "Try Free",
      ctaUrl: "https://socialpilot.ai",
      characterCount: 650,
    },
    X: {
      platform: "X",
      caption: `Most marketing teams waste 15+ hours weekly reformatting captions.\n\nHere is what changes when you automate native distribution:\n• 4x higher publishing velocity\n• Flawless brand consistency\n• Zero manual copy-pasting\n\nTry SocialPilot free or schedule a walkthrough today.`,
      hashtags: ["#SocialMediaAI", "#GrowthStrategy"],
      ctaText: "Try Free",
      ctaUrl: "https://socialpilot.ai",
      characterCount: 235,
    },
    INSTAGRAM: {
      platform: "INSTAGRAM",
      caption: `Stop copying & pasting your captions across platforms 🛑✨\n\nNative psychology is everything. The way your audience consumes on Instagram is completely distinct from LinkedIn or X.\n\n💡 Inside today's deep dive:\nWhy omni-channel native distribution outperforms cross-posting in 2026.\n\nSwipe through to see the exact framework we use to turn a single concept into 7 platform-optimized assets in minutes 📲👇\n\nTry SocialPilot free or schedule a walkthrough today.`,
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
      caption: `Are you still spending hours every week adapting posts for different social networks?\n\nHere is an easier way to think about distribution: establish your brand guidelines once, and let intelligent workflow tools handle the formatting, tone adjustment, and media sizing.\n\nCheck out how modern teams are saving 20+ hours a month:\n👉 Try SocialPilot free or schedule a walkthrough today.`,
      hashtags: ["#SocialMediaTips", "#BusinessGrowth"],
      ctaText: "Learn More",
      ctaUrl: "https://socialpilot.ai",
      characterCount: 380,
    },
    THREADS: {
      platform: "THREADS",
      caption: `Unpopular opinion: If you are cross-posting identical captions to X, LinkedIn, and Instagram, you are hurting your reach.\n\nEvery platform algorithm rewards native format syntax.\n\nHere is why omni-channel native distribution outperforms cross-posting in 2026 🧵👇`,
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

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

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

  // AI Content Generation with OpenAI
  const handleGenerateAI = async () => {
    if (!topic.trim()) {
      showToast("Please enter a topic or raw idea first.", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const selectedLangObj = LANGUAGES.find((l) => l.id === selectedLanguage) || LANGUAGES[0];
      const res = await AIService.generateMultiPlatformContent({
        topic,
        contentType,
        tone,
        language: selectedLangObj.promptLang,
        targetAudience,
        callToAction: cta,
        brand: activeBrand,
        targetPlatforms: selectedPlatforms,
      });

      setVariants((prev) => ({
        ...prev,
        ...res.variants,
      }));

      if (res.isLiveOpenAI) {
        showToast(`✨ Generated native captions with OpenAI ${res.model || "GPT-4o"}!`, "success");
      } else {
        showToast("✨ AI generated tailored variations for all selected platforms!", "success");
      }
    } catch (e: any) {
      showToast("AI generation encountered an issue. Please try again.", "error");
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

  // AI Assistant Quick Refinements (Hook, Shorten, Expand, Urgency)
  const handleQuickRewrite = async (mode: "shorten" | "expand" | "hook" | "urgency") => {
    const current = variants[activeTab]?.caption || "";
    if (!current.trim()) return;

    setIsRewriting(true);
    try {
      const res = await AIService.rewriteCaption({
        caption: current,
        mode,
        platform: activeTab,
      });
      updateCurrentCaption(res.rewritten);
      if (res.isLiveAI) {
        showToast(`⚡ Refined caption with OpenAI (${mode})!`, "success");
      } else {
        showToast(`Caption revised with "${mode}" intent`, "info");
      }
    } catch {
      showToast("Refinement failed.", "error");
    } finally {
      setIsRewriting(false);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WebP, GIF)", "error");
      return;
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    setUploadedFileName(file.name);
    setUploadedFileSize(sizeFormatted);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSelectedMedia(dataUrl);
        showToast(`🖼️ Image "${file.name}" uploaded directly!`, "success");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // AI Image Generation (DALL-E)
  const handleGenerateAIImage = async () => {
    setIsGeneratingImage(true);
    showToast("🎨 Generating AI image with DALL-E for your topic...", "info");

    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Modern editorial social media visual representation of: ${topic}. Ultra clean aesthetic, sleek lighting, brand colors.`,
        }),
      });

      const json = await res.json();
      if (json.success && json.url) {
        setSelectedMedia(json.url);
        setUploadedFileName(`AI Generated Image (${topic.slice(0, 20)}...)`);
        setUploadedFileSize("1024x1024");
        showToast("✨ DALL-E image generated and attached!", "success");
      } else {
        showToast(json.error || "DALL-E generation failed. Check OPENAI_API_KEY.", "error");
      }
    } catch {
      showToast("Failed to connect to image generation endpoint.", "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePublishNow = async () => {
    setIsPublishing(true);
    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: activeTab,
          caption: variants[activeTab]?.caption || "",
          mediaUrls: selectedMedia ? [selectedMedia] : [],
          accountId: connectedChannel?.platformAccountId,
          accessToken: connectedChannel?.accessToken,
        }),
      });

      const res = await response.json();
      setIsPublishing(false);

      if (res.success) {
        demoStore.addPost({
          workspaceId: data.activeWorkspaceId,
          brandId: data.activeBrandId,
          title: topic ? topic.slice(0, 40) + "..." : "Untitled Post",
          basePrompt: topic,
          contentType,
          status: "PUBLISHED",
          publishedAt: new Date().toISOString(),
          targetPlatforms: selectedPlatforms,
          variants,
          mediaUrls: selectedMedia ? [selectedMedia] : [],
        });

        if (res.live) {
          showToast(`🎉 লাইভ পোস্ট আপনার Facebook Page-এ সফলভাবে পাবলিশ হয়েছে! (ID: ${res.postId})`, "success");
        } else {
          showToast(`🚀 Published successfully to your SocialPilot Dashboard!`, "success");
        }
      } else {
        showToast(res.error || "Publishing failed. Please check account permissions.", "error");
      }
    } catch (err: any) {
      setIsPublishing(false);
      showToast("Publish request failed. Please try again.", "error");
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
      mediaUrls: selectedMedia ? [selectedMedia] : [],
    });
    showToast("📅 Post added to schedule for in 2 days at 2:00 PM!", "success");
  };

  const handleSendApproval = () => {
    const token = generateToken(24);
    demoStore.addPost({
      workspaceId: data.activeWorkspaceId,
      brandId: data.activeBrandId,
      title: topic.slice(0, 40) + "...",
      basePrompt: topic,
      contentType,
      status: "PENDING_APPROVAL",
      targetPlatforms: selectedPlatforms,
      variants,
      mediaUrls: selectedMedia ? [selectedMedia] : [],
    });

    showToast("📋 Client approval request created! Link: /client/approval/" + token, "info");
  };

  const currentVariant = variants[activeTab] || {
    caption: "",
    hashtags: [],
    characterCount: 0,
  };
  const activePlatformConfig = PLATFORMS.find((p) => p.id === activeTab) || PLATFORMS[0];
  const isOverLimit = currentVariant.characterCount > activePlatformConfig.limit;

  // Real connected channel matching active editing tab (e.g. FACEBOOK)
  const connectedChannel = data.socialAccounts.find(
    (acc) => acc.platform?.toUpperCase() === activeTab?.toUpperCase()
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={cn(
            "fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl text-white text-xs shadow-2xl flex items-center gap-2 border transition-all animate-in slide-in-from-top-2",
            notification.type === "success" && "bg-[#182238] border-[#D4FF32] text-white",
            notification.type === "error" && "bg-[#28151E] border-rose-500 text-rose-200",
            notification.type === "info" && "bg-[#182238] border-sky-400 text-slate-200"
          )}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#D4FF32] flex-shrink-0" />
          ) : notification.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">AI Content Studio</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] px-2 py-0.5 rounded-full font-bold border border-[#D4FF32]/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> OpenAI Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create once. Tailor automatically with OpenAI GPT-4o. Upload images and publish with brand consistency.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSendApproval}
            className="px-3 py-1.5 rounded-lg bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Client Approval</span>
          </button>
          <button
            onClick={handleSchedule}
            className="px-3 py-1.5 rounded-lg bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Schedule</span>
          </button>
          <button
            onClick={handlePublishNow}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
        {/* Left Column (4 cols): Brief & AI Parameters */}
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
                className="w-full p-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-[#0B1020]">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Output Language Selector (Bengali, English, Hindi) */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Output Language (ভাষা)</span>
                <span className="text-[10px] text-[#D4FF32] font-semibold">
                  {LANGUAGES.find((l) => l.id === selectedLanguage)?.name}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer border",
                      selectedLanguage === lang.id
                        ? "bg-[#D4FF32] text-[#0B1020] border-[#D4FF32] font-bold shadow-[0_0_10px_rgba(212,255,50,0.25)]"
                        : "bg-[#0B1020] text-slate-300 border-[rgba(255,255,255,0.08)] hover:border-[#D4FF32]/40"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.short}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone of Voice Selector */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
                Tone of Voice
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer",
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                />
              </div>
            </div>

            {/* Target Platforms Toggle Matrix */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
                Adapt for Platforms:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((p) => {
                  const isSelected = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer",
                        isSelected
                          ? "bg-[#182238] border-[#D4FF32]/40 text-white"
                          : "bg-[#0B1020] border-[rgba(255,255,255,0.05)] text-slate-500 hover:text-slate-300"
                      )}
                    >
                      <span className="truncate">{p.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-[#D4FF32]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Guardrails Notice */}
            {activeBrand.prohibitedClaims && (
              <div className="p-2.5 rounded-lg bg-[#182238]/50 border border-[rgba(255,255,255,0.06)] text-[10px] text-slate-400 leading-relaxed">
                <span className="font-semibold text-amber-300">Brand Brain Active:</span> Guarded against: &quot;{activeBrand.prohibitedClaims}&quot;
              </div>
            )}

            {/* Primary Generation Button */}
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-[#D4FF32] hover:bg-[#C2ED25] text-[#0B1020] font-bold text-xs shadow-lg shadow-[#D4FF32]/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating with OpenAI GPT-4o...</span>
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

        {/* Center Column (4 cols): Platform Tabs & Editor */}
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
                      "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
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
                disabled={isRewriting}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                ⚡ Strong Hook
              </button>
              <button
                onClick={() => handleQuickRewrite("shorten")}
                disabled={isRewriting}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                ✂️ Shorten
              </button>
              <button
                onClick={() => handleQuickRewrite("expand")}
                disabled={isRewriting}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                ➕ Expand
              </button>
              <button
                onClick={() => handleQuickRewrite("urgency")}
                disabled={isRewriting}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                🔥 Urgency
              </button>
            </div>

            {/* Caption Text Area */}
            <div className="flex-1 flex flex-col min-h-[260px]">
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

            {/* Direct Image Upload Section (No Media Library) */}
            <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4FF32]" />
                  <span>Post Image</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAIImage}
                    disabled={isGeneratingImage}
                    className="text-[10px] text-[#D4FF32] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    title="Generate with DALL-E 3"
                  >
                    {isGeneratingImage ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>AI Image</span>
                  </button>
                  {selectedMedia && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMedia("");
                        setUploadedFileName("");
                        setUploadedFileSize("");
                      }}
                      className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                      title="Clear image (Text-only post)"
                    >
                      <Trash2 className="w-2.5 h-2.5" /> Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Hidden file input for direct computer upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              {!selectedMedia ? (
                /* Direct Upload Box */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-3 rounded-xl bg-[#0B1020] border-2 border-dashed border-[#D4FF32]/35 hover:border-[#D4FF32] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-[#182238]/60 group text-center"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#182238] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#D4FF32] group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-[#D4FF32] transition-colors">
                      Click to upload image
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Direct upload from computer (PNG, JPG, WebP)
                    </span>
                  </div>
                </div>
              ) : (
                /* Uploaded Image Card */
                <div className="p-2.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedMedia}
                      alt="Uploaded"
                      className="w-12 h-12 rounded-lg object-cover border border-[#D4FF32]/50 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {uploadedFileName || "Uploaded Image"}
                      </div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Attached to post • {uploadedFileSize || "Ready"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-md bg-[#182238] hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)] text-[11px] text-slate-200 hover:text-white transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMedia("");
                        setUploadedFileName("");
                        setUploadedFileSize("");
                      }}
                      className="p-1.5 rounded-md hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
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
                {connectedChannel ? (
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Connected Page
                  </span>
                ) : (
                  <span className="text-[9px] bg-[#0B1020] text-slate-400 px-1.5 py-0.2 rounded border border-[rgba(255,255,255,0.08)]">
                    Simulated
                  </span>
                )}
              </div>

              {/* Device Toggle */}
              <div className="flex items-center bg-[#0B1020] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={cn(
                    "p-1 rounded text-slate-400 cursor-pointer",
                    previewDevice === "desktop" && "bg-[#182238] text-white"
                  )}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={cn(
                    "p-1 rounded text-slate-400 cursor-pointer",
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
                <div className="flex items-center gap-2.5 min-w-0">
                  {connectedChannel?.avatarUrl ? (
                    <img
                      src={connectedChannel.avatarUrl}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-[#D4FF32]/40 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#182238] border border-[rgba(255,255,255,0.1)] flex items-center justify-center font-bold text-xs text-[#D4FF32] flex-shrink-0">
                      {connectedChannel ? connectedChannel.accountName.slice(0, 2).toUpperCase() : "SP"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span className="truncate max-w-[150px]">
                        {connectedChannel ? connectedChannel.accountName : activeBrand.name}
                      </span>
                      {activeTab === "X" && (
                        <span className="text-[10px] text-sky-400 font-bold">✓</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                      {connectedChannel
                        ? connectedChannel.handle || `@${activeTab.toLowerCase()}_page`
                        : activeTab === "LINKEDIN"
                        ? "14,800 followers • 2h"
                        : "@" + activeBrand.slug}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">{activeTab}</span>
              </div>

              {/* Caption Text with native line-breaks */}
              <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-1">
                {currentVariant.caption}
              </div>

              {/* Hashtag strip */}
              {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
                <div className="text-[11px] text-sky-400 font-medium">
                  {currentVariant.hashtags.join(" ")}
                </div>
              )}

              {/* Media Preview Box */}
              {selectedMedia && (
                <div className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#121A2B]">
                  <img
                    src={selectedMedia}
                    alt="Post media preview"
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

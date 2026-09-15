"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Search,
  Filter,
  Trash2,
  Download,
  ExternalLink,
  Layers,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Copy,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { AIService } from "@/lib/ai/ai-service";
import { cn } from "@/lib/utils";

const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1 Square (IG / Feed)", width: 1080, height: 1080 },
  { id: "4:5", label: "4:5 Portrait (IG Feed)", width: 1080, height: 1350 },
  { id: "9:16", label: "9:16 Story / Reel", width: 1080, height: 1920 },
  { id: "16:9", label: "16:9 Landscape (X / LI)", width: 1920, height: 1080 },
];

const STYLES = [
  "Photorealistic Modern SaaS",
  "Minimalist 3D Isometric",
  "High-Fashion Editorial Studio",
  "Cyberpunk Midnight Glow",
  "Clean Abstract Geometry",
];

export default function MediaLibraryPage() {
  const { data } = useDemoStore();
  const [activeTab, setActiveTab] = useState<"library" | "ai-studio">("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [imagePrompt, setImagePrompt] = useState(
    "Futuristic analytics hologram floating above a midnight dark boardroom table with glowing neon electric lime edges"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGenerateCreative = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Generate simulated high-res image and add to library
      const sampleImages = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1080&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1080&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=1080&auto=format&fit=crop&q=80",
      ];
      const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];

      const newAsset = {
        id: `med-${Date.now()}`,
        title: imagePrompt.slice(0, 32) + "...",
        url: randomImg,
        type: "IMAGE" as const,
        aspectRatio: selectedRatio,
        tags: ["AI Studio", selectedRatio],
        createdAt: new Date().toISOString(),
      };

      data.mediaAssets.unshift(newAsset);
      showToast("🎨 AI Creative generated and saved to Media Library!");
      setActiveTab("library");
    }, 1500);
  };

  const filteredAssets = data.mediaAssets.filter((asset) =>
    asset.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {notification && (
        <div className="fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Media & Creative Studio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized asset storage, drag-and-drop uploads, and native multi-ratio AI image generation.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[#121A2B] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
          <button
            onClick={() => setActiveTab("library")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
              activeTab === "library" ? "bg-[#182238] text-white" : "text-slate-400 hover:text-white"
            )}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Asset Library ({data.mediaAssets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("ai-studio")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5",
              activeTab === "ai-studio"
                ? "bg-[#D4FF32] text-[#0B1020]"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Image Studio</span>
          </button>
        </div>
      </div>

      {/* Library View */}
      {activeTab === "library" && (
        <div className="space-y-6">
          {/* Search & Upload Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets by tag or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#121A2B] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50"
              />
            </div>

            {/* Quick Upload Drag Simulation */}
            <label className="cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#182238] hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#D4FF32]" />
              <span>Upload New Asset</span>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={() => showToast("📁 Asset uploaded to S3 / Cloudflare R2 bucket!")}
              />
            </label>
          </div>

          {/* Grid of Assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] overflow-hidden hover:border-[rgba(212,255,50,0.3)] transition-all flex flex-col"
              >
                <div className="relative aspect-square bg-[#0B1020] overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-[#0B1020]/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300 border border-[rgba(255,255,255,0.1)]">
                    {asset.aspectRatio}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-white truncate">{asset.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {asset.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] bg-[#182238] text-slate-400 px-1.5 py-0.2 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-[11px] text-slate-400">
                    <Link
                      href="/app/content-studio"
                      className="text-[#D4FF32] hover:underline flex items-center gap-1"
                    >
                      Use in Post →
                    </Link>
                    <button
                      onClick={() => showToast("Direct asset URL copied to clipboard")}
                      title="Copy asset link"
                      className="hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Image Studio View */}
      {activeTab === "ai-studio" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#D4FF32]" />
                <span>AI Prompt & Presets</span>
              </div>

              {/* Prompt Box */}
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Creative Prompt
                </label>
                <textarea
                  rows={4}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe your creative image..."
                  className="w-full p-3 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] focus:border-[#D4FF32]/60 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Aspect Ratio Presets */}
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
                  Social Aspect Ratio Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setSelectedRatio(ratio.id)}
                      className={cn(
                        "p-2.5 rounded-lg border text-left text-xs transition-all",
                        selectedRatio === ratio.id
                          ? "bg-[#182238] border-[#D4FF32] text-white"
                          : "bg-[#0B1020] border-[rgba(255,255,255,0.06)] text-slate-400 hover:text-white"
                      )}
                    >
                      <div className="font-bold">{ratio.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ratio.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Style Preset */}
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
                  Rendering Aesthetic
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none"
                >
                  {STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateCreative}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_20px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing High-Resolution Render...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Generate Creative ({selectedRatio})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Canvas (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col items-center justify-center min-h-[440px] text-center">
              <div className="w-72 aspect-square rounded-2xl overflow-hidden border-2 border-[rgba(212,255,50,0.3)] shadow-[0_0_30px_rgba(0,0,0,0.6)] relative group">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80"
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[9px] bg-[#D4FF32] text-[#0B1020] font-bold px-2 py-0.5 rounded">
                    {selectedRatio} Preset
                  </span>
                  <div className="text-xs font-bold text-white mt-1 line-clamp-1">{imagePrompt}</div>
                  <div className="text-[10px] text-slate-400">{selectedStyle}</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4 max-w-sm">
                Generated image creatives will be automatically rendered in full resolution, tagged with your brand palette, and synced to your Media Library.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

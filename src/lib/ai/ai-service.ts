import { Brand, ContentVariant, PlatformType } from "../types";

export interface GenerateBriefParams {
  topic: string;
  contentType: string; // "PROMOTIONAL", "EDUCATIONAL", "PRODUCT_LAUNCH", "FESTIVAL", "CASE_STUDY", "THOUGHT_LEADERSHIP"
  tone: string; // "Authoritative", "Conversational", "Playful", "Inspiring", "Bold"
  language?: string; // "Bengali (বাংলা)", "English", "Hindi (हिंदी)"
  targetAudience?: string;
  callToAction?: string;
  referenceUrl?: string;
  brand?: Brand | null;
  targetPlatforms: PlatformType[];
}

export interface GenerateResult {
  variants: Record<PlatformType, ContentVariant>;
  isLiveOpenAI: boolean;
  model?: string;
}

export class AIService {
  /**
   * Generates cross-platform tailored variations from a single brief using OpenAI GPT-4o / GPT-4o-mini
   * with automatic fallback if offline or unconfigured.
   */
  static async generateMultiPlatformContent(params: GenerateBriefParams): Promise<GenerateResult> {
    // 1. Try real OpenAI generation via server API route
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.variants && Object.keys(data.variants).length > 0) {
          return {
            variants: data.variants,
            isLiveOpenAI: true,
            model: data.model,
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI generation route unreachable, falling back to local synthesizer:", err);
    }

    // 2. Intelligent local fallback template generation
    await new Promise((resolve) => setTimeout(resolve, 600));

    const brandName = params.brand?.name || "SocialPilot AI";
    const cta = params.callToAction || "Discover how to scale your reach today.";
    const topic = params.topic.trim();

    const variants: Record<PlatformType, ContentVariant> = {} as any;

    // X (Twitter)
    if (params.targetPlatforms.includes("X")) {
      const xCaption = `Most marketing teams waste 15+ hours weekly reformatting captions.\n\nHere is what changes when you automate distribution:\n• 4x higher publishing velocity\n• Flawless brand consistency\n• Zero manual copy-pasting\n\n${topic}.\n\n${cta}`;
      variants["X"] = {
        platform: "X",
        caption: xCaption.slice(0, 275),
        hashtags: ["#SocialMediaAI", "#MarketingAutomation", "#GrowthStrategy"],
        ctaText: "Try Free",
        ctaUrl: "https://socialpilot.ai",
        characterCount: Math.min(xCaption.length, 275),
      };
    }

    // LinkedIn
    if (params.targetPlatforms.includes("LINKEDIN")) {
      const linkedInCaption = `The biggest bottleneck in modern social growth isn't creativity.\n\nIt's the friction between creation and multi-channel distribution.\n\nWhen we look at ${topic}, the companies winning the next decade aren't publishing more noise—they are adapting their core message with precision to every channel's native psychology.\n\nKey takeaways for founders and marketing leaders:\n1. Native formatting drives up to 3.2x higher dwell time.\n2. Unified analytics reveal cross-channel compounding.\n3. Centralized brand intelligence prevents fragmented voice.\n\n${cta}\n\nHow does your team currently handle multi-platform distribution? Drop your workflow below.`;
      variants["LINKEDIN"] = {
        platform: "LINKEDIN",
        caption: linkedInCaption,
        hashtags: ["#Leadership", "#MarketingStrategy", "#B2BGrowth", "#SaaS", "#ContentStrategy"],
        ctaText: "Read Full Blueprint",
        ctaUrl: "https://socialpilot.ai/insights",
        characterCount: linkedInCaption.length,
      };
    }

    // Instagram
    if (params.targetPlatforms.includes("INSTAGRAM")) {
      const igCaption = `Stop copying & pasting your captions across platforms 🛑✨\n\nNative psychology is everything. The way your audience consumes on Instagram is completely distinct from LinkedIn or X.\n\n💡 Inside today's deep dive:\n"${topic}"\n\nSwipe through to see the exact 4-step framework we use to turn a single concept into 7 platform-optimized assets in minutes 📲👇\n\nSave this post for your next campaign planning session! 📌\n\n${cta}`;
      variants["INSTAGRAM"] = {
        platform: "INSTAGRAM",
        caption: igCaption,
        hashtags: ["#ContentCreator", "#SocialMediaGrowth", "#MarketingTips", "#AutomationTools", "#GrowthHacking"],
        ctaText: "Link in Bio",
        ctaUrl: "https://socialpilot.ai",
        characterCount: igCaption.length,
      };
    }

    // Facebook
    if (params.targetPlatforms.includes("FACEBOOK")) {
      const fbCaption = `Are you still spending hours every week adapting posts for different social networks?\n\nHere is an easier way to think about distribution: establish your brand guidelines once, and let intelligent workflow tools handle the formatting, tone adjustment, and media sizing.\n\nCheck out how modern teams are saving 20+ hours a month:\n👉 ${cta}`;
      variants["FACEBOOK"] = {
        platform: "FACEBOOK",
        caption: fbCaption,
        hashtags: ["#SocialMediaTips", "#BusinessGrowth", "#MarketingProductivity"],
        ctaText: "Learn More",
        ctaUrl: "https://socialpilot.ai",
        characterCount: fbCaption.length,
      };
    }

    // Threads
    if (params.targetPlatforms.includes("THREADS")) {
      const threadsCaption = `Unpopular opinion: If you are cross-posting the exact same caption to X, LinkedIn, and Threads, you are wasting 80% of your organic potential.\n\nThreads rewards authentic conversation, not corporate PR.\n\n${topic}.\n\nWhat do you think?`;
      variants["THREADS"] = {
        platform: "THREADS",
        caption: threadsCaption,
        hashtags: [],
        ctaText: "Reply",
        ctaUrl: "https://threads.net",
        characterCount: threadsCaption.length,
      };
    }

    // Pinterest
    if (params.targetPlatforms.includes("PINTEREST")) {
      const pinCaption = `Step-by-step strategy for ${topic}. Discover actionable marketing tactics, visual content templates, and social media scheduling best practices to grow your business online. Click through to explore the full guide.`;
      variants["PINTEREST"] = {
        platform: "PINTEREST",
        caption: pinCaption,
        hashtags: ["#MarketingStrategy", "#SocialMediaPlanner", "#BusinessTips"],
        ctaText: "Visit Site",
        ctaUrl: "https://socialpilot.ai",
        characterCount: pinCaption.length,
      };
    }

    // YouTube
    if (params.targetPlatforms.includes("YOUTUBE")) {
      const ytCaption = `In this video, we break down everything you need to know about ${topic}.\n\n📌 TIMESTAMPS:\n0:00 - Introduction\n1:45 - The Multi-Platform Framework\n4:20 - Automating Without Losing Brand Voice\n7:10 - Real Case Study\n\n🔔 Subscribe for weekly breakdowns.\n🔗 ${cta}`;
      variants["YOUTUBE"] = {
        platform: "YOUTUBE",
        caption: ytCaption,
        hashtags: ["#MarketingTutorial", "#GrowthHacking"],
        ctaText: "Subscribe",
        ctaUrl: "https://socialpilot.ai",
        characterCount: ytCaption.length,
      };
    }

    // TikTok
    if (params.targetPlatforms.includes("TIKTOK")) {
      const ttCaption = `If you're still manually copying posts to 5 different apps in 2026, stop right now 🛑 Watch till the end for the workflow that changed everything #MarketingTok #SocialMediaHacks #CreatorTools`;
      variants["TIKTOK"] = {
        platform: "TIKTOK",
        caption: ttCaption,
        hashtags: ["#MarketingTok", "#SocialMediaHacks", "#CreatorTools", "#SmallBusiness"],
        ctaText: "Watch Now",
        ctaUrl: "https://socialpilot.ai",
        characterCount: ttCaption.length,
      };
    }

    return { variants, isLiveOpenAI: false };
  }

  /**
   * Refines a caption using OpenAI or smart local heuristics
   */
  static async rewriteCaption(params: {
    caption: string;
    mode: "hook" | "shorten" | "expand" | "urgency";
    platform: string;
  }): Promise<{ rewritten: string; isLiveAI: boolean }> {
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.rewritten) {
          return { rewritten: data.rewritten, isLiveAI: true };
        }
      }
    } catch (e) {}

    // Fallback local revision
    const { caption, mode } = params;
    let revised = caption;
    if (mode === "shorten") {
      revised = caption.split("\n\n").slice(0, 2).join("\n\n");
    } else if (mode === "hook") {
      revised = `🚨 Attention founders: Most teams are making this critical mistake with social distribution.\n\n` + caption;
    } else if (mode === "urgency") {
      revised = caption + `\n\n⚡ Don't wait—this framework is only effective before algorithms adapt further.`;
    } else if (mode === "expand") {
      revised = caption + `\n\nBonus Tip: Always benchmark your top-performing hooks on X before expanding into long-form LinkedIn essays.`;
    }

    return { rewritten: revised, isLiveAI: false };
  }

  static async suggestInboxReply(conversationSnippet: string, customerMessage: string): Promise<string[]> {
    try {
      const res = await fetch("/api/ai/suggest-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: conversationSnippet, message: customerMessage }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && data.suggestions.length > 0) {
          return data.suggestions;
        }
      }
    } catch {}

    return [
      `Thanks for reaching out! We'd love to help with this. Let me connect you with our team right away.`,
      `Great question! You can easily explore our features and workflows directly through our documentation.`,
      `Appreciate your interest! Our team is currently reviewing your request and will follow up shortly.`,
    ];
  }

  static generateImagePrompt(postContext: string, style = "Photorealistic Modern SaaS"): string {
    return `Editorial minimal 3D render of a futuristic dashboard interface floating above a midnight dark studio surface with subtle neon electric lime lighting accents, ultra-clean glassmorphic textures, premium cinematic composition, 8k resolution, ${style}`;
  }
}

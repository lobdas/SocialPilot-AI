import { Brand, ContentVariant, PlatformType } from "../types";

export interface GenerateBriefParams {
  topic: string;
  contentType: string; // "PROMOTIONAL", "EDUCATIONAL", "PRODUCT_LAUNCH", "FESTIVAL", "CASE_STUDY", "THOUGHT_LEADERSHIP"
  tone: string; // "Authoritative", "Conversational", "Playful", "Inspiring", "Bold"
  targetAudience?: string;
  callToAction?: string;
  referenceUrl?: string;
  brand?: Brand | null;
  targetPlatforms: PlatformType[];
}

export class AIService {
  /**
   * Generates cross-platform tailored variations from a single brief
   */
  static async generateMultiPlatformContent(params: GenerateBriefParams): Promise<Record<PlatformType, ContentVariant>> {
    // Artificial latency for realistic generation feel
    await new Promise((resolve) => setTimeout(resolve, 900));

    const brandName = params.brand?.name || "SocialPilot AI";
    const brandVoice = params.brand?.brandVoice || "Professional, bold, and insightful";
    const prohibitedNotice = params.brand?.prohibitedClaims ? `(Guarded against: ${params.brand.prohibitedClaims})` : "";
    const cta = params.callToAction || "Discover how to scale your reach today.";
    const topic = params.topic.trim();

    const variants: Record<PlatformType, ContentVariant> = {} as any;

    // X (Twitter) - Under 280 characters, crisp hook, 2-3 hashtags
    if (params.targetPlatforms.includes("X")) {
      const xCaption = `Most marketing teams waste 15+ hours weekly reformatting captions.

Here is what changes when you automate distribution:
• 4x higher publishing velocity
• Flawless brand consistency
• Zero manual copy-pasting

${topic}.

${cta}`;
      variants["X"] = {
        platform: "X",
        caption: xCaption.slice(0, 275),
        hashtags: ["#SocialMediaAI", "#MarketingAutomation", "#GrowthStrategy"],
        ctaText: "Try Free",
        ctaUrl: "https://socialpilot.ai",
        characterCount: Math.min(xCaption.length, 275),
      };
    }

    // LinkedIn - Professional narrative, line-spaced, engagement question, 3-5 hashtags
    if (params.targetPlatforms.includes("LINKEDIN")) {
      const linkedInCaption = `The biggest bottleneck in modern social growth isn't creativity.

It's the friction between creation and multi-channel distribution.

When we look at ${topic}, the companies winning the next decade aren't publishing more noise—they are adapting their core message with precision to every channel's native psychology.

Key takeaways for founders and marketing leaders:
1. Native formatting drives up to 3.2x higher dwell time.
2. Unified analytics reveal cross-channel compounding.
3. Centralized brand intelligence prevents fragmented voice.

${cta}

How does your team currently handle multi-platform distribution? Drop your workflow below.`;

      variants["LINKEDIN"] = {
        platform: "LINKEDIN",
        caption: linkedInCaption,
        hashtags: ["#Leadership", "#MarketingStrategy", "#B2BGrowth", "#SaaS", "#ContentStrategy"],
        ctaText: "Read Full Blueprint",
        ctaUrl: "https://socialpilot.ai/insights",
        characterCount: linkedInCaption.length,
      };
    }

    // Instagram - Visual hook, emoji rhythm, line breaks, rich hashtag cluster
    if (params.targetPlatforms.includes("INSTAGRAM")) {
      const igCaption = `Stop copying & pasting your captions across platforms 🛑✨

Native psychology is everything. The way your audience consumes on Instagram is completely distinct from LinkedIn or X.

💡 Inside today's deep dive:
"${topic}"

Swipe through to see the exact 4-step framework we use to turn a single concept into 7 platform-optimized assets in minutes 📲👇

Save this post for your next campaign planning session! 📌

${cta}`;

      variants["INSTAGRAM"] = {
        platform: "INSTAGRAM",
        caption: igCaption,
        hashtags: [
          "#ContentCreator",
          "#SocialMediaGrowth",
          "#MarketingTips",
          "#DigitalMarketingAgency",
          "#AIContent",
          "#CreatorEconomy",
          "#BrandStrategy",
          "#MarketingTools",
        ],
        ctaText: "Link in Bio",
        ctaUrl: "https://socialpilot.ai",
        characterCount: igCaption.length,
      };
    }

    // Facebook - Community conversation, warm tone, clear CTA
    if (params.targetPlatforms.includes("FACEBOOK")) {
      const fbCaption = `Are you still spending hours every week adapting posts for different social networks?

Here is an easier way to think about ${topic}:

Instead of starting from a blank page for every platform, start with one core idea, establish your brand guidelines once, and let intelligent workflow tools handle the formatting, tone adjustment, and media sizing.

Check out how modern teams are saving 20+ hours a month:
👉 ${cta}`;

      variants["FACEBOOK"] = {
        platform: "FACEBOOK",
        caption: fbCaption,
        hashtags: ["#SocialMediaTips", "#BusinessGrowth", "#MarketingMadeEasy"],
        ctaText: "Learn More",
        ctaUrl: "https://socialpilot.ai",
        characterCount: fbCaption.length,
      };
    }

    // WhatsApp - Direct conversational, bold headline, clear action link, no hashtag spam
    if (params.targetPlatforms.includes("WHATSAPP")) {
      const waCaption = `*Exclusive Update from ${brandName}* 🚀

Hi there! We just released our latest operational guide:
*${topic}*

Key Highlights:
• Streamlined multi-channel publishing
• Real-time team approvals
• Automated performance tracking

👉 Read the guide or schedule a walkthrough here:
${cta}
https://socialpilot.ai/connect`;

      variants["WHATSAPP"] = {
        platform: "WHATSAPP",
        caption: waCaption,
        hashtags: [],
        ctaText: "Chat with Us",
        ctaUrl: "https://socialpilot.ai/connect",
        characterCount: waCaption.length,
      };
    }

    // Threads - Punchy, conversational thought starter
    if (params.targetPlatforms.includes("THREADS")) {
      const threadsCaption = `Unpopular opinion: If you are cross-posting identical captions to X, LinkedIn, and Instagram, you are hurting your reach.

Every platform algorithm rewards native format syntax.

Here is the breakdown for "${topic}" 🧵👇`;

      variants["THREADS"] = {
        platform: "THREADS",
        caption: threadsCaption,
        hashtags: ["#SocialMedia", "#ContentTips"],
        ctaText: "Discuss",
        ctaUrl: "https://socialpilot.ai",
        characterCount: threadsCaption.length,
      };
    }

    // Pinterest - SEO keyword-rich pin description
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

    // YouTube - Video description format with chapter hooks
    if (params.targetPlatforms.includes("YOUTUBE")) {
      const ytCaption = `In this video, we break down everything you need to know about ${topic}.

📌 TIMESTAMPS:
0:00 - Introduction & The Big Problem
1:45 - The Multi-Platform Framework
4:20 - Automating Without Losing Brand Voice
7:10 - Real Case Study & Metrics

🔔 Subscribe for weekly growth breakdowns.
🔗 Access resources: https://socialpilot.ai`;

      variants["YOUTUBE"] = {
        platform: "YOUTUBE",
        caption: ytCaption,
        hashtags: ["#MarketingTutorial", "#GrowthHacking"],
        ctaText: "Subscribe",
        ctaUrl: "https://socialpilot.ai",
        characterCount: ytCaption.length,
      };
    }

    // TikTok - Fast hook, high engagement keywords
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

    return variants;
  }

  /**
   * Generates context-aware customer reply suggestions
   * Strictly enforces safety: NEVER invents unverified pricing, discounts, or binding guarantees
   */
  static async suggestInboxReply(conversationSnippet: string, customerMessage: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return [
      `Thanks for reaching out! We'd love to help with this. Let me connect you with our team right away so we can share the exact details tailored to your workspace.`,
      `Great question! You can easily explore our features and workflows directly through our documentation at socialpilot.ai/docs, or let us know if you'd like a quick product walkthrough!`,
      `Appreciate your interest! Our team is currently reviewing your request and will follow up shortly with comprehensive information.`,
    ];
  }

  /**
   * Generates prompt suggestions for AI Image Studio
   */
  static generateImagePrompt(postContext: string, style = "Photorealistic Modern SaaS"): string {
    return `Editorial minimal 3D render of a futuristic dashboard interface floating above a midnight dark studio surface with subtle neon electric lime lighting accents, ultra-clean glassmorphic textures, premium cinematic composition, 8k resolution, ${style}`;
  }
}

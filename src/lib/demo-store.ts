import {
  ApprovalRequestItem,
  Brand,
  Campaign,
  ContentItem,
  InboxConversation,
  SocialAccount,
  Workspace,
} from "./types";

export interface DemoStoreData {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  brands: Brand[];
  activeBrandId: string;
  socialAccounts: SocialAccount[];
  posts: ContentItem[];
  campaigns: Campaign[];
  conversations: InboxConversation[];
  approvalRequests: ApprovalRequestItem[];
  mediaAssets: {
    id: string;
    title: string;
    url: string;
    type: "IMAGE" | "VIDEO";
    aspectRatio: string;
    tags: string[];
    createdAt: string;
  }[];
}

const INITIAL_DATA: DemoStoreData = {
  workspaces: [
    {
      id: "ws-1",
      name: "Apex Growth Agency",
      slug: "apex-growth",
      industry: "Digital Marketing & Growth",
      country: "US",
      timezone: "America/New_York",
      language: "en",
    },
    {
      id: "ws-2",
      name: "Nordic Minimalist Studio",
      slug: "nordic-studio",
      industry: "E-Commerce & DTC",
      country: "SE",
      timezone: "Europe/Stockholm",
      language: "en",
    },
  ],
  activeWorkspaceId: "ws-1",
  brands: [
    {
      id: "brand-1",
      workspaceId: "ws-1",
      name: "SocialPilot AI",
      slug: "socialpilot",
      tagline: "Create once. Publish everywhere. Manage everything.",
      description: "All-in-one AI social media management platform for high-velocity teams.",
      primaryColor: "#D4FF32",
      secondaryColor: "#C4B5FD",
      brandVoice: "Authoritative, bold, analytical, yet approachable and empowering",
      tone: "Innovative, crisp, and high-agency",
      preferredLanguage: "en",
      targetAudience: "Digital marketing agencies, B2B founders, and multi-brand creators",
      prohibitedClaims: "Never guarantee exact ROI percentages, never claim 100% automated virality without human review",
      approvedExamples: "Stop wasting 15+ hours weekly reformatting captions. Scale your native reach with SocialPilot AI.",
      faqs: [
        { question: "What platforms do you support?", answer: "We support Meta (Facebook & Instagram), LinkedIn, X, Threads, WhatsApp, Pinterest, YouTube, and TikTok." },
        { question: "Does this include AI image generation?", answer: "Yes, built-in multi-aspect ratio generation and prompt engineering are included." }
      ]
    },
    {
      id: "brand-2",
      workspaceId: "ws-1",
      name: "Lumina Skincare",
      slug: "lumina-skincare",
      tagline: "Science-backed radiant daily wellness",
      description: "Clean dermatological skincare for sensitive skin.",
      primaryColor: "#FDA4AF",
      secondaryColor: "#E0E7FF",
      brandVoice: "Gentle, scientific, empathetic, and calming",
      tone: "Nurturing and educational",
      preferredLanguage: "en",
      targetAudience: "Wellness enthusiasts aged 24-42 seeking clean, dermatologically backed routines",
      prohibitedClaims: "Never claim to cure medical conditions or promise overnight anti-aging results",
    },
  ],
  activeBrandId: "brand-1",
  socialAccounts: [
    {
      id: "acc-1",
      workspaceId: "ws-1",
      brandId: "brand-1",
      platform: "LINKEDIN",
      platformAccountId: "li_org_98412",
      accountName: "Apex Growth Agency",
      handle: "apex-growth",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      accountType: "ORGANIZATION",
      status: "ACTIVE",
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      isDemoAccount: true,
      capabilities: {
        canPublishText: true,
        canPublishImage: true,
        canPublishVideo: true,
        canReadComments: true,
        canReplyToComments: true,
        canReadMessages: false,
        canSendMessages: false,
        canReadAnalytics: true,
        maxCharacterLimit: 3000,
        supportsHashtags: true,
        supportsCarousel: true,
      },
    },
    {
      id: "acc-2",
      workspaceId: "ws-1",
      brandId: "brand-1",
      platform: "X",
      platformAccountId: "x_usr_44921",
      accountName: "SocialPilot AI",
      handle: "@socialpilot_ai",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      accountType: "USER",
      status: "ACTIVE",
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isDemoAccount: true,
      capabilities: {
        canPublishText: true,
        canPublishImage: true,
        canPublishVideo: true,
        canReadComments: true,
        canReplyToComments: true,
        canReadMessages: true,
        canSendMessages: true,
        canReadAnalytics: true,
        maxCharacterLimit: 280,
        supportsHashtags: true,
        supportsCarousel: false,
      },
    },
    {
      id: "acc-3",
      workspaceId: "ws-1",
      brandId: "brand-1",
      platform: "INSTAGRAM",
      platformAccountId: "ig_biz_88310",
      accountName: "socialpilot.ai",
      handle: "@socialpilot.ai",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      accountType: "BUSINESS",
      status: "ACTIVE",
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isDemoAccount: true,
      capabilities: {
        canPublishText: true,
        canPublishImage: true,
        canPublishVideo: true,
        canReadComments: true,
        canReplyToComments: true,
        canReadMessages: true,
        canSendMessages: true,
        canReadAnalytics: true,
        maxCharacterLimit: 2200,
        supportsHashtags: true,
        supportsCarousel: true,
      },
    },
    {
      id: "acc-4",
      workspaceId: "ws-1",
      brandId: "brand-1",
      platform: "FACEBOOK",
      platformAccountId: "fb_pg_77123",
      accountName: "SocialPilot Technologies",
      handle: "socialpilot.tech",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      accountType: "PAGE",
      status: "ACTIVE",
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      isDemoAccount: true,
      capabilities: {
        canPublishText: true,
        canPublishImage: true,
        canPublishVideo: true,
        canReadComments: true,
        canReplyToComments: true,
        canReadMessages: true,
        canSendMessages: true,
        canReadAnalytics: true,
        maxCharacterLimit: 63206,
        supportsHashtags: true,
        supportsCarousel: true,
      },
    },
    {
      id: "acc-5",
      workspaceId: "ws-1",
      brandId: "brand-1",
      platform: "WHATSAPP",
      platformAccountId: "wa_biz_33109",
      accountName: "SocialPilot Concierge",
      handle: "+1 (800) 555-FLOW",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      accountType: "BUSINESS",
      status: "ACTIVE",
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isDemoAccount: true,
      capabilities: {
        canPublishText: true,
        canPublishImage: true,
        canPublishVideo: true,
        canReadComments: false,
        canReplyToComments: false,
        canReadMessages: true,
        canSendMessages: true,
        canReadAnalytics: false,
        maxCharacterLimit: 4096,
        supportsHashtags: false,
        supportsCarousel: false,
      },
    },
    {
      id: "acc-6",
      workspaceId: "ws-1",
      brandId: "brand-1",
      platform: "THREADS",
      platformAccountId: "th_usr_55102",
      accountName: "socialpilot",
      handle: "@socialpilot",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      accountType: "USER",
      status: "ACTIVE",
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      isDemoAccount: true,
      capabilities: {
        canPublishText: true,
        canPublishImage: true,
        canPublishVideo: true,
        canReadComments: true,
        canReplyToComments: true,
        canReadMessages: false,
        canSendMessages: false,
        canReadAnalytics: true,
        maxCharacterLimit: 500,
        supportsHashtags: true,
        supportsCarousel: true,
      },
    },
  ],
  posts: [
    {
      id: "post-1",
      workspaceId: "ws-1",
      brandId: "brand-1",
      title: "The Death of Generic Cross-Posting",
      basePrompt: "Why modern brands need native multi-platform distribution instead of lazy copy-pasting",
      contentType: "THOUGHT_LEADERSHIP",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      targetPlatforms: ["LINKEDIN", "X", "INSTAGRAM"],
      mediaUrls: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
      ],
      variants: {
        LINKEDIN: {
          platform: "LINKEDIN",
          caption: "The biggest bottleneck in modern social growth isn't creativity. It's the friction between creation and multi-channel distribution.\n\nWhen we look at social algorithms in 2026, native syntax is non-negotiable. Drop your workflow below.",
          hashtags: ["#MarketingStrategy", "#Leadership", "#ContentDistribution"],
          characterCount: 220,
        },
        X: {
          platform: "X",
          caption: "Most marketing teams waste 15+ hours weekly reformatting captions.\n\nHere is what changes with native multi-channel adaptation: 4x higher dwell time & zero copy-paste fatigue.",
          hashtags: ["#MarketingAI", "#GrowthStrategy"],
          characterCount: 195,
        },
        INSTAGRAM: {
          platform: "INSTAGRAM",
          caption: "Stop copying & pasting your captions across platforms 🛑✨\n\nNative psychology matters. Swipe through to learn how to scale your brand reach effortlessly 👇",
          hashtags: ["#SocialMediaTips", "#MarketingAgency", "#CreatorEconomy"],
          characterCount: 180,
        },
      } as any,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "post-2",
      workspaceId: "ws-1",
      brandId: "brand-1",
      title: "AI Image Studio Launch Featurette",
      basePrompt: "Introducing our instant multi-aspect ratio social media image generator",
      contentType: "PRODUCT_LAUNCH",
      status: "SCHEDULED",
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(), // Tomorrow afternoon
      targetPlatforms: ["X", "INSTAGRAM", "FACEBOOK"],
      mediaUrls: [
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1080&auto=format&fit=crop&q=80",
      ],
      variants: {
        X: {
          platform: "X",
          caption: "Design social visuals in seconds with our new AI Image Studio.\n\nPreset for 1:1, 4:5, 9:16 and 16:9 in a single click. Available now in SocialPilot AI.",
          hashtags: ["#AIStudio", "#ProductUpdate"],
          characterCount: 165,
        },
        INSTAGRAM: {
          platform: "INSTAGRAM",
          caption: "Visual storytelling just got 10x faster 🎨⚡\n\nGenerate photorealistic, brand-aligned graphics preset for feeds, stories, and carousels without leaving your dashboard.",
          hashtags: ["#CreativeTools", "#CanvaAlternative", "#DesignInspo"],
          characterCount: 210,
        },
        FACEBOOK: {
          platform: "FACEBOOK",
          caption: "Exciting product update! Creating visual content for multiple platforms used to take a whole team of designers. Today we are launching AI Image Studio inside SocialPilot.",
          hashtags: ["#TechLaunch", "#Productivity"],
          characterCount: 190,
        },
      } as any,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: "post-3",
      workspaceId: "ws-1",
      brandId: "brand-1",
      title: "Client Quarterly Growth Report Snapshot",
      basePrompt: "Key metrics from Q3 showing 142% engagement lift across our enterprise clients",
      contentType: "CASE_STUDY",
      status: "PENDING_APPROVAL",
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
      targetPlatforms: ["LINKEDIN"],
      mediaUrls: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080&auto=format&fit=crop&q=80",
      ],
      variants: {
        LINKEDIN: {
          platform: "LINKEDIN",
          caption: "Real benchmark numbers: How 24 agency clients scaled their cross-platform pipeline by 142% in 90 days without adding headcount.\n\nThe framework is simple: centralize brand voice, decentralize native execution.",
          hashtags: ["#B2BGrowth", "#CaseStudy", "#AgencyOps"],
          characterCount: 230,
        },
      } as any,
      approvalRequestId: "appr-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ],
  campaigns: [
    {
      id: "camp-1",
      workspaceId: "ws-1",
      brandId: "brand-1",
      name: "Q4 Product Launch Blitz",
      objective: "CONVERSIONS",
      description: "Omni-channel push across LinkedIn, X, and Instagram for enterprise tier rollout.",
      status: "ACTIVE",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
      budgetNotes: "$4,500 allocated for boost testing",
      postCount: 14,
      publishedCount: 6,
    },
    {
      id: "camp-2",
      workspaceId: "ws-1",
      brandId: "brand-1",
      name: "Thought Leadership & Industry Benchmark",
      objective: "AWARENESS",
      description: "Weekly executive insights on social media automation architecture.",
      status: "ACTIVE",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
      budgetNotes: "Organic only",
      postCount: 8,
      publishedCount: 3,
    },
  ],
  conversations: [
    {
      id: "conv-1",
      workspaceId: "ws-1",
      socialAccountId: "acc-1",
      platform: "LINKEDIN",
      type: "COMMENT",
      customerName: "David Chen",
      customerHandle: "david-chen-growth",
      customerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      snippet: "How does the brand brain handle prohibited regulatory claims?",
      isUnread: true,
      isArchived: false,
      sentiment: "LEAD",
      tags: ["High Intent", "Agency Prospect"],
      lastActivityAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      messages: [
        {
          id: "m-1",
          senderType: "CUSTOMER",
          senderName: "David Chen",
          content: "We manage 12 FinTech and Healthcare accounts. How does the Brand Brain guarantee that AI generation never violates strict regulatory restrictions or makes forbidden claims?",
          sentAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        },
      ],
    },
    {
      id: "conv-2",
      workspaceId: "ws-1",
      socialAccountId: "acc-2",
      platform: "X",
      type: "DIRECT_MESSAGE",
      customerName: "Elena Rostova",
      customerHandle: "@elena_builds",
      customerAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
      snippet: "Does SocialPilot support client approval links without creating accounts?",
      isUnread: false,
      isArchived: false,
      sentiment: "POSITIVE",
      tags: ["Feature Inquiry"],
      lastActivityAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
      messages: [
        {
          id: "m-2",
          senderType: "CUSTOMER",
          senderName: "Elena Rostova",
          content: "Hey team! Loving the demo. Can our external clients review and approve drafts without having to create a login?",
          sentAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
        {
          id: "m-3",
          senderType: "AGENT",
          senderName: "SocialPilot Team",
          content: "Yes! Every draft can generate a secure tokenized client link (/client/approval/[token]) where clients can review multi-platform previews and approve with one click.",
          sentAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        },
      ],
    },
    {
      id: "conv-3",
      workspaceId: "ws-1",
      socialAccountId: "acc-3",
      platform: "INSTAGRAM",
      type: "COMMENT",
      customerName: "Marcus Sterling",
      customerHandle: "@marcus_creative",
      customerAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      snippet: "This interface is stunning. What is the pricing for agencies?",
      isUnread: true,
      isArchived: false,
      sentiment: "LEAD",
      tags: ["Pricing", "Agency"],
      lastActivityAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      messages: [
        {
          id: "m-4",
          senderType: "CUSTOMER",
          senderName: "Marcus Sterling",
          content: "This interface looks unbelievable. What does your agency plan include in terms of workspaces and brand seats?",
          sentAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
      ],
    },
  ],
  approvalRequests: [
    {
      id: "appr-1",
      contentId: "post-3",
      clientToken: "demo-client-token-apex-992",
      state: "PENDING",
      clientName: "Horizon Ventures (Client)",
      clientEmail: "reviews@horizonventures.com",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      contentTitle: "Client Quarterly Growth Report Snapshot",
      platforms: ["LINKEDIN"],
      comments: [
        {
          id: "comm-1",
          authorName: "Content Lead (Internal)",
          isExternalClient: false,
          message: "Ready for client sign-off before Friday scheduling.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        },
      ],
    },
  ],
  mediaAssets: [
    {
      id: "med-1",
      title: "Abstract Neon Workspace 3D",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
      type: "IMAGE",
      aspectRatio: "1:1",
      tags: ["AI Creative", "Hero", "Brand"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "med-2",
      title: "SocialPilot Dashboard Preview Dark",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080&auto=format&fit=crop&q=80",
      type: "IMAGE",
      aspectRatio: "16:9",
      tags: ["Product", "UI Mockup"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: "med-3",
      title: "Electric Lime Gradient Sphere",
      url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1080&auto=format&fit=crop&q=80",
      type: "IMAGE",
      aspectRatio: "4:5",
      tags: ["Visual", "Instagram Preset"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
  ],
};

export const INITIAL_DEMO_DATA: DemoStoreData = INITIAL_DATA;

class DemoStore {
  private data: DemoStoreData = INITIAL_DATA;
  private isLoadedFromStorage = false;
  private listeners: (() => void)[] = [];

  getInitialData(): DemoStoreData {
    return INITIAL_DEMO_DATA;
  }

  constructor() {
    // Keep INITIAL_DATA during construction to match server-side rendering
  }

  initClient() {
    if (typeof window !== "undefined" && !this.isLoadedFromStorage) {
      this.isLoadedFromStorage = true;
      try {
        const saved = localStorage.getItem("socialpilot_demo_store_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.brands) && Array.isArray(parsed.posts)) {
            this.data = parsed;
            this.notify();
          }
        }
      } catch (e) {
        console.error("Failed to parse saved demo store", e);
      }
    }
  }

  private persist() {
    if (typeof window !== "undefined") {
      localStorage.setItem("socialpilot_demo_store_v1", JSON.stringify(this.data));
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getData(): DemoStoreData {
    return this.data;
  }

  getActiveWorkspace(): Workspace {
    return this.data.workspaces.find((w) => w.id === this.data.activeWorkspaceId) || this.data.workspaces[0];
  }

  getActiveBrand(): Brand {
    return this.data.brands.find((b) => b.id === this.data.activeBrandId) || this.data.brands[0];
  }

  setActiveWorkspace(id: string) {
    this.data.activeWorkspaceId = id;
    this.persist();
  }

  setActiveBrand(id: string) {
    this.data.activeBrandId = id;
    this.persist();
  }

  addPost(post: Omit<ContentItem, "id" | "createdAt" | "updatedAt">): ContentItem {
    const newPost: ContentItem = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.posts = [newPost, ...this.data.posts];
    this.persist();
    return newPost;
  }

  updatePost(id: string, updates: Partial<ContentItem>) {
    this.data.posts = this.data.posts.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    this.persist();
  }

  deletePost(id: string) {
    this.data.posts = this.data.posts.filter((p) => p.id !== id);
    this.persist();
  }

  updateBrand(id: string, updates: Partial<Brand>) {
    this.data.brands = this.data.brands.map((b) => (b.id === id ? { ...b, ...updates } : b));
    this.persist();
  }

  addBrand(brand: Omit<Brand, "id">) {
    const newBrand: Brand = {
      ...brand,
      id: `brand-${Date.now()}`,
    };
    this.data.brands.push(newBrand);
    this.data.activeBrandId = newBrand.id;
    this.persist();
    return newBrand;
  }

  addApprovalComment(requestId: string, message: string, authorName: string, isExternalClient = false) {
    this.data.approvalRequests = this.data.approvalRequests.map((req) => {
      if (req.id === requestId) {
        return {
          ...req,
          comments: [
            ...req.comments,
            {
              id: `comm-${Date.now()}`,
              authorName,
              isExternalClient,
              message,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return req;
    });
    this.persist();
  }

  setApprovalState(requestId: string, state: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED", notes?: string) {
    this.data.approvalRequests = this.data.approvalRequests.map((req) => {
      if (req.id === requestId) {
        // Also update the linked post status
        if (state === "APPROVED") {
          this.updatePost(req.contentId, { status: "SCHEDULED" });
        }
        return {
          ...req,
          state,
          decisionNotes: notes,
          reviewedAt: new Date().toISOString(),
        };
      }
      return req;
    });
    this.persist();
  }

  addInboxMessage(conversationId: string, content: string, senderType: "AGENT" | "CUSTOMER" = "AGENT") {
    this.data.conversations = this.data.conversations.map((conv) => {
      if (conv.id === conversationId) {
        const newMsg = {
          id: `m-${Date.now()}`,
          senderType,
          senderName: senderType === "AGENT" ? "Apex Growth Team" : conv.customerName,
          content,
          sentAt: new Date().toISOString(),
        };
        return {
          ...conv,
          snippet: content,
          isUnread: false,
          lastActivityAt: new Date().toISOString(),
          messages: [...conv.messages, newMsg],
        };
      }
      return conv;
    });
    this.persist();
  }

  toggleAccountStatus(accountId: string) {
    this.data.socialAccounts = this.data.socialAccounts.map((acc) => {
      if (acc.id === accountId) {
        const nextStatus = acc.status === "ACTIVE" ? "REVOKED" : "ACTIVE";
        return { ...acc, status: nextStatus, lastSyncAt: new Date().toISOString() };
      }
      return acc;
    });
    this.persist();
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.persist();
  }
}

export const demoStore = new DemoStore();

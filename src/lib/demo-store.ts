import {
  ApprovalRequestItem,
  Brand,
  Campaign,
  ContentItem,
  InboxConversation,
  PlatformType,
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
  ],
  activeWorkspaceId: "ws-1",
  brands: [],
  activeBrandId: "",
  socialAccounts: [],
  posts: [],
  campaigns: [],
  conversations: [],
  approvalRequests: [],
  mediaAssets: [],
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
        // Clean up legacy stores
        localStorage.removeItem("socialpilot_demo_store_v1");
        localStorage.removeItem("socialpilot_demo_store_v2");
        localStorage.removeItem("socialpilot_demo_store_v3");
        localStorage.removeItem("socialpilot_demo_store_v4");
        localStorage.removeItem("socialpilot_demo_store_v5");
        localStorage.removeItem("socialpilot_demo_store_v6");

        const saved = localStorage.getItem("socialpilot_fresh_brand_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.brands) && Array.isArray(parsed.posts)) {
            if (parsed.workspaces && parsed.workspaces.length > 1) {
              parsed.workspaces = [parsed.workspaces[0]];
              parsed.activeWorkspaceId = parsed.workspaces[0].id;
            }
            this.data = parsed;
            this.persist();
            this.notify();
            return;
          }
        } else {
          this.persist();
        }
      } catch (e) {
        console.error("Failed to parse saved demo store", e);
      }
    }
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        const serialized = JSON.stringify(this.data, (key, value) => {
          if (typeof value === "string" && value.startsWith("data:image/") && value.length > 10000) {
            return value.slice(0, 100) + "...[IMAGE_ATTACHED]";
          }
          return value;
        });
        localStorage.setItem("socialpilot_fresh_brand_v1", serialized);
      } catch (e) {
        console.warn("Storage quota exceeded; retained cleanly in active memory:", e);
      }
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

  getActiveBrand(): Brand | null {
    return this.data.brands.find((b) => b.id === this.data.activeBrandId) || this.data.brands[0] || null;
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
      brandId: post.brandId || this.data.activeBrandId,
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

  addCampaign(campaign: Omit<Campaign, "id" | "postCount" | "publishedCount"> & Partial<Campaign>): Campaign {
    const newCamp: Campaign = {
      id: campaign.id || `camp-${Date.now()}`,
      workspaceId: campaign.workspaceId || this.data.activeWorkspaceId,
      brandId: campaign.brandId || this.data.activeBrandId,
      name: campaign.name,
      objective: campaign.objective || "CONVERSIONS",
      description: campaign.description || "",
      status: campaign.status || "ACTIVE",
      startDate: campaign.startDate || new Date().toISOString(),
      endDate: campaign.endDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      budgetNotes: campaign.budgetNotes || "",
      postCount: campaign.postCount || 0,
      publishedCount: campaign.publishedCount || 0,
    };
    this.data.campaigns = [newCamp, ...this.data.campaigns];
    this.persist();
    return newCamp;
  }

  updateCampaign(id: string, updates: Partial<Campaign>) {
    this.data.campaigns = this.data.campaigns.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.persist();
  }

  deleteCampaign(id: string) {
    this.data.campaigns = this.data.campaigns.filter((c) => c.id !== id);
    // Disassociate posts linked to this campaign
    this.data.posts = this.data.posts.map((p) =>
      p.campaignId === id ? { ...p, campaignId: undefined } : p
    );
    this.persist();
  }

  assignPostToCampaign(postId: string, campaignId: string | null) {
    this.data.posts = this.data.posts.map((p) =>
      p.id === postId ? { ...p, campaignId: campaignId || undefined, updatedAt: new Date().toISOString() } : p
    );
    this.persist();
  }

  updateWorkspace(id: string, updates: Partial<Workspace>) {
    this.data.workspaces = this.data.workspaces.map((w) => (w.id === id ? { ...w, ...updates } : w));
    this.persist();
  }

  updateBrand(id: string, updates: Partial<Brand>) {
    this.data.brands = this.data.brands.map((b) => (b.id === id ? { ...b, ...updates } : b));
    this.persist();
  }

  addBrand(brand: Omit<Brand, "id">) {
    const newBrandId = `brand-${Date.now()}`;
    const newBrand: Brand = {
      ...brand,
      id: newBrandId,
      brandVoice: brand.brandVoice || "Authentic, clear, and engaging",
      tone: brand.tone || "Professional yet conversational",
      preferredLanguage: brand.preferredLanguage || "en",
      targetAudience: brand.targetAudience || `Followers and customers of ${brand.name}`,
    };
    this.data.brands.push(newBrand);
    this.data.activeBrandId = newBrand.id;

    // Initialize starter welcome draft post for this brand so it's fully ready to publish
    const starterPost: ContentItem = {
      id: `post-${Date.now()}`,
      workspaceId: this.data.activeWorkspaceId,
      brandId: newBrand.id,
      title: `Welcome to ${newBrand.name}`,
      basePrompt: `Introducing ${newBrand.name}: ${newBrand.tagline || "Innovating for our community"}`,
      contentType: "ANNOUNCEMENT",
      status: "DRAFT",
      targetPlatforms: ["LINKEDIN", "X", "INSTAGRAM"],
      mediaUrls: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
      ],
      variants: {
        LINKEDIN: {
          platform: "LINKEDIN",
          caption: `We are excited to introduce ${newBrand.name}! 🚀\n\n${newBrand.description || newBrand.tagline || "Follow along for our latest updates and insights."}\n\nWhat are you most excited to see from us?`,
          hashtags: ["#BrandLaunch", "#Innovation", `#${newBrand.name.replace(/\s+/g, "")}`],
          characterCount: 175,
        },
        X: {
          platform: "X",
          caption: `Excited to launch the official account for ${newBrand.name}! 🎉 Follow us for product news, updates, and more. ${newBrand.tagline || ""}`,
          hashtags: ["#Launch", `#${newBrand.name.replace(/\s+/g, "")}`],
          characterCount: 140,
        },
        INSTAGRAM: {
          platform: "INSTAGRAM",
          caption: `Welcome to ${newBrand.name} ✨\n\n${newBrand.tagline || "Creating memorable experiences."}\n\nStay tuned for behind-the-scenes content and exclusive reveals! 👇`,
          hashtags: ["#NewBrand", "#Community", `#${newBrand.name.replace(/\s+/g, "")}`],
          characterCount: 160,
        },
      } as any,
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.posts.push(starterPost);
    this.persist();
    return newBrand;
  }

  addApprovalRequest(request: Omit<ApprovalRequestItem, "id" | "createdAt" | "comments"> & {
    id?: string;
    createdAt?: string;
    comments?: ApprovalRequestItem["comments"];
  }): ApprovalRequestItem {
    const newRequest: ApprovalRequestItem = {
      id: request.id || `appr-${Date.now()}`,
      createdAt: request.createdAt || new Date().toISOString(),
      comments: request.comments || [],
      ...request,
    };
    this.data.approvalRequests = [newRequest, ...this.data.approvalRequests];
    this.persist();
    return newRequest;
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

  addMediaAsset(asset: DemoStoreData["mediaAssets"][0]) {
    this.data.mediaAssets = [asset, ...this.data.mediaAssets];
    this.persist();
  }

  addInboxMessage(conversationId: string, content: string, senderType: "AGENT" | "CUSTOMER" = "AGENT") {
    let linkedPostId: string | undefined;

    this.data.conversations = this.data.conversations.map((conv) => {
      if (conv.id === conversationId) {
        linkedPostId = conv.postId;
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

    // Also update the linked post's comment thread if replied by AGENT
    if (linkedPostId && senderType === "AGENT") {
      this.data.posts = this.data.posts.map((post) => {
        if (post.id === linkedPostId) {
          const currentComments = post.comments || [];
          const existingComm = currentComments.find(
            (c) => c.id === conversationId || c.id === `comm_${conversationId}`
          );

          if (existingComm) {
            const updatedReplies = [
              ...(existingComm.replies || []),
              {
                id: `rep-${Date.now()}`,
                authorName: "Apex Growth Team",
                content,
                sentAt: new Date().toISOString(),
              },
            ];
            return {
              ...post,
              comments: currentComments.map((c) =>
                c.id === existingComm.id ? { ...c, replies: updatedReplies } : c
              ),
              updatedAt: new Date().toISOString(),
            };
          } else {
            // Append as reply to the latest comment on this post
            if (currentComments.length > 0) {
              const lastIdx = currentComments.length - 1;
              const lastComm = currentComments[lastIdx];
              const updatedReplies = [
                ...(lastComm.replies || []),
                {
                  id: `rep-${Date.now()}`,
                  authorName: "Apex Growth Team",
                  content,
                  sentAt: new Date().toISOString(),
                },
              ];
              const updatedComments = [...currentComments];
              updatedComments[lastIdx] = { ...lastComm, replies: updatedReplies };
              return { ...post, comments: updatedComments, updatedAt: new Date().toISOString() };
            }
          }
        }
        return post;
      });
    }

    this.persist();
  }

  addPostComment(
    postId: string,
    platform: PlatformType,
    authorName: string,
    content: string,
    avatarUrl?: string
  ) {
    const post = this.data.posts.find((p) => p.id === postId);
    const postTitle = post ? post.title : "Social Post";
    const commentId = `comm_${Date.now()}`;
    const newSentAt = new Date().toISOString();

    const newComment = {
      id: commentId,
      platform,
      authorName,
      authorAvatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=182238&color=D4FF32`,
      content,
      sentAt: newSentAt,
      replies: [],
    };

    // 1. Update post comments array
    this.data.posts = this.data.posts.map((p) => {
      if (p.id === postId) {
        const existingComments = p.comments || [];
        return {
          ...p,
          commentsCount: (p.commentsCount || existingComments.length) + 1,
          comments: [newComment, ...existingComments],
          updatedAt: newSentAt,
        };
      }
      return p;
    });

    // 2. Add or prepend to Unified Social Inbox conversations
    const convId = `conv_${Date.now()}`;
    const newConv: InboxConversation = {
      id: convId,
      workspaceId: this.data.activeWorkspaceId,
      brandId: post?.brandId || this.data.activeBrandId,
      socialAccountId: `acc_${platform.toLowerCase()}`,
      platform,
      type: "COMMENT",
      customerName: authorName,
      customerHandle: `@${authorName.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`,
      customerAvatarUrl: newComment.authorAvatar,
      snippet: content,
      isUnread: true,
      isArchived: false,
      sentiment: "LEAD",
      tags: [platform, "Post Comment", "Live Feed"],
      lastActivityAt: newSentAt,
      postId,
      postTitle,
      messages: [
        {
          id: `m_${Date.now()}`,
          senderType: "CUSTOMER",
          senderName: authorName,
          content,
          sentAt: newSentAt,
        },
      ],
    };

    this.data.conversations = [newConv, ...this.data.conversations];
    this.persist();
    return { post, conversation: newConv };
  }

  toggleArchiveConversation(conversationId: string) {
    this.data.conversations = this.data.conversations.map((c) =>
      c.id === conversationId ? { ...c, isArchived: !c.isArchived } : c
    );
    this.persist();
  }

  toggleStarLead(conversationId: string) {
    this.data.conversations = this.data.conversations.map((c) =>
      c.id === conversationId
        ? { ...c, sentiment: c.sentiment === "LEAD" ? "NEUTRAL" : "LEAD" }
        : c
    );
    this.persist();
  }

  markConversationAsRead(conversationId: string) {
    this.data.conversations = this.data.conversations.map((c) =>
      c.id === conversationId ? { ...c, isUnread: false } : c
    );
    this.persist();
  }

  mergeConversations(newConvs: InboxConversation[]) {
    const existingIds = new Set(this.data.conversations.map((c) => c.id));
    const toAdd = newConvs.filter((c) => !existingIds.has(c.id));
    const updated = this.data.conversations.map((c) => {
      const incoming = newConvs.find((n) => n.id === c.id);
      return incoming ? incoming : c;
    });
    this.data.conversations = [...toAdd, ...updated];
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

  updateSocialAccount(accountId: string, updates: Partial<SocialAccount>) {
    this.data.socialAccounts = this.data.socialAccounts.map((acc) => {
      if (acc.id === accountId) {
        return { ...acc, ...updates, lastSyncAt: new Date().toISOString() };
      }
      return acc;
    });
    this.persist();
  }

  connectAccount(
    platform: PlatformType,
    accountName?: string,
    handle?: string,
    avatarUrl?: string,
    accessToken?: string,
    platformAccountId?: string
  ) {
    const existing = this.data.socialAccounts.find(
      (a) => a.platform === platform && a.brandId === this.data.activeBrandId
    );
    if (existing) {
      this.data.socialAccounts = this.data.socialAccounts.map((a) =>
        a.id === existing.id
          ? {
              ...a,
              accountName: accountName || a.accountName,
              handle: handle || a.handle,
              avatarUrl: avatarUrl || a.avatarUrl,
              accessToken: accessToken || a.accessToken,
              platformAccountId: platformAccountId || a.platformAccountId,
              status: "ACTIVE",
              lastSyncAt: new Date().toISOString(),
            }
          : a
      );
    } else {
      const newAcc: SocialAccount = {
        id: `acc-${Date.now()}`,
        workspaceId: this.data.activeWorkspaceId,
        brandId: this.data.activeBrandId,
        platform,
        platformAccountId: platformAccountId || `${platform.toLowerCase()}_${Date.now()}`,
        accountName: accountName || `${platform} Verified Account`,
        handle: handle || `@${platform.toLowerCase()}_account`,
        avatarUrl:
          avatarUrl ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
        accountType: "PAGE",
        status: "ACTIVE",
        lastSyncAt: new Date().toISOString(),
        isDemoAccount: false,
        accessToken,
        capabilities: {
          canPublishText: true,
          canPublishImage: true,
          canPublishVideo: true,
          canReadComments: true,
          canReplyToComments: true,
          canReadMessages: true,
          canSendMessages: true,
          canReadAnalytics: true,
          maxCharacterLimit: 3000,
          supportsHashtags: true,
          supportsCarousel: true,
        },
      };
      this.data.socialAccounts.push(newAcc);
    }
    this.persist();
  }

  updateAccountToken(accountId: string, accessToken: string) {
    this.data.socialAccounts = this.data.socialAccounts.map((a) =>
      a.id === accountId ? { ...a, accessToken } : a
    );
    this.persist();
  }

  disconnectAccount(accountId: string) {
    this.data.socialAccounts = this.data.socialAccounts.filter((a) => a.id !== accountId);
    this.persist();
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.persist();
  }
}

export const demoStore = new DemoStore();

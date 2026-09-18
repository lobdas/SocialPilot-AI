// SocialPilot AI - Domain & Application Types

export type PlatformType =
  | "FACEBOOK"
  | "INSTAGRAM"
  | "LINKEDIN"
  | "X"
  | "THREADS"
  | "PINTEREST"
  | "YOUTUBE"
  | "TIKTOK"
  | "GOOGLE_BUSINESS";

export type ContentStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "SCHEDULED"
  | "PUBLISHING"
  | "PUBLISHED"
  | "FAILED"
  | "CANCELLED";

export type ApprovalState =
  | "PENDING"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED";

export type UserRole =
  | "OWNER"
  | "ADMIN"
  | "CONTENT_MANAGER"
  | "DESIGNER"
  | "CLIENT"
  | "ANALYST";

export interface PlatformCapabilities {
  canPublishText: boolean;
  canPublishImage: boolean;
  canPublishVideo: boolean;
  canReadComments: boolean;
  canReplyToComments: boolean;
  canReadMessages: boolean;
  canSendMessages: boolean;
  canReadAnalytics: boolean;
  maxCharacterLimit: number;
  supportsHashtags: boolean;
  supportsCarousel: boolean;
}

export interface SocialAccount {
  id: string;
  workspaceId: string;
  brandId?: string;
  platform: PlatformType;
  platformAccountId: string;
  accountName: string;
  handle?: string;
  avatarUrl: string;
  accountType?: string;
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
  lastSyncAt: string;
  isDemoAccount: boolean;
  capabilities: PlatformCapabilities;
  accessToken?: string;
}

export interface Brand {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  brandEmail?: string;
  logoUrl?: string;
  websiteUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  tagline?: string;
  description?: string;
  targetAudience?: string;
  brandVoice?: string;
  tone?: string;
  preferredLanguage: string;
  prohibitedClaims?: string;
  approvedExamples?: string;
  faqs?: { question: string; answer: string }[];
}

export interface ContentVariant {
  platform: PlatformType;
  caption: string;
  hashtags: string[];
  ctaText?: string;
  ctaUrl?: string;
  characterCount: number;
}

export interface ContentItem {
  id: string;
  workspaceId: string;
  brandId?: string;
  title: string;
  basePrompt?: string;
  contentType: string;
  status: ContentStatus;
  scheduledAt?: string;
  publishedAt?: string;
  targetPlatforms: PlatformType[];
  variants: Record<PlatformType, ContentVariant>;
  mediaUrls: string[];
  campaignId?: string;
  approvalRequestId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  workspaceId: string;
  brandId?: string;
  name: string;
  objective: "AWARENESS" | "TRAFFIC" | "CONVERSIONS" | "ENGAGEMENT";
  description?: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
  startDate?: string;
  endDate?: string;
  budgetNotes?: string;
  postCount: number;
  publishedCount: number;
}

export interface InboxConversation {
  id: string;
  workspaceId: string;
  socialAccountId: string;
  platform: PlatformType;
  type: "COMMENT" | "DIRECT_MESSAGE" | "MENTION";
  customerName: string;
  customerHandle?: string;
  customerAvatarUrl: string;
  snippet: string;
  isUnread: boolean;
  isArchived: boolean;
  sentiment?: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "LEAD";
  tags: string[];
  lastActivityAt: string;
  assignedTo?: string;
  messages: {
    id: string;
    senderType: "CUSTOMER" | "AGENT" | "AI_DRAFT";
    senderName: string;
    content: string;
    sentAt: string;
    aiSuggested?: boolean;
  }[];
}

export interface ApprovalRequestItem {
  id: string;
  contentId: string;
  clientToken: string;
  state: ApprovalState;
  clientName?: string;
  clientEmail?: string;
  reviewedAt?: string;
  decisionNotes?: string;
  createdAt: string;
  contentTitle: string;
  platforms: PlatformType[];
  comments: {
    id: string;
    authorName: string;
    isExternalClient: boolean;
    message: string;
    createdAt: string;
  }[];
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  industry: string;
  country: string;
  timezone: string;
  language: string;
}

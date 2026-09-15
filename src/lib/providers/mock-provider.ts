import { PlatformCapabilities, PlatformType } from "../types";
import { ISocialProvider, PublishResult } from "./types";

export class MockSocialProvider implements ISocialProvider {
  platform: PlatformType;

  constructor(platform: PlatformType) {
    this.platform = platform;
  }

  getCapabilities(): PlatformCapabilities {
    const caps: Record<PlatformType, PlatformCapabilities> = {
      FACEBOOK: {
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
      INSTAGRAM: {
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
      LINKEDIN: {
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
      X: {
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
      WHATSAPP: {
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
      THREADS: {
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
      PINTEREST: {
        canPublishText: true,
        canPublishImage: true,
        canPublishVideo: true,
        canReadComments: true,
        canReplyToComments: false,
        canReadMessages: false,
        canSendMessages: false,
        canReadAnalytics: true,
        maxCharacterLimit: 500,
        supportsHashtags: true,
        supportsCarousel: false,
      },
      YOUTUBE: {
        canPublishText: true,
        canPublishImage: false,
        canPublishVideo: true,
        canReadComments: true,
        canReplyToComments: true,
        canReadMessages: false,
        canSendMessages: false,
        canReadAnalytics: true,
        maxCharacterLimit: 5000,
        supportsHashtags: true,
        supportsCarousel: false,
      },
      TIKTOK: {
        canPublishText: true,
        canPublishImage: true,
        canPublishVideo: true,
        canReadComments: true,
        canReplyToComments: true,
        canReadMessages: false,
        canSendMessages: false,
        canReadAnalytics: true,
        maxCharacterLimit: 2200,
        supportsHashtags: true,
        supportsCarousel: false,
      },
    };

    return caps[this.platform];
  }

  async connect(authCode: string, redirectUri: string) {
    return {
      accessToken: `mock_token_${this.platform.toLowerCase()}_${Date.now()}`,
      accountId: `mock_acc_${this.platform.toLowerCase()}_1`,
      accountName: `SocialPilot ${this.platform} Channel`,
    };
  }

  async disconnect(accountId: string): Promise<boolean> {
    return true;
  }

  async publishPost(params: {
    accountId: string;
    caption: string;
    mediaUrls?: string[];
    ctaUrl?: string;
  }): Promise<PublishResult> {
    // Validate character limit
    const caps = this.getCapabilities();
    if (params.caption.length > caps.maxCharacterLimit) {
      return {
        success: false,
        errorMessage: `Post exceeds ${this.platform} character limit (${params.caption.length}/${caps.maxCharacterLimit}).`,
        isSimulated: true,
      };
    }

    // Simulate realistic network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const simulatedPostId = `sim_${this.platform.toLowerCase()}_${Date.now()}`;
    return {
      success: true,
      platformPostId: simulatedPostId,
      postUrl: `https://${this.platform.toLowerCase()}.com/p/${simulatedPostId}`,
      isSimulated: true,
    };
  }

  async getComments(accountId: string, postId: string) {
    return [
      { id: "c1", author: "Alex Reed", text: "Excited for this launch! When is it live?", timestamp: new Date().toISOString() },
      { id: "c2", author: "Sarah Jenkins", text: "Does this include Zapier integration?", timestamp: new Date().toISOString() },
    ];
  }

  async replyToComment(accountId: string, commentId: string, message: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  }

  async getMessages(accountId: string) {
    return [];
  }

  async sendMessage(accountId: string, conversationId: string, message: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  }

  async getAnalytics(accountId: string, periodDays: number) {
    return {
      impressions: 48200,
      reach: 34100,
      engagement: 3950,
      followersGained: 420,
    };
  }
}

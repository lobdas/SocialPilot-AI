import { PlatformCapabilities, PlatformType } from "../types";
import {
  ISocialPublishingProvider,
  OAuthTokenResult,
  PublishingRequest,
  PublishingResult,
  PublishingVerificationResult,
} from "./social-publishing-provider";

export class StagedPublishingProvider implements ISocialPublishingProvider {
  readonly platform: PlatformType;

  constructor(platform: PlatformType) {
    this.platform = platform;
  }

  getCapabilities(): PlatformCapabilities {
    return {
      canPublishText: false,
      canPublishImage: false,
      canPublishVideo: false,
      canReadComments: false,
      canReplyToComments: false,
      canReadMessages: false,
      canSendMessages: false,
      canReadAnalytics: false,
      maxCharacterLimit: 500,
      supportsHashtags: true,
      supportsCarousel: false,
    };
  }

  getAuthorizationUrl(): string {
    throw new Error(`Integration for ${this.platform} is currently staged and awaiting official API approval.`);
  }

  async exchangeCode(): Promise<OAuthTokenResult> {
    throw new Error(`OAuth for ${this.platform} is disabled.`);
  }

  async refreshAccessToken(): Promise<OAuthTokenResult> {
    throw new Error(`Token refresh for ${this.platform} is disabled.`);
  }

  async publish(request: PublishingRequest): Promise<PublishingResult> {
    return {
      success: false,
      errorCode: "PROVIDER_STAGED_DISABLED",
      errorMessage: `${this.platform} publishing is currently staged in Tier 2 and disabled in production. Only Facebook, Instagram, and LinkedIn are active.`,
    };
  }

  async verifyStatus(platformPostId: string): Promise<PublishingVerificationResult> {
    return {
      status: "FAILED",
      platformPostId,
      errorMessage: `Verification for ${this.platform} is not available.`,
      verifiedAt: new Date().toISOString(),
    };
  }
}

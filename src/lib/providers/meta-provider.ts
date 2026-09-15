import { PlatformCapabilities, PlatformType } from "../types";
import {
  ISocialPublishingProvider,
  OAuthTokenResult,
  PublishingRequest,
  PublishingResult,
  PublishingVerificationResult,
} from "./social-publishing-provider";
import { EncryptionService } from "../security/encryption";

export class MetaPublishingProvider implements ISocialPublishingProvider {
  readonly platform: PlatformType;

  constructor(platform: "FACEBOOK" | "INSTAGRAM") {
    this.platform = platform;
  }

  getCapabilities(): PlatformCapabilities {
    if (this.platform === "FACEBOOK") {
      return {
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
      };
    }

    return {
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
    };
  }

  getAuthorizationUrl(params: { state: string; redirectUri: string; scopes?: string[] }): string {
    const appId = process.env.META_APP_ID || "MOCK_META_APP_ID";
    const defaultScopes = [
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_posts",
      "instagram_basic",
      "instagram_content_publish",
      "business_management",
    ];
    const scopes = params.scopes || defaultScopes;

    return `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
      params.redirectUri
    )}&state=${encodeURIComponent(params.state)}&scope=${encodeURIComponent(scopes.join(","))}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    if (!appId || !appSecret) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        return {
          accessToken: `demo_meta_token_${Date.now()}`,
          scopes: ["pages_manage_posts", "instagram_content_publish"],
          platformAccountId: "demo_meta_page_id",
          accountName: "Demo Meta Page",
          expiresInSeconds: 5184000,
        };
      }
      throw new Error("META_APP_ID or META_APP_SECRET missing in production environment.");
    }

    const url = `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&client_secret=${appSecret}&code=${code}`;

    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Meta OAuth Exchange Failed: ${data.error?.message || "Unknown error"}`);
    }

    return {
      accessToken: data.access_token,
      scopes: ["pages_manage_posts", "instagram_content_publish"],
      platformAccountId: data.user_id || "meta_user",
      accountName: "Meta Verified Account",
      expiresInSeconds: data.expires_in,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResult> {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !appId) {
      return {
        accessToken: `refreshed_meta_token_${Date.now()}`,
        scopes: [],
        platformAccountId: "demo_acc",
        accountName: "Demo Meta Page",
      };
    }

    const url = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${refreshToken}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Meta Token Refresh Failed: ${data.error?.message}`);
    }

    return {
      accessToken: data.access_token,
      scopes: [],
      platformAccountId: "refreshed_meta_user",
      accountName: "Meta Account",
      expiresInSeconds: data.expires_in,
    };
  }

  async publish(request: PublishingRequest): Promise<PublishingResult> {
    // Decrypt access token if IV is present
    let token = request.encryptedToken;
    if (request.tokenIv && request.tokenAuthTag) {
      try {
        token = EncryptionService.decrypt(request.encryptedToken, request.tokenIv, request.tokenAuthTag);
      } catch (e) {
        return {
          success: false,
          errorCode: "TOKEN_DECRYPTION_FAILED",
          errorMessage: "Failed to decrypt platform access token.",
        };
      }
    }

    // Never fake success in production mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
      if (!process.env.META_APP_ID) {
        return {
          success: false,
          errorCode: "MISSING_PRODUCTION_CREDENTIALS",
          errorMessage: "Meta API credentials not configured in production environment.",
        };
      }

      // Real Facebook Page Post
      if (this.platform === "FACEBOOK") {
        const url = `https://graph.facebook.com/v20.0/${request.accountId}/feed`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: request.caption,
            link: request.ctaUrl,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          return {
            success: false,
            errorCode: data.error?.code?.toString() || "API_ERROR",
            errorMessage: data.error?.message || "Meta API publishing failed.",
            rawResponse: data,
          };
        }

        return {
          success: true,
          platformPostId: data.id,
          postUrl: `https://facebook.com/${data.id}`,
        };
      }

      // Real Instagram Media Container Creation & Publish
      if (this.platform === "INSTAGRAM") {
        if (!request.mediaUrls || request.mediaUrls.length === 0) {
          return {
            success: false,
            errorCode: "MISSING_REQUIRED_MEDIA",
            errorMessage: "Instagram publishing requires at least one image or video URL.",
          };
        }

        // Step 1: Create Container
        const containerUrl = `https://graph.facebook.com/v20.0/${request.accountId}/media`;
        const containerRes = await fetch(containerUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: request.mediaUrls[0],
            caption: request.caption,
          }),
        });

        const containerData = await containerRes.json();
        if (!containerRes.ok || !containerData.id) {
          return {
            success: false,
            errorCode: containerData.error?.code?.toString() || "CONTAINER_ERROR",
            errorMessage: containerData.error?.message || "Failed to create Instagram media container.",
            rawResponse: containerData,
          };
        }

        // Step 2: Publish Container
        const publishUrl = `https://graph.facebook.com/v20.0/${request.accountId}/media_publish`;
        const publishRes = await fetch(publishUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creation_id: containerData.id,
          }),
        });

        const publishData = await publishRes.json();
        if (!publishRes.ok) {
          return {
            success: false,
            errorCode: publishData.error?.code?.toString() || "PUBLISH_ERROR",
            errorMessage: publishData.error?.message || "Failed to publish Instagram container.",
            rawResponse: publishData,
          };
        }

        return {
          success: true,
          platformPostId: publishData.id,
          postUrl: `https://instagram.com/p/${publishData.id}`,
        };
      }
    }

    // Demo Mode Simulation
    await new Promise((r) => setTimeout(r, 600));
    const simulatedId = `${this.platform.toLowerCase()}_post_${Date.now()}`;
    return {
      success: true,
      platformPostId: simulatedId,
      postUrl: `https://${this.platform.toLowerCase()}.com/p/${simulatedId}`,
      isSimulated: true,
    };
  }

  async verifyStatus(platformPostId: string, accessToken: string): Promise<PublishingVerificationResult> {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return {
        status: "CONFIRMED",
        platformPostId,
        verifiedAt: new Date().toISOString(),
      };
    }

    const url = `https://graph.facebook.com/v20.0/${platformPostId}?fields=id,permalink_url`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();

    if (!res.ok) {
      return {
        status: "FAILED",
        platformPostId,
        errorMessage: data.error?.message || "Post not found or deleted on Meta.",
        verifiedAt: new Date().toISOString(),
      };
    }

    return {
      status: "CONFIRMED",
      platformPostId: data.id,
      postUrl: data.permalink_url,
      verifiedAt: new Date().toISOString(),
    };
  }
}

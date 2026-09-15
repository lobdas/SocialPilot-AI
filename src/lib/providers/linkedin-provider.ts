import { PlatformCapabilities, PlatformType } from "../types";
import {
  ISocialPublishingProvider,
  OAuthTokenResult,
  PublishingRequest,
  PublishingResult,
  PublishingVerificationResult,
} from "./social-publishing-provider";
import { EncryptionService } from "../security/encryption";

export class LinkedInPublishingProvider implements ISocialPublishingProvider {
  readonly platform: PlatformType = "LINKEDIN";

  getCapabilities(): PlatformCapabilities {
    return {
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
    };
  }

  getAuthorizationUrl(params: { state: string; redirectUri: string; scopes?: string[] }): string {
    const clientId = process.env.LINKEDIN_CLIENT_ID || "MOCK_LINKEDIN_CLIENT_ID";
    const defaultScopes = ["openid", "profile", "email", "w_member_social", "w_organization_social"];
    const scopes = params.scopes || defaultScopes;

    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      params.redirectUri
    )}&state=${encodeURIComponent(params.state)}&scope=${encodeURIComponent(scopes.join(" "))}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        return {
          accessToken: `demo_linkedin_token_${Date.now()}`,
          scopes: ["w_member_social", "w_organization_social"],
          platformAccountId: "urn:li:organization:demo_org",
          accountName: "Apex Growth Agency (LinkedIn)",
          expiresInSeconds: 5184000,
        };
      }
      throw new Error("LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET missing in production environment.");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`LinkedIn OAuth Failed: ${data.error_description || data.error}`);
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresInSeconds: data.expires_in,
      scopes: ["w_member_social", "w_organization_social"],
      platformAccountId: "urn:li:person:me",
      accountName: "LinkedIn Professional Account",
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResult> {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !clientId || !clientSecret) {
      return {
        accessToken: `refreshed_linkedin_token_${Date.now()}`,
        scopes: [],
        platformAccountId: "urn:li:person:demo",
        accountName: "LinkedIn Account",
      };
    }

    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`LinkedIn Token Refresh Failed: ${data.error_description}`);
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresInSeconds: data.expires_in,
      scopes: [],
      platformAccountId: "urn:li:person:me",
      accountName: "LinkedIn Account",
    };
  }

  async publish(request: PublishingRequest): Promise<PublishingResult> {
    let token = request.encryptedToken;
    if (request.tokenIv && request.tokenAuthTag) {
      try {
        token = EncryptionService.decrypt(request.encryptedToken, request.tokenIv, request.tokenAuthTag);
      } catch (e) {
        return {
          success: false,
          errorCode: "TOKEN_DECRYPTION_FAILED",
          errorMessage: "Failed to decrypt LinkedIn access token.",
        };
      }
    }

    // Strict production guard: Never fake publishing in production mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
      if (!process.env.LINKEDIN_CLIENT_ID) {
        return {
          success: false,
          errorCode: "MISSING_PRODUCTION_CREDENTIALS",
          errorMessage: "LinkedIn API credentials not configured in production environment.",
        };
      }

      // Real LinkedIn Posts API endpoint (LinkedIn v2 / rest / posts)
      const authorUrn = request.accountId.startsWith("urn:li:")
        ? request.accountId
        : `urn:li:organization:${request.accountId}`;

      const payload = {
        author: authorUrn,
        commentary: request.caption,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      };

      const res = await fetch("https://api.linkedin.com/rest/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "LinkedIn-Version": "202401",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return {
          success: false,
          errorCode: res.status.toString(),
          errorMessage: errData.message || "LinkedIn API publishing request failed.",
          rawResponse: errData,
        };
      }

      const postId = res.headers.get("x-restli-id") || `urn:li:share:${Date.now()}`;
      return {
        success: true,
        platformPostId: postId,
        postUrl: `https://linkedin.com/feed/update/${postId}`,
      };
    }

    // Demo Mode Simulation
    await new Promise((r) => setTimeout(r, 650));
    const simulatedId = `urn:li:share:sim_${Date.now()}`;
    return {
      success: true,
      platformPostId: simulatedId,
      postUrl: `https://linkedin.com/feed/update/${simulatedId}`,
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

    const encodedUrn = encodeURIComponent(platformPostId);
    const res = await fetch(`https://api.linkedin.com/rest/posts/${encodedUrn}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    if (!res.ok) {
      return {
        status: "FAILED",
        platformPostId,
        errorMessage: "Post not confirmed on LinkedIn.",
        verifiedAt: new Date().toISOString(),
      };
    }

    return {
      status: "CONFIRMED",
      platformPostId,
      postUrl: `https://linkedin.com/feed/update/${platformPostId}`,
      verifiedAt: new Date().toISOString(),
    };
  }
}

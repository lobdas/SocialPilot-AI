import { PlatformCapabilities, PlatformType } from "../types";
import {
  ISocialPublishingProvider,
  OAuthTokenResult,
  PublishingRequest,
  PublishingResult,
  PublishingVerificationResult,
} from "./social-publishing-provider";
import { EncryptionService } from "../security/encryption";

export class PinterestPublishingProvider implements ISocialPublishingProvider {
  readonly platform: PlatformType = "PINTEREST";

  getCapabilities(): PlatformCapabilities {
    return {
      canPublishText: false,
      canPublishImage: true,       // Pins require an image
      canPublishVideo: true,       // Video Pins
      canReadComments: false,
      canReplyToComments: false,
      canReadMessages: false,
      canSendMessages: false,
      canReadAnalytics: true,     // Saves, impressions, outbound clicks
      maxCharacterLimit: 500,     // Description limit
      supportsHashtags: true,
      supportsCarousel: true,
    };
  }

  getAuthorizationUrl(params: { state: string; redirectUri: string; scopes?: string[] }): string {
    const clientId = process.env.PINTEREST_APP_ID || process.env.PINTEREST_CLIENT_ID || "MOCK_PINTEREST_APP_ID";
    const defaultScopes = [
      "boards:read",
      "pins:read",
      "pins:write",
      "user_accounts:read",
    ];
    const scopes = params.scopes || defaultScopes;

    const query = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: params.redirectUri,
      state: params.state,
      scope: scopes.join(","),
    });

    return `https://www.pinterest.com/oauth/?${query.toString()}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    const clientId = process.env.PINTEREST_APP_ID || process.env.PINTEREST_CLIENT_ID;
    const clientSecret = process.env.PINTEREST_APP_SECRET || process.env.PINTEREST_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        return {
          accessToken: `demo_pinterest_token_${Date.now()}`,
          scopes: ["pins:write", "boards:read"],
          platformAccountId: "pinterest_user_apex",
          accountName: "Apex Growth Agency (Pinterest)",
          handle: "@ApexGrowthBrand",
        };
      }
      throw new Error("PINTEREST_APP_ID and PINTEREST_APP_SECRET are required in environment.");
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenRes = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Pinterest OAuth token exchange failed (${tokenRes.status}): ${errText}`);
    }

    const data = await tokenRes.json();

    // Fetch user account info
    let username = "Pinterest User";
    let userId = "pinterest_account";
    try {
      const uRes = await fetch("https://api.pinterest.com/v5/user_account", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (uRes.ok) {
        const uData = await uRes.json();
        username = uData.username || username;
        userId = uData.id || userId;
      }
    } catch {}

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresInSeconds: data.expires_in,
      scopes: data.scope?.split(",") || ["pins:write"],
      platformAccountId: userId,
      accountName: username,
      handle: `@${username}`,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResult> {
    const clientId = process.env.PINTEREST_APP_ID || process.env.PINTEREST_CLIENT_ID;
    const clientSecret = process.env.PINTEREST_APP_SECRET || process.env.PINTEREST_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return {
        accessToken: `refreshed_demo_pin_token_${Date.now()}`,
        scopes: ["pins:write"],
        platformAccountId: "pinterest_user_apex",
        accountName: "Pinterest Account",
      };
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenRes = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Pinterest token refresh failed (${tokenRes.status}): ${errText}`);
    }

    const data = await tokenRes.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresInSeconds: data.expires_in,
      scopes: data.scope?.split(",") || [],
      platformAccountId: "pinterest_user_apex",
      accountName: "Pinterest Account",
    };
  }

  async publish(request: PublishingRequest): Promise<PublishingResult> {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || request.encryptedToken.startsWith("demo_")) {
      const mockPinId = `pin_${Date.now()}`;
      return {
        success: true,
        platformPostId: mockPinId,
        postUrl: `https://www.pinterest.com/pin/${mockPinId}`,
        isSimulated: true,
      };
    }

    let accessToken = request.encryptedToken;
    if (request.tokenIv && request.tokenAuthTag) {
      try {
        accessToken = EncryptionService.decrypt(request.encryptedToken, request.tokenIv, request.tokenAuthTag);
      } catch (err: any) {
        return {
          success: false,
          errorCode: "DECRYPTION_FAILED",
          errorMessage: "Failed to decrypt Pinterest access token.",
        };
      }
    }

    try {
      const mediaSource = request.mediaUrls?.[0]
        ? {
            source_type: "image_url",
            url: request.mediaUrls[0],
          }
        : undefined;

      if (!mediaSource) {
        return {
          success: false,
          errorCode: "MISSING_MEDIA",
          errorMessage: "Pinterest Pins require an image URL to be published.",
        };
      }

      const title = request.caption.split("\n")[0].substring(0, 95) || "Pin by SocialPilot AI";
      const boardId = request.accountId || process.env.PINTEREST_DEFAULT_BOARD_ID;

      if (!boardId) {
        return {
          success: false,
          errorCode: "MISSING_BOARD_ID",
          errorMessage: "A Pinterest Board ID is required to pin content.",
        };
      }

      const res = await fetch("https://api.pinterest.com/v5/pins", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: request.caption,
          board_id: boardId,
          media_source: mediaSource,
          link: request.ctaUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          errorCode: `PINTEREST_API_${res.status}`,
          errorMessage: data.message || "Failed to publish pin to Pinterest.",
          rawResponse: data,
        };
      }

      const pinId = data.id;
      return {
        success: true,
        platformPostId: pinId,
        postUrl: `https://www.pinterest.com/pin/${pinId}`,
        rawResponse: data,
      };
    } catch (err: any) {
      return {
        success: false,
        errorCode: "NETWORK_ERROR",
        errorMessage: err.message || "Network error while publishing to Pinterest.",
      };
    }
  }

  async verifyStatus(platformPostId: string, accessToken: string): Promise<PublishingVerificationResult> {
    try {
      const res = await fetch(`https://api.pinterest.com/v5/pins/${platformPostId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        return {
          status: "CONFIRMED",
          platformPostId,
          postUrl: `https://www.pinterest.com/pin/${platformPostId}`,
          verifiedAt: new Date().toISOString(),
        };
      }
      return {
        status: "NOT_FOUND",
        platformPostId,
        verifiedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        status: "FAILED",
        platformPostId,
        verifiedAt: new Date().toISOString(),
        errorMessage: err.message,
      };
    }
  }
}

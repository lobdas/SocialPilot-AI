import { PlatformCapabilities, PlatformType } from "../types";
import {
  ISocialPublishingProvider,
  OAuthTokenResult,
  PublishingRequest,
  PublishingResult,
  PublishingVerificationResult,
} from "./social-publishing-provider";
import { EncryptionService } from "../security/encryption";

export class YouTubePublishingProvider implements ISocialPublishingProvider {
  readonly platform: PlatformType = "YOUTUBE";

  getCapabilities(): PlatformCapabilities {
    return {
      canPublishText: false,
      canPublishImage: false,
      canPublishVideo: true,       // YouTube Shorts & Videos
      canReadComments: true,      // YouTube comments
      canReplyToComments: true,
      canReadMessages: false,
      canSendMessages: false,
      canReadAnalytics: true,     // Video views, watch time, likes
      maxCharacterLimit: 5000,    // Description limit
      supportsHashtags: true,
      supportsCarousel: false,
    };
  }

  getAuthorizationUrl(params: { state: string; redirectUri: string; scopes?: string[] }): string {
    const clientId = process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "MOCK_YOUTUBE_CLIENT_ID";
    const defaultScopes = [
      "openid",
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
    ];
    const scopes = params.scopes || defaultScopes;

    const query = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: params.redirectUri,
      state: params.state,
      scope: scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${query.toString()}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    const clientId = process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        return {
          accessToken: `demo_youtube_token_${Date.now()}`,
          scopes: ["https://www.googleapis.com/auth/youtube.upload"],
          platformAccountId: "youtube_channel_apex",
          accountName: "Apex Growth Agency (YouTube Shorts)",
          handle: "@ApexGrowthAgency",
        };
      }
      throw new Error("YOUTUBE_CLIENT_ID (or GOOGLE_CLIENT_ID) and secret are required in environment.");
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`YouTube OAuth token exchange failed (${tokenRes.status}): ${errText}`);
    }

    const data = await tokenRes.json();

    // Fetch Channel info
    let channelName = "YouTube Channel";
    let channelId = "youtube_channel_id";
    try {
      const chRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (chRes.ok) {
        const chData = await chRes.json();
        const chItem = chData.items?.[0];
        if (chItem) {
          channelName = chItem.snippet?.title || channelName;
          channelId = chItem.id || channelId;
        }
      }
    } catch {}

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresInSeconds: data.expires_in,
      scopes: data.scope?.split(" ") || [],
      platformAccountId: channelId,
      accountName: channelName,
      handle: `@${channelName.replace(/\s+/g, "")}`,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResult> {
    const clientId = process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return {
        accessToken: `refreshed_demo_yt_token_${Date.now()}`,
        scopes: ["https://www.googleapis.com/auth/youtube.upload"],
        platformAccountId: "youtube_channel_apex",
        accountName: "YouTube Channel",
      };
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`YouTube OAuth refresh failed (${tokenRes.status}): ${errText}`);
    }

    const data = await tokenRes.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresInSeconds: data.expires_in,
      scopes: data.scope?.split(" ") || [],
      platformAccountId: "youtube_channel_apex",
      accountName: "YouTube Channel",
    };
  }

  async publish(request: PublishingRequest): Promise<PublishingResult> {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || request.encryptedToken.startsWith("demo_")) {
      const mockVideoId = `yt_shorts_${Date.now()}`;
      return {
        success: true,
        platformPostId: mockVideoId,
        postUrl: `https://www.youtube.com/shorts/${mockVideoId}`,
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
          errorMessage: "Failed to decrypt YouTube access token.",
        };
      }
    }

    try {
      const title = request.caption.split("\n")[0].substring(0, 95) || "SocialPilot AI Video";
      const snippet = {
        snippet: {
          title,
          description: request.caption,
          tags: ["shorts", "socialpilot"],
          categoryId: "22", // People & Blogs
        },
        status: {
          privacyStatus: "public",
          selfDeclaredMadeForKids: false,
        },
      };

      const res = await fetch(
        "https://www.googleapis.com/youtube/v3/videos?part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(snippet),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          errorCode: `YOUTUBE_API_${res.status}`,
          errorMessage: data.error?.message || "YouTube API upload dispatch failed.",
          rawResponse: data,
        };
      }

      const videoId = data.id;
      return {
        success: true,
        platformPostId: videoId,
        postUrl: `https://www.youtube.com/watch?v=${videoId}`,
        rawResponse: data,
      };
    } catch (err: any) {
      return {
        success: false,
        errorCode: "NETWORK_ERROR",
        errorMessage: err.message || "Network failure uploading video to YouTube.",
      };
    }
  }

  async verifyStatus(platformPostId: string, accessToken: string): Promise<PublishingVerificationResult> {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=status&id=${platformPostId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const item = data.items?.[0];
        if (item) {
          return {
            status: "CONFIRMED",
            platformPostId,
            postUrl: `https://www.youtube.com/watch?v=${platformPostId}`,
            verifiedAt: new Date().toISOString(),
          };
        }
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

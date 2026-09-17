import { PlatformCapabilities, PlatformType } from "../types";
import {
  ISocialPublishingProvider,
  OAuthTokenResult,
  PublishingRequest,
  PublishingResult,
  PublishingVerificationResult,
} from "./social-publishing-provider";
import { EncryptionService } from "../security/encryption";

export class ThreadsPublishingProvider implements ISocialPublishingProvider {
  readonly platform: PlatformType = "THREADS";

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
      maxCharacterLimit: 500,
      supportsHashtags: true,
      supportsCarousel: true,
    };
  }

  getAuthorizationUrl(params: { state: string; redirectUri: string; scopes?: string[] }): string {
    const appId = process.env.THREADS_APP_ID || process.env.META_APP_ID || "MOCK_THREADS_APP_ID";
    const defaultScopes = [
      "threads_basic",
      "threads_content_publish",
      "threads_manage_insights",
    ];
    const scopes =
      params.scopes ||
      (process.env.THREADS_SCOPES
        ? process.env.THREADS_SCOPES.split(",").map((s) => s.trim())
        : defaultScopes);

    return `https://threads.net/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(
      params.redirectUri
    )}&scope=${encodeURIComponent(scopes.join(","))}&response_type=code&state=${encodeURIComponent(
      params.state
    )}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    const appId = process.env.THREADS_APP_ID || process.env.META_APP_ID;
    const appSecret = process.env.THREADS_APP_SECRET || process.env.META_APP_SECRET;

    if (!appId || !appSecret) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        return {
          accessToken: `demo_threads_token_${Date.now()}`,
          scopes: ["threads_basic", "threads_content_publish"],
          platformAccountId: "demo_threads_user_id",
          accountName: "Demo Threads Creator",
          handle: "@socialpilot_threads",
          expiresInSeconds: 5184000,
        };
      }
      throw new Error("THREADS_APP_ID (or META_APP_ID) and Secret missing in .env.local.");
    }

    // Step 1: Exchange code for short-lived access token
    const tokenParams = new URLSearchParams();
    tokenParams.append("client_id", appId);
    tokenParams.append("client_secret", appSecret);
    tokenParams.append("grant_type", "authorization_code");
    tokenParams.append("redirect_uri", redirectUri);
    tokenParams.append("code", code);

    const tokenRes = await fetch("https://graph.threads.net/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(
        `Threads OAuth Exchange Failed: ${tokenData.error_message || tokenData.error?.message || "Unknown error"}`
      );
    }

    let activeAccessToken = tokenData.access_token;
    let expiresIn = 5184000; // 60 days default for long-lived

    // Step 2: Exchange short-lived token for long-lived 60-day token
    try {
      const longLivedUrl = `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${appSecret}&access_token=${activeAccessToken}`;
      const longLivedRes = await fetch(longLivedUrl);
      if (longLivedRes.ok) {
        const longLivedData = await longLivedRes.json();
        if (longLivedData.access_token) {
          activeAccessToken = longLivedData.access_token;
          if (longLivedData.expires_in) {
            expiresIn = longLivedData.expires_in;
          }
        }
      }
    } catch (llErr) {
      console.warn("Could not upgrade to long-lived Threads token, using short-lived:", llErr);
    }

    // Step 3: Fetch user profile (username, name, avatar)
    let username = "";
    let name = "Threads Account";
    let avatarUrl: string | undefined = undefined;
    const userId = tokenData.user_id ? String(tokenData.user_id) : "me";

    try {
      const meRes = await fetch(
        `https://graph.threads.net/v1.0/me?fields=id,username,name,threads_profile_picture_url&access_token=${activeAccessToken}`
      );
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.username) username = meData.username;
        if (meData.name) name = meData.name;
        if (meData.threads_profile_picture_url) avatarUrl = meData.threads_profile_picture_url;
      }
    } catch (meErr) {
      console.warn("Could not fetch Threads profile details:", meErr);
    }

    return {
      accessToken: activeAccessToken,
      platformAccountId: userId,
      accountName: name || (username ? `@${username}` : "Threads Creator"),
      handle: username ? `@${username}` : undefined,
      avatarUrl,
      expiresInSeconds: expiresIn,
      scopes: ["threads_basic", "threads_content_publish", "threads_read_replies"],
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResult> {
    const appSecret = process.env.THREADS_APP_SECRET || process.env.META_APP_SECRET;

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !appSecret) {
      return {
        accessToken: `refreshed_threads_token_${Date.now()}`,
        scopes: [],
        platformAccountId: "demo_threads_acc",
        accountName: "Threads Account",
      };
    }

    const res = await fetch(
      `https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${refreshToken}`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Threads Token Refresh Failed: ${data.error_message || data.error?.message}`);
    }

    return {
      accessToken: data.access_token,
      expiresInSeconds: data.expires_in,
      scopes: ["threads_basic", "threads_content_publish"],
      platformAccountId: "me",
      accountName: "Threads Account",
    };
  }

  async publish(request: PublishingRequest): Promise<PublishingResult> {
    let token = request.encryptedToken;
    if (request.tokenIv && request.tokenAuthTag) {
      try {
        token = EncryptionService.decrypt(request.encryptedToken, request.tokenIv, request.tokenAuthTag);
      } catch {
        return {
          success: false,
          errorCode: "TOKEN_DECRYPTION_FAILED",
          errorMessage: "Failed to decrypt platform access token.",
        };
      }
    }

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      await new Promise((r) => setTimeout(r, 600));
      const simulatedId = `threads_post_${Date.now()}`;
      return {
        success: true,
        platformPostId: simulatedId,
        postUrl: `https://threads.net/t/${simulatedId}`,
        isSimulated: true,
      };
    }

    const userId = request.accountId || "me";
    const hasMedia = request.mediaUrls && request.mediaUrls.length > 0;

    // Step 1: Create media/text container
    const containerParams = new URLSearchParams();
    containerParams.append("access_token", token);

    if (hasMedia) {
      containerParams.append("media_type", "IMAGE");
      containerParams.append("image_url", request.mediaUrls![0]);
      if (request.caption) containerParams.append("text", request.caption);
    } else {
      containerParams.append("media_type", "TEXT");
      containerParams.append("text", request.caption || "");
    }

    const containerRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: containerParams.toString(),
    });

    const containerData = await containerRes.json();
    if (!containerRes.ok || !containerData.id) {
      return {
        success: false,
        errorMessage: containerData.error?.message || "Failed to create Threads post container.",
      };
    }

    // Step 2: Publish the container
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const publishParams = new URLSearchParams();
    publishParams.append("creation_id", containerData.id);
    publishParams.append("access_token", token);

    const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: publishParams.toString(),
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok || !publishData.id) {
      return {
        success: false,
        errorMessage: publishData.error?.message || "Failed to publish container to Threads.",
      };
    }

    return {
      success: true,
      platformPostId: publishData.id,
      postUrl: "https://www.threads.net",
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

    const url = `https://graph.threads.net/v1.0/${platformPostId}?fields=id,permalink,text&access_token=${accessToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return {
        status: "FAILED",
        platformPostId,
        errorMessage: data.error?.message || "Post not found or deleted on Threads.",
        verifiedAt: new Date().toISOString(),
      };
    }

    return {
      status: "CONFIRMED",
      platformPostId: data.id,
      postUrl: data.permalink || "https://www.threads.net",
      verifiedAt: new Date().toISOString(),
    };
  }
}

import { PlatformCapabilities, PlatformType } from "../types";
import {
  ISocialPublishingProvider,
  OAuthTokenResult,
  PublishingRequest,
  PublishingResult,
  PublishingVerificationResult,
} from "./social-publishing-provider";
import { EncryptionService } from "../security/encryption";

export class XPublishingProvider implements ISocialPublishingProvider {
  readonly platform: PlatformType = "X";

  getCapabilities(): PlatformCapabilities {
    return {
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
    };
  }

  getAuthorizationUrl(params: { state: string; redirectUri: string; scopes?: string[] }): string {
    const clientId = process.env.X_CLIENT_ID || process.env.TWITTER_CLIENT_ID || "MOCK_X_CLIENT_ID";
    const defaultScopes = [
      "tweet.read",
      "tweet.write",
      "users.read",
      "offline.access",
    ];
    const scopes = params.scopes || defaultScopes;

    const query = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: params.redirectUri,
      scope: scopes.join(" "),
      state: params.state,
      code_challenge: "challenge", // PKCE
      code_challenge_method: "plain",
    });

    return `https://twitter.com/i/oauth2/authorize?${query.toString()}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    const clientId = process.env.X_CLIENT_ID || process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.X_CLIENT_SECRET || process.env.TWITTER_CLIENT_SECRET;

    if (!clientId) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        return {
          accessToken: `demo_x_token_${Date.now()}`,
          scopes: ["tweet.read", "tweet.write"],
          platformAccountId: "x_user_apex",
          accountName: "Apex Growth Agency (@ApexGrowth)",
          handle: "@ApexGrowth",
        };
      }
      throw new Error("X_CLIENT_ID (or TWITTER_CLIENT_ID) is required in environment.");
    }

    const basicAuth = clientSecret
      ? Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
      : undefined;

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    if (basicAuth) {
      headers["Authorization"] = `Basic ${basicAuth}`;
    }

    const bodyParams = new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: "challenge",
      client_id: clientId,
    });

    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers,
      body: bodyParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`X OAuth token exchange failed (${tokenRes.status}): ${errText}`);
    }

    const data = await tokenRes.json();

    // Fetch user profile info
    let username = "X User";
    let userId = "x_account";
    try {
      const userRes = await fetch("https://api.twitter.com/2/users/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        username = userData.data?.name || userData.data?.username || "X User";
        userId = userData.data?.id || "x_account";
      }
    } catch {}

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresInSeconds: data.expires_in,
      scopes: data.scope?.split(" ") || ["tweet.read", "tweet.write"],
      platformAccountId: userId,
      accountName: username,
      handle: username.startsWith("@") ? username : `@${username}`,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResult> {
    const clientId = process.env.X_CLIENT_ID || process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.X_CLIENT_SECRET || process.env.TWITTER_CLIENT_SECRET;

    if (!clientId) {
      return {
        accessToken: `refreshed_demo_x_token_${Date.now()}`,
        scopes: ["tweet.read", "tweet.write"],
        platformAccountId: "x_user_apex",
        accountName: "Apex Growth Agency (@ApexGrowth)",
      };
    }

    const basicAuth = clientSecret
      ? Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
      : undefined;

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    if (basicAuth) {
      headers["Authorization"] = `Basic ${basicAuth}`;
    }

    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers,
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        client_id: clientId,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`X OAuth token refresh failed (${tokenRes.status}): ${errText}`);
    }

    const data = await tokenRes.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresInSeconds: data.expires_in,
      scopes: data.scope?.split(" ") || ["tweet.read", "tweet.write"],
      platformAccountId: "x_user_apex",
      accountName: "X Account",
    };
  }

  async publish(request: PublishingRequest): Promise<PublishingResult> {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || request.encryptedToken.startsWith("demo_")) {
      const mockTweetId = `x_tweet_${Date.now()}`;
      return {
        success: true,
        platformPostId: mockTweetId,
        postUrl: `https://x.com/ApexGrowth/status/${mockTweetId}`,
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
          errorMessage: "Failed to decrypt X access token.",
        };
      }
    }

    try {
      const tweetPayload: { text: string } = {
        text: request.caption,
      };

      const res = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tweetPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          errorCode: `X_API_${res.status}`,
          errorMessage: data.detail || data.title || "Failed to publish tweet to X.",
          rawResponse: data,
        };
      }

      const tweetId = data.data?.id;
      return {
        success: true,
        platformPostId: tweetId,
        postUrl: `https://x.com/i/web/status/${tweetId}`,
        rawResponse: data,
      };
    } catch (err: any) {
      return {
        success: false,
        errorCode: "NETWORK_ERROR",
        errorMessage: err.message || "Network error while publishing to X.",
      };
    }
  }

  async verifyStatus(platformPostId: string, accessToken: string): Promise<PublishingVerificationResult> {
    try {
      const res = await fetch(`https://api.twitter.com/2/tweets/${platformPostId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        return {
          status: "CONFIRMED",
          platformPostId,
          postUrl: `https://x.com/i/web/status/${platformPostId}`,
          verifiedAt: new Date().toISOString(),
        };
      }
      return {
        status: "NOT_FOUND",
        platformPostId,
        verifiedAt: new Date().toISOString(),
        errorMessage: `Tweet not found on X (status: ${res.status})`,
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

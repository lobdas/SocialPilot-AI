import { PlatformType } from "../types";
import { MockSocialProvider } from "./mock-provider";
import { MetaPublishingProvider } from "./meta-provider";
import { LinkedInPublishingProvider } from "./linkedin-provider";
import { StagedPublishingProvider } from "./staged-provider";
import { ISocialPublishingProvider } from "./social-publishing-provider";
import { FeatureFlagService } from "../features/feature-flags";

export class ProviderFactory {
  static getPublishingProvider(platform: PlatformType, workspaceId?: string): ISocialPublishingProvider {
    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    if (isDemo) {
      // Return typed wrapper around Mock provider for demo mode
      return {
        platform,
        getCapabilities: () => new MockSocialProvider(platform).getCapabilities(),
        getAuthorizationUrl: () => `https://socialpilot.ai/demo-oauth?platform=${platform}`,
        exchangeCode: async () => ({
          accessToken: `demo_${platform.toLowerCase()}_token`,
          scopes: ["publish"],
          platformAccountId: `demo_${platform.toLowerCase()}_acc`,
          accountName: `Demo ${platform} Channel`,
        }),
        refreshAccessToken: async () => ({
          accessToken: `refreshed_demo_${platform.toLowerCase()}_token`,
          scopes: ["publish"],
          platformAccountId: `demo_${platform.toLowerCase()}_acc`,
          accountName: `Demo ${platform} Channel`,
        }),
        publish: async (req) => {
          const res = await new MockSocialProvider(platform).publishPost(req);
          return {
            success: res.success,
            platformPostId: res.platformPostId,
            postUrl: res.postUrl,
            errorMessage: res.errorMessage,
            isSimulated: true,
          };
        },
        verifyStatus: async (id) => ({
          status: "CONFIRMED",
          platformPostId: id,
          verifiedAt: new Date().toISOString(),
        }),
      };
    }

    // Production Provider Resolution
    const isEnabled = FeatureFlagService.isPlatformEnabled(platform, workspaceId);
    if (!isEnabled) {
      return new StagedPublishingProvider(platform);
    }

    switch (platform) {
      case "FACEBOOK":
        return new MetaPublishingProvider("FACEBOOK");
      case "INSTAGRAM":
        return new MetaPublishingProvider("INSTAGRAM");
      case "LINKEDIN":
        return new LinkedInPublishingProvider();
      default:
        return new StagedPublishingProvider(platform);
    }
  }

  static getProvider(platform: PlatformType, useMock = true): any {
    return new MockSocialProvider(platform);
  }

  static getAllCapabilities(): Record<PlatformType, any> {
    const platforms: PlatformType[] = [
      "FACEBOOK",
      "INSTAGRAM",
      "LINKEDIN",
      "X",
      "WHATSAPP",
      "THREADS",
      "PINTEREST",
      "YOUTUBE",
      "TIKTOK",
    ];

    const result: any = {};
    for (const p of platforms) {
      const provider = this.getPublishingProvider(p);
      result[p] = provider.getCapabilities();
    }
    return result;
  }
}

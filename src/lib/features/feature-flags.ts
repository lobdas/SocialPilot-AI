import { PlatformType } from "../types";

export interface FeatureFlagDefinition {
  key: string;
  defaultEnabled: boolean;
  description: string;
}

export const PLATFORM_FLAGS: Record<PlatformType, string> = {
  FACEBOOK: "FEATURE_FACEBOOK",
  INSTAGRAM: "FEATURE_INSTAGRAM",
  LINKEDIN: "FEATURE_LINKEDIN",
  X: "FEATURE_X",
  WHATSAPP: "FEATURE_WHATSAPP",
  THREADS: "FEATURE_THREADS",
  PINTEREST: "FEATURE_PINTEREST",
  YOUTUBE: "FEATURE_YOUTUBE",
  TIKTOK: "FEATURE_TIKTOK",
};

// Default platform implementation readiness
export const DEFAULT_PLATFORM_STATUS: Record<PlatformType, boolean> = {
  FACEBOOK: true,    // Production Ready Tier 1
  INSTAGRAM: true,   // Production Ready Tier 1
  LINKEDIN: true,    // Production Ready Tier 1
  X: false,          // Staged / Modular
  WHATSAPP: false,   // Staged (Dedicated Messaging)
  THREADS: false,    // Staged
  PINTEREST: false,  // Staged
  YOUTUBE: false,    // Staged
  TIKTOK: false,     // Staged
};

export class FeatureFlagService {
  /**
   * Checks if a platform channel is enabled for publishing in this workspace
   */
  static isPlatformEnabled(platform: PlatformType, workspaceId?: string): boolean {
    // In Demo Mode, all platforms can be previewed/simulated
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return true;
    }

    // Check environment variable override (e.g. FEATURE_LINKEDIN=true)
    const envKey = PLATFORM_FLAGS[platform];
    if (process.env[envKey] !== undefined) {
      return process.env[envKey] === "true";
    }

    return DEFAULT_PLATFORM_STATUS[platform];
  }

  /**
   * Returns complete platform readiness dictionary
   */
  static getPlatformStatusMap(): Record<PlatformType, { enabled: boolean; tier: 1 | 2; statusText: string }> {
    return {
      FACEBOOK: { enabled: true, tier: 1, statusText: "Production Ready" },
      INSTAGRAM: { enabled: true, tier: 1, statusText: "Production Ready" },
      LINKEDIN: { enabled: true, tier: 1, statusText: "Production Ready" },
      X: { enabled: false, tier: 2, statusText: "Staged (Feature Flagged)" },
      WHATSAPP: { enabled: false, tier: 2, statusText: "Staged (Requires Cloud API Setup)" },
      THREADS: { enabled: false, tier: 2, statusText: "Staged (Coming Soon)" },
      PINTEREST: { enabled: false, tier: 2, statusText: "Staged (Coming Soon)" },
      YOUTUBE: { enabled: false, tier: 2, statusText: "Staged (Coming Soon)" },
      TIKTOK: { enabled: false, tier: 2, statusText: "Staged (Coming Soon)" },
    };
  }
}

import { PlatformCapabilities, PlatformType } from "../types";

export interface PublishingRequest {
  accountId: string;
  encryptedToken: string;
  tokenIv?: string;
  tokenAuthTag?: string;
  caption: string;
  mediaUrls?: string[];
  ctaUrl?: string;
  idempotencyKey?: string;
}

export interface PublishingResult {
  success: boolean;
  platformPostId?: string;
  postUrl?: string;
  errorCode?: string;
  errorMessage?: string;
  isSimulated?: boolean;
  rawResponse?: any;
}

export interface PublishingVerificationResult {
  status: "CONFIRMED" | "PENDING" | "FAILED" | "NOT_FOUND";
  platformPostId: string;
  postUrl?: string;
  verifiedAt: string;
  errorMessage?: string;
}

export interface OAuthTokenResult {
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds?: number;
  scopes: string[];
  platformAccountId: string;
  accountName: string;
}

export interface ISocialPublishingProvider {
  readonly platform: PlatformType;
  getCapabilities(): PlatformCapabilities;
  getAuthorizationUrl(params: { state: string; redirectUri: string; scopes?: string[] }): string;
  exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult>;
  refreshAccessToken(refreshToken: string): Promise<OAuthTokenResult>;
  publish(request: PublishingRequest): Promise<PublishingResult>;
  verifyStatus(platformPostId: string, accessToken: string): Promise<PublishingVerificationResult>;
}

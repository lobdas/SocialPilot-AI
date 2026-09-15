import { PlatformCapabilities, PlatformType } from "../types";

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  postUrl?: string;
  errorMessage?: string;
  isSimulated?: boolean;
}

export interface ISocialProvider {
  platform: PlatformType;
  getCapabilities(): PlatformCapabilities;
  connect(authCode: string, redirectUri: string): Promise<{ accessToken: string; accountId: string; accountName: string }>;
  disconnect(accountId: string): Promise<boolean>;
  publishPost(params: {
    accountId: string;
    caption: string;
    mediaUrls?: string[];
    ctaUrl?: string;
  }): Promise<PublishResult>;
  getComments(accountId: string, postId: string): Promise<any[]>;
  replyToComment(accountId: string, commentId: string, message: string): Promise<boolean>;
  getMessages(accountId: string): Promise<any[]>;
  sendMessage(accountId: string, conversationId: string, message: string): Promise<boolean>;
  getAnalytics(accountId: string, periodDays: number): Promise<any>;
}

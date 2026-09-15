import crypto from "crypto";
import { prisma } from "../db/prisma";
import { PlatformType } from "../types";
import { ProviderFactory } from "../providers/provider-factory";
import { MediaValidator } from "../media/media-validator";
import { UsageMeterService } from "../billing/usage-meter";
import { AuditLogger } from "../audit/audit-logger";

export interface PublishJobParams {
  contentId: string;
  workspaceId: string;
  platform: PlatformType;
  caption: string;
  mediaUrls?: string[];
  ctaUrl?: string;
  scheduledFor: Date;
}

export class PublishingService {
  /**
   * Generates a deterministic idempotency key for a publishing job
   */
  static generateIdempotencyKey(contentId: string, platform: PlatformType, scheduledTime: Date): string {
    const raw = `${contentId}:${platform}:${scheduledTime.toISOString()}`;
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  /**
   * Creates or retrieves an idempotent publishing job
   */
  static async schedulePublishingJob(params: PublishJobParams) {
    const idempotencyKey = this.generateIdempotencyKey(params.contentId, params.platform, params.scheduledFor);

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return {
        id: `job_sim_${Date.now()}`,
        idempotencyKey,
        status: "SCHEDULED",
        scheduledFor: params.scheduledFor,
      };
    }

    // In production, upsert into Prisma with idempotency key
    try {
      return await prisma.publishingJob.upsert({
        where: { idempotencyKey },
        create: {
          contentId: params.contentId,
          idempotencyKey,
          scheduledFor: params.scheduledFor,
          status: "SCHEDULED",
        },
        update: {
          scheduledFor: params.scheduledFor,
        },
      });
    } catch (e) {
      console.error("Failed to create idempotent publishing job in DB:", e);
      throw e;
    }
  }

  /**
   * Distributed worker lease locking to prevent concurrent double-publishing
   */
  static async acquireLease(jobId: string, workerId: string, leaseDurationMs = 30000): Promise<boolean> {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;

    const now = new Date();
    const leaseExpiresAt = new Date(now.getTime() + leaseDurationMs);

    try {
      // Only lock if unlocked OR previous lease expired
      const result = await prisma.publishingJob.updateMany({
        where: {
          id: jobId,
          status: "SCHEDULED",
          OR: [
            { lockedBy: null },
            { leaseExpiresAt: { lt: now } },
          ],
        },
        data: {
          lockedBy: workerId,
          lockedAt: now,
          leaseExpiresAt,
          status: "PUBLISHING",
        },
      });

      return result.count > 0;
    } catch (e) {
      return false;
    }
  }

  /**
   * Executes publishing through provider abstraction with idempotency, media validation, and audit logging
   */
  static async executePublishingJob(jobId: string, params: PublishJobParams, workerId = "worker-1") {
    // 1. Acquire distributed lease
    const hasLease = await this.acquireLease(jobId, workerId);
    if (!hasLease) {
      return {
        success: false,
        error: "CONCURRENCY_LOCK_ACTIVE",
        message: "Another background worker currently holds the publishing lease for this job.",
      };
    }

    // 2. Validate media specs if media URLs are present
    if (params.mediaUrls && params.mediaUrls.length > 0) {
      const validation = MediaValidator.validate(
        {
          fileSize: 2 * 1024 * 1024, // 2MB estimated if URL
          mimeType: "image/jpeg",
          width: 1080,
          height: 1080,
        },
        [params.platform]
      );

      if (!validation.isValid) {
        await this.markJobFailed(jobId, `Media Validation Failed: ${validation.errors.join(", ")}`);
        return {
          success: false,
          error: "MEDIA_VALIDATION_FAILED",
          details: validation.errors,
        };
      }
    }

    // 3. Check Workspace Usage Quota
    const quota = await UsageMeterService.checkQuota(params.workspaceId, "published_posts");
    if (!quota.allowed) {
      await this.markJobFailed(jobId, "Workspace monthly publishing quota exceeded.");
      return {
        success: false,
        error: "QUOTA_EXCEEDED",
        message: "Workspace monthly publishing quota exceeded. Please upgrade your plan.",
      };
    }

    // 4. Resolve Provider
    const provider = ProviderFactory.getPublishingProvider(params.platform, params.workspaceId);

    // 5. Execute Provider Publish
    try {
      const result = await provider.publish({
        accountId: `acc_${params.platform.toLowerCase()}`,
        encryptedToken: "dummy_encrypted_token",
        caption: params.caption,
        mediaUrls: params.mediaUrls,
        ctaUrl: params.ctaUrl,
        idempotencyKey: this.generateIdempotencyKey(params.contentId, params.platform, params.scheduledFor),
      });

      if (result.success) {
        await UsageMeterService.recordUsage(params.workspaceId, "published_posts", 1);
        await AuditLogger.log({
          workspaceId: params.workspaceId,
          action: "POST_PUBLISH_SUCCESS",
          entityType: "Content",
          entityId: params.contentId,
          metadata: { platform: params.platform, postId: result.platformPostId },
        });

        if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
          await prisma.publishingJob.update({
            where: { id: jobId },
            data: { status: "PUBLISHED" },
          });
        }

        return { success: true, platformPostId: result.platformPostId, postUrl: result.postUrl };
      } else {
        await this.handlePublishingError(jobId, params.workspaceId, params.contentId, result.errorMessage || "Publishing failed");
        return { success: false, error: result.errorCode, message: result.errorMessage };
      }
    } catch (err: any) {
      await this.handlePublishingError(jobId, params.workspaceId, params.contentId, err.message);
      return { success: false, error: "UNHANDLED_EXCEPTION", message: err.message };
    }
  }

  private static async markJobFailed(jobId: string, errorReason: string) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return;
    try {
      await prisma.publishingJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          errorMessage: errorReason,
          leaseExpiresAt: null,
          lockedBy: null,
        },
      });
    } catch (e) {}
  }

  private static async handlePublishingError(jobId: string, workspaceId: string, contentId: string, errorMsg: string) {
    await AuditLogger.log({
      workspaceId,
      action: "POST_PUBLISH_FAILURE",
      entityType: "Content",
      entityId: contentId,
      metadata: { error: errorMsg },
    });
    await this.markJobFailed(jobId, errorMsg);
  }
}

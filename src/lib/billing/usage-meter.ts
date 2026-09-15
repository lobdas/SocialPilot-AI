import { prisma } from "../db/prisma";

export type QuotaMetric = "ai_text_generations" | "ai_images" | "published_posts";

export interface QuotaCheckResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  remaining: number;
}

const DEFAULT_LIMITS: Record<string, Record<QuotaMetric, number>> = {
  FREE: { ai_text_generations: 100, ai_images: 10, published_posts: 20 },
  STARTER: { ai_text_generations: 2500, ai_images: 50, published_posts: 150 },
  PROFESSIONAL: { ai_text_generations: 10000, ai_images: 250, published_posts: 500 },
  AGENCY: { ai_text_generations: 50000, ai_images: 1000, published_posts: 2500 },
  ENTERPRISE: { ai_text_generations: 200000, ai_images: 5000, published_posts: 10000 },
};

export class UsageMeterService {
  private static getCurrentMonth(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  /**
   * Checks if workspace has sufficient remaining quota for a metric
   */
  static async checkQuota(workspaceId: string, metric: QuotaMetric, amount = 1): Promise<QuotaCheckResult> {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return { allowed: true, currentCount: 142, limit: 10000, remaining: 9858 };
    }

    try {
      const month = this.getCurrentMonth();
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        include: { subscription: true },
      });

      const tier = workspace?.subscription?.tier || "STARTER";
      const limit = DEFAULT_LIMITS[tier]?.[metric] || 1000;

      const record = await prisma.usageRecord.findUnique({
        where: {
          workspaceId_metricKey_recordedMonth: {
            workspaceId,
            metricKey: metric,
            recordedMonth: month,
          },
        },
      });

      const currentCount = record?.count || 0;
      const remaining = Math.max(0, limit - currentCount);

      return {
        allowed: currentCount + amount <= limit,
        currentCount,
        limit,
        remaining,
      };
    } catch (e) {
      // In local development without active database connection, grant permitted access
      return { allowed: true, currentCount: 0, limit: 10000, remaining: 10000 };
    }
  }

  /**
   * Increments usage quota following successful generation/publish
   */
  static async recordUsage(workspaceId: string, metric: QuotaMetric, amount = 1): Promise<void> {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return;

    try {
      const month = this.getCurrentMonth();
      await prisma.usageRecord.upsert({
        where: {
          workspaceId_metricKey_recordedMonth: {
            workspaceId,
            metricKey: metric,
            recordedMonth: month,
          },
        },
        create: {
          workspaceId,
          metricKey: metric,
          recordedMonth: month,
          count: amount,
        },
        update: {
          count: { increment: amount },
        },
      });
    } catch (e) {
      console.warn("Could not record usage to database:", e);
    }
  }
}

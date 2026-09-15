import { prisma } from "../db/prisma";

export interface AuditLogEntry {
  workspaceId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export class AuditLogger {
  /**
   * Logs a security or operational event to the audit trail
   */
  static async log(entry: AuditLogEntry): Promise<void> {
    const timestamp = new Date().toISOString();

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // In demo mode, record cleanly
      console.log(`[AUDIT LOG] ${timestamp} | [${entry.action}] Workspace: ${entry.workspaceId} | Entity: ${entry.entityType}:${entry.entityId}`);
      return;
    }

    try {
      await prisma.auditLog.create({
        data: {
          workspaceId: entry.workspaceId,
          userId: entry.userId,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
          ipAddress: entry.ipAddress,
        },
      });
    } catch (e) {
      console.error("Failed to write to AuditLog table:", e);
    }
  }
}

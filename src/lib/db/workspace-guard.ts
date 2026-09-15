import { prisma } from "./prisma";

export class WorkspaceGuard {
  /**
   * Asserts that an entity belongs to the requesting workspace before proceeding
   */
  static async assertContentAccess(contentId: string, workspaceId: string) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;

    const content = await prisma.content.findFirst({
      where: { id: contentId, workspaceId },
      select: { id: true },
    });

    if (!content) {
      throw new Error("Unauthorized: Content does not exist or does not belong to this workspace.");
    }
    return true;
  }

  /**
   * Asserts that a social account belongs to the requesting workspace
   */
  static async assertSocialAccountAccess(accountId: string, workspaceId: string) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;

    const account = await prisma.socialAccount.findFirst({
      where: { id: accountId, workspaceId },
      select: { id: true },
    });

    if (!account) {
      throw new Error("Unauthorized: Social account does not belong to this workspace.");
    }
    return true;
  }

  /**
   * Asserts that a conversation thread belongs to the requesting workspace
   */
  static async assertConversationAccess(conversationId: string, workspaceId: string) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;

    const conv = await prisma.conversation.findFirst({
      where: { id: conversationId, workspaceId },
      select: { id: true },
    });

    if (!conv) {
      throw new Error("Unauthorized: Conversation does not belong to this workspace.");
    }
    return true;
  }
}

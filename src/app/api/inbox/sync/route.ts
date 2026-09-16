import { NextRequest, NextResponse } from "next/server";
import { InboxConversation } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryToken = searchParams.get("token");
    const queryAccountId = searchParams.get("accountId");

    const token = queryToken || req.cookies.get("token_facebook")?.value;
    const accountId = queryAccountId || req.cookies.get("page_id_facebook")?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        error: "Facebook Access Token not found. Please connect Facebook in Social Accounts.",
      });
    }

    let pageId = accountId;
    let pageToken = token;

    // 1. Auto-resolve real Page ID and Page Access Token
    try {
      const accountsRes = await fetch(
        `https://graph.facebook.com/v20.0/me/accounts?access_token=${token}`
      );
      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        if (accountsData.data && accountsData.data.length > 0) {
          const matched =
            accountsData.data.find(
              (p: any) => p.id === accountId || p.name === "জীবন তরী"
            ) || accountsData.data[0];
          pageId = matched.id;
          pageToken = matched.access_token || token;
        }
      } else {
        const meRes = await fetch(
          `https://graph.facebook.com/v20.0/me?fields=id,name&access_token=${token}`
        );
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.id) {
            pageId = meData.id;
          }
        }
      }
    } catch (e) {
      console.warn("Could not auto-resolve page accounts for inbox sync:", e);
    }

    if (!pageId) {
      return NextResponse.json({
        success: false,
        error: "Could not find any Facebook Page associated with this token.",
      });
    }

    // 2. Fetch Feed posts and Photos with comments
    const feedUrl = `https://graph.facebook.com/v20.0/${pageId}/feed?fields=id,message,created_time,comments{id,message,from,created_time}&limit=25&access_token=${pageToken}`;
    const photosUrl = `https://graph.facebook.com/v20.0/${pageId}/photos?fields=id,name,created_time,comments{id,message,from,created_time}&limit=25&access_token=${pageToken}`;

    const [feedRes, photosRes] = await Promise.all([
      fetch(feedUrl),
      fetch(photosUrl),
    ]);

    const items: any[] = [];

    if (feedRes && feedRes.ok) {
      const feedData = await feedRes.json();
      if (feedData.data) items.push(...feedData.data);
    } else if (feedRes) {
      const err = await feedRes.json().catch(() => ({}));
      console.warn("[Inbox Sync] Feed fetch error:", err);
    }

    if (photosRes && photosRes.ok) {
      const photosData = await photosRes.json();
      if (photosData.data) items.push(...photosData.data);
    } else if (photosRes) {
      const err = await photosRes.json().catch(() => ({}));
      console.warn("[Inbox Sync] Photos fetch error:", err);
    }

    // Deduplicate items by ID
    const seenPostIds = new Set<string>();
    const uniqueItems = items.filter((item) => {
      if (seenPostIds.has(item.id)) return false;
      seenPostIds.add(item.id);
      return true;
    });

    const liveConversations: InboxConversation[] = [];

    for (const post of uniqueItems) {
      if (!post.comments?.data) continue;

      const postTitle = (post.message || post.name || "Facebook Post").slice(0, 45) + "...";

      for (const comment of post.comments.data) {
        const commentAuthor = comment.from?.name || "Facebook User";
        const commentText = comment.message || "";
        const commentTime = comment.created_time || new Date().toISOString();

        // Check if there are existing replies to this comment
        const subReplies: any[] = comment.comments?.data || [];

        const messages = [
          {
            id: `msg_${comment.id}`,
            senderType: "CUSTOMER" as const,
            senderName: commentAuthor,
            content: commentText,
            sentAt: commentTime,
          },
          ...subReplies.map((r: any) => ({
            id: `msg_${r.id}`,
            senderType: (r.from?.id === pageId ? "AGENT" : "CUSTOMER") as "AGENT" | "CUSTOMER",
            senderName: r.from?.name || (r.from?.id === pageId ? "জীবন তরী" : "Facebook User"),
            content: r.message,
            sentAt: r.created_time || new Date().toISOString(),
          })),
        ];

        liveConversations.push({
          id: `fb_${comment.id}`,
          workspaceId: "ws-1",
          socialAccountId: pageId,
          platform: "FACEBOOK",
          type: "COMMENT",
          customerName: commentAuthor,
          customerHandle: `@${commentAuthor.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`,
          customerAvatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            commentAuthor
          )}&background=1877F2&color=fff`,
          snippet: commentText,
          isUnread: subReplies.length === 0,
          isArchived: false,
          sentiment: "LEAD",
          tags: ["Facebook Comment", "Live"],
          lastActivityAt: messages[messages.length - 1].sentAt,
          messages,
        });
      }
    }

    return NextResponse.json({
      success: true,
      conversations: liveConversations,
      count: liveConversations.length,
      pageId,
    });
  } catch (err: any) {
    console.error("Inbox sync error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sync inbox" },
      { status: 500 }
    );
  }
}

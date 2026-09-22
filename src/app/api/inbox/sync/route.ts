import { NextRequest, NextResponse } from "next/server";
import { InboxConversation } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryToken = searchParams.get("token");
    const queryAccountId = searchParams.get("accountId");
    const platform = searchParams.get("platform")?.toUpperCase();

    const token = queryToken || req.cookies.get("token_facebook")?.value;
    const accountId = queryAccountId || req.cookies.get("page_id_facebook")?.value;

    const liveConversations: InboxConversation[] = [];
    const stats: Record<string, number> = {
      FACEBOOK: 0,
      INSTAGRAM: 0,
      YOUTUBE: 0,
    };

    // If Facebook / Meta token is provided, sync live Facebook Page comments & Instagram comments
    if (token) {
      let pageId = accountId;
      let pageToken = token;
      let instagramId: string | null = null;

      // 1. Auto-resolve real Page ID, Page Access Token, and linked Instagram Business ID
      try {
        const accountsRes = await fetch(
          `https://graph.facebook.com/v20.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${token}`
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
            if (matched.instagram_business_account?.id) {
              instagramId = matched.instagram_business_account.id;
            }
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

      // 2. Fetch Facebook Page Feed & Photos with comments
      if (pageId && (!platform || platform === "FACEBOOK" || platform === "ALL")) {
        try {
          const feedUrl = `https://graph.facebook.com/v20.0/${pageId}/feed?fields=id,message,created_time,comments{id,message,from,created_time,comments{id,message,from,created_time}}&limit=25&access_token=${pageToken}`;
          const photosUrl = `https://graph.facebook.com/v20.0/${pageId}/photos?fields=id,name,created_time,comments{id,message,from,created_time,comments{id,message,from,created_time}}&limit=25&access_token=${pageToken}`;

          const [feedRes, photosRes] = await Promise.all([
            fetch(feedUrl),
            fetch(photosUrl),
          ]);

          const items: any[] = [];

          if (feedRes && feedRes.ok) {
            const feedData = await feedRes.json();
            if (feedData.data) items.push(...feedData.data);
          }
          if (photosRes && photosRes.ok) {
            const photosData = await photosRes.json();
            if (photosData.data) items.push(...photosData.data);
          }

          const seenPostIds = new Set<string>();
          const uniqueItems = items.filter((item) => {
            if (seenPostIds.has(item.id)) return false;
            seenPostIds.add(item.id);
            return true;
          });

          for (const post of uniqueItems) {
            if (!post.comments?.data) continue;
            const postTitle = (post.message || post.name || "Facebook Post").slice(0, 50) + "...";

            for (const comment of post.comments.data) {
              const commentAuthor = comment.from?.name || "Facebook User";
              const commentText = comment.message || "";
              const commentTime = comment.created_time || new Date().toISOString();
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
                  senderName: r.from?.name || (r.from?.id === pageId ? "SocialPilot Team" : "Facebook User"),
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
                postId: post.id,
                postTitle,
                platformCommentId: comment.id,
                messages,
              });
              stats.FACEBOOK = (stats.FACEBOOK || 0) + 1;
            }
          }
        } catch (fbErr) {
          console.warn("[Inbox Sync] Error syncing Facebook feed:", fbErr);
        }
      }

      // 3. Fetch Instagram Comments if Instagram Business Account is attached
      if (instagramId && (!platform || platform === "INSTAGRAM" || platform === "ALL")) {
        try {
          const igMediaUrl = `https://graph.facebook.com/v20.0/${instagramId}/media?fields=id,caption,permalink,comments{id,text,from,timestamp,replies{id,text,from,timestamp}}&limit=25&access_token=${pageToken}`;
          const igRes = await fetch(igMediaUrl);
          if (igRes.ok) {
            const igData = await igRes.json();
            if (igData.data) {
              for (const media of igData.data) {
                if (!media.comments?.data) continue;
                const postTitle = (media.caption || "Instagram Post").slice(0, 50) + "...";

                for (const comment of media.comments.data) {
                  const commentAuthor = comment.from?.username || "Instagram User";
                  const commentText = comment.text || "";
                  const commentTime = comment.timestamp || new Date().toISOString();
                  const subReplies: any[] = comment.replies?.data || [];

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
                      senderType: "AGENT" as const,
                      senderName: "SocialPilot Team",
                      content: r.text,
                      sentAt: r.timestamp || new Date().toISOString(),
                    })),
                  ];

                  liveConversations.push({
                    id: `ig_${comment.id}`,
                    workspaceId: "ws-1",
                    socialAccountId: instagramId,
                    platform: "INSTAGRAM",
                    type: "COMMENT",
                    customerName: commentAuthor,
                    customerHandle: `@${commentAuthor}`,
                    customerAvatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      commentAuthor
                    )}&background=E4405F&color=fff`,
                    snippet: commentText,
                    isUnread: subReplies.length === 0,
                    isArchived: false,
                    sentiment: "LEAD",
                    tags: ["Instagram Comment", "Live"],
                    lastActivityAt: messages[messages.length - 1].sentAt,
                    postId: media.id,
                    postTitle,
                    postUrl: media.permalink,
                    platformCommentId: comment.id,
                    messages,
                  });
                  stats.INSTAGRAM = (stats.INSTAGRAM || 0) + 1;
                }
              }
            }
          }
        } catch (igErr) {
          console.warn("[Inbox Sync] Error syncing Instagram:", igErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      conversations: liveConversations,
      count: liveConversations.length,
      stats,
      message:
        liveConversations.length > 0
          ? `Successfully synced ${liveConversations.length} live comment(s) across connected channels!`
          : "Channels checked: All live comments up to date.",
    });
  } catch (err: any) {
    console.error("Inbox sync error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sync inbox" },
      { status: 500 }
    );
  }
}

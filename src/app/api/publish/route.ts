import { NextRequest, NextResponse } from "next/server";
import { PlatformType } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, caption, mediaUrls, accountId, accessToken } = body as {
      platform: PlatformType;
      caption: string;
      mediaUrls?: string[];
      accountId?: string;
      accessToken?: string;
    };

    if (!platform) {
      return NextResponse.json(
        { success: false, error: "Missing platform parameter" },
        { status: 400 }
      );
    }

    const platformKey = platform.toLowerCase();
    const rawToken = accessToken || req.cookies.get(`token_${platformKey}`)?.value;
    const rawPageId = accountId || req.cookies.get(`page_id_${platformKey}`)?.value;

    // Facebook / Meta Publishing
    if (platform === "FACEBOOK") {
      if (!rawToken) {
        return NextResponse.json({
          success: false,
          live: false,
          requiresToken: true,
          error:
            "Facebook Access Token missing. Please paste your token in Social Accounts (under pencil icon).",
        });
      }

      let activePageId = rawPageId;
      let activePageToken = rawToken;

      // 1. Auto-resolve real numeric Page ID and Page Access Token from Graph API
      try {
        // Check /me/accounts (works when token is a User Token)
        const accountsRes = await fetch(
          `https://graph.facebook.com/v20.0/me/accounts?access_token=${rawToken}`
        );
        if (accountsRes.ok) {
          const accountsData = await accountsRes.json();
          if (accountsData.data && accountsData.data.length > 0) {
            // Match page by name or id, or fallback to first managed page
            const matched =
              accountsData.data.find(
                (p: any) => p.id === rawPageId || p.name === "জীবন তরী"
              ) || accountsData.data[0];

            activePageId = matched.id;
            activePageToken = matched.access_token || rawToken;
            console.log(
              `[Publish API] Auto-resolved Page: "${matched.name}" (ID: ${activePageId})`
            );
          }
        } else {
          // Token might already be a Page Access Token, query /me
          const meRes = await fetch(
            `https://graph.facebook.com/v20.0/me?fields=id,name&access_token=${rawToken}`
          );
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData.id) {
              activePageId = meData.id;
              activePageToken = rawToken;
              console.log(
                `[Publish API] Direct Page Token verified for: "${meData.name}" (ID: ${activePageId})`
              );
            }
          }
        }
      } catch (resolveErr) {
        console.warn("[Publish API] Page auto-resolve error:", resolveErr);
      }

      if (!activePageId) {
        return NextResponse.json({
          success: false,
          live: true,
          error: "Could not find any Facebook Page associated with this token.",
        });
      }

      try {
        let postRes: Response;
        const hasMedia = mediaUrls && mediaUrls.length > 0;

        if (hasMedia) {
          const media = mediaUrls[0];
          const photoUrl = `https://graph.facebook.com/v20.0/${activePageId}/photos`;

          if (media.startsWith("data:")) {
            // Local uploaded image -> convert Base64 into binary blob
            const matches = media.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const mimeType = matches[1];
              const buffer = Buffer.from(matches[2], "base64");
              const blob = new Blob([buffer], { type: mimeType });

              const formData = new FormData();
              formData.append("access_token", activePageToken);
              formData.append("caption", caption || "");
              formData.append("source", blob, "image.png");
              formData.append("published", "true");
              formData.append("no_story", "false");

              postRes = await fetch(photoUrl, {
                method: "POST",
                body: formData,
              });
            } else {
              // Fallback text post
              const feedUrl = `https://graph.facebook.com/v20.0/${activePageId}/feed`;
              postRes = await fetch(feedUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  message: caption || "",
                  access_token: activePageToken,
                }),
              });
            }
          } else {
            // Hosted public image URL
            postRes = await fetch(photoUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: media,
                caption: caption || "",
                access_token: activePageToken,
                published: true,
                no_story: false,
              }),
            });
          }
        } else {
          // Text-only post
          const feedUrl = `https://graph.facebook.com/v20.0/${activePageId}/feed`;
          postRes = await fetch(feedUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: caption || "",
              access_token: activePageToken,
            }),
          });
        }

        const data = await postRes.json();
        console.log("[Publish API] Graph API post response:", data);

        if (postRes.ok && data.id) {
          return NextResponse.json({
            success: true,
            live: true,
            postId: data.id,
            postUrl: `https://facebook.com/${data.id}`,
            message: "Successfully published to live Facebook Page!",
          });
        }

        if (data.error) {
          console.warn("[Publish API] Meta Publishing Error:", data.error);
          let userMessage = data.error.message;

          if (data.error.code === 200 || data.error.error_subcode === 1349048) {
            userMessage =
              "Meta Permission Error: Your Facebook App needs 'pages_manage_posts' permission to post live. Please check Meta App permissions or reconnect with permissions.";
          } else if (data.error.code === 190) {
            userMessage =
              "Facebook token expired or invalid. Please refresh the token in Graph API Explorer.";
          }

          return NextResponse.json({
            success: false,
            live: true,
            error: userMessage,
            metaError: data.error,
          });
        }
      } catch (graphErr: any) {
        console.error("[Publish API] Facebook Graph API publish error:", graphErr);
        return NextResponse.json({
          success: false,
          live: true,
          error: graphErr.message || "Failed to communicate with Meta Graph API",
        });
      }
    }

    // Default simulation for unlinked accounts
    return NextResponse.json({
      success: true,
      live: false,
      postId: `post_${Date.now()}`,
      message: "Published successfully to your SocialPilot dashboard.",
    });
  } catch (err: any) {
    console.error("[Publish API] Route error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

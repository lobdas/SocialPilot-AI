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

    // Instagram / Meta Publishing
    if (platform === "INSTAGRAM") {
      if (!rawToken) {
        return NextResponse.json({
          success: false,
          live: false,
          requiresToken: true,
          error:
            "Instagram Access Token missing. Please reconnect Instagram in Social Accounts.",
        });
      }

      const hasMedia = mediaUrls && mediaUrls.length > 0;
      if (!hasMedia) {
        return NextResponse.json({
          success: false,
          live: true,
          error:
            "Instagram-এ পোস্ট করার জন্য ছবি (Image) বা ভিডিও আবশ্যক। দয়া করে Content Studio-তে একটি ছবি যুক্ত বা AI দিয়ে জেনারেট করুন।",
        });
      }

      let activeIgAccountId = rawPageId;
      let activePageToken = rawToken;
      let associatedFbPageId = "";

      // 1. Auto-resolve Instagram Business Account ID & Page Token from Graph API
      try {
        const accountsRes = await fetch(
          `https://graph.facebook.com/v20.0/me/accounts?access_token=${rawToken}&fields=id,name,access_token,instagram_business_account{id,username,name}`
        );
        if (accountsRes.ok) {
          const accountsData = await accountsRes.json();
          if (accountsData.data && accountsData.data.length > 0) {
            // Find the page matching accountId or the first page with a linked IG account
            const pageWithIg =
              accountsData.data.find(
                (p: any) =>
                  p.instagram_business_account?.id === rawPageId ||
                  p.id === rawPageId ||
                  p.instagram_business_account?.id
              ) || accountsData.data[0];

            if (pageWithIg?.instagram_business_account?.id) {
              activeIgAccountId = pageWithIg.instagram_business_account.id;
              activePageToken = pageWithIg.access_token || rawToken;
              associatedFbPageId = pageWithIg.id;
              console.log(
                `[Publish API] Auto-resolved Instagram Account: "${pageWithIg.instagram_business_account.username}" (ID: ${activeIgAccountId})`
              );
            } else {
              associatedFbPageId = pageWithIg?.id || "";
              if (pageWithIg?.access_token) {
                activePageToken = pageWithIg.access_token;
              }
            }
          }
        }

        // If rawPageId is a Page ID, check if it has a linked IG account directly
        if (!activeIgAccountId || activeIgAccountId === rawPageId) {
          const pageCheckRes = await fetch(
            `https://graph.facebook.com/v20.0/${rawPageId}?fields=instagram_business_account{id,username}&access_token=${activePageToken}`
          );
          if (pageCheckRes.ok) {
            const pageCheckData = await pageCheckRes.json();
            if (pageCheckData.instagram_business_account?.id) {
              activeIgAccountId = pageCheckData.instagram_business_account.id;
              associatedFbPageId = rawPageId || "";
            }
          }
        }
      } catch (resolveErr) {
        console.warn("[Publish API] Instagram auto-resolve error:", resolveErr);
      }

      if (!activeIgAccountId) {
        return NextResponse.json({
          success: false,
          live: true,
          error:
            "আপনার ফেসবুক পেজের সাথে কোনো Instagram Professional/Creator অ্যাকাউন্ট যুক্ত পাওয়া যায়নি। দয়া করে Instagram অ্যাকাউন্টটি Professional-এ রূপান্তর করে Facebook Page-এর সাথে কানেক্ট করুন।",
        });
      }

      try {
        let publicImageUrl = mediaUrls[0];

        // 2. Handle base64 image -> upload to Facebook Page as unpublished photo to obtain public CDN URL
        if (publicImageUrl.startsWith("data:")) {
          const matches = publicImageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const buffer = Buffer.from(matches[2], "base64");
            const blob = new Blob([buffer], { type: mimeType });

            const uploadPageId = associatedFbPageId || "me";
            const fbPhotoUrl = `https://graph.facebook.com/v20.0/${uploadPageId}/photos`;
            const formData = new FormData();
            formData.append("access_token", activePageToken);
            formData.append("source", blob, "upload.png");
            formData.append("published", "false");

            const uploadRes = await fetch(fbPhotoUrl, {
              method: "POST",
              body: formData,
            });
            const uploadData = await uploadRes.json();

            if (uploadData.id) {
              const photoDetailsRes = await fetch(
                `https://graph.facebook.com/v20.0/${uploadData.id}?fields=images&access_token=${activePageToken}`
              );
              if (photoDetailsRes.ok) {
                const photoDetails = await photoDetailsRes.json();
                if (photoDetails.images && photoDetails.images.length > 0) {
                  publicImageUrl = photoDetails.images[0].source;
                  console.log("[Publish API] Converted local image to Meta CDN URL for Instagram");
                }
              }
            }
          }
        }

        // 3. Step 1: Create Instagram Media Container
        const containerUrl = `https://graph.facebook.com/v20.0/${activeIgAccountId}/media`;
        const containerRes = await fetch(containerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: publicImageUrl,
            caption: caption || "",
            access_token: activePageToken,
          }),
        });

        const containerData = await containerRes.json();
        console.log("[Publish API] Instagram container creation response:", containerData);

        if (!containerRes.ok || !containerData.id) {
          return NextResponse.json({
            success: false,
            live: true,
            error: containerData.error?.message || "Instagram media container creation failed.",
            metaError: containerData.error,
          });
        }

        // 4. Step 2: Publish the Container to Live Instagram
        const publishUrl = `https://graph.facebook.com/v20.0/${activeIgAccountId}/media_publish`;
        const publishRes = await fetch(publishUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: activePageToken,
          }),
        });

        const publishData = await publishRes.json();
        console.log("[Publish API] Instagram media publish response:", publishData);

        if (!publishRes.ok || !publishData.id) {
          return NextResponse.json({
            success: false,
            live: true,
            error: publishData.error?.message || "Failed to publish Instagram media container.",
            metaError: publishData.error,
          });
        }

        // 5. Step 3: Fetch post permalink
        let permalink = `https://instagram.com`;
        try {
          const permalinkRes = await fetch(
            `https://graph.facebook.com/v20.0/${publishData.id}?fields=permalink&access_token=${activePageToken}`
          );
          if (permalinkRes.ok) {
            const pData = await permalinkRes.json();
            if (pData.permalink) {
              permalink = pData.permalink;
            }
          }
        } catch {}

        return NextResponse.json({
          success: true,
          live: true,
          postId: publishData.id,
          postUrl: permalink,
          message: "Successfully published live to Instagram!",
        });
      } catch (igErr: any) {
        console.error("[Publish API] Instagram publish error:", igErr);
        return NextResponse.json({
          success: false,
          live: true,
          error: igErr.message || "Failed to publish to Instagram Graph API",
        });
      }
    }

    // Threads Publishing
    if (platform === "THREADS") {
      if (!rawToken) {
        return NextResponse.json({
          success: false,
          live: false,
          requiresToken: true,
          error:
            "Threads Access Token missing. Please connect your Threads account in Social Accounts.",
        });
      }

      let activeUserId = rawPageId;
      const activeToken = rawToken;

      try {
        if (!activeUserId) {
          const meRes = await fetch(
            `https://graph.threads.net/v1.0/me?fields=id,username&access_token=${activeToken}`
          );
          if (meRes.ok) {
            const meData = await meRes.json();
            activeUserId = meData.id;
          }
        }
      } catch (e) {
        console.warn("[Publish API] Threads auto-resolve user error:", e);
      }

      const targetId = activeUserId || "me";

      try {
        const hasMedia = mediaUrls && mediaUrls.length > 0;
        const containerBody = new URLSearchParams();
        containerBody.append("access_token", activeToken);

        if (hasMedia) {
          containerBody.append("media_type", "IMAGE");
          containerBody.append("image_url", mediaUrls[0]);
          if (caption) containerBody.append("text", caption);
        } else {
          containerBody.append("media_type", "TEXT");
          containerBody.append("text", caption || "");
        }

        const createRes = await fetch(`https://graph.threads.net/v1.0/${targetId}/threads`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: containerBody.toString(),
        });

        const createData = await createRes.json();
        if (!createRes.ok || !createData.id) {
          return NextResponse.json({
            success: false,
            live: true,
            error: createData.error?.message || "Failed to create Threads post container.",
          });
        }

        // Processing pause for container readiness
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const publishBody = new URLSearchParams();
        publishBody.append("creation_id", createData.id);
        publishBody.append("access_token", activeToken);

        const publishRes = await fetch(
          `https://graph.threads.net/v1.0/${targetId}/threads_publish`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: publishBody.toString(),
          }
        );

        const publishData = await publishRes.json();
        if (!publishRes.ok || !publishData.id) {
          return NextResponse.json({
            success: false,
            live: true,
            error: publishData.error?.message || "Failed to publish to Threads.",
          });
        }

        return NextResponse.json({
          success: true,
          live: true,
          postId: publishData.id,
          postUrl: "https://www.threads.net",
          message: "Successfully published live to Threads!",
        });
      } catch (thErr: any) {
        return NextResponse.json({
          success: false,
          live: true,
          error: thErr.message || "Failed to publish to Threads API",
        });
      }
    }

    // Google Business Profile (GMB) Publishing
    if (platform === "GOOGLE_BUSINESS") {
      const activeLocationName = rawPageId || process.env.GOOGLE_BUSINESS_LOCATION_NAME;

      if (rawToken && activeLocationName) {
        try {
          const postPayload: any = {
            languageCode: "en-US",
            summary: (caption || "").slice(0, 1500),
            topicType: "STANDARD",
          };

          if (mediaUrls && mediaUrls.length > 0) {
            postPayload.media = [
              {
                mediaFormat: "PHOTO",
                sourceUrl: mediaUrls[0],
              },
            ];
          }

          const gmbRes = await fetch(
            `https://mybusiness.googleapis.com/v4/${activeLocationName}/localPosts`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${rawToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(postPayload),
            }
          );

          if (gmbRes.ok) {
            const gmbData = await gmbRes.json();
            return NextResponse.json({
              success: true,
              live: true,
              postId: gmbData.name || `gmb_${Date.now()}`,
              postUrl: gmbData.searchUrl || "https://www.google.com/maps",
              message: "Successfully published live to Google Business Profile!",
            });
          } else {
            const errData = await gmbRes.json().catch(() => ({}));
            return NextResponse.json({
              success: false,
              live: true,
              error: errData.error?.message || `Google Business API error (${gmbRes.status})`,
            });
          }
        } catch (gErr: any) {
          return NextResponse.json({
            success: false,
            live: true,
            error: gErr.message || "Failed to communicate with Google My Business API",
          });
        }
      }

      // Simulated publication for demo / non-token mode
      return NextResponse.json({
        success: true,
        live: false,
        postId: `gmb_simulated_${Date.now()}`,
        postUrl: "https://www.google.com/maps",
        message: "Google Business Profile update published successfully (simulated/scheduled).",
      });
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

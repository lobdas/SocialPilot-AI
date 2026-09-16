import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { commentId, message, token: customToken } = await req.json();

    if (!commentId || !message) {
      return NextResponse.json(
        { success: false, error: "Missing commentId or message" },
        { status: 400 }
      );
    }

    const token = customToken || req.cookies.get("token_facebook")?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        error: "Facebook Access Token missing. Please check Social Accounts.",
      });
    }

    // Strip fb_ prefix if present
    const rawCommentId = commentId.replace(/^fb_/, "");

    // Resolve Page token
    let pageToken = token;
    try {
      const accountsRes = await fetch(
        `https://graph.facebook.com/v20.0/me/accounts?access_token=${token}`
      );
      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        if (accountsData.data && accountsData.data.length > 0) {
          pageToken = accountsData.data[0].access_token || token;
        }
      }
    } catch {}

    // Post reply comment to Facebook Graph API
    const replyUrl = `https://graph.facebook.com/v20.0/${rawCommentId}/comments`;
    const res = await fetch(replyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        access_token: pageToken,
      }),
    });

    const data = await res.json();

    if (res.ok && data.id) {
      return NextResponse.json({
        success: true,
        replyId: data.id,
        message: "Reply successfully published to Facebook!",
      });
    }

    return NextResponse.json({
      success: false,
      error: data.error?.message || "Failed to post reply to Facebook.",
      details: data.error,
    });
  } catch (err: any) {
    console.error("Inbox reply error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

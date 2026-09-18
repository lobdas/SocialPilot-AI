import { NextRequest, NextResponse } from "next/server";
import {
  isSmtpConfigured,
  sendPostPublishedEmail,
  sendPostScheduledEmail,
  sendWeeklyDigestEmail,
  sendTestEmail,
} from "@/lib/email/email-service";

export async function GET() {
  const configured = isSmtpConfigured();
  const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : null;
  const maskedUser = smtpUser
    ? smtpUser.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => `${a}${"*".repeat(Math.min(b.length, 6))}${c}`)
    : null;

  return NextResponse.json({
    configured,
    smtpUserMasked: maskedUser,
    fromName: process.env.SMTP_FROM_NAME || "SocialPilot AI",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, to, data = {} } = body as {
      type: "POST_PUBLISHED" | "POST_SCHEDULED" | "WEEKLY_DIGEST" | "TEST";
      to?: string | string[];
      data?: any;
    };

    // Gather recipients: user email and brand email
    const toList: string[] = [];
    if (Array.isArray(to)) {
      toList.push(...to);
    } else if (typeof to === "string" && to.trim()) {
      toList.push(...to.split(",").map((s) => s.trim()));
    }
    if (data?.brandEmail && typeof data.brandEmail === "string" && data.brandEmail.trim()) {
      toList.push(data.brandEmail.trim());
    }
    if (toList.length === 0 && process.env.SMTP_USER) {
      toList.push(process.env.SMTP_USER.trim());
    }

    const uniqueRecipients = Array.from(new Set(toList.filter((e) => Boolean(e) && e.includes("@"))));
    const recipient = uniqueRecipients.join(", ");

    if (!recipient) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipient email address is required.",
        },
        { status: 400 }
      );
    }

    if (!isSmtpConfigured()) {
      return NextResponse.json({
        success: false,
        notConfigured: true,
        message: "Gmail SMTP is not configured yet. Please add SMTP_USER and SMTP_PASS in .env.local.",
      });
    }

    let result;

    switch (type) {
      case "POST_PUBLISHED":
        result = await sendPostPublishedEmail({
          to: recipient,
          brandName: data.brandName,
          platforms: data.platforms,
          caption: data.caption,
          publishedAt: data.publishedAt,
        });
        break;

      case "POST_SCHEDULED":
        result = await sendPostScheduledEmail({
          to: recipient,
          brandName: data.brandName,
          platforms: data.platforms,
          caption: data.caption,
          scheduledAt: data.scheduledAt,
        });
        break;

      case "WEEKLY_DIGEST":
        result = await sendWeeklyDigestEmail({
          to: recipient,
          workspaceName: data.workspaceName,
          stats: data.stats,
        });
        break;

      case "TEST":
        result = await sendTestEmail({
          to: recipient,
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported notification type: ${type}` },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, simulated: result.simulated },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    console.error("[Notifications API] Error handling email dispatch:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

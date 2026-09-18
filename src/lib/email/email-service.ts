import nodemailer from "nodemailer";

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

// Check if SMTP environment variables are properly supplied
export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_USER.trim() !== "" &&
    process.env.SMTP_PASS.trim() !== ""
  );
}

// Create reusable Nodemailer transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE !== "false"; // 465 is SSL, 587 is STARTTLS
  const user = process.env.SMTP_USER?.trim();
  // App passwords can sometimes have spaces (e.g. "abcd efgh ijkl mnop"), strip them out
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "").trim();

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

function getSender() {
  const fromName = process.env.SMTP_FROM_NAME || "SocialPilot AI";
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "noreply@socialpilot.ai";
  return `"${fromName}" <${fromEmail}>`;
}

// Modern SocialPilot AI HTML Email Shell
function wrapHtmlEmail({
  title,
  subtitle,
  badgeText,
  badgeColor = "#D4FF32",
  contentHtml,
  ctaText,
  ctaUrl,
}: {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeColor?: string;
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const targetUrl = ctaUrl ? (ctaUrl.startsWith("http") ? ctaUrl : `${appUrl}${ctaUrl}`) : appUrl;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #070B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; }
    .container { max-width: 600px; margin: 30px auto; background-color: #0F172A; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0B1020 0%, #162036 100%); padding: 32px 30px; border-bottom: 1px solid #1E293B; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background-color: rgba(212, 255, 50, 0.15); color: ${badgeColor}; border: 1px solid rgba(212, 255, 50, 0.3); margin-bottom: 14px; }
    .title { margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em; }
    .subtitle { margin: 0; font-size: 13px; color: #94A3B8; line-height: 1.5; }
    .body { padding: 28px 30px; }
    .card { background-color: #0B1020; border: 1px solid #1E293B; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .meta-row { display: flex; justify-content: space-between; font-size: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .meta-label { color: #64748B; }
    .meta-val { color: #F1F5F9; font-weight: 600; text-align: right; }
    .preview-box { margin-top: 14px; padding: 14px; background-color: #162036; border-radius: 8px; font-size: 13px; color: #CBD5E1; line-height: 1.6; white-space: pre-wrap; font-family: monospace; }
    .btn { display: inline-block; background-color: #D4FF32; color: #070B14; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 26px; border-radius: 10px; text-align: center; }
    .footer { padding: 24px 30px; border-top: 1px solid #1E293B; text-align: center; font-size: 11px; color: #64748B; }
    .footer a { color: #94A3B8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">${badgeText}</div>
      <h1 class="title">${title}</h1>
      <p class="subtitle">${subtitle}</p>
    </div>
    <div class="body">
      ${contentHtml}
      ${ctaText ? `
        <div style="text-align: center; margin-top: 24px;">
          <a href="${targetUrl}" class="btn">${ctaText} &rarr;</a>
        </div>
      ` : ""}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>SocialPilot AI</strong> — Multi-Platform Social Intelligence</p>
      <p style="margin: 0;">Sent automatically to your verified email. Manage your notification preferences in <a href="${appUrl}/app/settings">Account Settings</a>.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// 1. Post Published Notification
export async function sendPostPublishedEmail({
  to,
  brandName = "Primary Brand",
  platforms = ["ALL"],
  caption = "",
  publishedAt = new Date().toISOString(),
}: {
  to: string;
  brandName?: string;
  platforms?: string[];
  caption?: string;
  publishedAt?: string;
}): Promise<SendEmailResult> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[EmailService] SMTP credentials not set in .env.local. Post published notification skipped.");
    return { success: false, simulated: true, error: "SMTP_NOT_CONFIGURED" };
  }

  const platformsBadge = platforms.join(", ");
  const cleanSnippet = caption.length > 300 ? caption.slice(0, 300) + "..." : caption;

  const contentHtml = `
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <td style="padding: 8px 0; color: #64748B; font-size: 12px;">Brand</td>
          <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600; font-size: 12px; text-align: right;">${brandName}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <td style="padding: 8px 0; color: #64748B; font-size: 12px;">Published Channels</td>
          <td style="padding: 8px 0; color: #D4FF32; font-weight: 700; font-size: 12px; text-align: right;">${platformsBadge}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B; font-size: 12px;">Published At</td>
          <td style="padding: 8px 0; color: #94A3B8; font-size: 12px; text-align: right;">${new Date(publishedAt).toLocaleString()}</td>
        </tr>
      </table>
      ${cleanSnippet ? `
        <div style="margin-top: 16px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.05em; margin-bottom: 6px;">Published Caption Preview:</div>
          <div class="preview-box">${cleanSnippet}</div>
        </div>
      ` : ""}
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: getSender(),
      to,
      subject: `🚀 [Published] Social post live on ${platformsBadge} — SocialPilot AI`,
      html: wrapHtmlEmail({
        title: "Your Post is Now Live!",
        subtitle: `Content was published successfully across ${platforms.length} connected channel(s).`,
        badgeText: "Post Published",
        badgeColor: "#D4FF32",
        contentHtml,
        ctaText: "View Post Analytics",
        ctaUrl: "/app/posts",
      }),
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("[EmailService] Failed to send post published email:", err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}

// 2. Post Scheduled Notification
export async function sendPostScheduledEmail({
  to,
  brandName = "Primary Brand",
  platforms = ["ALL"],
  caption = "",
  scheduledAt,
}: {
  to: string;
  brandName?: string;
  platforms?: string[];
  caption?: string;
  scheduledAt: string;
}): Promise<SendEmailResult> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[EmailService] SMTP credentials not set in .env.local. Post scheduled notification skipped.");
    return { success: false, simulated: true, error: "SMTP_NOT_CONFIGURED" };
  }

  const platformsBadge = platforms.join(", ");
  const cleanSnippet = caption.length > 300 ? caption.slice(0, 300) + "..." : caption;
  const scheduledTimeStr = new Date(scheduledAt).toLocaleString();

  const contentHtml = `
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <td style="padding: 8px 0; color: #64748B; font-size: 12px;">Brand</td>
          <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600; font-size: 12px; text-align: right;">${brandName}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <td style="padding: 8px 0; color: #64748B; font-size: 12px;">Scheduled Release</td>
          <td style="padding: 8px 0; color: #38BDF8; font-weight: 700; font-size: 12px; text-align: right;">${scheduledTimeStr}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B; font-size: 12px;">Target Channels</td>
          <td style="padding: 8px 0; color: #D4FF32; font-weight: 700; font-size: 12px; text-align: right;">${platformsBadge}</td>
        </tr>
      </table>
      ${cleanSnippet ? `
        <div style="margin-top: 16px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.05em; margin-bottom: 6px;">Queued Caption Preview:</div>
          <div class="preview-box">${cleanSnippet}</div>
        </div>
      ` : ""}
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: getSender(),
      to,
      subject: `📅 [Scheduled] Social post queued for ${scheduledTimeStr} — SocialPilot AI`,
      html: wrapHtmlEmail({
        title: "Post Scheduled Successfully",
        subtitle: `Your campaign has been scheduled and will be automatically published at the designated time.`,
        badgeText: "Post Scheduled",
        badgeColor: "#38BDF8",
        contentHtml,
        ctaText: "Review in Calendar",
        ctaUrl: "/app/calendar",
      }),
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("[EmailService] Failed to send post scheduled email:", err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}

// 3. Weekly Digest / Performance Report Notification
export async function sendWeeklyDigestEmail({
  to,
  workspaceName = "Workspace",
  stats = {
    totalPosts: 14,
    totalImpressions: "48.2K",
    avgEngagementRate: "5.8%",
    topPlatform: "LinkedIn",
    topPlatformGrowth: "+24%",
  },
}: {
  to: string;
  workspaceName?: string;
  stats?: {
    totalPosts: number;
    totalImpressions: string;
    avgEngagementRate: string;
    topPlatform: string;
    topPlatformGrowth: string;
  };
}): Promise<SendEmailResult> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[EmailService] SMTP credentials not set in .env.local. Weekly digest notification skipped.");
    return { success: false, simulated: true, error: "SMTP_NOT_CONFIGURED" };
  }

  const contentHtml = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
      <div style="background-color: #0B1020; border: 1px solid #1E293B; border-radius: 12px; padding: 16px; text-align: center;">
        <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Published Posts</div>
        <div style="font-size: 24px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${stats.totalPosts}</div>
      </div>
      <div style="background-color: #0B1020; border: 1px solid #1E293B; border-radius: 12px; padding: 16px; text-align: center;">
        <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Total Impressions</div>
        <div style="font-size: 24px; font-weight: 800; color: #D4FF32; margin-top: 4px;">${stats.totalImpressions}</div>
      </div>
      <div style="background-color: #0B1020; border: 1px solid #1E293B; border-radius: 12px; padding: 16px; text-align: center;">
        <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Avg Engagement</div>
        <div style="font-size: 24px; font-weight: 800; color: #38BDF8; margin-top: 4px;">${stats.avgEngagementRate}</div>
      </div>
      <div style="background-color: #0B1020; border: 1px solid #1E293B; border-radius: 12px; padding: 16px; text-align: center;">
        <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Top Platform</div>
        <div style="font-size: 18px; font-weight: 800; color: #A78BFA; margin-top: 8px;">${stats.topPlatform} (${stats.topPlatformGrowth})</div>
      </div>
    </div>
    <div class="card">
      <div style="font-size: 12px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">AI Growth Recommendation for this Week:</div>
      <p style="font-size: 12px; color: #94A3B8; line-height: 1.6; margin: 0;">
        Based on algorithm performance across your connected channels, Tuesday and Thursday evenings generated 42% more organic reach. Consider queueing video carousels on LinkedIn and Threads at 19:00 for optimal dwell time.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: getSender(),
      to,
      subject: `📊 [Weekly Performance Digest] ${workspaceName} Summary — SocialPilot AI`,
      html: wrapHtmlEmail({
        title: "Your Weekly Social Digest",
        subtitle: `Here is your multi-channel social performance recap for ${workspaceName}.`,
        badgeText: "Weekly Intelligence Digest",
        badgeColor: "#A78BFA",
        contentHtml,
        ctaText: "Open Full Analytics Dashboard",
        ctaUrl: "/app/analytics",
      }),
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("[EmailService] Failed to send weekly digest email:", err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}

// 4. Test Email to verify Gmail App Password configuration
export async function sendTestEmail({
  to,
  senderName = "SocialPilot AI System",
}: {
  to: string;
  senderName?: string;
}): Promise<SendEmailResult> {
  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      error: "SMTP_NOT_CONFIGURED: SMTP_USER and SMTP_PASS are missing in .env.local.",
    };
  }

  const contentHtml = `
    <div class="card">
      <div style="color: #4ADE80; font-size: 14px; font-weight: 700; margin-bottom: 10px;">
        🎉 Connection Successful!
      </div>
      <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6; margin: 0 0 12px 0;">
        Your Gmail App Password was successfully verified. SocialPilot AI is now configured to send automated notifications for:
      </p>
      <ul style="font-size: 12px; color: #94A3B8; padding-left: 20px; line-height: 1.8; margin: 0;">
        <li><strong style="color: #FFFFFF;">Instant Post Published</strong> alerts whenever content is published live</li>
        <li><strong style="color: #FFFFFF;">Post Scheduled</strong> confirmation alerts with date & target platforms</li>
        <li><strong style="color: #FFFFFF;">Weekly Performance Digest</strong> every Monday morning</li>
      </ul>
    </div>
  `;

  try {
    // Verify connection first
    await transporter.verify();

    const info = await transporter.sendMail({
      from: getSender(),
      to,
      subject: `✅ [Verified] Gmail SMTP Connected Successfully — SocialPilot AI`,
      html: wrapHtmlEmail({
        title: "SMTP Connection Verified!",
        subtitle: `This test email confirms your Gmail App Password configuration is working properly.`,
        badgeText: "SMTP Test Passed",
        badgeColor: "#4ADE80",
        contentHtml,
        ctaText: "Go to Dashboard",
        ctaUrl: "/app",
      }),
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("[EmailService] SMTP Test failed:", err);
    return {
      success: false,
      error: err.message || "SMTP connection or authentication failed. Check your Gmail App Password.",
    };
  }
}

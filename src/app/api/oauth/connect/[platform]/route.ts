import { NextRequest, NextResponse } from "next/server";
import { MetaPublishingProvider } from "@/lib/providers/meta-provider";
import { LinkedInPublishingProvider } from "@/lib/providers/linkedin-provider";
import { ThreadsPublishingProvider } from "@/lib/providers/threads-provider";
import { PlatformType } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: rawPlatform } = await params;
  const platform = rawPlatform.toUpperCase() as PlatformType;
  const origin = new URL(req.url).origin;
  const redirectUri = `${origin}/api/oauth/callback/${rawPlatform.toLowerCase()}`;
  const state = `oauth_state_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  if (platform === "FACEBOOK") {
    const provider = new MetaPublishingProvider("FACEBOOK");
    const authUrl = provider.getAuthorizationUrl({ state, redirectUri });
    return NextResponse.redirect(authUrl);
  }

  if (platform === "INSTAGRAM") {
    const provider = new MetaPublishingProvider("INSTAGRAM");
    const authUrl = provider.getAuthorizationUrl({ state, redirectUri });
    return NextResponse.redirect(authUrl);
  }

  if (platform === "LINKEDIN") {
    const provider = new LinkedInPublishingProvider();
    const authUrl = provider.getAuthorizationUrl({ state, redirectUri });
    return NextResponse.redirect(authUrl);
  }

  if (platform === "THREADS") {
    const provider = new ThreadsPublishingProvider();
    const authUrl = provider.getAuthorizationUrl({ state, redirectUri });
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.redirect(
    new URL(`/app/social-accounts?error=Platform+${rawPlatform}+not+configured`, req.url)
  );
}

import { NextRequest, NextResponse } from "next/server";
import { ProviderFactory } from "@/lib/providers/provider-factory";
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

  try {
    const provider = ProviderFactory.getPublishingProvider(platform);
    const authUrl = provider.getAuthorizationUrl({ state, redirectUri });
    return NextResponse.redirect(authUrl);
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/app/social-accounts?error=${encodeURIComponent(err.message || `Platform ${rawPlatform} not configured`)}`, req.url)
    );
  }
}

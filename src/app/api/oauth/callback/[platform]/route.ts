import { NextRequest, NextResponse } from "next/server";
import { ProviderFactory } from "@/lib/providers/provider-factory";
import { EncryptionService } from "@/lib/security/encryption";
import { PlatformType } from "@/lib/types";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: rawPlatform } = await params;
  const platform = rawPlatform.toUpperCase() as PlatformType;
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      new URL(`/app/social-accounts?error=${encodeURIComponent(errorDescription || error)}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/app/social-accounts?error=Missing+authorization+code", req.url)
    );
  }

  try {
    const provider = ProviderFactory.getPublishingProvider(platform);
    const redirectUri = `${new URL(req.url).origin}/api/oauth/callback/${rawPlatform.toLowerCase()}`;

    // Exchange Code for Access & Refresh Tokens
    const tokenResult = await provider.exchangeCode(code, redirectUri);

    // Encrypt Tokens with AES-256-GCM
    const encryptedAccess = EncryptionService.encrypt(tokenResult.accessToken);
    const encryptedRefresh = tokenResult.refreshToken
      ? EncryptionService.encrypt(tokenResult.refreshToken)
      : undefined;

    if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
      // Try saving to PostgreSQL if DB is running
      try {
        const workspaceId = "ws-1";
        await prisma.socialAccount.upsert({
          where: {
            workspaceId_platform_platformAccountId: {
              workspaceId,
              platform,
              platformAccountId: tokenResult.platformAccountId,
            },
          },
          create: {
            workspaceId,
            platform,
            platformAccountId: tokenResult.platformAccountId,
            accountName: tokenResult.accountName,
            encryptedToken: encryptedAccess.encrypted,
            tokenIv: encryptedAccess.iv,
            tokenAuthTag: encryptedAccess.authTag,
            refreshToken: encryptedRefresh?.encrypted,
            scopes: tokenResult.scopes,
            tokenStatus: "ACTIVE",
            lastSyncAt: new Date(),
          },
          update: {
            encryptedToken: encryptedAccess.encrypted,
            tokenIv: encryptedAccess.iv,
            tokenAuthTag: encryptedAccess.authTag,
            refreshToken: encryptedRefresh?.encrypted,
            tokenStatus: "ACTIVE",
            lastSyncAt: new Date(),
            lastRefreshedAt: new Date(),
          },
        });
      } catch (dbErr: any) {
        console.warn("PostgreSQL storage skipped (DB unreachable on localhost:5432):", dbErr.message);
      }
    }

    const redirectUrl = new URL(`/app/social-accounts`, req.url);
    redirectUrl.searchParams.set("connected", platform);
    if (tokenResult.accountName) {
      redirectUrl.searchParams.set("accountName", tokenResult.accountName);
    }
    if (tokenResult.handle) {
      redirectUrl.searchParams.set("handle", tokenResult.handle);
    }
    if (tokenResult.avatarUrl) {
      redirectUrl.searchParams.set("avatarUrl", tokenResult.avatarUrl);
    }
    if (tokenResult.accessToken) {
      redirectUrl.searchParams.set("token", tokenResult.accessToken);
    }
    if (tokenResult.platformAccountId) {
      redirectUrl.searchParams.set("accountId", tokenResult.platformAccountId);
    }

    const response = NextResponse.redirect(redirectUrl);
    if (tokenResult.accessToken) {
      response.cookies.set(`token_${platform.toLowerCase()}`, tokenResult.accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 60, // 60 days
      });
    }
    if (tokenResult.platformAccountId) {
      response.cookies.set(`page_id_${platform.toLowerCase()}`, tokenResult.platformAccountId, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 60,
      });
    }

    return response;
  } catch (err: any) {
    console.error("OAuth exchange failed:", err);
    return NextResponse.redirect(
      new URL(`/app/social-accounts?error=${encodeURIComponent(err.message || "OAuth exchange failed")}`, req.url)
    );
  }
}

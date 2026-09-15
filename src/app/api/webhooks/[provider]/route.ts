import { NextRequest, NextResponse } from "next/server";
import { EncryptionService } from "@/lib/security/encryption";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(req.url);

  // Meta & WhatsApp Webhook Verification handshake
  if (provider === "meta" || provider === "whatsapp") {
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || "socialpilot_webhook_secret_verify";

    if (mode === "subscribe" && token === expectedToken) {
      return new NextResponse(challenge, { status: 200 });
    }
    return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
  }

  return NextResponse.json({ status: "ok", provider });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256") || "";

  // Verify HMAC-SHA256 signature for Meta/WhatsApp
  if (provider === "meta" || provider === "whatsapp") {
    const secret = process.env.META_APP_SECRET || "dummy_meta_secret";
    const isValid = EncryptionService.verifyWebhookSignature(rawBody, signature, secret);

    if (!isValid && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
      return NextResponse.json({ error: "Invalid webhook HMAC signature" }, { status: 401 });
    }
  }

  // Idempotent webhook event storage
  try {
    const payloadJson = JSON.parse(rawBody || "{}");
    const eventId = payloadJson.entry?.[0]?.id || `evt_${Date.now()}`;

    if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
      await prisma.webhookEvent.upsert({
        where: { eventId },
        create: {
          provider: provider.toUpperCase(),
          eventId,
          payload: rawBody,
          signature,
          status: "PENDING",
        },
        update: {},
      });
    }

    return NextResponse.json({ received: true, provider, eventId }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: "Malformed webhook payload", details: e.message }, { status: 400 });
  }
}

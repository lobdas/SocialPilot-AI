export interface WhatsAppTemplateRequest {
  phoneNumberId: string;
  recipientPhoneNumber: string;
  templateName: string;
  languageCode: string;
  components?: any[];
}

export interface WhatsAppSessionRequest {
  phoneNumberId: string;
  recipientPhoneNumber: string;
  messageText: string;
  mediaUrl?: string;
}

export interface WhatsAppMessageResult {
  success: boolean;
  messageId?: string;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
  errorCode?: string;
  errorMessage?: string;
}

export interface IWhatsAppMessagingProvider {
  sendTemplateMessage(params: WhatsAppTemplateRequest, accessToken: string): Promise<WhatsAppMessageResult>;
  sendSessionMessage(params: WhatsAppSessionRequest, accessToken: string): Promise<WhatsAppMessageResult>;
  check24HourWindow(recipientPhoneNumber: string, lastMessageTimestamp?: Date): boolean;
  verifyWebhookSignature(rawBody: string, signature: string, appSecret: string): boolean;
}

export class WhatsAppMessagingProvider implements IWhatsAppMessagingProvider {
  check24HourWindow(recipientPhoneNumber: string, lastMessageTimestamp?: Date): boolean {
    if (!lastMessageTimestamp) return false;
    const now = Date.now();
    const messageTime = new Date(lastMessageTimestamp).getTime();
    return now - messageTime <= 24 * 60 * 60 * 1000;
  }

  async sendTemplateMessage(params: WhatsAppTemplateRequest, accessToken: string): Promise<WhatsAppMessageResult> {
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
      throw new Error("WHATSAPP_PHONE_NUMBER_ID is not configured in production environment.");
    }

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return {
        success: true,
        messageId: `wamid.sim_${Date.now()}`,
        status: "SENT",
      };
    }

    // Call Meta WhatsApp Cloud API endpoint
    const url = `https://graph.facebook.com/v20.0/${params.phoneNumberId}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: params.recipientPhoneNumber,
        type: "template",
        template: {
          name: params.templateName,
          language: { code: params.languageCode },
          components: params.components,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        errorCode: data.error?.code?.toString() || "API_ERROR",
        errorMessage: data.error?.message || "Failed to send WhatsApp template message.",
        status: "FAILED",
      };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
      status: "SENT",
    };
  }

  async sendSessionMessage(params: WhatsAppSessionRequest, accessToken: string): Promise<WhatsAppMessageResult> {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return {
        success: true,
        messageId: `wamid.sim_${Date.now()}`,
        status: "SENT",
      };
    }

    const url = `https://graph.facebook.com/v20.0/${params.phoneNumberId}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: params.recipientPhoneNumber,
        type: "text",
        text: { preview_url: false, body: params.messageText },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        errorCode: data.error?.code?.toString(),
        errorMessage: data.error?.message,
        status: "FAILED",
      };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
      status: "SENT",
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string, appSecret: string): boolean {
    const crypto = require("crypto");
    const cleanSig = signature.startsWith("sha256=") ? signature.slice(7) : signature;
    const expected = crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(cleanSig, "hex"), Buffer.from(expected, "hex"));
  }
}

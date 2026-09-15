import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for GCM

function getMasterKey(): Buffer {
  const secret = process.env.TOKEN_ENCRYPTION_SECRET || "socialpilot_secure_token_master_seed_2026";
  return crypto.createHash("sha256").update(secret).digest();
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

export class EncryptionService {
  /**
   * Encrypts sensitive credentials (access tokens, refresh tokens, secrets) using AES-256-GCM
   */
  static encrypt(plainText: string): EncryptedData {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getMasterKey(), iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag,
    };
  }

  /**
   * Decrypts encrypted credentials and verifies authentication tag
   */
  static decrypt(encryptedHex: string, ivHex: string, authTagHex: string): string {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      getMasterKey(),
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  /**
   * Masks sensitive credentials for UI display
   */
  static maskSecret(secret: string): string {
    if (!secret || secret.length < 8) return "••••••••";
    const prefix = secret.slice(0, 4);
    const suffix = secret.slice(-3);
    return `${prefix}••••••••${suffix}`;
  }

  /**
   * Sanitizes social account objects before returning to client-side API consumers
   */
  static sanitizeAccount<T extends Record<string, any>>(account: T): Omit<T, "encryptedToken" | "tokenIv" | "tokenAuthTag" | "encryptedSecret"> {
    const { encryptedToken, tokenIv, tokenAuthTag, encryptedSecret, ...safe } = account;
    return safe as any;
  }

  /**
   * Verifies HMAC-SHA256 signature for incoming webhooks (Meta, WhatsApp, etc.)
   */
  static verifyWebhookSignature(rawBody: string, signatureHeader: string, appSecret: string): boolean {
    if (!signatureHeader || !appSecret) return false;

    // Header format often "sha256=<hash>"
    const cleanSig = signatureHeader.startsWith("sha256=")
      ? signatureHeader.slice(7)
      : signatureHeader;

    const expectedHash = crypto
      .createHmac("sha256", appSecret)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(cleanSig, "hex"),
      Buffer.from(expectedHash, "hex")
    );
  }

  /**
   * Generates a cryptographically secure random token (e.g. for external client approval URLs)
   */
  static generateSecureToken(bytes = 24): string {
    return crypto.randomBytes(bytes).toString("hex");
  }
}

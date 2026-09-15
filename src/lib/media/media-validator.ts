import { PlatformType } from "../types";

export interface MediaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface MediaSpecs {
  fileSize: number; // in bytes
  mimeType: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
}

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_VIDEO_SIZE_BYTES = 512 * 1024 * 1024; // 512MB

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const SUPPORTED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

export class MediaValidator {
  /**
   * Validates a media asset against general SaaS storage limits and platform-specific restrictions
   */
  static validate(specs: MediaSpecs, targetPlatforms: PlatformType[]): MediaValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const isImage = SUPPORTED_IMAGE_TYPES.includes(specs.mimeType);
    const isVideo = SUPPORTED_VIDEO_TYPES.includes(specs.mimeType);

    if (!isImage && !isVideo) {
      errors.push(`Unsupported media format: ${specs.mimeType}. Only JPEG, PNG, WEBP, and MP4 are supported.`);
      return { isValid: false, errors, warnings };
    }

    // Size checks
    if (isImage && specs.fileSize > MAX_IMAGE_SIZE_BYTES) {
      errors.push(`Image file size exceeds limit (Max 8MB, received ${(specs.fileSize / (1024 * 1024)).toFixed(1)}MB).`);
    }

    if (isVideo && specs.fileSize > MAX_VIDEO_SIZE_BYTES) {
      errors.push(`Video file size exceeds limit (Max 512MB, received ${(specs.fileSize / (1024 * 1024)).toFixed(1)}MB).`);
    }

    // Dimension & Platform-specific rules
    if (specs.width && specs.height) {
      const aspectRatio = specs.width / specs.height;

      if (targetPlatforms.includes("INSTAGRAM")) {
        // Instagram feed requires aspect ratios between 4:5 (0.8) and 1.91:1 (1.91)
        if (aspectRatio < 0.79 || aspectRatio > 1.95) {
          warnings.push("Instagram feed requires aspect ratios between 4:5 (portrait) and 1.91:1 (landscape). This media may be automatically cropped.");
        }
        if (specs.width < 320) {
          errors.push("Instagram requires images to have a minimum width of 320px.");
        }
      }

      if (targetPlatforms.includes("X")) {
        if (isImage && specs.fileSize > 5 * 1024 * 1024) {
          errors.push("X (Twitter) limits image uploads to a maximum of 5MB.");
        }
      }

      if (targetPlatforms.includes("LINKEDIN")) {
        if (specs.width < 400) {
          warnings.push("LinkedIn recommends images with a minimum resolution of 400x400px for optimal feed rendering.");
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

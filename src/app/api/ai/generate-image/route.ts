import { NextRequest, NextResponse } from "next/server";

function buildFallbackImage(prompt: string, size: string) {
  const safePrompt = (prompt || "AI social media creative").slice(0, 180);
  const [width, height] = size.split("x").map(Number);
  const displayWidth = Number.isFinite(width) ? width : 1024;
  const displayHeight = Number.isFinite(height) ? height : 1024;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${displayWidth}" height="${displayHeight}" viewBox="0 0 ${displayWidth} ${displayHeight}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#0B1020"/>
          <stop offset="55%" stop-color="#15233C"/>
          <stop offset="100%" stop-color="#D4FF32"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.9)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" rx="32"/>
      <circle cx="${displayWidth * 0.72}" cy="${displayHeight * 0.35}" r="${Math.min(displayWidth, displayHeight) * 0.38}" fill="url(#glow)"/>
      <rect x="56" y="56" width="${displayWidth - 112}" height="${displayHeight - 112}" rx="28" fill="rgba(11,16,32,0.18)" stroke="rgba(212,255,50,0.45)" stroke-width="2"/>
      <text x="50%" y="45%" font-size="56" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#F8FAFC" text-anchor="middle">SocialPilot AI</text>
      <text x="50%" y="58%" font-size="26" font-family="Arial, Helvetica, sans-serif" fill="#D4FF32" text-anchor="middle">Creative concept preview</text>
      <text x="50%" y="72%" font-size="20" font-family="Arial, Helvetica, sans-serif" fill="#E2E8F0" text-anchor="middle">${safePrompt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = "1024x1024" } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const imagePrompt =
      prompt ||
      "Modern vibrant abstract technology gradient backdrop for social media banner, ultra clean aesthetic, 8k resolution, cinematic lighting";

    if (!apiKey || apiKey === "your_openai_api_key_here") {
      return NextResponse.json({
        success: true,
        url: buildFallbackImage(imagePrompt, size),
        fallback: true,
      });
    }

    const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt: imagePrompt,
        n: 1,
        size,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        {
          success: true,
          url: buildFallbackImage(imagePrompt, size),
          fallback: true,
          warning: data.error?.message || "OpenAI image generation unavailable. Using demo creative fallback.",
        },
        { status: 200 }
      );
    }

    const url = data.data?.[0]?.url;
    if (url) {
      return NextResponse.json({ success: true, url, fallback: false });
    }

    const b64 = data.data?.[0]?.b64_json;
    if (b64) {
      return NextResponse.json({
        success: true,
        url: `data:image/png;base64,${b64}`,
        fallback: false,
      });
    }

    return NextResponse.json({
      success: true,
      url: buildFallbackImage(imagePrompt, size),
      fallback: true,
    });
  } catch (err: any) {
    const { prompt, size = "1024x1024" } = await req.json().catch(() => ({ prompt: "", size: "1024x1024" }));
    return NextResponse.json({
      success: true,
      url: buildFallbackImage(prompt, size),
      fallback: true,
      warning: err?.message || "Image generation failed. Using local demo image fallback.",
    });
  }
}

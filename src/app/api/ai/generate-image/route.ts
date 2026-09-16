import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = "1024x1024" } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === "your_openai_api_key_here") {
      return NextResponse.json(
        { success: false, error: "OPENAI_API_KEY is not configured in .env.local" },
        { status: 200 }
      );
    }

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt:
          prompt ||
          "Modern vibrant abstract technology gradient backdrop for social media banner, ultra clean aesthetic, 8k resolution, cinematic lighting",
        n: 1,
        size,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error?.message || "DALL-E image generation failed" },
        { status: 200 }
      );
    }

    const url = data.data?.[0]?.url;
    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 200 });
  }
}

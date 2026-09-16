import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { caption, mode, platform }: { caption: string; mode: "hook" | "shorten" | "expand" | "urgency"; platform: string } =
      await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_openai_api_key_here") {
      return NextResponse.json({ success: false, error: "No API key", useFallback: true });
    }

    const instructions = {
      hook: "Add an irresistible, high-CTR opening hook sentence that stops scrolling immediately while keeping the rest coherent.",
      shorten: "Make this caption 30-50% more concise and punchy without losing key insights or clarity.",
      expand: "Expand this caption with 2-3 high-value actionable bullet points, insights, or industry examples.",
      urgency: "Add a compelling sense of urgency, timeliness, or high-stakes importance to the message and call to action.",
    };

    const prompt = `
Platform: ${platform}
Task: ${instructions[mode] || "Rewrite this caption to be more engaging."}

Original Caption:
"""
${caption}
"""

Return ONLY the revised caption text directly. Do not include markdown code fences or introductory conversational filler.
`;

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "You are an expert social media copy editor specializing in viral hooks and engagement.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, useFallback: true });
    }

    const data = await res.json();
    const rewritten = data.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({
      success: true,
      rewritten,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, useFallback: true });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { context, message }: { context?: string; message: string } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === "your_openai_api_key_here") {
      return NextResponse.json({
        success: false,
        suggestions: [
          "Thanks for reaching out! We'd love to help with this. Let us know what questions you have.",
          "Great question! You can explore full details directly in our link or send us a message anytime.",
          "Appreciate your comment and feedback! Glad you found this valuable.",
        ],
      });
    }

    const prompt = `
A user left this comment or message on our social media post:
User Message: "${message}"
Post Context: "${context || "General brand post"}"

Generate 3 distinct, professional, friendly, and engaging reply suggestions:
1. A warm & helpful answer
2. A direct & concise response
3. An engagement-boosting response (asks a follow-up question or invites them to learn more)

Return ONLY a valid JSON object with format:
{
  "suggestions": [
    "Reply 1...",
    "Reply 2...",
    "Reply 3..."
  ]
}
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
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a friendly, brand-safe social media community manager generating quick reply suggestions.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        suggestions: [
          "Thanks for reaching out! We'd love to help with this.",
          "Great question! Feel free to send us a direct message.",
          "Appreciate your comment and support!",
        ],
      });
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    return NextResponse.json({
      success: true,
      suggestions: parsed.suggestions || [],
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      suggestions: [
        "Thanks for reaching out! We'd love to help.",
        "Great point! What has your experience been?",
        "Appreciate you taking the time to share your feedback!",
      ],
    });
  }
}

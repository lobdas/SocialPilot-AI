import { NextRequest, NextResponse } from "next/server";
import { PlatformType } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic,
      contentType,
      tone,
      language,
      targetAudience,
      callToAction,
      brand,
      targetPlatforms,
    }: {
      topic: string;
      contentType?: string;
      tone?: string;
      language?: string;
      targetAudience?: string;
      callToAction?: string;
      brand?: { name?: string; brandVoice?: string; prohibitedClaims?: string; preferredLanguage?: string };
      targetPlatforms: PlatformType[];
    } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === "your_openai_api_key_here") {
      return NextResponse.json(
        {
          success: false,
          error: "OPENAI_API_KEY is not configured in .env.local",
          useFallback: true,
        },
        { status: 200 }
      );
    }

    const brandName = brand?.name || "Our Brand";
    const brandVoice = brand?.brandVoice || "Professional, insightful, and authoritative";
    const prohibited = brand?.prohibitedClaims ? `Strictly avoid: ${brand.prohibitedClaims}` : "";
    const cta = callToAction || "Learn more and join the conversation.";
    const targetAud = targetAudience || "Industry leaders, founders, and creators";
    const selectedLang = language || brand?.preferredLanguage || "English";

    const prompt = `
Generate native social media content tailored for the following platforms: ${targetPlatforms.join(", ")}.

CRITICAL LANGUAGE REQUIREMENT:
All post captions, hooks, bullet points, call-to-actions, and questions MUST be written in the following language: "${selectedLang}".
- If language is "Bengali (বাংলা)": Write complete, high-quality, authentic Bengali script (বাংলা বর্ণমালা ও কথ্য/প্রমিত ভাষা). Do NOT write English if Bengali is requested.
- If language is "Hindi (हिंदी)": Write complete, high-quality, authentic Hindi script (हिंदी देवनागरी लिपि). Do NOT write English if Hindi is requested.
- If language is "English": Write in fluent, punchy, modern English.

Core Topic / Raw Idea: "${topic}"
Content Type: ${contentType || "Thought Leadership"}
Tone of Voice: ${tone || "Authoritative"}
Target Audience: ${targetAud}
Call to Action: ${cta}
Brand Name: ${brandName}
Brand Voice & Guidelines: ${brandVoice}
${prohibited}

Formatting & Platform Requirements:
- "X": Under 270 characters total. Punchy single hook, high-density value bullet points or insight, 1-2 sharp hashtags, concise CTA.
- "LINKEDIN": 150-300 words. Strong single-line hook with white-space, narrative insight, actionable takeaways (1, 2, 3), open-ended engagement question at end, 3-5 relevant B2B hashtags.
- "INSTAGRAM": Visual hook with relevant emojis (🛑, ✨, 💡, 📲), conversational storytelling with line breaks, clear save/share CTA, 5-8 curated hashtags.
- "FACEBOOK": Engaging conversational post, relatable community angle, question to prompt comments and shares, clear link/action CTA, 2-3 hashtags.
- "THREADS": Conversational, hot take or thought starter, feels like a real human message, 1-2 sentences or short list, 0-1 hashtags.
- "PINTEREST": Descriptive keyword-rich pin caption explaining the idea/guide, inspiring aesthetic tone, 3-5 hashtags.
- "GOOGLE_BUSINESS": Clear, professional local business update or promotional announcement (under 1500 chars). High-intent Local SEO tone, strong business value, action-oriented CTA (e.g. "Call Now", "Learn More", "Book Online", "Get Offer"). Do NOT use hashtags.

Return ONLY a valid JSON object matching this structure:
{
  "variants": {
    "<PLATFORM>": {
      "platform": "<PLATFORM>",
      "caption": "Post text here",
      "hashtags": ["#tag1", "#tag2"],
      "ctaText": "Call to action label",
      "ctaUrl": "https://example.com"
    }
  }
}
Only include the requested platforms: ${targetPlatforms.join(", ")}.
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
            content:
              "You are SocialPilot AI, an elite viral social media ghostwriter and growth strategist. You write highly engaging, human-sounding native posts tailored precisely for each social network.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("OpenAI API error:", errData);
      return NextResponse.json(
        {
          success: false,
          error: errData.error?.message || `OpenAI request failed with status ${res.status}`,
          useFallback: true,
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    const contentText = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(contentText);

    // Format variants with character counts
    const variants: Record<string, any> = {};
    if (parsed.variants) {
      for (const [key, val] of Object.entries(parsed.variants as Record<string, any>)) {
        variants[key] = {
          ...val,
          characterCount: (val.caption || "").length,
        };
      }
    }

    return NextResponse.json({
      success: true,
      variants,
      model,
    });
  } catch (error: any) {
    console.error("AI Generation route exception:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error generating AI content",
        useFallback: true,
      },
      { status: 200 }
    );
  }
}

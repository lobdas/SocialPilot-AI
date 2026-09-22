import { NextRequest, NextResponse } from "next/server";
import { PlatformType } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      campaignName,
      objective = "CONVERSIONS",
      targetAudience,
      durationWeeks = 4,
      postCount = 4,
      language = "en",
      brand,
      targetPlatforms = ["LINKEDIN", "X", "INSTAGRAM", "FACEBOOK"],
    }: {
      campaignName: string;
      objective?: "AWARENESS" | "TRAFFIC" | "CONVERSIONS" | "ENGAGEMENT";
      targetAudience?: string;
      durationWeeks?: number;
      postCount?: number;
      language?: string;
      brand?: { name?: string; brandVoice?: string; prohibitedClaims?: string; preferredLanguage?: string };
      targetPlatforms?: PlatformType[];
    } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    const isBengali = language === "bn" || language?.toLowerCase().includes("bengali");
    const isHindi = language === "hi" || language?.toLowerCase().includes("hindi");

    const brandName = brand?.name || "SocialPilot AI";
    const brandVoice = brand?.brandVoice || "Authoritative, modern, insightful, high-agency";
    const audience = targetAudience || "Growth marketers, agency founders, and digital entrepreneurs";

    // If OpenAI key is available, call GPT
    if (apiKey && apiKey !== "your_openai_api_key_here") {
      try {
        const prompt = `
Generate a comprehensive multi-week marketing campaign strategy and a series of ${postCount} scheduled social media posts.

Campaign Name: "${campaignName}"
Objective: ${objective}
Target Audience: ${audience}
Duration: ${durationWeeks} weeks (${postCount} strategic posts distributed across the campaign)
Brand Name: ${brandName}
Brand Voice: ${brandVoice}
Language: ${isBengali ? "Bengali (বাংলা script)" : isHindi ? "Hindi (हिंदी)" : "English"}
Platforms: ${targetPlatforms.join(", ")}

Generate a JSON response matching:
{
  "description": "Strategic campaign summary (2-3 sentences explaining the overarching theme and goal)",
  "budgetNotes": "Strategic budget recommendation or organic distribution strategy",
  "strategyPhases": [
    "Phase 1: Hook & Problem Awareness",
    "Phase 2: Solution & Feature Spotlight",
    "Phase 3: Social Proof & Metrics",
    "Phase 4: Conversion & Call to Action"
  ],
  "posts": [
    {
      "title": "Short descriptive post title",
      "phase": "Phase 1: Awareness",
      "contentType": "Thought Leadership",
      "dayOffset": 2,
      "variants": {
        "<PLATFORM>": {
          "platform": "<PLATFORM>",
          "caption": "Platform-native caption with appropriate tone, hooks, and line-breaks",
          "hashtags": ["#tag1", "#tag2"],
          "ctaText": "Learn More"
        }
      }
    }
  ]
}

Ensure the post variants match the native characteristics of each selected platform:
- LINKEDIN: Professional, whitespace, 3-point insight, question at the end.
- X: Punchy, under 260 chars, hook + punchline.
- INSTAGRAM: Visual emojis, engaging storytelling, hashtag cluster.
- FACEBOOK: Conversational, community focus, clear link/comment invite.
`;

        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
                  "You are SocialPilot AI Campaign Architect, an expert CMO and viral social media strategist.",
              },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const parsed = JSON.parse(aiData.choices[0].message.content);
          return NextResponse.json({
            success: true,
            data: parsed,
          });
        }
      } catch (e) {
        console.error("OpenAI generation failed, using intelligent fallback", e);
      }
    }

    // Intelligent Fallback Strategy & Posts Generator
    const phases = [
      "Phase 1: Hook & Problem Awareness",
      "Phase 2: Deep-Dive Solution & Educational Proof",
      "Phase 3: Customer Transformation & Case Study",
      "Phase 4: Urgency & Final Conversion Drive",
    ];

    const fallbackPosts = Array.from({ length: Math.min(postCount, 6) }).map((_, i) => {
      const phaseIndex = Math.min(i, phases.length - 1);
      const dayOffset = Math.round((i + 1) * ((durationWeeks * 7) / (postCount + 1)));

      let title = "";
      let captions: Record<string, string> = {};

      if (isBengali) {
        if (i === 0) {
          title = `${campaignName}: সমস্যার গোড়াপত্তন ও সচেতনতা`;
          captions = {
            LINKEDIN: `অধিকাংশ টিম সোশ্যাল মিডিয়া গ্রোথে সময় নষ্ট করে ভুল পদ্ধতিতে কাজ করার কারণে।\n\n${campaignName}-এর মূল লক্ষ্য হলো এই জটিলতা দূর করে কার্যকর ফলাফল নিয়ে আসা।\n\n১. সময় সাশ্রয় করুন\n২. সঠিক অডিয়েন্সকে টার্গেট করুন\n৩. ধারাবাহিকতা বজায় রাখুন\n\nআপনার টিমের বর্তমান চ্যালেঞ্জ কী? কমেন্টে জানান।`,
            X: `সোশ্যাল মিডিয়া ম্যানেজমেন্ট কোনো অনুমান নয়, এটি একটি নিখুঁত স্ট্র্যাটেজি। ${campaignName} শুরু হচ্ছে আজই! 🚀`,
            INSTAGRAM: `আপনি কি এখনও সোশ্যাল মিডিয়া পোস্টের সঠিক রিচ পাচ্ছেন না? 🛑\n\n${campaignName} নিয়ে এসেছে সহজ সমাধান। আপনার ব্র্যান্ডকে পরবর্তী ধাপে নিয়ে যান এখনই। সোয়াইপ করুন আরও জানতে 👉`,
            FACEBOOK: `বর্তমান ডিজিটাল যুগে সঠিক স্ট্র্যাটেজি ছাড়া ব্র্যান্ড গ্রোথ অসম্ভব। ${campaignName}-এর মাধ্যমে আমরা নিয়ে এসেছি কার্যকরী সল্যুশন। বিস্তারিত জানতে যুক্ত থাকুন আমাদের সাথে!`,
          };
        } else if (i === 1) {
          title = `${campaignName}: সমাধান ও ফিচার হাইলাইট`;
          captions = {
            LINKEDIN: `আমাদের নতুন ফ্রেমওয়ার্ক কীভাবে ক্যাম্পেইন ম্যানেজমেন্টকে সহজ করে তোলে?\n\nএখানে রয়েছে অটোমেশন ও ব্র্যান্ড গার্ডরেইলের চমৎকার সমন্বয়:\n- এক ক্লিকে মাল্টি-চ্যানেল পোস্ট\n- ব্র্যান্ড ভয়েস কনসিস্টেন্সি\n- স্বয়ংক্রিয় শিডিউলিং\n\n${brandName}-এ যুক্ত হয়ে আপনার গ্রোথকে দ্রুততর করুন।`,
            X: `প্রতিটি পোস্ট রি-ফরম্যাট করতে ঘণ্টার পর ঘণ্টা ব্যয় করার দিন শেষ। ${campaignName} দিয়ে পুরো টিমকে আনুন এক প্ল্যাটফর্মে! ⚡`,
            INSTAGRAM: `স্মার্ট ওয়ার্ক > হার্ড ওয়ার্ক! ✨\n\nকীভাবে এক ক্লিকে আপনার সোশ্যাল প্রেজেন্স ১০ গুণ বাড়ানো সম্ভব? দেখে নিন আমাদের নতুন ফিচারে। বিস্তারিত প্রোফাইল লিঙ্কে!`,
            FACEBOOK: `আপনার ব্র্যান্ডকে আলাদা পরিচিতি দিতে প্রয়োজন সঠিক টুলস। ${campaignName}-এর বিশেষ ফিচারগুলো আপনার ব্যবসাকে এগিয়ে রাখবে প্রতিযোগীদের চেয়ে অনেক দূর।`,
          };
        } else if (i === 2) {
          title = `${campaignName}: সাকসেস স্টোরি ও কেস স্টাডি`;
          captions = {
            LINKEDIN: `প্রকৃত ফলাফল কথা বলে: কীভাবে আমাদের ক্লায়েন্টরা ৯০ দিনে ১৪২% বেশি এনগেজমেন্ট পেয়েছেন?\n\n${campaignName}-এর স্ট্র্যাটেজি ফলো করে কোনো অতিরিক্ত টিম মেম্বার ছাড়াই এই গ্রোথ অর্জন করা সম্ভব হয়েছে।\n\nফলাফল নিজেই যাচাই করুন।`,
            X: `ফলাফল যখন স্পষ্ট, তখন সিদ্ধান্ত নেওয়া সহজ। ৯০ দিনে ১৪২% গ্রোথ অর্জনকারী ক্লায়েন্ট স্টোরিটি পড়ুন এখনই। 📊`,
            INSTAGRAM: `আমাদের ক্লায়েন্টদের রিয়েল সাকসেস রেজাল্ট! 📈🎉\n\nসঠিক প্ল্যানিং আর ধারাবাহিকতার ফল সবসময়ই দুর্দান্ত হয়। আপনিও কি একই রেজাল্ট চান? এখনই ডিএম করুন!`,
            FACEBOOK: `সফলতার কোনো শর্টকাট নেই, তবে সঠিক পথ জানা থাকলে কাজ সহজ হয়। দেখুন কীভাবে আমাদের ক্লায়েন্টরা দ্বিগুণ ফলাফল পেলেন। বিস্তারিত জানতে মেসেজ দিন!`,
          };
        } else {
          title = `${campaignName}: ফাইনাল অফার ও অ্যাকশন`;
          captions = {
            LINKEDIN: `${campaignName}-এর এই বিশেষ সুযোগ শেষ হতে চলেছে।\n\nআপনার মার্কেটিং টিমকে নেক্সট লেভেলে নিয়ে যেতে আজই অংশ নিন। সীমিত সময়ের জন্য এক্সক্লুসিভ অ্যাক্সেস দেওয়া হচ্ছে।`,
            X: `দেরি করবেন না! ${campaignName}-এর স্পেশাল অফার শীঘ্রই বন্ধ হচ্ছে। আজই জয়েন করুন! 🔥`,
            INSTAGRAM: `লাস্ট চান্স! ⏳\n\n${campaignName}-এর বিশেষ সুবিধা পেতে আজই রেজিস্টার করুন। প্রোফাইল লিঙ্কে ক্লিক করে শুরু করুন ফ্রি ট্রায়াল!`,
            FACEBOOK: `আর মাত্র কয়েকদিন বাকি! আপনার ব্র্যান্ডের জন্য সেরা সোশ্যাল অটোমেশন টুল এখনই আনলক করুন আকর্ষণীয় অফারে।`,
          };
        }
      } else {
        // English
        if (i === 0) {
          title = `${campaignName}: The Awakening & The Bottleneck`;
          captions = {
            LINKEDIN: `The single biggest drag on modern growth teams isn't creativity—it's distribution friction.\n\nWith "${campaignName}", we are eliminating the manual rework and giving teams their focus back.\n\n1. Centralize brand intelligence\n2. Decentralize native formatting\n3. Accelerate approval cycles\n\nHow is your team tackling this in 2026?`,
            X: `Stop burning 15+ hours every week manually adapting content across networks. ${campaignName} is officially live. ⚡`,
            INSTAGRAM: `The modern social playbook is changing 🛑✨\n\nIntroducing ${campaignName}: Native distribution, zero copy-paste fatigue, and maximum brand impact. Swipe to see what changes 👉`,
            FACEBOOK: `Ready to revolutionize how your brand shows up online? We are kicking off ${campaignName} to help you reach more high-intent customers with less friction.`,
          };
        } else if (i === 1) {
          title = `${campaignName}: The Architecture & Blueprint`;
          captions = {
            LINKEDIN: `Behind the scenes of "${campaignName}": What does scalable multi-channel architecture actually look like?\n\n- Zero off-brand claims\n- Dynamic aspect ratio generation\n- Unified client approvals\n\nHere is how ${brandName} makes this effortless for modern agencies.`,
            X: `Why do generic cross-posts flop? Algorithms penalize non-native grammar. Here is how ${campaignName} fixes it on auto-pilot. 🎯`,
            INSTAGRAM: `Crafted for speed, built for compliance 🧠💡\n\nHere is a quick tour of what makes ${campaignName} the top choice for growth agencies this quarter. Link in bio to explore!`,
            FACEBOOK: `Scaling content doesn't mean sacrificing quality. With ${campaignName}, every post is tailored for the platform it lives on. Check out the demo inside!`,
          };
        } else if (i === 2) {
          title = `${campaignName}: Benchmark Metrics & Proof`;
          captions = {
            LINKEDIN: `Real benchmark metrics: How 24 agency accounts drove 142% higher qualified leads during the first 60 days of this framework.\n\nThe secret? Quality native distribution beats noisy volume every single time.\n\nDownload the full benchmark breakdown below.`,
            X: `Real numbers: 142% pipeline lift in 60 days. Zero added headcount. Here is the framework inside ${campaignName} 📈`,
            INSTAGRAM: `The numbers speak for themselves 📊🔥\n\nSee how high-growth creators and brands unlocked record engagement rates with ${campaignName}. Save this post for your next campaign planning session!`,
            FACEBOOK: `Case study spotlight: How smart automation helped our partners scale engagement without working extra hours. Read the full case study on our website!`,
          };
        } else {
          title = `${campaignName}: Final Rollout & Next Steps`;
          captions = {
            LINKEDIN: `Closing out our ${campaignName} rollout with one clear takeaway: Those who master native distribution will capture the vast majority of social attention in 2026.\n\nReady to activate your brand? Get started today with ${brandName}.`,
            X: `Final chance to access our launch bonuses for ${campaignName}. Lock in your spot today. 🚀`,
            INSTAGRAM: `Last call to join the ${campaignName} cohort! ⏰ Don't leave your brand reach to chance. Tap the link in our bio to launch today!`,
            FACEBOOK: `The response to ${campaignName} has been incredible! Join hundreds of teams already scaling with us. Try SocialPilot AI risk-free today.`,
          };
        }
      }

      const postVariants: Record<string, any> = {};
      targetPlatforms.forEach((p) => {
        postVariants[p] = {
          platform: p,
          caption: captions[p] || captions["LINKEDIN"] || `Announcing ${campaignName} for ${p}!`,
          hashtags: [
            `#${campaignName.replace(/[^a-zA-Z0-9]/g, "")}`,
            "#MarketingStrategy",
            "#Growth2026",
          ],
          ctaText: isBengali ? "বিস্তারিত দেখুন" : "Learn More",
          ctaUrl: "https://socialpilot.ai",
        };
      });

      return {
        title,
        phase: phases[phaseIndex],
        contentType: i === 0 ? "Thought Leadership" : i === 1 ? "Product Launch" : i === 2 ? "Case Study" : "Promotional",
        dayOffset,
        variants: postVariants,
      };
    });

    const fallbackData = {
      description: isBengali
        ? `"${campaignName}" হলো একটি সমন্বিত মাল্টি-চ্যানেল মার্কেটিং ক্যাম্পেইন যার লক্ষ্য ${targetPlatforms.join(", ")} জুড়ে শক্তিশালী উপস্থিতি তৈরি করা এবং নির্ধারিত ফলাফল অর্জন করা।`
        : `A high-impact, multi-week campaign orchestrating native content across ${targetPlatforms.join(", ")} to achieve measurable ${objective.toLowerCase()} goals.`,
      budgetNotes: isBengali
        ? "৮০% অর্গানিক পুশ + ২০% টপ পারফর্মিং পোস্টে বুস্টিং"
        : "$3,000 allocated across high-performing boost posts & organic distribution",
      strategyPhases: phases,
      posts: fallbackPosts,
    };

    return NextResponse.json({
      success: true,
      data: fallbackData,
    });
  } catch (error: any) {
    console.error("AI Campaign Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate campaign" },
      { status: 500 }
    );
  }
}

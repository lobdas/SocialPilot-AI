import { Brand, ContentVariant, PlatformType } from "../types";

export interface GenerateBriefParams {
  topic: string;
  contentType: string; // "PROMOTIONAL", "EDUCATIONAL", "PRODUCT_LAUNCH", "FESTIVAL", "CASE_STUDY", "THOUGHT_LEADERSHIP"
  tone: string; // "Authoritative", "Conversational", "Playful", "Inspiring", "Bold"
  language?: string; // "Bengali (বাংলা)", "English", "Hindi (हिंदी)"
  targetAudience?: string;
  callToAction?: string;
  referenceUrl?: string;
  brand?: Brand | null;
  targetPlatforms: PlatformType[];
}

export interface GenerateResult {
  variants: Record<PlatformType, ContentVariant>;
  isLiveOpenAI: boolean;
  model?: string;
}

export class AIService {
  /**
   * Generates cross-platform tailored variations from a single brief using OpenAI GPT-4o / GPT-4o-mini
   * with automatic fallback if offline or unconfigured.
   */
  static async generateMultiPlatformContent(params: GenerateBriefParams): Promise<GenerateResult> {
    // 1. Try real OpenAI generation via server API route
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.variants && Object.keys(data.variants).length > 0) {
          return {
            variants: data.variants,
            isLiveOpenAI: true,
            model: data.model,
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI generation route unreachable, falling back to local synthesizer:", err);
    }

    // 2. Intelligent local fallback template generation
    await new Promise((resolve) => setTimeout(resolve, 600));

    const brandName = params.brand?.name || "SocialPilot AI";
    const cta = params.callToAction || "Discover how to scale your reach today.";
    const topic = params.topic.trim();

    const isBengali = params.language?.includes("Bengali") || params.language?.includes("বাংলা");
    const isHindi = params.language?.includes("Hindi") || params.language?.includes("हिंदी");

    const variants: Record<PlatformType, ContentVariant> = {} as any;

    if (isBengali) {
      // BENGALI NATIVE GENERATION
      if (params.targetPlatforms.includes("X")) {
        const xCaption = `বেশিরভাগ মার্কেটিং টিম প্রতি সপ্তাহে ১৫+ ঘণ্টা নষ্ট করে শুধু ক্যাপশন রি-ফরম্যাট করতে।\n\nস্মার্ট মাল্টি-চ্যানেল অটোমেশন ব্যবহার করলে যা পাবেন:\n• ৪ গুণ দ্রুত পাবলিশিং গতি\n• নিখুঁত ব্র্যান্ড কনসিস্টেন্সি\n• শূন্য ম্যানুয়াল কপি-পেস্ট\n\n${topic}।\n\n${cta}`;
        variants["X"] = {
          platform: "X",
          caption: xCaption.slice(0, 275),
          hashtags: ["#মার্কেটিংটিপস", "#গ্রোথস্ট্র্যাটেজি"],
          ctaText: "ফ্রি ট্রায়াল",
          ctaUrl: "https://socialpilot.ai",
          characterCount: Math.min(xCaption.length, 275),
        };
      }

      if (params.targetPlatforms.includes("LINKEDIN")) {
        const linkedInCaption = `আধুনিক সোশ্যাল মিডিয়ার প্রসারে মূল সমস্যা কিন্তু ক্রিয়েটিভিটি নয়।\n\nআসল সমস্যা হলো কন্টেন্ট তৈরি ও একাধিক প্ল্যাটফর্মের সঠিক ডিস্ট্রিবিউশনের মধ্যে সমন্বয়ের অভাব।\n\nযখন আমরা ${topic} বিষয়টি পর্যালোচনা করি, তখন দেখা যায় প্রতিটি নেটওয়ার্কের নিজস্ব ফরম্যাটে বার্তা পৌঁছানোই আসল চাবিকাঠি। সফল টিমগুলো সব জায়গায় অন্ধভাবে একই ক্যাপশন কপি-পেস্ট করে না—তারা প্রতিটি মাধ্যমের দর্শকের মনস্তত্ত্ব বুঝে মূল বার্তাটি তুলে ধরে।\n\nমূল শিক্ষণীয় বিষয়সমূহ:\n১. নেটিভ ফরম্যাটিং ৩.২ গুণ বেশি মনোযোগ তৈরি করে।\n২. সেন্ট্রালাইজড ব্র্যান্ড গাইডলাইন বিভ্রান্তিকর টোন প্রতিরোধ করে।\n৩. দ্রুত অনুমোদন ওয়ার্কফ্লো ক্যাম্পেইন মসৃণ রাখে।\n\n${cta}\n\nআপনার টিম কীভাবে একাধিক প্ল্যাটফর্মে কন্টেন্ট ম্যানেজ করে? কমেন্টে জানান।`;
        variants["LINKEDIN"] = {
          platform: "LINKEDIN",
          caption: linkedInCaption,
          hashtags: ["#কন্টেন্টস্ট্র্যাটেজি", "#বিজনেসগ্রোথ", "#সোশ্যালমিডিয়াটিপস", "#মার্কেটিং"],
          ctaText: "বিস্তারিত পড়ুন",
          ctaUrl: "https://socialpilot.ai/insights",
          characterCount: linkedInCaption.length,
        };
      }

      if (params.targetPlatforms.includes("INSTAGRAM")) {
        const igCaption = `প্ল্যাটফর্মভেদে একই ক্যাপশন কপি-পেস্ট করা এখনই বন্ধ করুন 🛑✨\n\nপ্রতিটি প্ল্যাটফর্মের অডিয়েন্সের চাহিদা আলাদা। ইনস্টাগ্রামের ব্যবহারকারীরা যেভাবে কন্টেন্ট দেখে, তা লিঙ্কডইন বা টুইটার থেকে সম্পূর্ণ ভিন্ন।\n\n💡 আজকের বিশেষ আলোচনা:\n"${topic}"\n\nএকটিমাত্র আইডিয়াকে কীভাবে কয়েক মিনিটে প্ল্যাটফর্ম-অনুকূল করে তুলবেন, তা দেখতে সোয়াইপ করুন 📲👇\n\nভবিষ্যতের জন্য পোস্টটি সেভ করে রাখুন! 📌\n\n${cta}`;
        variants["INSTAGRAM"] = {
          platform: "INSTAGRAM",
          caption: igCaption,
          hashtags: ["#কন্টেন্টক্রিয়েটর", "#সোশ্যালমিডিয়াগ্রোথ", "#ডিজিটালমার্কেটিং", "#বিজনেসটিপস"],
          ctaText: "লিংক ইন বায়ো",
          ctaUrl: "https://socialpilot.ai",
          characterCount: igCaption.length,
        };
      }

      if (params.targetPlatforms.includes("FACEBOOK")) {
        const fbCaption = `আপনি কি এখনও প্রতি সপ্তাহে ঘণ্টার পর ঘণ্টা সময় নষ্ট করছেন বিভিন্ন সোশ্যাল নেটওয়ার্কের জন্য আলাদা পোস্ট তৈরি করতে?\n\nসহজ সমাধান হলো: একবার আপনার ব্র্যান্ড ভয়েস সেট করুন এবং এআই ওয়ার্কফ্লো দিয়ে সঠিক ফরম্যাট, টোন এবং সাইজিং নিশ্চিত করুন।\n\nদেখুন কীভাবে আধুনিক টিমগুলো মাসে ২০+ ঘণ্টা সময় বাঁচাচ্ছে:\n👉 ${cta}`;
        variants["FACEBOOK"] = {
          platform: "FACEBOOK",
          caption: fbCaption,
          hashtags: ["#সোশ্যালমিডিয়াটিপস", "#বিজনেসগ্রোথ"],
          ctaText: "আরও জানুন",
          ctaUrl: "https://socialpilot.ai",
          characterCount: fbCaption.length,
        };
      }

      if (params.targetPlatforms.includes("THREADS")) {
        const threadsCaption = `আনপপুলার ওপিনিয়ন: আপনি যদি X, লিঙ্কডইন আর ইনস্টাগ্রামে হুবহু একই ক্যাপশন দেন, তবে আপনি আপনার রিচের ৬০% নষ্ট করছেন।\n\nপ্রতিটি প্ল্যাটফর্মের অ্যালগরিদম তাদের নিজস্ব ফরম্যাটকে প্রাধান্য দেয়।\n\n${topic}।\n\nআপনি এই ব্যাপারে কী ভাবছেন? নিচে আলোচনা করুন 👇`;
        variants["THREADS"] = {
          platform: "THREADS",
          caption: threadsCaption,
          hashtags: ["#সোশ্যালমিডিয়া"],
          ctaText: "আলোচনা করুন",
          ctaUrl: "https://threads.net",
          characterCount: threadsCaption.length,
        };
      }

      if (params.targetPlatforms.includes("PINTEREST")) {
        const pinCaption = `${topic} সম্পর্কিত সম্পূর্ণ নির্দেশিকা। আপনার ব্যবসার জন্য কার্যকর সোশ্যাল মিডিয়া মার্কেটিং স্ট্র্যাটেজি ও শিডিউলিং নিয়মাবলী জানতে সম্পূর্ণ গাইডটি ভিজিট করুন।`;
        variants["PINTEREST"] = {
          platform: "PINTEREST",
          caption: pinCaption,
          hashtags: ["#মার্কেটিংস্ট্র্যাটেজি", "#সোশ্যালমিডিয়াটিপস"],
          ctaText: "ওয়েবসাইট ভিজিট করুন",
          ctaUrl: "https://socialpilot.ai",
          characterCount: pinCaption.length,
        };
      }

      if (params.targetPlatforms.includes("YOUTUBE")) {
        const ytCaption = `${topic} 🎬\n\nএকই ক্যাপশন বারবার কপি-পেস্ট করা বন্ধ করুন। আধুনিক মার্কেটিং টিমগুলো কীভাবে সহজে বিভিন্ন প্ল্যাটফর্মে রূপান্তর করে, তা এই ভিডিওতে বিস্তারিত দেখুন।\n\n📌 টাইমস্ট্যাম্পস:\n০:০০ - ভূমিকা\n১:৪৫ - ওমনি-চ্যানেল ফ্রেমওয়ার্ক\n৪:২০ - ব্র্যান্ড ভয়েস ধরে রাখার উপায়\n\n🔔 সাবস্ক্রাইব করুন এবং বেল আইকনে ক্লিক করে আমাদের সাথে থাকুন!\n🔗 ${cta}`;
        variants["YOUTUBE"] = {
          platform: "YOUTUBE",
          caption: ytCaption,
          hashtags: ["#Shorts", "#মার্কেটিংটিউটোরিয়াল", "#বিজনেসগ্রোথ"],
          ctaText: "সাবস্ক্রাইব করুন",
          ctaUrl: "https://socialpilot.ai",
          characterCount: ytCaption.length,
        };
      }

      if (params.targetPlatforms.includes("GOOGLE_BUSINESS")) {
        const gmbCaption = `📢 ${brandName} থেকে বিশেষ আপডেট:\n\n${topic}।\n\nআপনার ব্যবসার অনলাইন উপস্থিতি বাড়াতে এবং কাস্টমারদের সাথে সরাসরি যোগাযোগ স্থাপন করতে আমাদের সমাধান আধুনিক ব্যবসায়ীদের সময় বাঁচায় এবং নতুন কাস্টমার তৈরি করতে সহায়তা করে।\n\n📍 সরাসরি আমাদের আউটলেটে আসুন অথবা অনলাইনে যোগাযোগ করুন!\n\n👉 ${cta}`;
        variants["GOOGLE_BUSINESS"] = {
          platform: "GOOGLE_BUSINESS",
          caption: gmbCaption.slice(0, 1500),
          hashtags: [],
          ctaText: "যোগাযোগ করুন",
          ctaUrl: "https://socialpilot.ai",
          characterCount: Math.min(gmbCaption.length, 1500),
        };
      }
    } else if (isHindi) {
      // HINDI NATIVE GENERATION
      if (params.targetPlatforms.includes("X")) {
        const xCaption = `अधिकतर मार्केटिंग टीमें हर हफ्ते 15+ घंटे केवल कैप्शन सुधारने में बर्बाद करती हैं।\n\nमल्टी-चैनल ऑटोमेशन से क्या बदलता है:\n• 4 गुना तेज पब्लिशिंग गति\n• सटीक ब्रांड निरंतरता\n• शून्य मैनुअल कॉपी-पेस्ट\n\n${topic}।\n\n${cta}`;
        variants["X"] = {
          platform: "X",
          caption: xCaption.slice(0, 275),
          hashtags: ["#मार्केटिंगटिप्स", "#ग्रोथस्ट्रेटेजी"],
          ctaText: "फ्री ट्रायल",
          ctaUrl: "https://socialpilot.ai",
          characterCount: Math.min(xCaption.length, 275),
        };
      }

      if (params.targetPlatforms.includes("LINKEDIN")) {
        const linkedInCaption = `सोशल ग्रोथ में सबसे बड़ी बाधा रचनात्मकता नहीं है, बल्कि क्रिएशन और मल्टी-चैनल वितरण के बीच का तालमेल है।\n\nजब हम ${topic} पर विचार करते हैं, तो सफल कंपनियां हर चैनल के अनुसार अपने संदेश को ढालती हैं।\n\nमुख्य सीख:\n1. नेटिव फॉर्मेटिंग 3.2 गुना अधिक जुड़ाव देती है।\n2. केंद्रीकृत ब्रांड इंटेलिजेंस एकरूपता बनाए रखती है।\n3. त्वरित अनुमोदन प्रक्रिया काम में तेजी लाती है।\n\n${cta}\n\nआपकी टीम मल्टी-प्लेटफ़ॉर्म वितरण कैसे संभालती है? नीचे टिप्पणी करें।`;
        variants["LINKEDIN"] = {
          platform: "LINKEDIN",
          caption: linkedInCaption,
          hashtags: ["#बिजनेसग्रोथ", "#मार्केटिंगस्ट्रेटेजी", "#सोशलमीडियाटिप्स"],
          ctaText: "पूरा पढ़ें",
          ctaUrl: "https://socialpilot.ai/insights",
          characterCount: linkedInCaption.length,
        };
      }

      if (params.targetPlatforms.includes("INSTAGRAM")) {
        const igCaption = `सभी प्लेटफॉर्म्स पर एक ही कैप्शन कॉपी-पेस्ट करना बंद करें 🛑✨\n\nहर प्लेटफॉर्म के दर्शकों का व्यवहार अलग होता है।\n\n💡 आज का मुख्य विषय:\n"${topic}"\n\nएक ही विचार को मिनटों में कई प्लेटफॉर्म्स के लिए अनुकूल बनाने का तरीका जानने के लिए स्वाइप करें 📲👇\n\nभविष्य के लिए इस पोस्ट को सेव करें! 📌\n\n${cta}`;
        variants["INSTAGRAM"] = {
          platform: "INSTAGRAM",
          caption: igCaption,
          hashtags: ["#कंटेंटक्रिएटर", "#सोशलमीडियाग्रोथ", "#डिजिटलमार्केटिंग"],
          ctaText: "बायो में लिंक",
          ctaUrl: "https://socialpilot.ai",
          characterCount: igCaption.length,
        };
      }

      if (params.targetPlatforms.includes("FACEBOOK")) {
        const fbCaption = `क्या आप अभी भी विभिन्न सोशल नेटवर्क के लिए पोस्ट बनाने में हर हफ्ते कई घंटे बिता रहे हैं?\n\nएक बार अपनी ब्रांड गाइडलाइंस सेट करें और ऑटोमेशन से सही फॉर्मेट और टोन पाएं।\n\nदेखें कि आधुनिक टीमें महीने में 20+ घंटे कैसे बचा रही हैं:\n👉 ${cta}`;
        variants["FACEBOOK"] = {
          platform: "FACEBOOK",
          caption: fbCaption,
          hashtags: ["#सोशलमीडियाटिप्स", "#बिजनेसग्रोथ"],
          ctaText: "और जानें",
          ctaUrl: "https://socialpilot.ai",
          characterCount: fbCaption.length,
        };
      }

      if (params.targetPlatforms.includes("THREADS")) {
        const threadsCaption = `अलोकप्रिय राय: यदि आप X, लिंक्डइन और इंस्टाग्राम पर एक ही कैप्शन पोस्ट कर रहे हैं, तो आप अपनी पहुंच खो रहे हैं।\n\nहर प्लेटफॉर्म का एल्गोरिदम अपने नेटिव फॉर्मेट को पसंद करता है।\n\n${topic}।\n\nआपकी क्या राय है? नीचे चर्चा करें 👇`;
        variants["THREADS"] = {
          platform: "THREADS",
          caption: threadsCaption,
          hashtags: ["#सोशलमीडिया"],
          ctaText: "जवाब दें",
          ctaUrl: "https://threads.net",
          characterCount: threadsCaption.length,
        };
      }

      if (params.targetPlatforms.includes("PINTEREST")) {
        const pinCaption = `${topic} के लिए सम्पूर्ण गाइड। अपने व्यवसाय को ऑनलाइन बढ़ाने के लिए उपयोगी मार्केटिंग रणनीतियां और शेड्यूलिंग टिप्स जानने के लिए पूरा गाइड देखें।`;
        variants["PINTEREST"] = {
          platform: "PINTEREST",
          caption: pinCaption,
          hashtags: ["#मार्केटिंगस्ट्रेटेजी", "#सोशलमीडियाटिप्स"],
          ctaText: "साइट देखें",
          ctaUrl: "https://socialpilot.ai",
          characterCount: pinCaption.length,
        };
      }

      if (params.targetPlatforms.includes("YOUTUBE")) {
        const ytCaption = `${topic} 🎬\n\nएक ही कैप्शन कॉपी-पेस्ट करना बंद करें। इस वीडियो में जानें कि आधुनिक मार्केटिंग टीमें आसानी से मल्टी-प्लेटफ़ॉर्म कंटेंट कैसे तैयार करती हैं।\n\n📌 टाइमस्टैम्प:\n0:00 - परिचय\n1:45 - मल्टी-प्लेटफॉर्म फ्रेमवर्क\n4:20 - ब्रांड वॉइस बनाए रखना\n\n🔔 साप्ताहिक अपडेट के लिए सब्सक्राइब करें!\n🔗 ${cta}`;
        variants["YOUTUBE"] = {
          platform: "YOUTUBE",
          caption: ytCaption,
          hashtags: ["#Shorts", "#मार्केटिंगट्यूटोरियल", "#बिजनेसग्रोथ"],
          ctaText: "सब्सक्राइब करें",
          ctaUrl: "https://socialpilot.ai",
          characterCount: ytCaption.length,
        };
      }

      if (params.targetPlatforms.includes("GOOGLE_BUSINESS")) {
        const gmbCaption = `📢 ${brandName} से विशेष अपडेट:\n\n${topic}।\n\nअपने स्थानीय व्यापार की पहुंच बढ़ाएं और ग्राहकों से सीधे जुड़ें। हमारे समाधान आपका समय बचाते हैं और नए ग्राहक जोड़ने में मदद करते हैं।\n\n📍 हमारी शाखा पर आएं या ऑनलाइन संपर्क करें!\n\n👉 ${cta}`;
        variants["GOOGLE_BUSINESS"] = {
          platform: "GOOGLE_BUSINESS",
          caption: gmbCaption.slice(0, 1500),
          hashtags: [],
          ctaText: "संपर्क करें",
          ctaUrl: "https://socialpilot.ai",
          characterCount: Math.min(gmbCaption.length, 1500),
        };
      }
    } else {
      // ENGLISH DEFAULT GENERATION
      // X (Twitter)
      if (params.targetPlatforms.includes("X")) {
        const xCaption = `Most marketing teams waste 15+ hours weekly reformatting captions.\n\nHere is what changes when you automate distribution:\n• 4x higher publishing velocity\n• Flawless brand consistency\n• Zero manual copy-pasting\n\n${topic}.\n\n${cta}`;
        variants["X"] = {
          platform: "X",
          caption: xCaption.slice(0, 275),
          hashtags: ["#SocialMediaAI", "#MarketingAutomation", "#GrowthStrategy"],
          ctaText: "Try Free",
          ctaUrl: "https://socialpilot.ai",
          characterCount: Math.min(xCaption.length, 275),
        };
      }

      // LinkedIn
      if (params.targetPlatforms.includes("LINKEDIN")) {
        const linkedInCaption = `The biggest bottleneck in modern social growth isn't creativity.\n\nIt's the friction between creation and multi-channel distribution.\n\nWhen we look at ${topic}, the companies winning the next decade aren't publishing more noise—they are adapting their core message with precision to every channel's native psychology.\n\nKey takeaways for founders and marketing leaders:\n1. Native formatting drives up to 3.2x higher dwell time.\n2. Unified analytics reveal cross-channel compounding.\n3. Centralized brand intelligence prevents fragmented voice.\n\n${cta}\n\nHow does your team currently handle multi-platform distribution? Drop your workflow below.`;
        variants["LINKEDIN"] = {
          platform: "LINKEDIN",
          caption: linkedInCaption,
          hashtags: ["#Leadership", "#MarketingStrategy", "#B2BGrowth", "#SaaS", "#ContentStrategy"],
          ctaText: "Read Full Blueprint",
          ctaUrl: "https://socialpilot.ai/insights",
          characterCount: linkedInCaption.length,
        };
      }

      // Instagram
      if (params.targetPlatforms.includes("INSTAGRAM")) {
        const igCaption = `Stop copying & pasting your captions across platforms 🛑✨\n\nNative psychology is everything. The way your audience consumes on Instagram is completely distinct from LinkedIn or X.\n\n💡 Inside today's deep dive:\n"${topic}"\n\nSwipe through to see the exact 4-step framework we use to turn a single concept into 7 platform-optimized assets in minutes 📲👇\n\nSave this post for your next campaign planning session! 📌\n\n${cta}`;
        variants["INSTAGRAM"] = {
          platform: "INSTAGRAM",
          caption: igCaption,
          hashtags: ["#ContentCreator", "#SocialMediaGrowth", "#MarketingTips", "#AutomationTools", "#GrowthHacking"],
          ctaText: "Link in Bio",
          ctaUrl: "https://socialpilot.ai",
          characterCount: igCaption.length,
        };
      }

      // Facebook
      if (params.targetPlatforms.includes("FACEBOOK")) {
        const fbCaption = `Are you still spending hours every week adapting posts for different social networks?\n\nHere is an easier way to think about distribution: establish your brand guidelines once, and let intelligent workflow tools handle the formatting, tone adjustment, and media sizing.\n\nCheck out how modern teams are saving 20+ hours a month:\n👉 ${cta}`;
        variants["FACEBOOK"] = {
          platform: "FACEBOOK",
          caption: fbCaption,
          hashtags: ["#SocialMediaTips", "#BusinessGrowth", "#MarketingProductivity"],
          ctaText: "Learn More",
          ctaUrl: "https://socialpilot.ai",
          characterCount: fbCaption.length,
        };
      }

      // Threads
      if (params.targetPlatforms.includes("THREADS")) {
        const threadsCaption = `Unpopular opinion: If you are cross-posting the exact same caption to X, LinkedIn, and Threads, you are wasting 80% of your organic potential.\n\nThreads rewards authentic conversation, not corporate PR.\n\n${topic}.\n\nWhat do you think?`;
        variants["THREADS"] = {
          platform: "THREADS",
          caption: threadsCaption,
          hashtags: [],
          ctaText: "Reply",
          ctaUrl: "https://threads.net",
          characterCount: threadsCaption.length,
        };
      }

      // Pinterest
      if (params.targetPlatforms.includes("PINTEREST")) {
        const pinCaption = `Step-by-step strategy for ${topic}. Discover actionable marketing tactics, visual content templates, and social media scheduling best practices to grow your business online. Click through to explore the full guide.`;
        variants["PINTEREST"] = {
          platform: "PINTEREST",
          caption: pinCaption,
          hashtags: ["#MarketingStrategy", "#SocialMediaPlanner", "#BusinessTips"],
          ctaText: "Visit Site",
          ctaUrl: "https://socialpilot.ai",
          characterCount: pinCaption.length,
        };
      }

      // YouTube
      if (params.targetPlatforms.includes("YOUTUBE")) {
        const ytCaption = `In this video, we break down everything you need to know about ${topic}.\n\n📌 TIMESTAMPS:\n0:00 - Introduction\n1:45 - The Multi-Platform Framework\n4:20 - Automating Without Losing Brand Voice\n7:10 - Real Case Study\n\n🔔 Subscribe for weekly breakdowns.\n🔗 ${cta}`;
        variants["YOUTUBE"] = {
          platform: "YOUTUBE",
          caption: ytCaption,
          hashtags: ["#MarketingTutorial", "#GrowthHacking"],
          ctaText: "Subscribe",
          ctaUrl: "https://socialpilot.ai",
          characterCount: ytCaption.length,
        };
      }

      // Google Business Profile (GMB)
      if (params.targetPlatforms.includes("GOOGLE_BUSINESS")) {
        const gmbCaption = `📢 Business Update from ${brandName}:\n\n${topic}.\n\nLooking to elevate your local reach, streamline operations, and drive real customer action? Our team is here to help you grow with proven, reliable solutions.\n\n📍 Visit our location or connect with us online today!\n\n👉 ${cta}`;
        variants["GOOGLE_BUSINESS"] = {
          platform: "GOOGLE_BUSINESS",
          caption: gmbCaption.slice(0, 1500),
          hashtags: [],
          ctaText: "Learn More",
          ctaUrl: "https://socialpilot.ai",
          characterCount: Math.min(gmbCaption.length, 1500),
        };
      }
    }

    return { variants, isLiveOpenAI: false };
  }

  /**
   * Refines a caption using OpenAI or smart local heuristics
   */
  static async rewriteCaption(params: {
    caption: string;
    mode: "hook" | "shorten" | "expand" | "urgency";
    platform: string;
  }): Promise<{ rewritten: string; isLiveAI: boolean }> {
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.rewritten) {
          return { rewritten: data.rewritten, isLiveAI: true };
        }
      }
    } catch (e) {}

    // Fallback local revision
    const { caption, mode } = params;
    let revised = caption;
    if (mode === "shorten") {
      revised = caption.split("\n\n").slice(0, 2).join("\n\n");
    } else if (mode === "hook") {
      revised = `🚨 Attention founders: Most teams are making this critical mistake with social distribution.\n\n` + caption;
    } else if (mode === "urgency") {
      revised = caption + `\n\n⚡ Don't wait—this framework is only effective before algorithms adapt further.`;
    } else if (mode === "expand") {
      revised = caption + `\n\nBonus Tip: Always benchmark your top-performing hooks on X before expanding into long-form LinkedIn essays.`;
    }

    return { rewritten: revised, isLiveAI: false };
  }

  static async suggestInboxReply(conversationSnippet: string, customerMessage: string): Promise<string[]> {
    try {
      const res = await fetch("/api/ai/suggest-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: conversationSnippet, message: customerMessage }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && data.suggestions.length > 0) {
          return data.suggestions;
        }
      }
    } catch {}

    return [
      `Thanks for reaching out! We'd love to help with this. Let me connect you with our team right away.`,
      `Great question! You can easily explore our features and workflows directly through our documentation.`,
      `Appreciate your interest! Our team is currently reviewing your request and will follow up shortly.`,
    ];
  }

  static generateImagePrompt(postContext: string, style = "Photorealistic Modern SaaS"): string {
    return `Editorial minimal 3D render of a futuristic dashboard interface floating above a midnight dark studio surface with subtle neon electric lime lighting accents, ultra-clean glassmorphic textures, premium cinematic composition, 8k resolution, ${style}`;
  }
}

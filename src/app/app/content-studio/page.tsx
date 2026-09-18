"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  RefreshCw,
  Send,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Copy,
  Hash,
  Wand2,
  Trash2,
  ExternalLink,
  Sliders,
  Check,
  Upload,
  ImagePlus,
  Bot,
  Store,
  Star,
  MapPin,
  Video,
  Play,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Bookmark,
  MessageCircle,
  Repeat2,
  Share2,
  MoreHorizontal,
  MessageSquare,
  UserCheck,
  X as CloseIcon,
  Clock,
  Edit2,
  Plus,
} from "lucide-react";
import { demoStore } from "@/lib/demo-store";
import { useDemoStore } from "@/lib/use-demo-store";
import { useAuth } from "@/lib/auth/auth-context";
import { AIService } from "@/lib/ai/ai-service";
import { ProviderFactory } from "@/lib/providers/provider-factory";
import { ContentVariant, PlatformType } from "@/lib/types";
import { cn, generateToken, formatDate } from "@/lib/utils";

const PLATFORMS: { id: PlatformType; name: string; color: string; limit: number }[] = [
  { id: "LINKEDIN", name: "LinkedIn", color: "#0A66C2", limit: 3000 },
  { id: "X", name: "X (Twitter)", color: "#FFFFFF", limit: 280 },
  { id: "INSTAGRAM", name: "Instagram", color: "#E4405F", limit: 2200 },
  { id: "FACEBOOK", name: "Facebook", color: "#1877F2", limit: 63206 },
  { id: "GOOGLE_BUSINESS", name: "Google Business (GMB)", color: "#4285F4", limit: 1500 },
  { id: "THREADS", name: "Threads", color: "#FFFFFF", limit: 500 },
  { id: "YOUTUBE", name: "YouTube (Shorts)", color: "#FF0000", limit: 5000 },
  { id: "PINTEREST", name: "Pinterest", color: "#BD081C", limit: 500 },
];

const CONTENT_TYPES = [
  "Thought Leadership",
  "Product Launch",
  "Educational / How-To",
  "Promotional Post",
  "Customer Case Study",
  "Festival / Holiday",
  "Behind The Scenes",
];

const TONES = ["Authoritative", "Conversational", "Playful", "Inspiring", "Bold", "Empathetic"];

const LANGUAGES = [
  { id: "bn", name: "বাংলা (Bengali)", short: "বাংলা", flag: "🇧🇩", promptLang: "Bengali (বাংলা)" },
  { id: "en", name: "English", short: "English", flag: "🇬🇧", promptLang: "English" },
  { id: "hi", name: "हिंदी (Hindi)", short: "हिंदी", flag: "🇮🇳", promptLang: "Hindi (हिंदी)" },
];

const BENGALI_STARTER_VARIANTS: Record<string, ContentVariant> = {
  LINKEDIN: {
    platform: "LINKEDIN",
    caption: `আধুনিক সোশ্যাল মিডিয়ার প্রসারে মূল সমস্যা কিন্তু ক্রিয়েটিভিটি নয়।\n\nআসল সমস্যা হলো কন্টেন্ট তৈরি ও একাধিক প্ল্যাটফর্মের সঠিক ডিস্ট্রিবিউশনের মধ্যে সমন্বয়ের অভাব।\n\n২০২৬ সালে সোশ্যাল অ্যালগরিদমের দিকে তাকালে দেখা যায়, প্রতিটি নেটওয়ার্কের নিজস্ব ফরম্যাটে কন্টেন্ট প্রকাশ করা অত্যন্ত জরুরি। সফল কোম্পানিগুলো অন্ধভাবে সব জায়গায় এক পোস্ট কপি-পেস্ট করে না—তারা প্রতিটি মাধ্যমের দর্শকের মনস্তত্ত্ব বুঝে মূল বার্তাটি উপস্থাপন করে।\n\nমূল শিক্ষণীয় বিষয়সমূহ:\n১. নেটিভ ফরম্যাটিং ৩.২ গুণ বেশি মনোযোগ বা ডওয়েল টাইম তৈরি করে।\n২. সেন্ট্রালাইজড ব্র্যান্ড গাইডলাইন বিভ্রান্তিকর টোন প্রতিরোধ করে।\n৩. দ্রুত অনুমোদন ওয়ার্কফ্লো টিমকে গতিশীল রাখে।\n\nআজই সোশ্যালপাইলট ব্যবহার করে দেখুন এবং আপনার টিমকে দিন সুপারপাওয়ার।\n\nআপনার টিম কীভাবে একাধিক প্ল্যাটফর্মে কন্টেন্ট ম্যানেজ করে? কমেন্টে জানান।`,
    hashtags: ["#কন্টেন্টস্ট্র্যাটেজি", "#বিজনেসগ্রোথ", "#সোশ্যালমিডিয়াটিপস", "#মার্কেটিং"],
    ctaText: "বিস্তারিত পড়ুন",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 610,
  },
  X: {
    platform: "X",
    caption: `বেশিরভাগ মার্কেটিং টিম প্রতি সপ্তাহে ১৫+ ঘণ্টা নষ্ট করে শুধু ক্যাপশন রি-ফরম্যাট করতে।\n\nস্মার্ট মাল্টি-চ্যানেল অটোমেশন ব্যবহার করলে যা পাবেন:\n• ৪ গুণ দ্রুত পাবলিশিং গতি\n• নিখুঁত ব্র্যান্ড কনসিস্টেন্সি\n• শূন্য ম্যানুয়াল কপি-পেস্ট\n\nআজই ফ্রি ট্রায়াল শুরু করুন।`,
    hashtags: ["#মার্কেটিংটিপস", "#গ্রোথস্ট্র্যাটেজি"],
    ctaText: "ফ্রি ট্রায়াল",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 220,
  },
  INSTAGRAM: {
    platform: "INSTAGRAM",
    caption: `প্ল্যাটফর্মভেদে একই ক্যাপশন কপি-পেস্ট করা এখনই বন্ধ করুন 🛑✨\n\nপ্রতিটি প্ল্যাটফর্মের অডিয়েন্সের চাহিদা আলাদা। ইনস্টাগ্রামের ব্যবহারকারীরা যেভাবে কন্টেন্ট দেখে, তা লিঙ্কডইন বা টুইটার থেকে সম্পূর্ণ ভিন্ন।\n\n💡 আজকের বিশেষ আলোচনা:\nকেন ২০২৬ সালে ক্রস-পোস্টিং এর চেয়ে নেটিভ ওমনি-চ্যানেল ডিস্ট্রিবিউশন বেশি কার্যকর।\n\nএকটিমাত্র আইডিয়াকে কীভাবে কয়েক মিনিটে ৭টি প্ল্যাটফর্মের উপযোগী করে তুলবেন, তা দেখতে সোয়াইপ করুন 📲👇\n\nভবিষ্যতের জন্য পোস্টটি সেভ করে রাখুন! 📌\n\nআজই সোশ্যালপাইলট শুরু করুন।`,
    hashtags: ["#কন্টেন্টক্রিয়েটর", "#সোশ্যালমিডিয়াগ্রোথ", "#ডিজিটালমার্কেটিং", "#বিজনেসটিপস"],
    ctaText: "লিংক ইন বায়ো",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 395,
  },
  FACEBOOK: {
    platform: "FACEBOOK",
    caption: `আপনি কি এখনও প্রতি সপ্তাহে ঘণ্টার পর ঘণ্টা সময় নষ্ট করছেন বিভিন্ন সোশ্যাল নেটওয়ার্কের জন্য আলাদা পোস্ট তৈরি করতে?\n\nসহজ সমাধান হলো: একবার আপনার ব্র্যান্ড ভয়েস সেট করুন এবং এআই ওয়ার্কফ্লো দিয়ে সঠিক ফরম্যাট, টোন এবং সাইজিং নিশ্চিত করুন।\n\nদেখুন কীভাবে আধুনিক টিমগুলো মাসে ২০+ ঘণ্টা সময় বাঁচাচ্ছে:\n👉 আজই ফ্রি ট্রায়াল বুক করুন।`,
    hashtags: ["#সোশ্যালমিডিয়াটিপস", "#বিজনেসগ্রোথ"],
    ctaText: "আরও জানুন",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 340,
  },
  THREADS: {
    platform: "THREADS",
    caption: `আনপপুলার ওপিনিয়ন: আপনি যদি X, লিঙ্কডইন আর ইনস্টাগ্রামে হুবহু একই ক্যাপশন দেন, তবে আপনি আপনার রিচের ৬০% নষ্ট করছেন।\n\nপ্রতিটি প্ল্যাটফর্মের অ্যালগরিদম তাদের নিজস্ব ফরম্যাটকে প্রাধান্য দেয়।\n\nআপনি এই ব্যাপারে কী ভাবছেন? নিচে কমেন্ট করুন 👇`,
    hashtags: ["#সোশ্যালমিডিয়া"],
    ctaText: "আলোচনা করুন",
    ctaUrl: "https://threads.net",
    characterCount: 215,
  },
  YOUTUBE: {
    platform: "YOUTUBE",
    caption: `২০২৬ সালে ক্রস-পোস্টিং বনাম নেটিভ মাল্টি-প্ল্যাটফর্ম ডিস্ট্রিবিউশন 🎬\n\nএকই ক্যাপশন বারবার কপি-পেস্ট করা বন্ধ করুন। আধুনিক মার্কেটিং এজেন্সিগুলো কীভাবে একটি সিঙ্গেল কনসেপ্টকে সহজে বিভিন্ন প্ল্যাটফর্মে রূপান্তর করে, তা এই ভিডিওতে বিস্তারিত দেখুন।\n\n📌 টাইমস্ট্যাম্পস:\n০:০০ - ভূমিকা\n১:৪৫ - ওমনি-চ্যানেল ফ্রেমওয়ার্ক\n৪:২০ - ব্র্যান্ড ভয়েস ধরে রাখার উপায়\n\n🔔 সাবস্ক্রাইব করুন এবং বেল আইকনে ক্লিক করে আমাদের সাথে থাকুন!`,
    hashtags: ["#Shorts", "#মার্কেটিংটিউটোরিয়াল", "#বিজনেসগ্রোথ"],
    ctaText: "সাবস্ক্রাইব করুন",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 310,
  },
  PINTEREST: {
    platform: "PINTEREST",
    caption: `সোশ্যাল মিডিয়ায় মাল্টি-প্ল্যাটফর্ম ডিস্ট্রিবিউশনের সম্পূর্ণ গাইড। আপনার ব্যবসার জন্য কার্যকর মার্কেটিং স্ট্র্যাটেজি, ভিজ্যুয়াল টেমপ্লেট এবং শিডিউলিং নিয়মাবলী জানতে সম্পূর্ণ গাইডটি ভিজিট করুন।`,
    hashtags: ["#মার্কেটিংস্ট্র্যাটেজি", "#সোশ্যালমিডিয়াটিপস"],
    ctaText: "ওয়েবসাইট ভিজিট করুন",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 210,
  },
  GOOGLE_BUSINESS: {
    platform: "GOOGLE_BUSINESS",
    caption: `📢 আমাদের লোকাল বিজনেস থেকে বিশেষ আপডেট:\n\nআপনার ব্যবসার অনলাইন উপস্থিতি বাড়াতে এবং কাস্টমারদের সাথে সরাসরি যোগাযোগ স্থাপন করতে চান? আমাদের স্মার্ট ম্যানেজমেন্ট সলিউশন আধুনিক ব্যবসায়ীদের সময় বাঁচায় এবং নতুন গ্রাহক তৈরি করতে সাহায্য করে।\n\n📍 সরাসরি আমাদের আউটলেটে আসুন অথবা অনলাইনে যোগাযোগ করুন!\n\n👉 এখনই বিস্তারিত জানতে কল বা বুক করুন।`,
    hashtags: [],
    ctaText: "যোগাযোগ করুন",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 290,
  },
};

const ENGLISH_STARTER_VARIANTS: Record<string, ContentVariant> = {
  LINKEDIN: {
    platform: "LINKEDIN",
    caption: `The biggest bottleneck in modern social growth isn't creativity.\n\nIt's the friction between creation and multi-channel distribution.\n\nWhen we look at social algorithms in 2026, native syntax is non-negotiable. The companies scaling their organic pipeline aren't publishing more noise—they are adapting their core message with precision to every channel's native psychology.\n\nKey takeaways:\n1. Native formatting drives 3.2x higher dwell time.\n2. Centralized brand intelligence prevents fragmented voice.\n3. Rapid approvals prevent campaign logjams.\n\nTry SocialPilot free or schedule a walkthrough today.\n\nHow does your team currently handle multi-platform distribution? Drop your workflow below.`,
    hashtags: ["#MarketingStrategy", "#Leadership", "#B2BGrowth", "#ContentStrategy"],
    ctaText: "Try Free",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 650,
  },
  X: {
    platform: "X",
    caption: `Most marketing teams waste 15+ hours weekly reformatting captions.\n\nHere is what changes when you automate native distribution:\n• 4x higher publishing velocity\n• Flawless brand consistency\n• Zero manual copy-pasting\n\nTry SocialPilot free or schedule a walkthrough today.`,
    hashtags: ["#SocialMediaAI", "#GrowthStrategy"],
    ctaText: "Try Free",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 235,
  },
  INSTAGRAM: {
    platform: "INSTAGRAM",
    caption: `Stop copying & pasting your captions across platforms 🛑✨\n\nNative psychology is everything. The way your audience consumes on Instagram is completely distinct from LinkedIn or X.\n\n💡 Inside today's deep dive:\nWhy omni-channel native distribution outperforms cross-posting in 2026.\n\nSwipe through to see the exact framework we use to turn a single concept into 7 platform-optimized assets in minutes 📲👇\n\nTry SocialPilot free or schedule a walkthrough today.`,
    hashtags: [
      "#ContentCreator",
      "#SocialMediaGrowth",
      "#MarketingTips",
      "#DigitalMarketingAgency",
      "#AIContent",
      "#CreatorEconomy",
    ],
    ctaText: "Link in Bio",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 420,
  },
  FACEBOOK: {
    platform: "FACEBOOK",
    caption: `Are you still spending hours every week adapting posts for different social networks?\n\nHere is an easier way to think about distribution: establish your brand guidelines once, and let intelligent workflow tools handle the formatting, tone adjustment, and media sizing.\n\nCheck out how modern teams are saving 20+ hours a month:\n👉 Try SocialPilot free or schedule a walkthrough today.`,
    hashtags: ["#SocialMediaTips", "#BusinessGrowth"],
    ctaText: "Learn More",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 380,
  },
  THREADS: {
    platform: "THREADS",
    caption: `Unpopular opinion: If you are cross-posting identical captions to X, LinkedIn, and Instagram, you are hurting your reach.\n\nEvery platform algorithm rewards native format syntax.\n\nHere is why omni-channel native distribution outperforms cross-posting in 2026 🧵👇`,
    hashtags: ["#SocialMedia", "#ContentTips"],
    ctaText: "Discuss",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 240,
  },
  YOUTUBE: {
    platform: "YOUTUBE",
    caption: `Why omni-channel native distribution outperforms cross-posting in 2026 🎬\n\nStop copying and pasting identical captions across platforms. Discover the unified workflow top agencies use to multiply organic pipeline velocity without extra headcount.\n\n👉 Subscribe and tap the bell for weekly growth playbooks!`,
    hashtags: ["#Shorts", "#ContentMarketing", "#SocialMediaStrategy", "#AIAutomation"],
    ctaText: "Subscribe",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 330,
  },
  PINTEREST: {
    platform: "PINTEREST",
    caption: `Step-by-step strategy for omni-channel native distribution in 2026. Discover actionable marketing tactics, visual content templates, and social media scheduling best practices to grow your business online.`,
    hashtags: ["#MarketingStrategy", "#SocialMediaPlanner"],
    ctaText: "Visit Site",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 220,
  },
  GOOGLE_BUSINESS: {
    platform: "GOOGLE_BUSINESS",
    caption: `📢 Exciting Update for our Local Community!\n\nAre you looking to streamline your social media workflow and scale your brand presence effortlessly? Visit us or explore our solutions online to see how modern teams are saving 20+ hours every month.\n\n👉 Connect with our team today for a tailored walkthrough!`,
    hashtags: [],
    ctaText: "Learn More",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 320,
  },
};

const HINDI_STARTER_VARIANTS: Record<string, ContentVariant> = {
  LINKEDIN: {
    platform: "LINKEDIN",
    caption: `सोशल ग्रोथ में सबसे बड़ी बाधा रचनात्मकता नहीं है, बल्कि क्रिएशन और मल्टी-चैनल वितरण के बीच का तालमेल है।\n\nजब हम 2026 में सोशल एल्गोरिदम को देखते हैं, तो हर चैनल के अनुसार संदेश को ढालना आवश्यक है।\n\nमुख्य सीख:\n1. नेटिव फॉर्मेटिंग 3.2 गुना अधिक जुड़ाव देती है।\n2. केंद्रीकृत ब्रांड इंटेलिजेंस एकरूपता बनाए रखती है।\n3. त्वरित अनुमोदन प्रक्रिया काम में तेजी लाती है।\n\nआज ही सोशलपायलट का निःशुल्क ट्रायल शुरू करें।`,
    hashtags: ["#बिजनेसग्रोथ", "#मार्केटिंगस्ट्रेटेजी", "#सोशलमीडियाटिप्स"],
    ctaText: "पूरा पढ़ें",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 520,
  },
  X: {
    platform: "X",
    caption: `अधिकतर मार्केटिंग टीमें हर हफ्ते 15+ घंटे केवल कैप्शन सुधारने में बर्बाद करती हैं।\n\nमल्टी-चैनल ऑटोमेशन से क्या बदलता है:\n• 4 गुना तेज पब्लिशिंग गति\n• सटीक ब्रांड निरंतरता\n• शून्य मैनुअल कॉपी-पेस्ट\n\nआज ही शुरू करें।`,
    hashtags: ["#मार्केटिंगटिप्स", "#ग्रोथस्ट्रेटेजी"],
    ctaText: "फ्री ट्रायल",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 210,
  },
  INSTAGRAM: {
    platform: "INSTAGRAM",
    caption: `सभी प्लेटफॉर्म्स पर एक ही कैप्शन कॉपी-पेस्ट करना बंद करें 🛑✨\n\nहर प्लेटफॉर्म के दर्शकों का व्यवहार अलग होता है।\n\n💡 आज का मुख्य विषय:\n2026 में क्रॉस-पोस्टिंग के मुकाबले नेटिव मल्टी-चैनल वितरण क्यों बेहतर है।\n\nएक ही विचार को कई प्लेटफॉर्म्स के लिए अनुकूल बनाने का तरीका जानने के लिए स्वाइप करें 📲👇\n\nभविष्य के लिए इस पोस्ट को सेव करें! 📌`,
    hashtags: ["#कंटेंटक्रिएटर", "#सोशलमीडियाग्रोथ", "#डिजिटलमार्केटिंग"],
    ctaText: "बायो में लिंक",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 380,
  },
  FACEBOOK: {
    platform: "FACEBOOK",
    caption: `क्या आप अभी भी विभिन्न सोशल नेटवर्क के लिए पोस्ट बनाने में हर हफ्ते कई घंटे बिता रहे हैं?\n\nएक बार अपनी ब्रांड गाइडलाइंस सेट करें और ऑटोमेशन से सही फॉर्मेट और टोन पाएं।\n\nदेखें कि आधुनिक टीमें महीने में 20+ घंटे कैसे बचा रही हैं:\n👉 आज ही फ्री ट्रायल लें।`,
    hashtags: ["#सोशलमीडियाटिप्स", "#बिजनेसग्रोथ"],
    ctaText: "और जानें",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 310,
  },
  THREADS: {
    platform: "THREADS",
    caption: `अलोकप्रिय राय: यदि आप X, लिंक्डइन और इंस्टाग्राम पर एक ही कैप्शन पोस्ट कर रहे हैं, तो आप अपनी पहुंच खो रहे हैं।\n\nहर प्लेटफॉर्म का एल्गोरिदम अपने नेटिव फॉर्मेट को पसंद करता है।\n\nआपकी क्या राय है? नीचे चर्चा करें 👇`,
    hashtags: ["#सोशलमीडिया"],
    ctaText: "जवाब दें",
    ctaUrl: "https://threads.net",
    characterCount: 210,
  },
  YOUTUBE: {
    platform: "YOUTUBE",
    caption: `2026 में क्रॉस-पोस्टिंग बनाम नेटिव मल्टी-प्लेटफ़ॉर्म वितरण 🎬\n\nएक ही कैप्शन कॉपी-पेस्ट करना बंद करें। इस वीडियो में जानें कि आधुनिक मार्केटिंग टीमें आसानी से मल्टी-प्लेटफ़ॉर्म कंटेंट कैसे तैयार करती हैं।\n\n🔔 साप्ताहिक अपडेट के लिए सब्सक्राइब करें!`,
    hashtags: ["#Shorts", "#मार्केटिंगट्यूटोरियल", "#बिजनेसग्रोथ"],
    ctaText: "सब्सक्राइब करें",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 290,
  },
  PINTEREST: {
    platform: "PINTEREST",
    caption: `सोशल मीडिया पर मल्टी-प्लेटफ़ॉर्म कंटेंट वितरण के लिए सम्पूर्ण गाइड। अपने व्यवसाय को ऑनलाइन बढ़ाने के लिए उपयोगी मार्केटिंग रणनीतियां जानने के लिए पूरा गाइड देखें।`,
    hashtags: ["#मार्केटिंगस्ट्रेटेजी", "#सोशलमीडियाटिप्स"],
    ctaText: "साइट देखें",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 195,
  },
  GOOGLE_BUSINESS: {
    platform: "GOOGLE_BUSINESS",
    caption: `📢 हमारे स्थानीय व्यापार से विशेष अपडेट:\n\nअपने व्यवसाय की ऑनलाइन पहुंच बढ़ाएं और ग्राहकों से सीधे जुड़ें। हमारे समाधान आपका समय बचाते हैं और नए ग्राहक जोड़ने में मदद करते हैं।\n\n📍 हमारी शाखा पर आएं या ऑनलाइन संपर्क करें!\n\n👉 आज ही संपर्क करें।`,
    hashtags: [],
    ctaText: "संपर्क करें",
    ctaUrl: "https://socialpilot.ai",
    characterCount: 260,
  },
};

function getCleanHandle(channel?: any, brand?: any): string {
  const raw = channel?.handle || "";
  const cleaned = raw.replace(/^@/, "").trim();
  if (cleaned && !/^[_\s-]+$/.test(cleaned)) {
    return cleaned;
  }
  if (channel?.accountName && !/^[_\s-]+$/.test(channel.accountName.trim())) {
    const slug = channel.accountName.trim().toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "");
    if (slug) return slug;
  }
  if (brand?.slug && !/^[_\s-]+$/.test(brand.slug.trim())) {
    return brand.slug.trim();
  }
  return "socialpilot_ai";
}

function getCleanDisplayName(channel?: any, brand?: any): string {
  if (channel?.accountName && !/^[_\s-]+$/.test(channel.accountName.trim())) {
    return channel.accountName.trim();
  }
  if (brand?.name && !/^[_\s-]+$/.test(brand.name.trim())) {
    return brand.name.trim();
  }
  return "SocialPilot AI";
}

export default function ContentStudioPage() {
  const { data, activeBrand, store } = useDemoStore();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Brief state (Defaults to Bengali if 'bn' is selected)
  const [topic, setTopic] = useState(
    "কেন ২০২৬ সালে অন্ধ কপি-পেস্টের চেয়ে প্রতিটি সোশ্যাল নেটওয়ার্কের নিজস্ব ফরম্যাটে পোস্ট করা বেশি কার্যকর"
  );
  const [contentType, setContentType] = useState("Thought Leadership");
  const [tone, setTone] = useState("Authoritative");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("bn");
  const [targetAudience, setTargetAudience] = useState("Founders, Agency Owners, and Marketing Heads");
  const [cta, setCta] = useState("আজই সোশ্যালপাইলট ফ্রি ট্রায়াল শুরু করুন।");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([
    "LINKEDIN",
    "X",
    "INSTAGRAM",
    "FACEBOOK",
    "GOOGLE_BUSINESS",
    "THREADS",
    "YOUTUBE",
    "PINTEREST",
  ]);

  // Active editing tab
  const [activeTab, setActiveTab] = useState<PlatformType>("INSTAGRAM");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishingAll, setIsPublishingAll] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [scheduleTime, setScheduleTime] = useState("14:00");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  // Selected media for post (Empty by default, direct upload only)
  const [selectedMedia, setSelectedMedia] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "">("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileSize, setUploadedFileSize] = useState<string>("");

  // Platform variants initialized with authentic Bengali content matching selectedLanguage="bn"
  const [variants, setVariants] = useState<Record<PlatformType, ContentVariant>>(BENGALI_STARTER_VARIANTS);

  // Hashtag Management States
  const [newHashtagInput, setNewHashtagInput] = useState("");
  const [editingHashtagIndex, setEditingHashtagIndex] = useState<number | null>(null);
  const [editingHashtagValue, setEditingHashtagValue] = useState("");

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    if (langId === "bn") {
      setVariants(BENGALI_STARTER_VARIANTS);
      setTopic("কেন ২০২৬ সালে অন্ধ কপি-পেস্টের চেয়ে প্রতিটি সোশ্যাল নেটওয়ার্কের নিজস্ব ফরম্যাটে পোস্ট করা বেশি কার্যকর");
      setCta("আজই সোশ্যালপাইলট ফ্রি ট্রায়াল শুরু করুন।");
      showToast("বাংলা (Bengali) ভাষা নির্বাচিত হয়েছে। ক্যাপশন আপডেট করা হয়েছে!", "info");
    } else if (langId === "hi") {
      setVariants(HINDI_STARTER_VARIANTS);
      setTopic("2026 में क्रॉस-पोस्टिंग के मुकाबले नेटिव मल्टी-चैनल वितरण क्यों अधिक प्रभावी है");
      setCta("आज ही सोशलपायलट का निःशुल्क ट्रायल शुरू करें।");
      showToast("हिंदी (Hindi) भाषा चुनी गई। कैप्शन अपडेट किए गए!", "info");
    } else {
      setVariants(ENGLISH_STARTER_VARIANTS);
      setTopic("Why omni-channel native distribution outperforms cross-posting in 2026");
      setCta("Try SocialPilot free or schedule a walkthrough today.");
      showToast("English language selected. Captions updated!", "info");
    }
  };

  const togglePlatform = (p: PlatformType) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        const next = selectedPlatforms.filter((item) => item !== p);
        setSelectedPlatforms(next);
        if (activeTab === p) setActiveTab(next[0]);
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  // AI Content Generation with OpenAI
  const handleGenerateAI = async () => {
    if (!topic.trim()) {
      showToast("Please enter a topic or raw idea first.", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const selectedLangObj = LANGUAGES.find((l) => l.id === selectedLanguage) || LANGUAGES[0];
      const res = await AIService.generateMultiPlatformContent({
        topic,
        contentType,
        tone,
        language: selectedLangObj.promptLang,
        targetAudience,
        callToAction: cta,
        brand: activeBrand,
        targetPlatforms: selectedPlatforms,
      });

      setVariants((prev) => ({
        ...prev,
        ...res.variants,
      }));

      if (res.isLiveOpenAI) {
        showToast(`✨ Generated native captions with OpenAI ${res.model || "GPT-4o"}!`, "success");
      } else {
        showToast("✨ AI generated tailored variations for all selected platforms!", "success");
      }
    } catch (e: any) {
      showToast("AI generation encountered an issue. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateCurrentCaption = (newCaption: string) => {
    setVariants((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        caption: newCaption,
        characterCount: newCaption.length,
      },
    }));
  };

  const updateCurrentHashtags = (newHashtags: string[]) => {
    setVariants((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        hashtags: newHashtags,
      },
    }));
  };

  const handleAddHashtag = (tagToAdd?: string) => {
    const raw = (tagToAdd !== undefined ? tagToAdd : newHashtagInput).trim();
    if (!raw) return;

    // Split by spaces or commas in case user inputs multiple hashtags at once
    const rawTokens = raw.split(/[\s,]+/).filter(Boolean);
    const existingTags = variants[activeTab]?.hashtags || [];
    const formattedTokens: string[] = [];

    rawTokens.forEach((token) => {
      let clean = token.trim().replace(/^#+/, "");
      if (!clean) return;
      const fullTag = `#${clean}`;
      if (!existingTags.includes(fullTag) && !formattedTokens.includes(fullTag)) {
        formattedTokens.push(fullTag);
      }
    });

    if (formattedTokens.length > 0) {
      updateCurrentHashtags([...existingTags, ...formattedTokens]);
      setNewHashtagInput("");
      showToast(`Added ${formattedTokens.length} hashtag${formattedTokens.length > 1 ? "s" : ""}`, "success");
    } else {
      setNewHashtagInput("");
    }
  };

  const handleDeleteHashtag = (idxToDelete: number) => {
    const existing = variants[activeTab]?.hashtags || [];
    const deletedTag = existing[idxToDelete];
    const next = existing.filter((_, i) => i !== idxToDelete);
    updateCurrentHashtags(next);
    if (editingHashtagIndex === idxToDelete) {
      setEditingHashtagIndex(null);
      setEditingHashtagValue("");
    } else if (editingHashtagIndex !== null && editingHashtagIndex > idxToDelete) {
      setEditingHashtagIndex(editingHashtagIndex - 1);
    }
    showToast(`Deleted ${deletedTag || "hashtag"}`, "info");
  };

  const handleStartEditHashtag = (idx: number, currentTag: string) => {
    setEditingHashtagIndex(idx);
    setEditingHashtagValue(currentTag.replace(/^#+/, ""));
  };

  const handleSaveEditHashtag = () => {
    if (editingHashtagIndex === null) return;
    const clean = editingHashtagValue.trim().replace(/^#+/, "");
    if (!clean) {
      handleDeleteHashtag(editingHashtagIndex);
      return;
    }
    const fullTag = `#${clean}`;
    const existing = [...(variants[activeTab]?.hashtags || [])];
    existing[editingHashtagIndex] = fullTag;
    updateCurrentHashtags(existing);
    setEditingHashtagIndex(null);
    setEditingHashtagValue("");
    showToast(`Updated hashtag to ${fullTag}`, "success");
  };

  const handleCancelEditHashtag = () => {
    setEditingHashtagIndex(null);
    setEditingHashtagValue("");
  };

  const handleClearAllHashtags = () => {
    const existing = variants[activeTab]?.hashtags || [];
    if (existing.length === 0) return;
    updateCurrentHashtags([]);
    setEditingHashtagIndex(null);
    setEditingHashtagValue("");
    showToast("Cleared all hashtags for this platform", "info");
  };

  // AI Assistant Quick Refinements (Hook, Shorten, Expand, Urgency)
  const handleQuickRewrite = async (mode: "shorten" | "expand" | "hook" | "urgency") => {
    const current = variants[activeTab]?.caption || "";
    if (!current.trim()) return;

    setIsRewriting(true);
    try {
      const res = await AIService.rewriteCaption({
        caption: current,
        mode,
        platform: activeTab,
      });
      updateCurrentCaption(res.rewritten);
      if (res.isLiveAI) {
        showToast(`⚡ Refined caption with OpenAI (${mode})!`, "success");
      } else {
        showToast(`Caption revised with "${mode}" intent`, "info");
      }
    } catch {
      showToast("Refinement failed.", "error");
    } finally {
      setIsRewriting(false);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WebP, GIF)", "error");
      return;
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    setUploadedFileName(file.name);
    setUploadedFileSize(sizeFormatted);
    setMediaType("image");

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSelectedMedia(dataUrl);
        showToast(`🖼️ Image "${file.name}" uploaded directly!`, "success");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Video Upload Handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      showToast("Please select a valid video file (MP4, MOV, WebM, OGG)", "error");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      showToast("Video exceeds 100MB browser preview limit. Please choose a shorter clip.", "error");
      return;
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    setUploadedFileName(file.name);
    setUploadedFileSize(sizeFormatted);
    setMediaType("video");

    const objectUrl = URL.createObjectURL(file);
    setSelectedMedia(objectUrl);
    showToast(`🎬 Video "${file.name}" uploaded! Ready for YouTube Shorts, Reels & Video feeds.`, "success");
    e.target.value = "";
  };

  // AI Image Generation (DALL-E)
  const handleGenerateAIImage = async () => {
    setIsGeneratingImage(true);
    showToast("🎨 Generating AI image with DALL-E for your topic...", "info");

    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Modern editorial social media visual representation of: ${topic}. Ultra clean aesthetic, sleek lighting, brand colors.`,
        }),
      });

      const json = await res.json();
      if (json.success && json.url) {
        setSelectedMedia(json.url);
        setMediaType("image");
        setUploadedFileName(`AI Generated Image (${topic.slice(0, 20)}...)`);
        setUploadedFileSize("1024x1024");
        showToast("✨ DALL-E image generated and attached!", "success");
      } else {
        showToast(json.error || "DALL-E generation failed. Check OPENAI_API_KEY.", "error");
      }
    } catch {
      showToast("Failed to connect to image generation endpoint.", "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const currentVariant = variants[activeTab] || {
    caption: "",
    hashtags: [],
    characterCount: 0,
  };
  const activePlatformConfig = PLATFORMS.find((p) => p.id === activeTab) || PLATFORMS[0];
  const activePlatformDisplayName = activePlatformConfig?.name.replace(/ \(.*\)/, "") || activeTab;
  const isOverLimit = currentVariant.characterCount > activePlatformConfig.limit;

  // Real connected channel matching active editing tab (e.g. FACEBOOK)
  const connectedChannel = data.socialAccounts.find(
    (acc) => acc.platform?.toUpperCase() === activeTab?.toUpperCase()
  );

  const formatCaptionForPublish = (variant?: ContentVariant) => {
    if (!variant) return "";
    let text = variant.caption || "";
    if (variant.hashtags && variant.hashtags.length > 0) {
      const unincludedTags = variant.hashtags.filter((h) => !text.includes(h));
      if (unincludedTags.length > 0) {
        text = `${text.trim()}\n\n${unincludedTags.join(" ")}`;
      }
    }
    return text;
  };

  const handlePublishNow = async () => {
    const activeCaption = variants[activeTab]?.caption?.trim();
    if (!activeCaption) {
      showToast(`⚠️ The ${activePlatformDisplayName} post has no content. Please add a caption first!`, "error");
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: activeTab,
          caption: formatCaptionForPublish(variants[activeTab]),
          mediaUrls: selectedMedia ? [selectedMedia] : [],
          accountId: connectedChannel?.platformAccountId,
          accessToken: connectedChannel?.accessToken,
        }),
      });

      const res = await response.json();
      setIsPublishing(false);

      if (res.success) {
        demoStore.addPost({
          workspaceId: data.activeWorkspaceId,
          brandId: data.activeBrandId,
          title: topic ? (topic.slice(0, 40) + (topic.length > 40 ? "..." : "")) : `${activePlatformDisplayName} Post`,
          basePrompt: topic,
          contentType,
          status: "PUBLISHED",
          publishedAt: new Date().toISOString(),
          targetPlatforms: [activeTab],
          variants: {
            [activeTab]: variants[activeTab],
          } as any,
          mediaUrls: selectedMedia ? [selectedMedia] : [],
        });

        if (res.live) {
          showToast(`🎉 লাইভ পোস্ট আপনার ${activePlatformDisplayName} অ্যাকাউন্টে সফলভাবে পাবলিশ হয়েছে! (ID: ${res.postId})`, "success");
        } else {
          showToast(`🚀 ${activePlatformDisplayName} post published successfully to SocialPilot!`, "success");
        }

        // Trigger automated Gmail notification
        fetch("/api/notifications/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "POST_PUBLISHED",
            to: user?.email,
            data: {
              brandName: activeBrand?.name || "Primary Brand",
              brandEmail: activeBrand?.brandEmail,
              platforms: [activePlatformDisplayName],
              caption: formatCaptionForPublish(variants[activeTab]),
              publishedAt: new Date().toISOString(),
            },
          }),
        }).catch((e) => console.warn("[Notification] Email dispatch error:", e));
      } else {
        showToast(res.error || `Publishing to ${activePlatformDisplayName} failed. Please check account permissions.`, "error");
      }
    } catch (err: any) {
      setIsPublishing(false);
      showToast("Publish request failed. Please try again.", "error");
    }
  };

  const handlePublishAll = async () => {
    // Filter selectedPlatforms to only those that have non-empty content
    const populatedPlatforms = selectedPlatforms.filter((p) => {
      const v = variants[p];
      return v && v.caption && v.caption.trim().length > 0;
    });

    const emptyPlatforms = selectedPlatforms.filter((p) => !populatedPlatforms.includes(p));

    if (populatedPlatforms.length === 0) {
      showToast("⚠️ No platforms have content set. Please write or generate captions first!", "error");
      return;
    }

    setIsPublishingAll(true);
    try {
      for (const plat of populatedPlatforms) {
        const channel = data.socialAccounts.find(
          (acc) => acc.platform?.toUpperCase() === plat?.toUpperCase()
        );
        try {
          await fetch("/api/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              platform: plat,
              caption: formatCaptionForPublish(variants[plat]),
              mediaUrls: selectedMedia ? [selectedMedia] : [],
              accountId: channel?.platformAccountId,
              accessToken: channel?.accessToken,
            }),
          });
        } catch (e) {
          console.error(`Error publishing to ${plat}:`, e);
        }
      }

      demoStore.addPost({
        workspaceId: data.activeWorkspaceId,
        brandId: data.activeBrandId,
        title: topic ? (topic.slice(0, 40) + (topic.length > 40 ? "..." : "")) : "Multi-Platform Omni Post",
        basePrompt: topic,
        contentType,
        status: "PUBLISHED",
        publishedAt: new Date().toISOString(),
        targetPlatforms: populatedPlatforms,
        variants,
        mediaUrls: selectedMedia ? [selectedMedia] : [],
      });

      const populatedNames = populatedPlatforms
        .map((p) => PLATFORMS.find((cfg) => cfg.id === p)?.name.replace(/ \(.*\)/, "") || p)
        .join(", ");

      const skippedNote = emptyPlatforms.length > 0
        ? ` (${emptyPlatforms.length} blank platform${emptyPlatforms.length > 1 ? "s" : ""} skipped)`
        : "";

      showToast(
        `🚀 Published to ${populatedPlatforms.length} platform(s): ${populatedNames}${skippedNote}!`,
        "success"
      );

      // Trigger automated Gmail notification for all platforms
      fetch("/api/notifications/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "POST_PUBLISHED",
          to: user?.email,
          data: {
            brandName: activeBrand?.name || "Primary Brand",
            brandEmail: activeBrand?.brandEmail,
            platforms: populatedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.name || p),
            caption: formatCaptionForPublish(variants[populatedPlatforms[0]]),
            publishedAt: new Date().toISOString(),
          },
        }),
      }).catch((e) => console.warn("[Notification] Email dispatch error:", e));
    } catch (err: any) {
      showToast("Failed to publish to all platforms. Please try again.", "error");
    } finally {
      setIsPublishingAll(false);
    }
  };

  const handleConfirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      showToast("Please select both a date and time to schedule.", "error");
      return;
    }
    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    if (isNaN(scheduledDateTime.getTime())) {
      showToast("Invalid date or time selected.", "error");
      return;
    }

    demoStore.addPost({
      workspaceId: data.activeWorkspaceId,
      brandId: data.activeBrandId,
      title: topic ? (topic.slice(0, 40) + (topic.length > 40 ? "..." : "")) : "Scheduled Social Post",
      basePrompt: topic,
      contentType,
      status: "SCHEDULED",
      scheduledAt: scheduledDateTime.toISOString(),
      targetPlatforms: selectedPlatforms,
      variants,
      mediaUrls: selectedMedia ? [selectedMedia] : [],
    });

    setIsScheduleModalOpen(false);
    showToast(
      `📅 Post scheduled for ${formatDate(scheduledDateTime.toISOString(), "medium")}! Added to Scheduled posts list.`,
      "success"
    );

    // Trigger automated Gmail notification for scheduled post
    fetch("/api/notifications/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "POST_SCHEDULED",
        to: user?.email,
        data: {
          brandName: activeBrand?.name || "Primary Brand",
          brandEmail: activeBrand?.brandEmail,
          platforms: selectedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.name || p),
          caption: formatCaptionForPublish(variants[activeTab]),
          scheduledAt: scheduledDateTime.toISOString(),
        },
      }),
    }).catch((e) => console.warn("[Notification] Email dispatch error:", e));
  };

  const handleSendApproval = () => {
    const token = generateToken(24);
    const postTitle = topic ? (topic.slice(0, 40) + (topic.length > 40 ? "..." : "")) : "New Multi-Platform Campaign Draft";

    const newPost = demoStore.addPost({
      workspaceId: data.activeWorkspaceId,
      brandId: data.activeBrandId,
      title: postTitle,
      basePrompt: topic,
      contentType,
      status: "PENDING_APPROVAL",
      targetPlatforms: selectedPlatforms,
      variants,
      mediaUrls: selectedMedia ? [selectedMedia] : [],
    });

    demoStore.addApprovalRequest({
      contentId: newPost.id,
      clientToken: token,
      state: "PENDING",
      clientName: `${activeBrand.name} Client Reviewer`,
      clientEmail: `client@${activeBrand.slug || "brand"}.com`,
      contentTitle: postTitle,
      platforms: selectedPlatforms,
      comments: [
        {
          id: `comm-${Date.now()}`,
          authorName: "Content Lead",
          isExternalClient: false,
          message: "Draft submitted for stakeholder review and sign-off.",
          createdAt: new Date().toISOString(),
        },
      ],
    });

    showToast(`📋 Added to Approvals page! Client link: /client/approval/${token}`, "success");
  };

  const cleanHandle = getCleanHandle(connectedChannel, activeBrand);
  const cleanDisplayName = getCleanDisplayName(connectedChannel, activeBrand);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={cn(
            "fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl text-white text-xs shadow-2xl flex items-center gap-2 border transition-all animate-in slide-in-from-top-2",
            notification.type === "success" && "bg-[#182238] border-[#D4FF32] text-white",
            notification.type === "error" && "bg-[#28151E] border-rose-500 text-rose-200",
            notification.type === "info" && "bg-[#182238] border-sky-400 text-slate-200"
          )}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#D4FF32] flex-shrink-0" />
          ) : notification.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {selectedMedia && isImagePreviewOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020817]/80 backdrop-blur-sm p-4"
          onClick={() => setIsImagePreviewOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#121A2B] p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsImagePreviewOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1020] text-slate-200 border border-[rgba(255,255,255,0.12)] hover:text-white cursor-pointer"
              aria-label="Close media preview"
            >
              ✕
            </button>
            {mediaType === "video" ? (
              <video
                src={selectedMedia}
                controls
                autoPlay
                className="max-h-[80vh] w-full rounded-xl object-contain bg-[#0B1020]"
              />
            ) : (
              <img
                src={selectedMedia}
                alt="Selected media preview"
                className="max-h-[80vh] w-full rounded-xl object-contain bg-[#0B1020]"
              />
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">AI Content Studio</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] px-2 py-0.5 rounded-full font-bold border border-[#D4FF32]/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> OpenAI Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create once. Tailor automatically with OpenAI GPT-4o. Upload images and publish with brand consistency.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Client Approval Button */}
          <button
            onClick={handleSendApproval}
            className="px-3 py-1.5 rounded-lg bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] text-xs text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Create client approval request and add to Approvals page"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Client Approval</span>
          </button>

          {/* 2. Schedule Button */}
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] text-xs text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Select date & time to schedule post"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Schedule</span>
          </button>

          {/* 3. Dynamic Active Platform Publish Button */}
          <button
            onClick={handlePublishNow}
            disabled={isPublishing}
            className="px-3.5 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            title={`Publish only ${activePlatformDisplayName} post now`}
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>{activePlatformDisplayName} Post Publish Now</span>
              </>
            )}
          </button>

          {/* 4. All Platform Publish Button */}
          <button
            onClick={handlePublishAll}
            disabled={isPublishingAll}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            title="Publish across all platforms with content in one click (blank platforms skipped)"
          >
            {isPublishingAll ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing All...</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>All Platform Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Brief & AI Parameters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                1. Content Brief
              </span>
              <span className="text-[10px] text-slate-400">Brand: {activeBrand.name}</span>
            </div>

            {/* Core Topic / Prompt */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Post Topic or Raw Idea
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to talk about? (e.g. 5 tips for B2B growth)"
                className="w-full p-2.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] focus:border-[#D4FF32]/60 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Content Objective / Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-[#0B1020]">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Output Language Selector (Bengali, English, Hindi) */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Output Language (ভাষা)</span>
                <span className="text-[10px] text-[#D4FF32] font-semibold">
                  {LANGUAGES.find((l) => l.id === selectedLanguage)?.name}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleLanguageChange(lang.id)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer border",
                      selectedLanguage === lang.id
                        ? "bg-[#D4FF32] text-[#0B1020] border-[#D4FF32] font-bold shadow-[0_0_10px_rgba(212,255,50,0.25)]"
                        : "bg-[#0B1020] text-slate-300 border-[rgba(255,255,255,0.08)] hover:border-[#D4FF32]/40"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.short}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone of Voice Selector */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
                Tone of Voice
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer",
                      tone === t
                        ? "bg-[#D4FF32] text-[#0B1020] font-bold"
                        : "bg-[#182238] text-slate-400 hover:text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience & CTA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60"
                />
              </div>
            </div>

            {/* Target Platforms Toggle Matrix */}
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
                Adapt for Platforms:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((p) => {
                  const isSelected = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer",
                        isSelected
                          ? "bg-[#182238] border-[#D4FF32]/40 text-white"
                          : "bg-[#0B1020] border-[rgba(255,255,255,0.05)] text-slate-500 hover:text-slate-300"
                      )}
                    >
                      <span className="truncate">{p.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-[#D4FF32]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Guardrails Notice */}
            {activeBrand.prohibitedClaims && (
              <div className="p-2.5 rounded-lg bg-[#182238]/50 border border-[rgba(255,255,255,0.06)] text-[10px] text-slate-400 leading-relaxed">
                <span className="font-semibold text-amber-300">Brand Brain Active:</span> Guarded against: &quot;{activeBrand.prohibitedClaims}&quot;
              </div>
            )}

            {/* Primary Generation Button */}
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-[#D4FF32] hover:bg-[#C2ED25] text-[#0B1020] font-bold text-xs shadow-lg shadow-[#D4FF32]/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating with OpenAI GPT-4o...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate Multi-Platform Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center Column (4 cols): Platform Tabs & Editor */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col h-full space-y-3">
            {/* Platform Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-[rgba(255,255,255,0.06)]">
              {selectedPlatforms.map((p) => {
                const isCurrent = activeTab === p;
                const platformCfg = PLATFORMS.find((pl) => pl.id === p);
                const displayName = platformCfg?.name.replace(/ \(.*\)/, "") || p;
                return (
                  <button
                    key={p}
                    onClick={() => {
                      setActiveTab(p);
                      setEditingHashtagIndex(null);
                      setEditingHashtagValue("");
                      setNewHashtagInput("");
                    }}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border",
                      isCurrent
                        ? "bg-[#182238] text-white border-[#D4FF32]/60 shadow-[0_0_10px_rgba(212,255,50,0.15)]"
                        : "bg-[#0B1020] text-slate-400 hover:text-white hover:bg-[#182238]/60 border-[rgba(255,255,255,0.06)]"
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: platformCfg?.color || "#FFFFFF" }}
                    />
                    <span>{displayName}</span>
                  </button>
                );
              })}
            </div>

            {/* AI Assistant Quick Refinements */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase">AI Tools:</span>
              <button
                onClick={() => handleQuickRewrite("hook")}
                disabled={isRewriting}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                ⚡ Strong Hook
              </button>
              <button
                onClick={() => handleQuickRewrite("shorten")}
                disabled={isRewriting}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                ✂️ Shorten
              </button>
              <button
                onClick={() => handleQuickRewrite("expand")}
                disabled={isRewriting}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                ➕ Expand
              </button>
              <button
                onClick={() => handleQuickRewrite("urgency")}
                disabled={isRewriting}
                className="text-[10px] bg-[#182238] hover:bg-[#1E2A44] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                🔥 Urgency
              </button>
            </div>

            {/* Caption Text Area */}
            <div className="flex-1 flex flex-col min-h-[260px]">
              <textarea
                value={currentVariant.caption}
                onChange={(e) => updateCurrentCaption(e.target.value)}
                placeholder="Platform caption..."
                className="flex-1 w-full p-3 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Character Limit Meter */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">
                {activeTab} Character Limit:
              </span>
              <span
                className={cn(
                  "font-mono font-semibold",
                  isOverLimit ? "text-rose-400" : "text-slate-300"
                )}
              >
                {currentVariant.characterCount} / {activePlatformConfig.limit}
              </span>
            </div>

            {/* Interactive Hashtag Manager (Add, Edit, Delete) */}
            <div className="p-3 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#D4FF32]" />
                  <label className="text-xs font-semibold text-white tracking-wide">
                    Hashtags
                  </label>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#182238] text-slate-400 font-mono border border-white/5">
                    {currentVariant.hashtags?.length || 0}
                  </span>
                </div>
                {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllHashtags}
                    className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Clear all hashtags"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>

              {/* Hashtag Chips with Edit and Delete */}
              <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
                {currentVariant.hashtags && currentVariant.hashtags.length > 0 ? (
                  currentVariant.hashtags.map((tag, idx) => {
                    const isEditing = editingHashtagIndex === idx;

                    if (isEditing) {
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-1 bg-[#182238] border border-[#D4FF32] rounded-lg px-2 py-1 shadow-sm"
                        >
                          <span className="text-xs text-[#D4FF32] font-semibold">#</span>
                          <input
                            type="text"
                            value={editingHashtagValue}
                            onChange={(e) => setEditingHashtagValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSaveEditHashtag();
                              } else if (e.key === "Escape") {
                                handleCancelEditHashtag();
                              }
                            }}
                            autoFocus
                            placeholder="tag..."
                            className="bg-transparent text-xs text-white outline-none w-28 font-medium placeholder-slate-500"
                          />
                          <button
                            type="button"
                            onClick={handleSaveEditHashtag}
                            title="Save"
                            className="p-1 rounded bg-[#D4FF32] text-[#0B1020] hover:bg-[#c4ee24] transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditHashtag}
                            title="Cancel"
                            className="p-1 rounded bg-white/10 text-slate-300 hover:bg-white/20 transition-colors cursor-pointer"
                          >
                            <CloseIcon className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className="group flex items-center gap-1.5 text-xs bg-[#182238] hover:bg-[#1E2B47] text-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg border border-[rgba(255,255,255,0.08)] hover:border-[#D4FF32]/40 transition-all shadow-sm"
                      >
                        <span
                          onClick={() => handleStartEditHashtag(idx, tag)}
                          title="Click to edit hashtag"
                          className="cursor-pointer hover:text-[#D4FF32] transition-colors font-medium select-none"
                        >
                          {tag.startsWith("#") ? tag : `#${tag}`}
                        </span>
                        <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleStartEditHashtag(idx, tag)}
                            title="Edit"
                            className="p-0.5 text-slate-400 hover:text-[#D4FF32] rounded transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteHashtag(idx)}
                            title="Delete"
                            className="p-0.5 text-slate-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
                          >
                            <CloseIcon className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-[11px] text-slate-500 italic">
                    No hashtags yet for {activePlatformDisplayName}. Add one below!
                  </span>
                )}
              </div>

              {/* Add New Hashtag Input */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold select-none">
                    #
                  </span>
                  <input
                    type="text"
                    value={newHashtagInput}
                    onChange={(e) => setNewHashtagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddHashtag();
                      }
                    }}
                    placeholder="Add tag (e.g. growth, marketing or multiple)..."
                    className="w-full pl-6 pr-3 py-1.5 rounded-lg bg-[#121A2B] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 font-sans"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddHashtag()}
                  disabled={!newHashtagInput.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#182238] hover:bg-[#D4FF32] hover:text-[#0B1020] disabled:opacity-40 disabled:hover:bg-[#182238] disabled:hover:text-slate-400 text-slate-200 border border-[rgba(255,255,255,0.08)] text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tag</span>
                </button>
              </div>
            </div>

            {/* Google Business Profile Action Button (CTA) */}
            {activeTab === "GOOGLE_BUSINESS" && (
              <div className="p-3 rounded-lg bg-[#0B1020] border border-[#4285F4]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-white flex items-center gap-1.5 text-[#4285F4]">
                    <Store className="w-3.5 h-3.5" />
                    <span>Google Business Call-to-Action (CTA)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Maps & Search</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Button Action</label>
                    <select
                      value={currentVariant.ctaText || "Learn More"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) => ({
                          ...prev,
                          [activeTab]: {
                            ...prev[activeTab],
                            ctaText: val,
                          },
                        }));
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#4285F4]"
                    >
                      <option value="Learn More">Learn More</option>
                      <option value="Call Now">Call Now</option>
                      <option value="Book Online">Book Online</option>
                      <option value="Order Online">Order Online</option>
                      <option value="Sign Up">Sign Up</option>
                      <option value="Get Offer">Get Offer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Action URL / Phone</label>
                    <input
                      type="text"
                      value={currentVariant.ctaUrl || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVariants((prev) => ({
                          ...prev,
                          [activeTab]: {
                            ...prev[activeTab],
                            ctaUrl: val,
                          },
                        }));
                      }}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-2.5 py-1.5 rounded bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#4285F4]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Direct Media Upload Section (Image & Video) */}
            <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4FF32]" />
                  <span>Post Media</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Image or Video)</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAIImage}
                    disabled={isGeneratingImage}
                    className="text-[10px] text-[#D4FF32] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50 font-medium"
                    title="Generate with DALL-E 3"
                  >
                    {isGeneratingImage ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>AI Image</span>
                  </button>
                  {selectedMedia && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMedia("");
                        setMediaType("");
                        setUploadedFileName("");
                        setUploadedFileSize("");
                      }}
                      className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                      title="Clear media"
                    >
                      <Trash2 className="w-2.5 h-2.5" /> Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Hidden file inputs for direct computer upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/ogg"
                className="hidden"
                onChange={handleVideoUpload}
              />

              {!selectedMedia ? (
                /* Two Side-by-Side Upload Cards: Image & Video */
                <div className="grid grid-cols-2 gap-2">
                  {/* Upload Image Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="py-3.5 px-3 rounded-xl bg-[#0B1020] border-2 border-dashed border-[#D4FF32]/35 hover:border-[#D4FF32] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-[#182238]/60 group text-center"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#182238] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#D4FF32] group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-[#D4FF32] transition-colors block">
                        Upload Image
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        PNG, JPG, WebP
                      </span>
                    </div>
                  </div>

                  {/* Upload Video Box */}
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="py-3.5 px-3 rounded-xl bg-[#0B1020] border-2 border-dashed border-sky-500/35 hover:border-sky-400 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-[#182238]/60 group text-center"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#182238] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors block">
                        Upload Video
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        MP4, MOV (Shorts/Reels)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Uploaded Media Card (Image or Video) */
                <div className="p-2.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {mediaType === "video" ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-sky-400/50 flex-shrink-0 bg-black flex items-center justify-center">
                        <video
                          src={selectedMedia}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsImagePreviewOpen(true)}
                        className="cursor-pointer rounded-lg overflow-hidden border border-[#D4FF32]/50 flex-shrink-0"
                        aria-label="Preview uploaded image"
                      >
                        <img
                          src={selectedMedia}
                          alt="Uploaded"
                          className="w-12 h-12 object-cover"
                        />
                      </button>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {uploadedFileName || (mediaType === "video" ? "Uploaded Video" : "Uploaded Image")}
                      </div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {mediaType === "video" ? "🎬 Video Attached" : "🖼️ Image Attached"} • {uploadedFileSize || "Ready"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (mediaType === "video") {
                          videoInputRef.current?.click();
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      className="px-2.5 py-1 rounded-md bg-[#182238] hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)] text-[11px] text-slate-200 hover:text-white transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMedia("");
                        setMediaType("");
                        setUploadedFileName("");
                        setUploadedFileSize("");
                      }}
                      className="p-1.5 rounded-md hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Live Native Preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)]">
            {/* Header: Platform format indicator & device toggle */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Preview
                </span>
                <span className="text-[10px] bg-[#182238] text-slate-300 px-2.5 py-0.5 rounded-full border border-[rgba(255,255,255,0.08)] font-semibold flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: activePlatformConfig.color || "#D4FF32" }}
                  />
                  <span>{activePlatformConfig.name}</span>
                </span>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center bg-[#0B1020] rounded-lg p-0.5 border border-[rgba(255,255,255,0.08)]">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={cn(
                    "p-1 rounded text-slate-400 cursor-pointer",
                    previewDevice === "desktop" && "bg-[#182238] text-white"
                  )}
                  title="Desktop Layout"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={cn(
                    "p-1 rounded text-slate-400 cursor-pointer",
                    previewDevice === "mobile" && "bg-[#182238] text-white"
                  )}
                  title="Mobile Feed Layout"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Native Card Preview Container */}
            <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-left space-y-3 overflow-hidden">
              {/* 1. LINKEDIN NATIVE CARD */}
              {activeTab === "LINKEDIN" && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {connectedChannel?.avatarUrl ? (
                        <img src={connectedChannel.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-sm" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#0A66C2] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                          {cleanDisplayName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span className="truncate">{cleanDisplayName}</span>
                          <span className="text-[11px] text-slate-400 font-normal">• 1st</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {activeBrand.tagline || "Digital Strategy & Technology"} • 1h • 🌐
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-[#70B5F9] font-bold hover:underline cursor-pointer">
                        + Follow
                      </button>
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto pr-1">
                    {currentVariant.caption}
                  </div>

                  {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#70B5F9] font-medium break-words">
                      {currentVariant.hashtags.map((h, i) => (
                        <span key={i} className="hover:underline cursor-pointer">{h}</span>
                      ))}
                    </div>
                  )}

                  {selectedMedia && (
                    <div className="rounded-lg overflow-hidden border border-white/10 bg-[#121A2B]">
                      {mediaType === "video" ? (
                        <video src={selectedMedia} controls playsInline className="w-full max-h-56 object-contain bg-black" />
                      ) : (
                        <img src={selectedMedia} alt="Media" className="w-full h-48 object-cover" />
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-4 gap-1 text-[11px] text-slate-300">
                    <button className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white/5 cursor-pointer">
                      <ThumbsUp className="w-3.5 h-3.5" /> Like
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white/5 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" /> Comment
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white/5 cursor-pointer">
                      <Repeat2 className="w-3.5 h-3.5" /> Repost
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white/5 cursor-pointer">
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </div>
                </div>
              )}

              {/* 2. X (TWITTER) NATIVE CARD */}
              {activeTab === "X" && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {connectedChannel?.avatarUrl ? (
                        <img src={connectedChannel.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-white/10" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#182238] border border-white/10 text-[#D4FF32] font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {cleanDisplayName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span className="truncate">{cleanDisplayName}</span>
                          <span className="w-3.5 h-3.5 rounded-full bg-[#1D9BF0] text-[9px] text-white font-bold flex items-center justify-center">✓</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          @{cleanHandle} · Just now
                        </div>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="text-xs text-slate-100 whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto pr-1">
                    {currentVariant.caption}
                  </div>

                  {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#1D9BF0] font-medium break-words">
                      {currentVariant.hashtags.map((h, i) => (
                        <span key={i} className="hover:underline cursor-pointer">{h}</span>
                      ))}
                    </div>
                  )}

                  {selectedMedia && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#121A2B]">
                      {mediaType === "video" ? (
                        <video src={selectedMedia} controls playsInline className="w-full max-h-56 object-contain bg-black" />
                      ) : (
                        <img src={selectedMedia} alt="Tweet media" className="w-full h-48 object-cover" />
                      )}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 pt-1">
                    11:05 AM · Sep 18, 2026 · Official X Post
                  </div>

                  <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-slate-400 px-2">
                    <button className="hover:text-[#1D9BF0] cursor-pointer"><MessageCircle className="w-4 h-4" /></button>
                    <button className="hover:text-emerald-400 cursor-pointer"><Repeat2 className="w-4 h-4" /></button>
                    <button className="hover:text-rose-500 cursor-pointer"><Heart className="w-4 h-4" /></button>
                    <button className="hover:text-[#1D9BF0] cursor-pointer"><Bookmark className="w-4 h-4" /></button>
                    <button className="hover:text-[#1D9BF0] cursor-pointer"><Share2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

              {/* 3. INSTAGRAM NATIVE CARD */}
              {activeTab === "INSTAGRAM" && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex-shrink-0">
                        {connectedChannel?.avatarUrl ? (
                          <img src={connectedChannel.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#0B1020] text-white font-bold text-xs flex items-center justify-center">
                            {cleanDisplayName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {cleanHandle}
                        </div>
                        <div className="text-[9px] text-slate-400">Audio • Original audio</div>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </div>

                  {selectedMedia ? (
                    <div className="rounded-lg overflow-hidden border border-white/10 bg-[#121A2B]">
                      {mediaType === "video" ? (
                        <video src={selectedMedia} controls playsInline className="w-full max-h-60 object-contain bg-black" />
                      ) : (
                        <img src={selectedMedia} alt="Post media" className="w-full h-52 object-cover" />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-36 rounded-lg bg-[#121A2B] border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 text-xs gap-1">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                      <span>Attach image or video for Instagram</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-slate-200">
                      <Heart className="w-4 h-4 cursor-pointer hover:text-rose-500" />
                      <MessageCircle className="w-4 h-4 cursor-pointer" />
                      <Send className="w-4 h-4 cursor-pointer" />
                    </div>
                    <Bookmark className="w-4 h-4 text-slate-200 cursor-pointer" />
                  </div>

                  <div className="text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto pr-1 break-words">
                    <span className="font-bold text-white mr-1.5">
                      {cleanHandle}
                    </span>
                    <span className="whitespace-pre-line">{currentVariant.caption}</span>
                  </div>

                  {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-sky-400 font-medium break-words">
                      {currentVariant.hashtags.map((h, i) => (
                        <span key={i} className="hover:underline cursor-pointer">{h}</span>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 pt-1 border-t border-white/5">
                    Add a comment... 😊
                  </div>
                </div>
              )}

              {/* 4. FACEBOOK NATIVE CARD */}
              {activeTab === "FACEBOOK" && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {connectedChannel?.avatarUrl ? (
                        <img src={connectedChannel.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-sm" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#1877F2] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                          {cleanDisplayName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {cleanDisplayName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Sponsored · 🌎 Public
                        </div>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-1">
                    {currentVariant.caption}
                  </div>

                  {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#1877F2] font-medium break-words">
                      {currentVariant.hashtags.map((h, i) => (
                        <span key={i} className="hover:underline cursor-pointer">{h}</span>
                      ))}
                    </div>
                  )}

                  {selectedMedia && (
                    <div className="rounded-lg overflow-hidden border border-white/10 bg-[#121A2B]">
                      {mediaType === "video" ? (
                        <video src={selectedMedia} controls playsInline className="w-full max-h-56 object-contain bg-black" />
                      ) : (
                        <img src={selectedMedia} alt="Facebook media" className="w-full h-48 object-cover" />
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-3 gap-1 text-[11px] text-slate-300">
                    <button className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white/5 cursor-pointer">
                      <ThumbsUp className="w-3.5 h-3.5" /> Like
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white/5 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" /> Comment
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white/5 cursor-pointer">
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                </div>
              )}

              {/* 5. GOOGLE BUSINESS PROFILE (GMB) CARD */}
              {activeTab === "GOOGLE_BUSINESS" && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#4285F4] flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-md">
                        G
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="truncate">{cleanDisplayName}</span>
                          <span className="text-[9px] bg-[#4285F4]/20 text-[#4285F4] px-1.5 py-0.2 rounded font-semibold border border-[#4285F4]/40">
                            ✓ Verified
                          </span>
                        </div>
                        <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
                          <span>★★★★★</span>
                          <span className="text-slate-400 font-sans font-medium">5.0 • Google Maps</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#4285F4] font-semibold bg-[#4285F4]/10 border border-[#4285F4]/20 px-2 py-0.5 rounded-full">
                      Posted on Google
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-1">
                    {currentVariant.caption}
                  </div>

                  {selectedMedia && (
                    <div className="rounded-lg overflow-hidden border border-white/10 bg-[#121A2B]">
                      {mediaType === "video" ? (
                        <video src={selectedMedia} controls playsInline className="w-full max-h-56 object-contain bg-black" />
                      ) : (
                        <img src={selectedMedia} alt="GMB media" className="w-full h-44 object-cover" />
                      )}
                    </div>
                  )}

                  <div className="pt-1">
                    <a
                      href={currentVariant.ctaUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold transition-all shadow-md text-center cursor-pointer uppercase tracking-wider"
                    >
                      <span>{currentVariant.ctaText || "Learn More"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#4285F4]" /> Verified Google Business Storefront
                    </span>
                    <span className="text-[#4285F4] font-semibold">Search & Maps View</span>
                  </div>
                </div>
              )}

              {/* 6. THREADS NATIVE CARD */}
              {activeTab === "THREADS" && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {connectedChannel?.avatarUrl ? (
                        <img src={connectedChannel.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-white/20" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white text-[#0B1020] font-black text-xs flex items-center justify-center flex-shrink-0">
                          @
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {cleanHandle}
                        </div>
                        <div className="text-[10px] text-slate-400">Just now · Threads</div>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-1 pl-1 border-l-2 border-white/10">
                    {currentVariant.caption}
                  </div>

                  {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400 font-medium break-words">
                      {currentVariant.hashtags.map((h, i) => (
                        <span key={i} className="hover:underline cursor-pointer">{h}</span>
                      ))}
                    </div>
                  )}

                  {selectedMedia && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#121A2B]">
                      {mediaType === "video" ? (
                        <video src={selectedMedia} controls playsInline className="w-full max-h-56 object-contain bg-black" />
                      ) : (
                        <img src={selectedMedia} alt="Threads media" className="w-full h-48 object-cover" />
                      )}
                    </div>
                  )}

                  <div className="pt-1 flex items-center gap-4 text-slate-400">
                    <Heart className="w-4 h-4 cursor-pointer hover:text-rose-500" />
                    <MessageCircle className="w-4 h-4 cursor-pointer" />
                    <Repeat2 className="w-4 h-4 cursor-pointer" />
                    <Send className="w-4 h-4 cursor-pointer" />
                  </div>
                </div>
              )}

              {/* 7. YOUTUBE & SHORTS NATIVE CARD */}
              {activeTab === "YOUTUBE" && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {connectedChannel?.avatarUrl ? (
                        <img src={connectedChannel.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          ▶
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {cleanDisplayName}
                        </div>
                        <div className="text-[10px] text-slate-400">YouTube Shorts & Video</div>
                      </div>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1 rounded-full cursor-pointer">
                      Subscribe
                    </button>
                  </div>

                  {/* Video Player or Frame */}
                  {selectedMedia ? (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                      {mediaType === "video" ? (
                        <video src={selectedMedia} controls playsInline className="w-full max-h-56 object-contain bg-black" />
                      ) : (
                        <div className="relative">
                          <img src={selectedMedia} alt="Thumbnail" className="w-full h-48 object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-36 rounded-xl bg-black border border-dashed border-red-500/30 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                      <Play className="w-6 h-6 text-red-500" />
                      <span>Upload video clip to preview Shorts</span>
                    </div>
                  )}

                  <div className="text-xs font-bold text-white leading-snug">
                    {currentVariant.caption.split("\n")[0] || "Video Title"}
                  </div>

                  <div className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto pr-1">
                    {currentVariant.caption}
                  </div>

                  {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-sky-400 font-medium break-words">
                      {currentVariant.hashtags.map((h, i) => (
                        <span key={i} className="hover:underline cursor-pointer">{h}</span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-slate-400 px-2 text-[11px]">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> Like</span>
                    <span className="flex items-center gap-1"><ThumbsDown className="w-3.5 h-3.5" /> Dislike</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</span>
                    <span className="text-[10px] text-red-400 font-semibold">Shorts</span>
                  </div>
                </div>
              )}

              {/* 8. PINTEREST NATIVE CARD */}
              {activeTab === "PINTEREST" && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#BD081C]" />
                      <span>Pinterest Pin</span>
                    </div>
                    <button className="bg-[#E60023] hover:bg-[#b8001c] text-white font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 cursor-pointer">
                      <Bookmark className="w-3.5 h-3.5 fill-white" /> Save
                    </button>
                  </div>

                  {selectedMedia ? (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#121A2B]">
                      {mediaType === "video" ? (
                        <video src={selectedMedia} controls playsInline className="w-full max-h-64 object-contain bg-black" />
                      ) : (
                        <img src={selectedMedia} alt="Pin media" className="w-full h-56 object-cover" />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-44 rounded-xl bg-[#121A2B] border border-dashed border-red-500/30 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                      <ImageIcon className="w-6 h-6 text-[#BD081C]" />
                      <span>Upload vertical pin media (2:3 aspect)</span>
                    </div>
                  )}

                  <div className="text-xs font-bold text-white">
                    {topic.slice(0, 60)}
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto pr-1">
                    {currentVariant.caption}
                  </div>

                  {currentVariant.hashtags && currentVariant.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#BD081C] font-medium break-words">
                      {currentVariant.hashtags.map((h, i) => (
                        <span key={i} className="hover:underline cursor-pointer">{h}</span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#182238] text-white font-bold text-[10px] flex items-center justify-center">
                        {activeBrand.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-white">{activeBrand.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 hover:text-white cursor-pointer flex items-center gap-1">
                      Visit <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Calendar & Time Picker Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md bg-[#121A2B] border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D4FF32]/10 border border-[#D4FF32]/20 flex items-center justify-center text-[#D4FF32]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Schedule Social Post</h3>
                  <p className="text-[11px] text-slate-400">Set the exact date & time to auto-publish</p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#182238] transition-colors cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>Select Date</span>
                <span className="text-[10px] text-slate-400 font-normal">Calendar Picker</span>
              </label>
              <input
                type="date"
                value={scheduleDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60 cursor-pointer"
              />
              {/* Quick Date Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "Tomorrow", offset: 1 },
                  { label: "In 2 Days", offset: 2 },
                  { label: "In 3 Days", offset: 3 },
                  { label: "Next Week", offset: 7 },
                ].map((chip) => {
                  const chipDate = new Date();
                  chipDate.setDate(chipDate.getDate() + chip.offset);
                  const iso = chipDate.toISOString().split("T")[0];
                  const isSelected = scheduleDate === iso;
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setScheduleDate(iso)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer",
                        isSelected
                          ? "bg-[#D4FF32]/15 text-[#D4FF32] border-[#D4FF32]/40 font-bold"
                          : "bg-[#0B1020] text-slate-400 border-[rgba(255,255,255,0.06)] hover:text-white"
                      )}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>Select Time</span>
                <span className="text-[10px] text-slate-400 font-normal">24-hour / AM-PM format</span>
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/60 cursor-pointer"
              />
              {/* Quick Time Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "09:00 AM (Peak Morning)", val: "09:00" },
                  { label: "02:00 PM (Afternoon)", val: "14:00" },
                  { label: "07:00 PM (Peak Evening)", val: "19:00" },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => setScheduleTime(chip.val)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer",
                      scheduleTime === chip.val
                        ? "bg-[#D4FF32]/15 text-[#D4FF32] border-[#D4FF32]/40 font-bold"
                        : "bg-[#0B1020] text-slate-400 border-[rgba(255,255,255,0.06)] hover:text-white"
                    )}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Summary */}
            <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Scheduled Date & Time:</span>
                <span className="text-white font-semibold">
                  {scheduleDate} at {scheduleTime}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Target Platforms:</span>
                <span className="text-[#D4FF32] font-semibold">
                  {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Destination:</span>
                <span className="text-slate-300">
                  Posts Page → <strong className="text-amber-400">Scheduled</strong>
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[rgba(255,255,255,0.08)]">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#182238] hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)] text-xs text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSchedule}
                className="px-4 py-2 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,255,50,0.25)] cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Confirm & Schedule Post</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

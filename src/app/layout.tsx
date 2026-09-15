import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0B1020",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "SocialPilot AI — Create once. Publish everywhere. Manage everything.",
    template: "%s | SocialPilot AI",
  },
  description:
    "The all-in-one AI social media management platform for modern digital marketing agencies, creators, and high-growth brands. One prompt adapts into native LinkedIn narratives, X threads, Instagram visuals, and Facebook updates with brand guardrails.",
  keywords: [
    "AI social media management",
    "social media scheduler",
    "omni-channel publishing",
    "LinkedIn AI writer",
    "Instagram carousel generator",
    "client approval portal",
    "social inbox AI",
    "marketing agency SaaS",
    "Brand Brain",
  ],
  authors: [{ name: "SocialPilot Technologies" }],
  creator: "SocialPilot Technologies Inc.",
  publisher: "SocialPilot AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://socialpilot.ai"),
  openGraph: {
    title: "SocialPilot AI — Create once. Publish everywhere. Manage everything.",
    description:
      "All-in-one AI social media management platform. Multi-platform distribution, AI Image Studio, unified social inbox, and passwordless client approval portals.",
    url: "https://socialpilot.ai",
    siteName: "SocialPilot AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialPilot AI — Create once. Publish everywhere. Manage everything.",
    description:
      "All-in-one AI social media management platform for marketing agencies and creators.",
    creator: "@socialpilot_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B1020] text-slate-100 selection:bg-[#D4FF32] selection:text-[#0B1020]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

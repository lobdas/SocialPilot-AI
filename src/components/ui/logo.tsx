import React from "react";
import { cn } from "@/lib/utils";

interface SocialPilotLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textClassName?: string;
}

export function SocialPilotIcon({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0 select-none", className)}
    >
      <defs>
        <linearGradient id="logoBgGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#182238" />
          <stop offset="1" stopColor="#0B1020" />
        </linearGradient>
        <linearGradient id="logoBorder" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4FF32" stopOpacity="0.8" />
          <stop offset="1" stopColor="#C4B5FD" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="wingGrad1" x1="16" y1="46" x2="48" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4FF32" />
          <stop offset="0.6" stopColor="#E5FF75" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="wingGrad2" x1="28" y1="36" x2="48" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A5DB00" />
          <stop offset="1" stopColor="#D4FF32" />
        </linearGradient>
        <linearGradient id="keelGrad" x1="28" y1="36" x2="33" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#739900" />
          <stop offset="1" stopColor="#8DBF00" />
        </linearGradient>
        <filter id="logoGlow" x="6" y="6" width="52" height="52" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Hex/Squircle Base */}
      <rect width="64" height="64" rx="16" fill="url(#logoBgGrad)" />
      <rect x="1" y="1" width="62" height="62" rx="15" stroke="url(#logoBorder)" strokeWidth="1.8" />

      {/* Pilot Delta Wing Structure */}
      <g filter="url(#logoGlow)">
        {/* Upper Wing */}
        <path d="M48 16L17 31L28 36L48 16Z" fill="url(#wingGrad1)" />
        {/* Lower Wing */}
        <path d="M48 16L33 47L28 36L48 16Z" fill="url(#wingGrad2)" />
        {/* Fold Keel */}
        <path d="M28 36V45L32.5 40.5L28 36Z" fill="url(#keelGrad)" />
      </g>

      {/* Satellite Multi-Channel Broadcast Nodes */}
      <circle cx="51" cy="13" r="3.5" fill="#D4FF32" />
      <circle cx="16" cy="46" r="2.5" fill="#C4B5FD" />
      <circle cx="47" cy="49" r="2.5" fill="#C4B5FD" />

      {/* Radio Wave Radiance */}
      <path
        d="M43 9C47.5 11 51 14.5 53 19"
        stroke="#D4FF32"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="1.5 2"
      />
    </svg>
  );
}

export function SocialPilotLogo({
  className,
  size = "md",
  showText = true,
  textClassName,
}: SocialPilotLogoProps) {
  const iconPixelSize = {
    xs: 24,
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  }[size];

  const textSize = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  }[size];

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <SocialPilotIcon size={iconPixelSize} className="shadow-[0_0_20px_rgba(212,255,50,0.3)] hover:scale-105 transition-transform" />
      {showText && (
        <span className={cn("font-extrabold tracking-tight text-white", textSize, textClassName)}>
          SocialPilot <span className="text-[#D4FF32]">AI</span>
        </span>
      )}
    </div>
  );
}

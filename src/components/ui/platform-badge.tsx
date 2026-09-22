"use client";

import React from "react";
import { PlatformType } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface PlatformMeta {
  name: string;
  shortName: string;
  icon: (className?: string) => React.ReactNode;
  iconColor: string;
  activeClass: string;
  badgeClass: string;
  glowColor: string;
}

export const PLATFORM_CONFIG: Record<PlatformType, PlatformMeta> = {
  LINKEDIN: {
    name: "LinkedIn",
    shortName: "LinkedIn",
    iconColor: "text-[#0A66C2]",
    activeClass: "bg-[#0A66C2] text-white border-[#0A66C2] shadow-[0_0_15px_rgba(10,102,194,0.45)]",
    badgeClass: "bg-[#0A66C2]/15 text-[#0A66C2] border-[#0A66C2]/30",
    glowColor: "rgba(10,102,194,0.4)",
    icon: (className = "w-3.5 h-3.5") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.25 1.63 1.63 0 0 0 0-3.25z" />
      </svg>
    ),
  },
  X: {
    name: "X (Twitter)",
    shortName: "X",
    iconColor: "text-slate-100",
    activeClass: "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]",
    badgeClass: "bg-white/10 text-white border-white/20",
    glowColor: "rgba(255,255,255,0.3)",
    icon: (className = "w-3.5 h-3.5") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  INSTAGRAM: {
    name: "Instagram",
    shortName: "Instagram",
    iconColor: "text-[#E4405F]",
    activeClass: "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white border-pink-400 shadow-[0_0_15px_rgba(228,64,95,0.5)]",
    badgeClass: "bg-[#E4405F]/15 text-[#E4405F] border-[#E4405F]/30",
    glowColor: "rgba(228,64,95,0.4)",
    icon: (className = "w-3.5 h-3.5") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  FACEBOOK: {
    name: "Facebook",
    shortName: "Facebook",
    iconColor: "text-[#1877F2]",
    activeClass: "bg-[#1877F2] text-white border-[#1877F2] shadow-[0_0_15px_rgba(24,119,242,0.45)]",
    badgeClass: "bg-[#1877F2]/15 text-[#1877F2] border-[#1877F2]/30",
    glowColor: "rgba(24,119,242,0.4)",
    icon: (className = "w-3.5 h-3.5") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  GOOGLE_BUSINESS: {
    name: "Google Business",
    shortName: "Google",
    iconColor: "text-[#4285F4]",
    activeClass: "bg-[#4285F4] text-white border-[#4285F4] shadow-[0_0_15px_rgba(66,133,244,0.45)]",
    badgeClass: "bg-[#4285F4]/15 text-[#4285F4] border-[#4285F4]/30",
    glowColor: "rgba(66,133,244,0.4)",
    icon: (className = "w-3.5 h-3.5") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    ),
  },
  THREADS: {
    name: "Threads",
    shortName: "Threads",
    iconColor: "text-slate-100",
    activeClass: "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.35)]",
    badgeClass: "bg-white/10 text-slate-200 border-white/20",
    glowColor: "rgba(255,255,255,0.3)",
    icon: (className = "w-3.5 h-3.5") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24C5.467 24 0 18.533 0 11.814 0 5.094 5.467 0 12.186 0c6.72 0 12.187 5.094 12.187 11.814 0 1.944-.555 3.82-1.574 5.405l-1.92-1.344c.732-1.17 1.127-2.529 1.127-4.061 0-5.385-4.379-9.764-9.82-9.764-5.441 0-9.82 4.379-9.82 9.764 0 5.385 4.379 9.764 9.82 9.764 3.77 0 7.027-2.133 8.65-5.289l1.988 1.127C20.67 21.246 16.757 24 12.186 24zm-.093-6.684c-2.482 0-4.496-2.014-4.496-4.496 0-2.482 2.014-4.496 4.496-4.496 2.482 0 4.496 2.014 4.496 4.496 0 .546-.104 1.077-.3 1.57l-1.94-.962a2.49 2.49 0 0 0 .16-.608c0-1.332-1.084-2.416-2.416-2.416-1.332 0-2.416 1.084-2.416 2.416 0 1.332 1.084 2.416 2.416 2.416.717 0 1.365-.315 1.815-.815l1.528 1.488a4.47 4.47 0 0 1-3.343 1.401z" />
      </svg>
    ),
  },
  YOUTUBE: {
    name: "YouTube",
    shortName: "YouTube",
    iconColor: "text-[#FF0000]",
    activeClass: "bg-[#FF0000] text-white border-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.45)]",
    badgeClass: "bg-[#FF0000]/15 text-[#FF0000] border-[#FF0000]/30",
    glowColor: "rgba(255,0,0,0.4)",
    icon: (className = "w-3.5 h-3.5") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  PINTEREST: {
    name: "Pinterest",
    shortName: "Pinterest",
    iconColor: "text-[#BD081C]",
    activeClass: "bg-[#BD081C] text-white border-[#BD081C] shadow-[0_0_15px_rgba(189,8,28,0.45)]",
    badgeClass: "bg-[#BD081C]/15 text-[#BD081C] border-[#BD081C]/30",
    glowColor: "rgba(189,8,28,0.4)",
    icon: (className = "w-3.5 h-3.5") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.057.24-.19.291-.439.175-1.644-.766-2.672-3.171-2.672-5.105 0-4.155 3.018-7.971 8.709-7.971 4.572 0 8.125 3.258 8.125 7.612 0 4.541-2.863 8.196-6.837 8.196-1.335 0-2.59-.694-3.019-1.512l-.823 3.136c-.297 1.144-1.1 2.578-1.638 3.456C9.378 23.834 10.666 24 12 24c6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  TIKTOK: {
    name: "TikTok",
    shortName: "TikTok",
    iconColor: "text-[#00F2FE]",
    activeClass: "bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.45)]",
    badgeClass: "bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/30",
    glowColor: "rgba(0,242,254,0.4)",
    icon: (className = "w-3.5 h-3.5") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.03 3.28-1.5 3.32-3.31.02-4.06.01-8.13.01-12.2z" />
      </svg>
    ),
  },
};

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Search,
  Bell,
  HelpCircle,
  Plus,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: "n1",
      title: "Client Approved Post",
      time: "12m ago",
      text: "Horizon Ventures approved 'Client Quarterly Growth Report Snapshot'",
      unread: true,
    },
    {
      id: "n2",
      title: "Scheduled Publishing Successful",
      time: "2h ago",
      text: "Post 'The Death of Generic Cross-Posting' published to LinkedIn, X & IG.",
      unread: false,
    },
    {
      id: "n3",
      title: "New High-Intent Inbox Lead",
      time: "4h ago",
      text: "David Chen commented on LinkedIn regarding Brand Brain FinTech rules.",
      unread: true,
    },
  ];

  return (
    <header className="h-14 bg-[#0B1020]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns, posts, brand assets... (⌘K)"
            className="w-full pl-9 pr-4 py-1.5 bg-[#121A2B] border border-[rgba(255,255,255,0.08)] focus:border-[#D4FF32]/50 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Create AI Button */}
        <Link
          href="/app/content-studio"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-semibold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Create with AI</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-lg bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:bg-[#182238] flex items-center justify-center text-slate-400 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#D4FF32] absolute top-1.5 right-1.5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#182238] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-medium px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-[rgba(255,255,255,0.05)] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#1E2A44] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center border-t border-[rgba(255,255,255,0.08)]">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Client Approval Link Demo quick launcher */}
        <Link
          href="/client/approval/demo-client-token-apex-992"
          target="_blank"
          title="Open Client Approval Portal Preview"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#121A2B] border border-[rgba(255,255,255,0.08)] hover:bg-[#182238] text-xs text-[#C4B5FD] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Client Portal</span>
        </Link>
      </div>
    </header>
  );
}

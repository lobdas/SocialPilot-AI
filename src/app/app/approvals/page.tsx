"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Copy,
  UserCheck,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { formatDate } from "@/lib/utils";

export default function ApprovalsPage() {
  const { data } = useDemoStore();
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const copyClientLink = (token: string) => {
    const url = `${window.location.origin}/client/approval/${token}`;
    navigator.clipboard.writeText(url);
    showToast("📋 Client approval link copied to clipboard!");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {notification && (
        <div className="fixed top-16 right-8 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Client & Team Approvals</h1>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
              {data.approvalRequests.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Send passwordless, secure approval links to external clients and track stakeholder feedback.
          </p>
        </div>
      </div>

      {/* Approval Requests Table / Cards */}
      <div className="space-y-4">
        {data.approvalRequests.map((req) => {
          const linkedPost = data.posts.find((p) => p.id === req.contentId);
          return (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[rgba(255,255,255,0.15)] transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{req.contentTitle}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      req.state === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : req.state === "CHANGES_REQUESTED"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {req.state.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1">
                  {linkedPost?.basePrompt || "Multi-channel content draft ready for client sign-off."}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Client: <strong className="text-white">{req.clientName}</strong></span>
                  <span>Platforms: <strong className="text-[#D4FF32]">{req.platforms.join(", ")}</strong></span>
                  <span>Created: {formatDate(req.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={() => copyClientLink(req.clientToken)}
                  className="px-3 py-1.5 rounded-lg bg-[#182238] hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Client Link</span>
                </button>

                <Link
                  href={`/client/approval/${req.clientToken}`}
                  target="_blank"
                  className="px-3.5 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all flex items-center gap-1.5 shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Review Portal</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

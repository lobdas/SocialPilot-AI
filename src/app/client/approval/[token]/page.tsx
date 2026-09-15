"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
  MessageSquare,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { formatDate } from "@/lib/utils";
import { SocialPilotIcon } from "@/components/ui/logo";

export default function ClientApprovalPortalPage() {
  const params = useParams();
  const token = params.token as string;

  const { data, activeBrand, store } = useDemoStore();
  const [commentText, setCommentText] = useState("");
  const [clientName, setClientName] = useState("Horizon Client Lead");
  const [isDone, setIsDone] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const approvalReq = data.approvalRequests.find((r) => r.clientToken === token) || data.approvalRequests[0];
  const linkedPost = data.posts.find((p) => p.id === approvalReq?.contentId);
  const targetBrand = data.brands.find((b) => b.id === linkedPost?.brandId) || activeBrand;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = () => {
    if (!approvalReq) return;
    store.setApprovalState(approvalReq.id, "APPROVED", "Approved by client via external portal.");
    showToast("🎉 Content approved! The post has been queued for publishing.");
    setIsDone(true);
  };

  const handleRequestChanges = () => {
    if (!commentText.trim() || !approvalReq) return;
    store.addApprovalComment(approvalReq.id, commentText, clientName, true);
    store.setApprovalState(approvalReq.id, "CHANGES_REQUESTED", commentText);
    setCommentText("");
    showToast("📝 Feedback submitted. Your marketing team will review and update the draft.");
  };

  if (!approvalReq) {
    return (
      <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center p-4">
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] text-center max-w-sm">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <h2 className="text-sm font-bold">Invalid or Expired Approval Link</h2>
          <p className="text-xs text-slate-400 mt-1">Please contact your marketing team for a renewed link.</p>
        </div>
      </div>
    );
  }

  const isApproved = approvalReq.state === "APPROVED";

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans p-4 sm:p-8 bg-grid-pattern">
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#182238] border border-[#D4FF32] text-white text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Client Portal Header */}
        <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SocialPilotIcon size={38} className="shadow-[0_0_15px_rgba(212,255,50,0.25)]" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Client Review Portal
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-mono border border-emerald-500/20">
                  SECURE TOKEN ACCESS
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Brand: <strong className="text-white" suppressHydrationWarning>{targetBrand?.name || activeBrand.name}</strong> • Prepared by Apex Growth Agency
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                isApproved
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
              }`}
            >
              Status: {approvalReq.state.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Content Review Card */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-6">
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase">Campaign Content</span>
            <h1 className="text-lg font-bold text-white mt-1">{approvalReq.contentTitle}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-400">Target Platforms:</span>
              {approvalReq.platforms.map((p) => (
                <span
                  key={p}
                  className="text-[10px] bg-[#0B1020] text-slate-300 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.08)] font-semibold"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Native Preview */}
          <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.08)] space-y-3 max-w-xl mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#182238] flex items-center justify-center font-bold text-xs text-[#D4FF32]">
                AG
              </div>
              <div>
                <div className="text-xs font-bold text-white">{activeBrand.name}</div>
                <div className="text-[10px] text-slate-500">Scheduled for Friday at 2:00 PM EST</div>
              </div>
            </div>

            <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
              {linkedPost?.variants.LINKEDIN?.caption || "Real benchmark numbers: How 24 agency clients scaled their cross-platform pipeline by 142% in 90 days."}
            </p>

            {linkedPost?.mediaUrls[0] && (
              <img
                src={linkedPost.mediaUrls[0]}
                alt=""
                className="w-full h-56 object-cover rounded-lg border border-[rgba(255,255,255,0.08)]"
              />
            )}
          </div>

          {/* Action Bar */}
          {!isApproved ? (
            <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Approving will automatically mark this post as approved and schedule it for live broadcast.
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleApprove}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-extrabold text-xs shadow-[0_0_20px_rgba(212,255,50,0.3)] hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Schedule</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-semibold">
              ✓ This post has been approved and is scheduled for automatic publishing.
            </div>
          )}
        </div>

        {/* Change Request & Feedback Thread */}
        <div className="p-6 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-[#D4FF32]" />
            <span>Client Feedback & Revisions ({approvalReq.comments.length})</span>
          </div>

          {/* Existing Comments */}
          <div className="space-y-2.5">
            {approvalReq.comments.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] text-xs text-slate-300"
              >
                <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-white">
                  <span>{c.authorName} {c.isExternalClient && "(Client)"}</span>
                  <span className="text-slate-500 font-normal" suppressHydrationWarning>{formatDate(c.createdAt, "time")}</span>
                </div>
                <p>{c.message}</p>
              </div>
            ))}
          </div>

          {/* New Feedback Input */}
          <div className="pt-2 space-y-2">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Need edits? Request changes or suggest modifications here..."
              className="w-full p-3 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
            />
            <button
              onClick={handleRequestChanges}
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-lg bg-[#182238] hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 font-semibold transition-colors disabled:opacity-40"
            >
              Request Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Users, Plus, ShieldCheck, Mail, Check, MoreVertical } from "lucide-react";
import { UserRole } from "@/lib/types";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: "ACTIVE" | "PENDING";
}

const MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "Alex Rivera",
    email: "alex@apexgrowth.io",
    role: "OWNER",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "tm-2",
    name: "Jessica Miller",
    email: "jessica@apexgrowth.io",
    role: "CONTENT_MANAGER",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "tm-3",
    name: "Liam Thorne",
    email: "liam@apexgrowth.io",
    role: "DESIGNER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "tm-4",
    name: "Horizon Client Contact",
    email: "reviews@horizonventures.com",
    role: "CLIENT",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState(MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("CONTENT_MANAGER");

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setMembers([
      ...members,
      {
        id: `tm-${Date.now()}`,
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
        status: "PENDING",
      },
    ]);
    setShowInviteModal(false);
    setInviteEmail("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Team & Access Control</h1>
            <span className="text-[10px] bg-[#D4FF32]/10 text-[#D4FF32] font-semibold px-2 py-0.5 rounded-full border border-[#D4FF32]/20">
              {members.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage agency team members, external client reviewers, and granular role permissions.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs shadow-[0_0_15px_rgba(212,255,50,0.25)] hover:bg-[#C2ED25] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Members List */}
      <div className="rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] divide-y divide-[rgba(255,255,255,0.06)] overflow-hidden">
        {members.map((m) => (
          <div
            key={m.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#182238]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  {m.name}
                  {m.status === "PENDING" && (
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded">
                      INVITED
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{m.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                  m.role === "OWNER"
                    ? "bg-[#D4FF32]/10 text-[#D4FF32] border-[#D4FF32]/30"
                    : m.role === "CLIENT"
                    ? "bg-[#C4B5FD]/10 text-[#C4B5FD] border-[#C4B5FD]/30"
                    : "bg-[#182238] text-slate-300 border-[rgba(255,255,255,0.08)]"
                }`}
              >
                {m.role.replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="p-5 rounded-2xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Role Permission Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)]">
            <strong className="text-[#D4FF32] block mb-1">Owner / Admin</strong>
            Full access to billing, OAuth credentials, workspace settings, brand brain, publishing, and team invites.
          </div>
          <div className="p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)]">
            <strong className="text-white block mb-1">Content Manager & Designer</strong>
            Can create posts, generate AI creatives, manage calendar, and reply to social inbox.
          </div>
          <div className="p-3 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)]">
            <strong className="text-[#C4B5FD] block mb-1">Client (External)</strong>
            Restricted to client review portal: preview drafts, approve content, and submit revision feedback.
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121A2B] border border-[rgba(255,255,255,0.12)] rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Invite Team Member or Client</h3>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="colleague@agency.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Assigned Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none"
              >
                <option value="CONTENT_MANAGER">Content Manager</option>
                <option value="DESIGNER">Designer</option>
                <option value="CLIENT">Client (Approval Only)</option>
                <option value="ADMIN">Admin</option>
                <option value="ANALYST">Analyst (Read-Only)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="px-4 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25]"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

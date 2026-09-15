"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Sparkles,
  LayoutDashboard,
  PenTool,
  Calendar,
  Image as ImageIcon,
  Inbox,
  BarChart3,
  Layers,
  CheckSquare,
  BrainCircuit,
  Users,
  Share2,
  Settings,
  ChevronDown,
  Building2,
  Check,
  Zap,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";
import { SocialPilotIcon } from "@/components/ui/logo";

const NAV_ITEMS = [
  { name: "Overview", href: "/app", icon: LayoutDashboard },
  { name: "AI Content Studio", href: "/app/content-studio", icon: Sparkles, badge: "AI" },
  { name: "Content Calendar", href: "/app/calendar", icon: Calendar },
  { name: "Media Library", href: "/app/media", icon: ImageIcon },
  { name: "Social Inbox", href: "/app/inbox", icon: Inbox, badgeCount: 2 },
  { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { name: "Campaigns", href: "/app/campaigns", icon: Layers },
  { name: "Approvals", href: "/app/approvals", icon: CheckSquare, badgeCount: 1 },
  { name: "Brand Brain", href: "/app/brand-brain", icon: BrainCircuit, badge: "PRO" },
  { name: "Social Accounts", href: "/app/social-accounts", icon: Share2 },
  { name: "Team & Roles", href: "/app/team", icon: Users },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data, activeBrand, activeWorkspace, store } = useDemoStore();
  const { user, logout } = useAuth();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0B1020] border-r border-[rgba(255,255,255,0.08)] flex flex-col h-screen select-none z-30">
      {/* Brand Header: Logo points to public homepage per requirements */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" title="Return to Public Homepage">
          <SocialPilotIcon size={34} className="shadow-[0_0_15px_rgba(212,255,50,0.3)] transition-transform group-hover:scale-105" />
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              SocialPilot <span className="text-[#D4FF32]">AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">
              Midnight Intelligence
            </div>
          </div>
        </Link>
      </div>

      {/* Workspace & Brand Switchers */}
      <div className="p-3 border-b border-[rgba(255,255,255,0.08)] space-y-2">
        {/* Workspace Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowWorkspaceMenu(!showWorkspaceMenu);
              setShowBrandMenu(false);
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#121A2B] hover:bg-[#182238] border border-[rgba(255,255,255,0.08)] text-xs text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-[#D4FF32]" />
              <span className="font-medium truncate">{activeWorkspace?.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#182238] border border-[rgba(255,255,255,0.12)] rounded-lg shadow-xl py-1 z-50">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Workspaces
              </div>
              {data.workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    store.setActiveWorkspace(ws.id);
                    setShowWorkspaceMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-[#1E2A44] flex items-center justify-between"
                >
                  <span className="truncate">{ws.name}</span>
                  {ws.id === activeWorkspace?.id && <Check className="w-3.5 h-3.5 text-[#D4FF32]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Brand Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowBrandMenu(!showBrandMenu);
              setShowWorkspaceMenu(false);
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#121A2B]/60 hover:bg-[#182238] border border-[rgba(255,255,255,0.05)] text-xs text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: activeBrand?.primaryColor || "#D4FF32" }}
              />
              <span className="text-[11px] text-slate-400">Brand:</span>
              <span className="font-medium truncate text-white">{activeBrand?.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showBrandMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#182238] border border-[rgba(255,255,255,0.12)] rounded-lg shadow-xl py-1 z-50">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Brands
              </div>
              {data.brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    store.setActiveBrand(b.id);
                    setShowBrandMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-[#1E2A44] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.primaryColor }} />
                    <span className="truncate">{b.name}</span>
                  </div>
                  {b.id === activeBrand?.id && <Check className="w-3.5 h-3.5 text-[#D4FF32]" />}
                </button>
              ))}
              <div className="border-t border-[rgba(255,255,255,0.08)] mt-1 pt-1 px-2">
                <Link
                  href="/app/brand-brain"
                  onClick={() => setShowBrandMenu(false)}
                  className="block text-[11px] text-[#C4B5FD] hover:underline py-1"
                >
                  + Add or edit in Brand Brain
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-[#182238] text-white border border-[rgba(212,255,50,0.2)] shadow-[0_0_10px_rgba(212,255,50,0.05)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#121A2B]"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-[#D4FF32]" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide",
                    item.badge === "AI"
                      ? "bg-[#D4FF32]/15 text-[#D4FF32] border border-[#D4FF32]/30"
                      : "bg-[#C4B5FD]/15 text-[#C4B5FD] border border-[#C4B5FD]/30"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {item.badgeCount && (
                <span className="text-[10px] font-semibold bg-[#D4FF32] text-[#0B1020] px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {item.badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Demo Badge & User Profile */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.08)] bg-[#0B1020]/80 space-y-2">
        {/* Demo Mode Status Card */}
        <div className="rounded-lg bg-[#121A2B] border border-[rgba(255,255,255,0.08)] p-2.5 text-[11px]">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D4FF32] animate-pulse" />
              Demo Mode Active
            </span>
            <button
              onClick={() => {
                if (confirm("Reset demo data to initial seed?")) {
                  store.resetToDefault();
                  alert("Demo store reset successfully.");
                }
              }}
              title="Reset sample data"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-tight">
            Simulated publishing & AI active. No live social accounts touched.
          </p>
        </div>

        {/* User Account Bar with Logout Action */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#121A2B] border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D4FF32] to-[#C4B5FD] text-[#0B1020] font-black text-xs flex items-center justify-center flex-shrink-0">
              {user ? user.name.slice(0, 2).toUpperCase() : "AG"}
            </div>
            <div className="truncate text-left">
              <div className="text-xs font-semibold text-white truncate">
                {user ? user.name : "Apex Growth Team"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user ? user.workspaceName : activeWorkspace.name}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to sign out?")) {
                logout();
                window.location.href = "/login";
              }
            }}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#182238] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

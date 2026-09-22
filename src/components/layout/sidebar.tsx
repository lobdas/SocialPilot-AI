"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  LayoutDashboard,
  PenTool,
  Calendar,
  Inbox,
  BarChart3,
  Layers,
  CheckSquare,
  BrainCircuit,
  Share2,
  Settings,
  ChevronDown,
  Building2,
  Check,
  Zap,
  RotateCcw,
  LogOut,
  Plus,
  X,
} from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";
import { SocialPilotIcon } from "@/components/ui/logo";

const NAV_ITEMS = [
  { name: "Overview", href: "/app", icon: LayoutDashboard },
  { name: "AI Content Studio", href: "/app/content-studio", icon: Sparkles, badge: "AI" },
  { name: "All Posts", href: "/app/posts", icon: Send },
  { name: "Content Calendar", href: "/app/calendar", icon: Calendar },
  { name: "Social Inbox", href: "/app/inbox", icon: Inbox, badgeCount: 2 },
  { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { name: "Campaigns", href: "/app/campaigns", icon: Layers },
  { name: "Approvals", href: "/app/approvals", icon: CheckSquare, badgeCount: 1 },
  { name: "Brand Brain", href: "/app/brand-brain", icon: BrainCircuit, badge: "PRO" },
  { name: "Social Accounts", href: "/app/social-accounts", icon: Share2 },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data, activeBrand, activeWorkspace, store } = useDemoStore();
  const { user, logout } = useAuth();
  const [showBrandMenu, setShowBrandMenu] = useState(false);
  const [isCreateBrandOpen, setIsCreateBrandOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandEmail, setNewBrandEmail] = useState("");
  const [newBrandTagline, setNewBrandTagline] = useState("");
  const [newBrandColor, setNewBrandColor] = useState("#D4FF32");

  useEffect(() => {
    const handleOpen = () => setIsCreateBrandOpen(true);
    window.addEventListener("open-create-brand", handleOpen);
    return () => window.removeEventListener("open-create-brand", handleOpen);
  }, []);

  const handleCreateBrand = () => {
    if (!newBrandName.trim()) return;
    store.addBrand({
      workspaceId: activeWorkspace?.id || "ws-1",
      name: newBrandName.trim(),
      slug: newBrandName.trim().toLowerCase().replace(/\s+/g, "-"),
      brandEmail: newBrandEmail.trim() || undefined,
      tagline: newBrandTagline.trim() || undefined,
      primaryColor: newBrandColor,
      secondaryColor: "#C4B5FD",
      brandVoice: "Authentic, clear, engaging",
      tone: "Professional yet conversational",
      preferredLanguage: "en",
    });
    setNewBrandName("");
    setNewBrandEmail("");
    setNewBrandTagline("");
    setNewBrandColor("#D4FF32");
    setIsCreateBrandOpen(false);
  };

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

      {/* Workspace Header & Brand Switcher */}
      <div className="p-3 border-b border-[rgba(255,255,255,0.08)] space-y-2.5">
        {/* Organization / Single Workspace Header */}
        <div className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#121A2B] border border-[rgba(255,255,255,0.06)] shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#182238] flex items-center justify-center border border-white/5 flex-shrink-0 text-[#D4FF32]">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] text-slate-400 uppercase font-mono tracking-wider leading-none">
                Workspace
              </div>
              <div
                className="font-semibold text-xs text-white truncate leading-snug mt-0.5"
                title={activeWorkspace?.name || "Apex Growth Agency"}
              >
                {activeWorkspace?.name || "Apex Growth Agency"}
              </div>
            </div>
          </div>
          <Link
            href="/app/settings"
            title="Workspace Settings"
            className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Brand Selector Dropdown */}
        <div className="relative">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1 flex items-center justify-between">
            <span>Active Brand</span>
            <span className="text-[9px] font-mono text-slate-500">{data.brands.length} Brands</span>
          </div>
          <button
            onClick={() => {
              if (data.brands.length === 0) {
                setIsCreateBrandOpen(true);
              } else {
                setShowBrandMenu(!showBrandMenu);
              }
            }}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#182238] hover:bg-[#1E2A44] border border-[rgba(255,255,255,0.08)] hover:border-[#D4FF32]/40 text-xs text-slate-200 transition-all shadow-sm group cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate min-w-0">
              {data.brands.length === 0 ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-[#D4FF32] animate-pulse" />
                  <span className="font-bold truncate text-[#D4FF32]">
                    + Create First Brand
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white/10"
                    style={{ backgroundColor: activeBrand?.primaryColor || "#D4FF32" }}
                  />
                  <span className="font-semibold truncate text-white group-hover:text-[#D4FF32] transition-colors">
                    {activeBrand?.name || "Select Brand"}
                  </span>
                </>
              )}
            </div>
            {data.brands.length > 0 && (
              <ChevronDown
                className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", showBrandMenu && "rotate-180")}
              />
            )}
          </button>

          {showBrandMenu && (
            <>
              {/* Invisible backdrop to close menu on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowBrandMenu(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#182238] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-white/5">
                  <span>Switch Brand</span>
                  <span className="text-[9px] text-slate-500 font-mono">Select Active</span>
                </div>

                <div className="max-h-56 overflow-y-auto py-1">
                  {data.brands.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-slate-400">
                      No brands created yet.
                    </div>
                  ) : (
                    data.brands.map((b) => {
                      const isCurrent = b.id === activeBrand?.id;
                      return (
                        <button
                          key={b.id}
                          onClick={() => {
                            store.setActiveBrand(b.id);
                            setShowBrandMenu(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer",
                            isCurrent
                              ? "bg-[#D4FF32]/10 text-white font-semibold"
                              : "text-slate-300 hover:bg-[#1E2A44] hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2.5 truncate min-w-0">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: b.primaryColor || "#D4FF32" }}
                            />
                            <span className="truncate">{b.name}</span>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-[#D4FF32] flex-shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Create New Brand Button */}
                <div className="border-t border-[rgba(255,255,255,0.08)] mt-1 pt-1.5 px-2">
                  <button
                    onClick={() => {
                      setShowBrandMenu(false);
                      setIsCreateBrandOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#D4FF32]/10 hover:bg-[#D4FF32]/20 border border-[#D4FF32]/30 text-xs font-semibold text-[#D4FF32] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Brand</span>
                  </button>
                </div>
              </div>
            </>
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

      {/* Create New Brand Modal */}
      {isCreateBrandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md bg-[#121A2B] border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF32]" />
                  Create New Brand
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Add a new client or internal brand under {activeWorkspace?.name}
                </p>
              </div>
              <button
                onClick={() => setIsCreateBrandOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Brand Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateBrand();
                    }
                  }}
                  placeholder="e.g. Nike, Starbucks, Acme Corp..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Brand Email <span className="text-slate-500 font-normal">(for Brand Alerts & Reports)</span>
                </label>
                <input
                  type="email"
                  value={newBrandEmail}
                  onChange={(e) => setNewBrandEmail(e.target.value)}
                  placeholder="e.g. brand@example.com"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Tagline / Description (Optional)
                </label>
                <input
                  type="text"
                  value={newBrandTagline}
                  onChange={(e) => setNewBrandTagline(e.target.value)}
                  placeholder="e.g. Just Do It / Premium activewear"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.1)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
                  Brand Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {["#D4FF32", "#38BDF8", "#EC4899", "#10B981", "#8B5CF6", "#F59E0B"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewBrandColor(color)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-transform cursor-pointer border border-white/20",
                        newBrandColor === color && "scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#121A2B]"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateBrandOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBrand}
                disabled={!newBrandName.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] hover:bg-[#c4ee24] disabled:opacity-40 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Create Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

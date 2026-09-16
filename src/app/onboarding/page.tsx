"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Share2,
  Check,
} from "lucide-react";
import { demoStore } from "@/lib/demo-store";
import { PlatformType, Brand } from "@/lib/types";
import { SocialPilotLogo } from "@/components/ui/logo";

const USER_TYPES = [
  { id: "agency", label: "Digital Marketing Agency", desc: "Managing multi-brand client pipelines & approvals" },
  { id: "business", label: "Small / Mid Business Owner", desc: "Scaling organic brand presence & lead generation" },
  { id: "creator", label: "Content Creator / Solopreneur", desc: "Monetizing cross-platform audience distribution" },
  { id: "enterprise", label: "Enterprise Marketing Team", desc: "Strict compliance, Brand Brain & large teams" },
];

const PLATFORMS_TO_CONNECT: { id: PlatformType; name: string }[] = [
  { id: "LINKEDIN", name: "LinkedIn" },
  { id: "X", name: "X (Twitter)" },
  { id: "INSTAGRAM", name: "Instagram" },
  { id: "FACEBOOK", name: "Facebook" },
  { id: "THREADS", name: "Threads" },
  { id: "PINTEREST", name: "Pinterest" },
];

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [userType, setUserType] = useState("agency");
  const [workspaceName, setWorkspaceName] = useState("Apex Growth Agency");
  const [industry, setIndustry] = useState("Digital Marketing");
  const [brandName, setBrandName] = useState("SocialPilot AI");
  const [brandVoice, setBrandVoice] = useState("Authoritative, bold, analytical, yet approachable");
  const [targetAudience, setTargetAudience] = useState("Founders and Agency Leaders");
  const [connectedPlatforms, setConnectedPlatforms] = useState<PlatformType[]>(["LINKEDIN", "X", "INSTAGRAM"]);
  const [firstPostIdea, setFirstPostIdea] = useState("Why omni-channel native distribution outperforms cross-posting in 2026");

  const togglePlatform = (p: PlatformType) => {
    if (connectedPlatforms.includes(p)) {
      setConnectedPlatforms(connectedPlatforms.filter((item) => item !== p));
    } else {
      setConnectedPlatforms([...connectedPlatforms, p]);
    }
  };

  const handleFinish = () => {
    // Persist brand
    demoStore.updateBrand("brand-1", {
      name: brandName,
      brandVoice,
      targetAudience,
    });
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col justify-between p-6 bg-grid-pattern">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between py-4">
        <SocialPilotLogo size="sm" />
        <div className="text-xs text-slate-400 font-mono">Step {step} of 5</div>
      </div>

      {/* Main Step Container */}
      <div className="max-w-xl mx-auto w-full p-6 sm:p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-6 animate-in fade-in duration-300">
        {/* Step 1: Welcome & User Type */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#D4FF32] uppercase tracking-wider">
                Step 1
              </span>
              <h1 className="text-xl font-extrabold text-white mt-1">Welcome to SocialPilot AI</h1>
              <p className="text-xs text-slate-400 mt-1">
                How would you describe your primary business structure?
              </p>
            </div>

            <div className="space-y-2">
              {USER_TYPES.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setUserType(type.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    userType === type.id
                      ? "bg-[#182238] border-[#D4FF32] text-white"
                      : "bg-[#0B1020] border-[rgba(255,255,255,0.06)] text-slate-400 hover:text-white"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{type.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{type.desc}</div>
                  </div>
                  {userType === type.id && <Check className="w-4 h-4 text-[#D4FF32]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Workspace Setup */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#D4FF32] uppercase tracking-wider">
                Step 2
              </span>
              <h1 className="text-xl font-extrabold text-white mt-1">Create Your Workspace</h1>
              <p className="text-xs text-slate-400 mt-1">
                Workspaces isolate channels, assets, and permissions.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Brand Brain Setup */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#D4FF32] uppercase tracking-wider">
                Step 3
              </span>
              <h1 className="text-xl font-extrabold text-white mt-1">Configure Brand Brain</h1>
              <p className="text-xs text-slate-400 mt-1">
                This teaches our AI your tone of voice and target personas.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Brand Voice Guidelines
                </label>
                <input
                  type="text"
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Social Accounts */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#D4FF32] uppercase tracking-wider">
                Step 4
              </span>
              <h1 className="text-xl font-extrabold text-white mt-1">Connect Channels</h1>
              <p className="text-xs text-slate-400 mt-1">
                Select accounts to publish to. (In Demo Mode, these are simulated automatically).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS_TO_CONNECT.map((p) => {
                const isSelected = connectedPlatforms.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs font-semibold ${
                      isSelected
                        ? "bg-[#182238] border-[#D4FF32] text-white"
                        : "bg-[#0B1020] border-[rgba(255,255,255,0.06)] text-slate-400"
                    }`}
                  >
                    <span>{p.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D4FF32]" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: First AI Post */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#D4FF32] uppercase tracking-wider">
                Step 5
              </span>
              <h1 className="text-xl font-extrabold text-white mt-1">Generate Your First Post</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter any raw idea and SocialPilot AI will adapt it across all channels.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Content Idea
              </label>
              <textarea
                rows={3}
                value={firstPostIdea}
                onChange={(e) => setFirstPostIdea(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50 resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] flex items-center gap-1.5 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-extrabold text-xs hover:bg-[#C2ED25] flex items-center gap-2 shadow-[0_0_20px_rgba(212,255,50,0.3)] transition-all"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Complete Setup & Enter Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-[11px] text-slate-500">
        Demo Mode Enabled • No real social media accounts are modified without live OAuth authorization.
      </div>
    </div>
  );
}

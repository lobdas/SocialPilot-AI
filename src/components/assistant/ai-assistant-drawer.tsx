"use client";

import { useState } from "react";
import { Sparkles, X, Send, Bot, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { useDemoStore } from "@/lib/use-demo-store";
import { useRouter } from "next/navigation";

export function AIAssistantDrawer() {
  const { activeBrand } = useDemoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; text: string; action?: { label: string; url: string } }[]>([
    {
      role: "assistant",
      text: "Hello! I am your SocialPilot Marketing Copilot. I can draft multi-platform campaigns, generate image ideas, suggest strategic posting times, or write high-converting hooks. What are we creating today?",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const router = useRouter();

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    setInput("");
    const userMsg = { role: "user" as const, text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    // Realistic response synthesis
    setTimeout(() => {
      setIsThinking(false);
      let replyText = "";
      let actionObj: { label: string; url: string } | undefined;

      if (textToSend.toLowerCase().includes("calendar") || textToSend.toLowerCase().includes("30-day")) {
        replyText = "I've structured a 30-day multi-channel content rhythm based on your brand voice:\n• Mondays: Thought leadership & industry benchmarks (LinkedIn)\n• Wednesdays: Product teardowns & case studies (X + IG Carousel)\n• Fridays: Culture & weekend insights (Instagram + Threads)\n\nWould you like to open the Content Studio to draft the first week?";
        actionObj = { label: "Open Content Studio", url: "/app/content-studio" };
      } else if (textToSend.toLowerCase().includes("image") || textToSend.toLowerCase().includes("creative")) {
        replyText = "I recommend an editorial 3D minimal render with electric lime backlighting and clean typography for maximum scroll-stopping power on Instagram & LinkedIn.";
        actionObj = { label: "Generate in Media Studio", url: "/app/media" };
      } else {
        replyText = `Great strategic initiative. I've analyzed your Brand Brain guidelines for "${activeBrand.name}". I recommend framing this with a high-curiosity hook on X and a comprehensive breakdown on LinkedIn.`;
        actionObj = { label: "Draft in Studio", url: "/app/content-studio" };
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: replyText,
          action: actionObj,
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#182238] border border-[rgba(212,255,50,0.4)] text-white shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:border-[#D4FF32] transition-all hover:scale-105 group"
      >
        <div className="w-6 h-6 rounded-full bg-[#D4FF32] text-[#0B1020] flex items-center justify-center font-bold">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="text-xs font-semibold">AI Assistant</span>
        <span className="w-2 h-2 rounded-full bg-[#D4FF32] animate-pulse" />
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-[#121A2B] border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-[#182238] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#D4FF32] text-[#0B1020] flex items-center justify-center">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  SocialPilot Assistant
                  <span className="text-[9px] bg-[#D4FF32]/20 text-[#D4FF32] px-1.5 py-0.2 rounded font-mono">
                    LIVE
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">Context: {activeBrand.name}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#182238] border border-[rgba(255,255,255,0.08)] flex items-center justify-center flex-shrink-0 text-[#D4FF32]">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[82%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#D4FF32] text-[#0B1020] font-medium"
                      : "bg-[#182238] text-slate-200 border border-[rgba(255,255,255,0.08)]"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.action && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        router.push(m.action!.url);
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4FF32] text-[#0B1020] text-[11px] font-bold shadow hover:bg-[#C2ED25] transition-colors"
                    >
                      <span>{m.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pl-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF32] animate-ping" />
                SocialPilot is formulating strategy...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto border-t border-[rgba(255,255,255,0.05)] bg-[#0B1020]/50">
            <button
              onClick={() => handleSend("Plan a 30-day content calendar for our agency")}
              className="text-[10px] bg-[#182238] text-slate-300 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-[rgba(255,255,255,0.06)]"
            >
              📅 30-day calendar
            </button>
            <button
              onClick={() => handleSend("Generate high-converting hook ideas for LinkedIn")}
              className="text-[10px] bg-[#182238] text-slate-300 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-[rgba(255,255,255,0.06)]"
            >
              ⚡ LinkedIn hooks
            </button>
            <button
              onClick={() => handleSend("Suggest an AI image prompt for our next post")}
              className="text-[10px] bg-[#182238] text-slate-300 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-[rgba(255,255,255,0.06)]"
            >
              🎨 Image prompt
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#182238] border-t border-[rgba(255,255,255,0.08)] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for ideas, hooks, or calendar strategy..."
              className="flex-1 bg-[#121A2B] border border-[rgba(255,255,255,0.08)] focus:border-[#D4FF32]/60 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="px-3 py-1.5 bg-[#D4FF32] text-[#0B1020] rounded-lg font-bold hover:bg-[#C2ED25] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

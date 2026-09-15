import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AIAssistantDrawer } from "@/components/assistant/ai-assistant-drawer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B1020] text-slate-100 antialiased font-sans">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <Topbar />

        {/* Scrollable Page Canvas */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 bg-midnight bg-grid-pattern">
          {children}
        </main>

        {/* Floating Conversational AI Copilot */}
        <AIAssistantDrawer />
      </div>
    </div>
  );
}

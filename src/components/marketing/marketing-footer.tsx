import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { SocialPilotLogo } from "@/components/ui/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#070B14] py-16 px-6 text-slate-400">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <SocialPilotLogo size="sm" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Create once. Publish everywhere. Manage everything. The all-in-one AI social media management platform engineered for digital marketing agencies, creators, and high-growth brands.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (API Handshakes Verified)</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/features" className="hover:text-white transition-colors">AI Content Studio</Link></li>
              <li><Link href="/features#image-studio" className="hover:text-white transition-colors">AI Image Studio</Link></li>
              <li><Link href="/features#calendar" className="hover:text-white transition-colors">Content Calendar</Link></li>
              <li><Link href="/features#inbox" className="hover:text-white transition-colors">Unified Social Inbox</Link></li>
              <li><Link href="/features#brand-brain" className="hover:text-white transition-colors">Brand Brain</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources & Integrations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/integrations" className="hover:text-white transition-colors">Supported Platforms</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">System Architecture</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Enterprise Inquiries</Link></li>
              <li><Link href="/client/approval/demo-client-token-apex-992" className="hover:text-white transition-colors">Client Portal Preview</Link></li>
              <li><Link href="/features" className="hover:text-white transition-colors">Release Notes</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Security Disclosures</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500">
            © 2026 SocialPilot Technologies Inc. All rights reserved. Built with Next.js 16 & Prisma.
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#D4FF32] transition-colors">LinkedIn</Link>
            <Link href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#D4FF32] transition-colors">X (Twitter)</Link>
            <Link href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#D4FF32] transition-colors">GitHub</Link>
            <Link href="/contact" className="hover:text-[#D4FF32] transition-colors">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

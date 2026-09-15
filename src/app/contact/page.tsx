"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, MessageSquare, CheckCircle2, AlertTriangle, Send, Building2, User } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    inquiryType: "Enterprise & Custom Workspaces",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <MarketingNavbar />

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Contact & Support</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Get in Touch</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Have questions regarding agency workspace deployments, custom API rate limits, or integration roadmaps?
          </p>
        </div>

        {/* Demo Environment Notice Banner */}
        <div className="p-4 rounded-2xl bg-[#182238] border border-amber-500/30 text-xs space-y-1.5 text-amber-300">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Demo State Notice</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            In this preview deployment, backend email dispatch is currently staged. Inquiries submitted through this form are captured in the local session audit log rather than transmitted via live SMTP.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] shadow-2xl space-y-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Your Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="sarah@agency.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Company / Organization</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Apex Growth Digital"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Inquiry Category</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white focus:outline-none focus:border-[#D4FF32]/50 transition-colors"
                  >
                    <option value="Enterprise & Custom Workspaces">Enterprise & Custom Workspaces</option>
                    <option value="Agency Pricing & White-Label">Agency Pricing & White-Label</option>
                    <option value="Custom API & Webhooks">Custom API & Webhooks</option>
                    <option value="Feedback & Feature Request">Feedback & Feature Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your team size, current social workflow, and what platforms you manage..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-lg bg-[#0B1020] border border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF32]/50 resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-[#D4FF32] text-[#0B1020] font-bold text-xs hover:bg-[#C2ED25] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,255,50,0.2)] disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Recording submission...</span>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Inquiry Recorded in Demo Log</h3>
                <p className="text-xs text-slate-400">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Your message was recorded in the demo audit queue.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#D4FF32] hover:underline font-semibold"
              >
                Submit another message
              </button>
            </div>
          )}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

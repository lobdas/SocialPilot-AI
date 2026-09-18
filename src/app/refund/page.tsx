import Link from "next/link";
import { RefreshCw, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <MarketingNavbar />

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-10">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Billing & Assurance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Refund & Cancellation Policy</h1>
          <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Version 1.1</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-8 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4FF32]" />
              1. 7-Day Money-Back Guarantee (First-Time Subscriptions)
            </h2>
            <p>
              We want you to be completely satisfied with SocialPilot AI. If you are a new subscriber to any of our recurring monthly or annual plans and find that our platform does not suit your business workflow, you are eligible for a full refund within <strong>7 days</strong> of your initial purchase date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#D4FF32]" />
              2. Subscription Cancellation
            </h2>
            <p>
              You can cancel your subscription at any time directly through your <strong>Workspace Billing Dashboard</strong> or by notifying our billing department. Upon cancellation:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Your plan will remain fully active until the end of your current paid billing period.</li>
              <li>You will not be charged for the subsequent billing cycle.</li>
              <li>Your connected social tokens, scheduling queues, and Brand Brain knowledge will remain preserved in read-only status for 30 days before scheduled purge.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#D4FF32]" />
              3. Non-Refundable Items & Usage Limits
            </h2>
            <p>
              Refund requests may be denied or prorated under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Accounts that have consumed more than 50% of their monthly AI token quotas or generated over 250 AI media assets during the initial 7-day window.</li>
              <li>Subsequent renewal charges where cancellation was not requested prior to the automated renewal date.</li>
              <li>Violations of our Terms of Service (e.g., spamming, abusive automation, rate-limit bypassing).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#D4FF32]" />
              4. How to Request a Refund
            </h2>
            <p>
              To submit a refund request, please email our finance team at <a href="mailto:billing@socialpilot.ai" className="text-[#D4FF32] underline hover:opacity-80">billing@socialpilot.ai</a> with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Your account email address</li>
              <li>Invoice number or transaction ID</li>
              <li>A brief reason for your cancellation (helps us improve our service)</li>
            </ul>
            <p className="pt-2">
              Approved refunds are credited to the original payment method (Credit Card, Stripe, or Bank Transfer) within <strong>5 to 10 business days</strong> depending on your bank.
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

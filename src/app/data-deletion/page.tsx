import Link from "next/link";
import { Trash2, ShieldAlert, CheckCircle, ExternalLink, Mail } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <MarketingNavbar />

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-10">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#D4FF32] uppercase tracking-wider">Compliance & User Rights</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">User Data Deletion Instructions</h1>
          <p className="text-xs text-slate-400">In accordance with Meta Platform Terms, GDPR, and Global Privacy Standards</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121A2B] border border-[rgba(255,255,255,0.08)] space-y-8 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D4FF32]" />
              1. Overview & Your Right to Be Forgotten
            </h2>
            <p>
              SocialPilot AI respects your privacy and full ownership of your personal information. When you integrate your social channels (such as Facebook Pages, Instagram Professional Accounts, WhatsApp Business API, LinkedIn, or X), we only access the permissions explicitly authorized by you.
            </p>
            <p>
              Under platform rules (including the Meta Platform Policy) and international privacy frameworks, you have the right to request the permanent deletion of your social media tokens, synced messages, media files, and personal data from our systems at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-[#D4FF32]" />
              2. Option A: Delete Data Directly from SocialPilot AI Dashboard
            </h2>
            <p>
              If you have access to your SocialPilot AI account, you can initiate an instant unlink and deletion:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400">
              <li>Log in to your <strong>SocialPilot AI Dashboard</strong>.</li>
              <li>Navigate to <strong>Settings &rarr; Connected Accounts</strong>.</li>
              <li>Locate the social account (Facebook, Instagram, WhatsApp, etc.) you wish to remove.</li>
              <li>Click <strong>&quot;Disconnect &amp; Purge Tokens&quot;</strong>.</li>
              <li>Confirm the deletion. All OAuth access tokens, cached profile data, and incoming webhooks for that account will be immediately wiped from our primary databases.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#D4FF32]" />
              3. Option B: Revoke Access via Facebook / Meta App Settings
            </h2>
            <p>
              To remove SocialPilot AI&apos;s permissions from your Facebook or Instagram profile directly via Meta:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400">
              <li>Go to your Facebook profile&apos;s <strong>Settings &amp; Privacy &rarr; Settings</strong>.</li>
              <li>Look for <strong>&quot;Apps and Websites&quot;</strong> in the left sidebar menu.</li>
              <li>Search for <strong>SocialPilot AI</strong>.</li>
              <li>Click the <strong>&quot;Remove&quot;</strong> button next to the app name.</li>
              <li>Optionally check the box to delete all posts, videos, or events that SocialPilot AI may have published on your behalf.</li>
              <li>Click <strong>&quot;Remove&quot;</strong> to finalize. Meta will send an automated deletion callback notification to our servers to invalidate all active session tokens.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D4FF32]" />
              4. Option C: Request Full Account &amp; Data Purge via Email
            </h2>
            <p>
              If you wish to request a comprehensive purge of all user records, workspace logs, and AI conversation history, send an email to our data privacy officer:
            </p>
            <div className="p-4 rounded-xl bg-[#0B1020] border border-[rgba(255,255,255,0.06)] space-y-1">
              <p><strong>Email:</strong> <a href="mailto:privacy@socialpilot.ai" className="text-[#D4FF32] underline">privacy@socialpilot.ai</a></p>
              <p><strong>Subject:</strong> Meta / User Data Deletion Request</p>
              <p><strong>Required Info:</strong> Your registered account email address or your Meta User ID / Page ID.</p>
            </div>
            <p className="text-slate-400">
              Our engineering team processes manual data wipe requests within <strong>48 to 72 hours</strong>. You will receive an official confirmation receipt and tracking code upon completion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#D4FF32]" />
              5. Data Retention &amp; Backup Policy
            </h2>
            <p>
              Once a deletion request is executed, your encryption keys and OAuth tokens are permanently destroyed. Encrypted cold backups are automatically purged within 30 days per our rolling retention lifecycle.
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

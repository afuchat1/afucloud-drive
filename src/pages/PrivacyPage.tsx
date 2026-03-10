import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AfuLogo from "@/components/AfuLogo";
import SEO from "@/components/SEO";

const PrivacyPage = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Privacy Policy – AfuCloud"
      description="Read the AfuCloud Privacy Policy. Learn how AfuCloud by AfuChat collects, uses, and protects your data on our developer cloud storage platform."
      keywords="AfuCloud privacy, afuchat privacy policy, cloud storage privacy, afucloud data protection, afu cloud privacy"
      canonical="https://cloud.afuchat.com/privacy"
    />

    <nav className="flex items-center justify-between px-6 py-4 lg:px-12 border-b border-border">
      <Link to="/" className="flex items-center gap-2">
        <AfuLogo className="h-6 w-6" />
        <span className="text-lg font-semibold tracking-tight">AfuCloud</span>
      </Link>
      <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
    </nav>

    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 1, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Information We Collect</h2>
          <p>We collect information you provide directly: email address, display name, and files you upload. We also collect usage data including storage consumption, API usage, and access logs.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">How We Use Your Information</h2>
          <p>We use your information to provide, maintain, and improve the Service; communicate with you about your account; enforce our terms; and protect against abuse.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">File Storage & Access</h2>
          <p>Files you upload are stored securely and are private by default. Public files are accessible via direct URL. We do not access, scan, or analyze the contents of your files except as required for the AI summarization feature, which is opt-in.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Data Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share data with infrastructure providers necessary to operate the Service, under strict confidentiality agreements.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Data Retention</h2>
          <p>We retain your data for as long as your account is active. Upon account deletion, your files and personal data will be permanently removed within 30 days.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Security</h2>
          <p>We implement industry-standard security measures including encryption in transit (TLS), access controls, and regular security audits to protect your data.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Cookies</h2>
          <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Your Rights</h2>
          <p>You may access, update, or delete your personal information at any time through your account settings. You may also request a complete data export by contacting us.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will notify you of significant changes via email or in-app notification.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Contact</h2>
          <p>For privacy-related inquiries, contact us at <a href="mailto:privacy@afuchat.com" className="text-primary hover:underline">privacy@afuchat.com</a>.</p>
        </section>
      </div>
    </main>

    <footer className="px-6 py-8 text-center text-xs text-muted-foreground border-t border-border">
      © {new Date().getFullYear()} AfuCloud · cloud.afuchat.com
    </footer>
  </div>
);

export default PrivacyPage;

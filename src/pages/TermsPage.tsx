import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AfuLogo from "@/components/AfuLogo";
import SEO from "@/components/SEO";

const TermsPage = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Terms of Service – AfuCloud"
      description="Read the AfuCloud Terms of Service. Understand the rules, usage limits, and policies for using AfuCloud developer cloud storage platform by AfuChat."
      keywords="AfuCloud terms, afuchat terms of service, cloud storage terms, afucloud legal, afu cloud terms"
      canonical="https://cloud.afuchat.com/terms"
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
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 1, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using AfuCloud ("Service"), operated at cloud.afuchat.com by AfuChat, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">2. Description of Service</h2>
          <p>AfuCloud provides cloud file storage, project-based file management, public link generation, and a developer REST API. The Service is provided "as is" without warranty of any kind.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">3. User Accounts</h2>
          <p>You must provide a valid email address to create an account. You are responsible for maintaining the security of your account credentials. You must be at least 13 years old to use the Service.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">4. Acceptable Use</h2>
          <p>You agree not to upload, store, or distribute content that is illegal, harmful, threatening, abusive, or violates any applicable law. We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">5. Storage & Limits</h2>
          <p>Each account is subject to storage limits as displayed in your dashboard. We may adjust limits at any time with notice. Exceeding your storage limit may result in restricted upload capabilities.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">6. API Usage</h2>
          <p>API access is provided via project-scoped API keys. You are responsible for keeping your API keys secure. We reserve the right to rate-limit or suspend API access for abuse.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">7. Data & Privacy</h2>
          <p>Your use of the Service is also governed by our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. We do not sell your data to third parties.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">8. Termination</h2>
          <p>We may terminate or suspend your access to the Service at any time, with or without cause, with or without notice. Upon termination, your right to use the Service ceases immediately.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">9. Limitation of Liability</h2>
          <p>AfuCloud shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">10. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">11. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:support@afuchat.com" className="text-primary hover:underline">support@afuchat.com</a>.</p>
        </section>
      </div>
    </main>

    <footer className="px-6 py-8 text-center text-xs text-muted-foreground border-t border-border">
      © {new Date().getFullYear()} AfuCloud · cloud.afuchat.com
    </footer>
  </div>
);

export default TermsPage;

import { Link } from "react-router-dom";
import { Cloud, ArrowLeft, Zap, Shield, Globe, Code } from "lucide-react";

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
      <Link to="/" className="flex items-center gap-2">
        <Cloud className="h-6 w-6 text-brand" />
        <span className="text-lg font-semibold tracking-tight">AfuCloud</span>
      </Link>
      <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
    </nav>

    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">About AfuCloud</h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        AfuCloud is a developer-first cloud storage platform built for speed and simplicity. We believe file storage should be fast, transparent, and easy to integrate.
      </p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Our Mission</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We're building the simplest cloud storage platform on the internet. No bloated dashboards, no confusing pricing tiers, no unnecessary complexity. Upload a file, get a link, use our API. That's it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">What We Offer</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { icon: Zap, title: "Fast Uploads", desc: "Direct uploads with instant public link generation. No waiting." },
              { icon: Code, title: "REST API", desc: "Project-scoped API keys. Four endpoints. Integrate in minutes." },
              { icon: Shield, title: "Secure by Default", desc: "Files are private by default with fine-grained visibility controls." },
              { icon: Globe, title: "Global CDN", desc: "Public files served globally with correct MIME types and caching." },
            ].map((item, i) => (
              <div key={i} className="rounded-lg bg-secondary p-5">
                <item.icon className="mb-3 h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Company</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><span className="text-foreground font-medium">Product:</span> AfuCloud</p>
            <p><span className="text-foreground font-medium">Website:</span> <a href="https://cloud.afuchat.com" className="text-brand hover:underline">cloud.afuchat.com</a></p>
            <p><span className="text-foreground font-medium">Support:</span> <a href="mailto:support@afuchat.com" className="text-brand hover:underline">support@afuchat.com</a></p>
            <p><span className="text-foreground font-medium">Founded:</span> 2026</p>
          </div>
        </section>
      </div>
    </main>

    <footer className="px-6 py-8 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} AfuCloud · cloud.afuchat.com
    </footer>
  </div>
);

export default AboutPage;

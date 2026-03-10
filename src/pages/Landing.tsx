import { Link } from "react-router-dom";
import { Upload, Code, Shield, Zap, ArrowRight, Terminal, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AfuLogo from "@/components/AfuLogo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import SEO from "@/components/SEO";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AfuCloud – Developer Cloud Storage | Fast File Hosting & API"
        description="AfuCloud by AfuChat is a fast, secure developer cloud storage platform. Upload files, get instant public links, and integrate with our REST API. Simple pricing at $0.98/month."
        keywords="AfuCloud, afuchat, afuchat cloud, afu cloud, cloud storage, developer cloud storage, file hosting, upload files, public file links, file sharing API, cloud platform, REST API file storage, developer file hosting, secure cloud, CDN hosting, file management"
        canonical="https://cloud.afuchat.com/"
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 lg:px-12 border-b border-border">
        <div className="flex items-center gap-2.5">
          <AfuLogo className="h-7 w-7" />
          <span className="text-lg font-bold tracking-tight">AfuCloud</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Link to="/pricing">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Pricing</Button>
          </Link>
          <Link to="/app">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Sign In</Button>
          </Link>
          <Link to="/app">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-24 text-center lg:pt-32">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <Zap className="h-3 w-3 text-primary-foreground" />
          </span>
          Developer-first cloud storage by AfuChat
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        </div>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
          Cloud storage that
          <br />
          <span className="gradient-text">gets out of your way</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Upload files, get public links, use our API. No clutter, no complexity.
          Built for developers who value speed and simplicity. Powered by AfuChat.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/app">
            <Button size="lg" className="h-12 gap-2 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold">
              Start Building <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg" className="h-12 gap-2 px-8 text-base">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="features-heading">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 id="features-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need, nothing you don't</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Upload, title: "Project-based uploads", desc: "Organize files into projects. Upload via dashboard or API. Get instant public links for sharing." },
            { icon: Code, title: "Developer API", desc: "RESTful API with project-scoped API keys. Upload, list, update, delete — all via HTTP endpoints." },
            { icon: Globe, title: "Public links", desc: "Toggle any file public. Share direct links with correct MIME types. No authentication required." },
            { icon: Shield, title: "Secure by default", desc: "Files are private by default. API key authentication. Rate limiting. File type validation built in." },
            { icon: Zap, title: "Fast & minimal", desc: "No decoration. No loading spinners that take forever. Upload and get a link in seconds." },
            { icon: Terminal, title: "CLI-friendly", desc: "Use curl to upload. Integrate into CI/CD pipelines. Automate with scripts. Simple REST API." },
          ].map((feature, i) => (
            <article
              key={i}
              className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-24" aria-labelledby="how-heading">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h2 id="how-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Up and running in minutes</h2>
          <p className="mt-3 text-muted-foreground">Three steps. No config files. No infrastructure headaches.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { step: "01", title: "Create a project", desc: "Sign up and create your first project in seconds. Each project gets its own isolated storage and API key." },
            { step: "02", title: "Upload files", desc: "Drag and drop from the dashboard or push via our REST API. We handle storage, CDN, and MIME types." },
            { step: "03", title: "Share instantly", desc: "Toggle any file public to get a direct link. Embed images, serve downloads, power your apps." },
          ].map((item) => (
            <article key={item.step} className="rounded-lg border border-border bg-card p-7">
              <span className="mb-4 block text-5xl font-black text-primary/20">{item.step}</span>
              <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20" aria-label="Platform statistics">
        <div className="mx-auto grid max-w-4xl gap-8 px-6 text-center sm:grid-cols-3">
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<50ms", label: "Avg response time" },
            { value: "∞", label: "Free public links" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-8">
              <p className="text-4xl font-extrabold text-primary sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center" aria-label="Call to action">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Ready to upload?</h2>
        <p className="mb-8 text-lg text-muted-foreground">Just $0.98/month for everything. No hidden fees. Powered by AfuChat.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/pricing">
            <Button size="lg" className="h-12 gap-2 px-10 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold">
              View Pricing <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <AfuLogo className="h-5 w-5" />
            <span className="text-sm font-semibold">AfuCloud</span>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground" aria-label="Footer navigation">
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AfuCloud · cloud.afuchat.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

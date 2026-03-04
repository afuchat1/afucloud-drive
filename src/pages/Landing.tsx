import { Link } from "react-router-dom";
import { Cloud, Upload, Code, Shield, Zap, ArrowRight, Terminal, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <Cloud className="h-6 w-6 text-brand" />
          <span className="text-lg font-semibold tracking-tight">AfuCloud</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/app">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/app">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-center lg:pt-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-brand">
          <Zap className="h-3 w-3" /> Developer-first cloud storage
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Cloud storage that<br />
          <span className="text-brand">gets out of your way</span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
          Upload files, get public links, use our API. No clutter, no complexity.
          Built for developers who value speed and simplicity.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/app">
            <Button size="lg" className="gap-2 px-8">
              Start Building <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg" className="gap-2 px-8">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Upload,
              title: "Project-based uploads",
              desc: "Organize files into projects. Upload via dashboard or API. Get instant public links.",
            },
            {
              icon: Code,
              title: "Developer API",
              desc: "RESTful API with project-scoped API keys. Upload, list, update, delete — all via HTTP.",
            },
            {
              icon: Globe,
              title: "Public links",
              desc: "Toggle any file public. Share direct links with correct MIME types. No auth required.",
            },
            {
              icon: Shield,
              title: "Secure by default",
              desc: "Files are private by default. API key auth. Rate limiting. File type validation.",
            },
            {
              icon: Zap,
              title: "Fast & minimal",
              desc: "No decoration. No loading spinners that take forever. Upload and get a link in seconds.",
            },
            {
              icon: Terminal,
              title: "CLI-friendly",
              desc: "Use curl to upload. Integrate into CI/CD. Automate with scripts. Simple REST API.",
            },
          ].map((feature, i) => (
            <div key={i} className="group">
              <div className="mb-3 inline-flex rounded-lg bg-secondary p-2.5 text-brand transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">Up and running in minutes</h2>
          <p className="text-muted-foreground">Three steps. No config files. No infrastructure headaches.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { step: "01", title: "Create a project", desc: "Sign up and create your first project in seconds. Each project gets its own isolated storage and API key." },
            { step: "02", title: "Upload files", desc: "Drag and drop from the dashboard or push via our REST API. We handle storage, CDN, and MIME types." },
            { step: "03", title: "Share instantly", desc: "Toggle any file public to get a direct link. Embed images, serve downloads, power your apps." },
          ].map((item) => (
            <div key={item.step} className="relative rounded-xl border border-border bg-card p-6">
              <span className="mb-4 block text-4xl font-black text-brand/20">{item.step}</span>
              <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="border-y border-border bg-secondary/40 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 px-6 text-center sm:grid-cols-3">
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<50ms", label: "Avg response time" },
            { value: "∞", label: "Free public links" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-brand sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">Ready to upload?</h2>
        <p className="mb-8 text-muted-foreground">Free to start. No credit card required.</p>
        <Link to="/app">
          <Button size="lg" className="gap-2 px-10">
            Create Account <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-brand" />
            <span className="text-sm font-medium">AfuCloud</span>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AfuCloud</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

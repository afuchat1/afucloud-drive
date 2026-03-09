import { Link } from "react-router-dom";
import { Upload, Code, Shield, Zap, ArrowRight, Terminal, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AfuLogo from "@/components/AfuLogo";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
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
            <Button size="sm" className="gradient-primary border-0 glow-sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-6 pt-20 pb-24 text-center lg:pt-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -top-20 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 text-xs font-medium text-foreground">
            <span className="flex h-5 w-5 items-center justify-center rounded-full gradient-primary">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </span>
            Developer-first cloud storage
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            Cloud storage that
            <br />
            <span className="gradient-text">gets out of your way</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Upload files, get public links, use our API. No clutter, no complexity.
            Built for developers who value speed and simplicity.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/app">
              <Button size="lg" className="h-12 gap-2 px-8 gradient-primary border-0 glow-sm text-base font-semibold">
                Start Building <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="h-12 gap-2 px-8 glass-card text-base">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need, nothing you don't</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Upload, title: "Project-based uploads", desc: "Organize files into projects. Upload via dashboard or API. Get instant public links." },
            { icon: Code, title: "Developer API", desc: "RESTful API with project-scoped API keys. Upload, list, update, delete — all via HTTP." },
            { icon: Globe, title: "Public links", desc: "Toggle any file public. Share direct links with correct MIME types. No auth required." },
            { icon: Shield, title: "Secure by default", desc: "Files are private by default. API key auth. Rate limiting. File type validation." },
            { icon: Zap, title: "Fast & minimal", desc: "No decoration. No loading spinners that take forever. Upload and get a link in seconds." },
            { icon: Terminal, title: "CLI-friendly", desc: "Use curl to upload. Integrate into CI/CD. Automate with scripts. Simple REST API." },
          ].map((feature, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl gradient-primary glow-sm transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Up and running in minutes</h2>
          <p className="mt-3 text-muted-foreground">Three steps. No config files. No infrastructure headaches.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { step: "01", title: "Create a project", desc: "Sign up and create your first project in seconds. Each project gets its own isolated storage and API key." },
            { step: "02", title: "Upload files", desc: "Drag and drop from the dashboard or push via our REST API. We handle storage, CDN, and MIME types." },
            { step: "03", title: "Share instantly", desc: "Toggle any file public to get a direct link. Embed images, serve downloads, power your apps." },
          ].map((item) => (
            <div key={item.step} className="relative rounded-2xl border border-border bg-card p-7 transition-all hover:border-primary/20">
              <span className="mb-4 block text-5xl font-black gradient-text opacity-40">{item.step}</span>
              <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[600px] rounded-full bg-primary/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto grid max-w-4xl gap-8 px-6 text-center sm:grid-cols-3">
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<50ms", label: "Avg response time" },
            { value: "∞", label: "Free public links" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-8">
              <p className="text-4xl font-extrabold gradient-text sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Ready to upload?</h2>
        <p className="mb-8 text-lg text-muted-foreground">Just $0.98/month for everything. No hidden fees.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/pricing">
            <Button size="lg" className="h-12 gap-2 px-10 gradient-primary border-0 glow-sm text-base font-semibold">
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
          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
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

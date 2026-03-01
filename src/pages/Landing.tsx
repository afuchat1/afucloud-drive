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
          <a href="#api">
            <Button variant="outline" size="lg" className="gap-2 px-8">
              View API
            </Button>
          </a>
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

      {/* API Section */}
      <section id="api" className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">Simple API</h2>
          <p className="text-muted-foreground">One API key per project. Four endpoints. That's it.</p>
        </div>

        <div className="space-y-4">
          {[
            { method: "POST", path: "/v1/files/upload", desc: "Upload a file" },
            { method: "GET", path: "/v1/files", desc: "List all files" },
            { method: "PATCH", path: "/v1/files/:id", desc: "Update file metadata" },
            { method: "DELETE", path: "/v1/files/:id", desc: "Delete a file" },
          ].map((endpoint, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg bg-secondary px-5 py-4"
            >
              <code className={`rounded px-2 py-0.5 text-xs font-bold ${
                endpoint.method === "POST" ? "bg-primary/10 text-brand" :
                endpoint.method === "GET" ? "bg-primary/10 text-brand" :
                endpoint.method === "PATCH" ? "bg-primary/10 text-brand" :
                "bg-destructive/10 text-destructive"
              }`}>
                {endpoint.method}
              </code>
              <code className="flex-1 text-sm font-mono text-foreground">{endpoint.path}</code>
              <span className="hidden text-sm text-muted-foreground sm:block">{endpoint.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-foreground p-5">
          <p className="mb-3 text-xs font-medium text-muted-foreground/60">Upload example</p>
          <pre className="overflow-x-auto text-sm text-primary-foreground/80">
            <code>{`curl -X POST \\
  https://cloud.afuchat.com/api/v1/files/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@photo.png" \\
  -F "public=true"`}</code>
          </pre>
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
            <a href="mailto:support@afuchat.com" className="hover:text-foreground transition-colors">Contact</a>
          </nav>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AfuCloud</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import { Link } from "react-router-dom";
import { Check, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AfuLogo from "@/components/AfuLogo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import SEO from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

const features = [
  "Unlimited projects",
  "10 GB storage",
  "API access with project keys",
  "Public file links",
  "Priority support",
  "No ads, no tracking",
];

const PricingPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast({ title: "Sign in first", description: "Create an account to subscribe." });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan: "pro",
        status: "active",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      if (error) throw error;
      toast({ title: "You're subscribed!", description: "Welcome to AfuCloud Pro." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Pricing – AfuCloud Pro Plan $0.98/month"
        description="AfuCloud Pro plan at just $0.98/month. Unlimited projects, 10GB storage, full API access, public file links, and priority support. No hidden fees. By AfuChat."
        keywords="AfuCloud pricing, afuchat cloud pricing, cloud storage pricing, cheap cloud storage, developer file hosting price, $0.98 cloud storage, affordable cloud hosting, afuchat pricing"
        canonical="https://cloud.afuchat.com/pricing"
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 lg:px-12 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5">
          <AfuLogo className="h-7 w-7" />
          <span className="text-lg font-bold tracking-tight">AfuCloud</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Link to="/app">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Dashboard</Button>
          </Link>
        </div>
      </nav>

      {/* Pricing */}
      <section className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <Zap className="h-3 w-3 text-primary-foreground" />
          </span>
          Simple pricing
        </div>

        <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          One plan. Everything included.
        </h1>
        <p className="mb-14 text-muted-foreground">
          No tiers, no hidden fees. Just $0.98/month for the full AfuCloud experience.
        </p>

        {/* Card */}
        <div className="mx-auto max-w-sm rounded-lg border border-border bg-card p-8 text-left">
          <div className="mb-6">
            <p className="text-sm font-semibold text-primary">Pro Plan</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold tracking-tight text-primary">$0.98</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
          </div>

          <ul className="mb-8 space-y-3.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                {f}
              </li>
            ))}
          </ul>

          <Button
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold gap-2"
            size="lg"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Processing…" : "Get Started"} {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <AfuLogo className="h-5 w-5" />
            <span className="text-sm font-semibold">AfuCloud</span>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground" aria-label="Footer">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AfuCloud</p>
        </div>
      </footer>
    </main>
  );
};

export default PricingPage;

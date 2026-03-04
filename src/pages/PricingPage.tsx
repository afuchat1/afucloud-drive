import { Link } from "react-router-dom";
import { ArrowLeft, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import AfuLogo from "@/components/AfuLogo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
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
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
        <Link to="/" className="flex items-center gap-2">
          <AfuLogo className="h-6 w-6" />
          <span className="text-lg font-semibold tracking-tight">AfuCloud</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Link to="/app">
            <Button size="sm">Dashboard</Button>
          </Link>
        </div>
      </nav>

      {/* Pricing */}
      <section className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-brand">
          <Zap className="h-3 w-3" /> Simple pricing
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          One plan. Everything included.
        </h1>
        <p className="mb-12 text-muted-foreground">
          No tiers, no hidden fees. Just $0.98/month for the full experience.
        </p>

        {/* Card */}
        <div className="mx-auto max-w-sm rounded-2xl bg-card p-8 text-left ring-1 ring-border">
          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground">Pro Plan</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-foreground">$0.98</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
          </div>

          <ul className="mb-8 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                <Check className="h-4 w-4 flex-shrink-0 text-brand" />
                {f}
              </li>
            ))}
          </ul>

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Processing…" : "Get Started"}
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
            <AfuLogo className="h-4 w-4" />
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
    </main>
  );
};

export default PricingPage;

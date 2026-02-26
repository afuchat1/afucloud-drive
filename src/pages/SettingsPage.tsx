import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const updateEmail = async () => {
    if (!email.trim()) return;
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    setSavingEmail(false);

    if (error) {
      toast({ title: "Email update failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Email update requested", description: "Check your inbox to confirm the new email." });
  };

  const updatePassword = async () => {
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);

    if (error) {
      toast({ title: "Password update failed", description: error.message, variant: "destructive" });
      return;
    }

    setPassword("");
    toast({ title: "Password updated" });
  };

  return (
    <AppLayout showProjects={false}>
      <section className="mx-auto w-full max-w-3xl space-y-8 py-4">
        <header>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update security and account preferences.</p>
        </header>

        <div className="rounded-lg bg-secondary p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">Change email</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-none bg-background"
            />
            <Button onClick={updateEmail} disabled={savingEmail}>
              {savingEmail ? "Updating..." : "Update email"}
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-secondary p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">Change password</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="border-none bg-background"
            />
            <Button onClick={updatePassword} disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Update password"}
            </Button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default SettingsPage;

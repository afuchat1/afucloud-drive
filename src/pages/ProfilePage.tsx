import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  email: string | null;
  storage_used: number;
  storage_limit: number;
  created_at: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState((user?.user_metadata?.full_name as string) || "");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      if (!user?.id) {
        if (active) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("email, storage_used, storage_limit, created_at")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        toast({ title: "Profile error", description: error.message, variant: "destructive" });
      }

      setProfile(data ?? null);
      setLoading(false);
    };

    void fetchProfile();

    return () => {
      active = false;
    };
  }, [toast, user?.id]);

  const storagePercent = useMemo(() => {
    if (!profile?.storage_limit || profile.storage_limit <= 0) return 0;
    return Math.min(100, Math.round((profile.storage_used / profile.storage_limit) * 100));
  }, [profile]);

  const formatStorage = (bytes: number) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** idx).toFixed(1)} ${units[idx]}`;
  };

  const saveName = async () => {
    setSavingName(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim() || null },
    });
    setSavingName(false);

    if (error) {
      toast({ title: "Could not update name", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Profile updated" });
  };

  return (
    <AppLayout showProjects={false}>
      <section className="mx-auto w-full max-w-3xl space-y-8 py-4">
        <header>
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account and storage details.</p>
        </header>

        <div className="rounded-lg bg-secondary p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">User details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="mt-1 text-sm text-foreground">{user?.email || profile?.email || "-"}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">Display name</label>
              <div className="flex gap-2">
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="border-none bg-background"
                />
                <Button onClick={saveName} disabled={savingName}>{savingName ? "Saving..." : "Save"}</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-secondary p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">Storage usage</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          ) : (
            <>
              <p className="text-sm text-foreground">
                {formatStorage(profile?.storage_used ?? 0)} of {formatStorage(profile?.storage_limit ?? 0)} used
              </p>
              <div className="mt-3 h-2 rounded-full bg-background">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-200"
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{storagePercent}% used</p>
            </>
          )}
        </div>
      </section>
    </AppLayout>
  );
};

export default ProfilePage;

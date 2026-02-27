import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, FolderOpen, HardDrive, Ban, CheckCircle, Shield } from "lucide-react";

interface UserProfile {
  id: string;
  email: string | null;
  storage_used: number;
  storage_limit: number;
  suspended: boolean;
  created_at: string;
}

interface ProjectRow {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
};

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [tab, setTab] = useState<"users" | "projects">("users");

  const fetchAll = async () => {
    const [{ data: u }, { data: p }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
    ]);
    if (u) setUsers(u);
    if (p) setProjects(p);
  };

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const toggleSuspend = async (user: UserProfile) => {
    const next = !user.suspended;
    await supabase.from("profiles").update({ suspended: next }).eq("id", user.id);
    toast({ title: next ? "User suspended" : "User unsuspended" });
    fetchAll();
  };

  if (!isAdmin) {
    return (
      <AppLayout showProjects={false}>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">You don't have admin access.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showProjects={false}>
      <section className="mx-auto w-full max-w-5xl space-y-6 py-4 animate-fade-in">
        <header>
          <h1 className="text-2xl font-semibold text-foreground">Admin Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all users and projects.</p>
        </header>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard icon={Users} label="Users" value={String(users.length)} />
          <SummaryCard icon={FolderOpen} label="Projects" value={String(projects.length)} />
          <SummaryCard
            icon={HardDrive}
            label="Total Storage"
            value={formatBytes(users.reduce((acc, u) => acc + u.storage_used, 0))}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          <button
            onClick={() => setTab("users")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === "users" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover-tint"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === "projects" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover-tint"
            }`}
          >
            Projects
          </button>
        </div>

        {/* Users tab */}
        {tab === "users" && (
          <div className="space-y-1">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded-md px-4 py-3 hover-tint">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-brand">
                  {(u.email?.[0] ?? "?").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.email || "No email"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(u.storage_used)} / {formatBytes(u.storage_limit)}
                  </p>
                </div>
                {u.suspended && <Badge variant="destructive" className="text-xs">Suspended</Badge>}
                <Button size="sm" variant="ghost" onClick={() => toggleSuspend(u)}>
                  {u.suspended ? (
                    <><CheckCircle className="mr-1 h-3.5 w-3.5" /> Unsuspend</>
                  ) : (
                    <><Ban className="mr-1 h-3.5 w-3.5" /> Suspend</>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Projects tab */}
        {tab === "projects" && (
          <div className="space-y-1">
            {projects.map((p) => {
              const owner = users.find((u) => u.id === p.user_id);
              return (
                <div key={p.id} className="flex items-center gap-3 rounded-md px-4 py-3 hover-tint">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Owner: {owner?.email || p.user_id.slice(0, 8)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppLayout>
  );
};

const SummaryCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="rounded-lg bg-secondary p-5">
    <div className="flex items-center gap-3">
      <div className="rounded-md bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminPage;

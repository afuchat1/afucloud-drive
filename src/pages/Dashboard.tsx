import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import FileList from "@/components/FileList";
import AiChatPanel from "@/components/AiChatPanel";
import { Cloud, FolderOpen, FileIcon, HardDrive, MessageSquare, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OverviewStats {
  projectCount: number;
  fileCount: number;
  storageUsed: number;
  storageLimit: number;
}

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const projectFromUrl = searchParams.get("project");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectFromUrl);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    if (projectFromUrl) setSelectedProjectId(projectFromUrl);
  }, [projectFromUrl]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ count: projCount }, { count: fileCount }, { data: profile }] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("files").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("storage_used, storage_limit").eq("id", user.id).single(),
      ]);
      setStats({
        projectCount: projCount ?? 0,
        fileCount: fileCount ?? 0,
        storageUsed: profile?.storage_used ?? 0,
        storageLimit: profile?.storage_limit ?? 0,
      });
    })();
  }, [user]);

  return (
    <AppLayout selectedProjectId={selectedProjectId} onSelectProject={setSelectedProjectId}>
      {selectedProjectId ? (
        <FileList projectId={selectedProjectId} />
      ) : (
        <div className="mx-auto max-w-5xl animate-fade-in space-y-8">
          {/* Overview heading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Welcome back. Here's your overview.</p>
          </div>

          {/* Stat cards */}
          {stats && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={FolderOpen} label="Projects" value={String(stats.projectCount)} color="text-primary" />
              <StatCard icon={FileIcon} label="Total Files" value={String(stats.fileCount)} color="text-blue-500" />
              <StatCard
                icon={HardDrive}
                label="Storage Used"
                value={formatBytes(stats.storageUsed)}
                color="text-emerald-500"
              />
              <StatCard
                icon={TrendingUp}
                label="Storage Limit"
                value={formatBytes(stats.storageLimit)}
                color="text-amber-500"
              />
            </div>
          )}

          {/* Storage usage bar */}
          {stats && stats.storageLimit > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Storage Usage</span>
                <span className="text-muted-foreground">{((stats.storageUsed / stats.storageLimit) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(stats.storageUsed / stats.storageLimit) * 100} className="h-2.5 rounded-full" />
              <p className="text-xs text-muted-foreground">
                {formatBytes(stats.storageUsed)} used of {formatBytes(stats.storageLimit)}
              </p>
            </div>
          )}

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Cloud className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-semibold">No project selected</p>
            <p className="mt-1 text-sm text-muted-foreground">Select or create a project to get started</p>
          </div>

          {/* AI Chat toggle */}
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-medium transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <MessageSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            {aiOpen ? "Close AI Assistant" : "Ask AI Assistant"}
          </button>

          {aiOpen && <AiChatPanel />}
        </div>
      )}
    </AppLayout>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) => (
  <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md hover:shadow-primary/5">
    <div className="flex items-center gap-4">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-muted", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  </div>
);

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;

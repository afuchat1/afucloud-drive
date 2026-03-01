import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import FileList from "@/components/FileList";
import AiChatPanel from "@/components/AiChatPanel";
import { Cloud, FolderOpen, FileIcon, HardDrive, MessageSquare } from "lucide-react";
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
        <div className="mx-auto max-w-4xl animate-fade-in space-y-8 py-4">
          {/* Overview heading */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Welcome back. Here's your overview.</p>
          </div>

          {/* Stat cards */}
          {stats && (
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard icon={FolderOpen} label="Projects" value={String(stats.projectCount)} />
              <StatCard icon={FileIcon} label="Total Files" value={String(stats.fileCount)} />
              <StatCard
                icon={HardDrive}
                label="Storage"
                value={`${formatBytes(stats.storageUsed)} / ${formatBytes(stats.storageLimit)}`}
              />
            </div>
          )}

          {/* Storage usage bar */}
          {stats && stats.storageLimit > 0 && (
            <div className="rounded-lg bg-secondary p-5 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Storage Usage</span>
                <span className="font-medium">{((stats.storageUsed / stats.storageLimit) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(stats.storageUsed / stats.storageLimit) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {formatBytes(stats.storageUsed)} used of {formatBytes(stats.storageLimit)}
              </p>
            </div>
          )}

          {/* Empty state + AI */}
          <div className="flex flex-col items-center justify-center rounded-lg bg-secondary py-16">
            <Cloud className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">Select or create a project to get started</p>
          </div>

          {/* AI Chat toggle */}
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-brand transition-colors hover:bg-primary/20"
          >
            <MessageSquare className="h-4 w-4" />
            {aiOpen ? "Close AI Assistant" : "Ask AI Assistant"}
          </button>

          {aiOpen && <AiChatPanel />}
        </div>
      )}
    </AppLayout>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
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

export default Dashboard;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Folder, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
}

interface Props {
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

const ProjectSidebar = ({ selectedProjectId, onSelectProject }: Props) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const fetchProjects = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const createProject = async () => {
    if (!newName.trim() || !user) return;
    await supabase.from("projects").insert({ name: newName.trim(), user_id: user.id });
    setNewName("");
    setCreating(false);
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    if (selectedProjectId === id) onSelectProject(null);
    fetchProjects();
  };

  const renameProject = async (id: string) => {
    if (!renameValue.trim()) return;
    await supabase.from("projects").update({ name: renameValue.trim() }).eq("id", id);
    setRenaming(null);
    fetchProjects();
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Projects</span>
        <button
          onClick={() => setCreating(true)}
          className="hover-tint rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {creating && (
        <div className="px-4 pb-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createProject();
              if (e.key === "Escape") setCreating(false);
            }}
            onBlur={() => { if (!newName.trim()) setCreating(false); }}
            placeholder="Project name"
            className="w-full rounded-md bg-secondary px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      )}

      <div className="space-y-0.5 px-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer transition-colors duration-150 ${
              selectedProjectId === p.id
                ? "bg-sidebar-accent text-brand font-medium"
                : "text-sidebar-foreground hover-tint"
            }`}
            onClick={() => onSelectProject(p.id)}
          >
            <Folder className="h-4 w-4 flex-shrink-0" />
            {renaming === p.id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") renameProject(p.id);
                  if (e.key === "Escape") setRenaming(null);
                }}
                onBlur={() => setRenaming(null)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent outline-none"
              />
            ) : (
              <span className="flex-1 truncate">{p.name}</span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="opacity-0 group-hover:opacity-100 hover-tint rounded p-0.5 transition-opacity">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenaming(p.id);
                    setRenameValue(p.name);
                  }}
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" /> Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(p.id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {projects.length === 0 && !creating && (
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
          No projects yet
        </div>
      )}
    </div>
  );
};

export default ProjectSidebar;

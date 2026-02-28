import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Copy, Trash2, Eye, EyeOff, Upload, Key, FileIcon, Check, CloudUpload, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface FileRecord {
  id: string;
  name: string;
  size: number;
  type: string | null;
  visibility: string;
  storage_path: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  api_key: string;
}

interface Props {
  projectId: string;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const FileList = ({ projectId }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editFileName, setEditFileName] = useState("");

  const fetchData = async () => {
    const [{ data: proj }, { data: fileData }] = await Promise.all([
      supabase.from("projects").select("id, name, api_key").eq("id", projectId).single(),
      supabase.from("files").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
    ]);
    if (proj) setProject(proj);
    if (fileData) setFiles(fileData);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const uploadFile = async (file: File) => {
    if (!user) return;
    setUploading(true);

    const fileId = crypto.randomUUID();
    const ext = file.name.split(".").pop();
    const storagePath = `${projectId}/${fileId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("project-files")
      .upload(storagePath, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    await supabase.from("files").insert({
      id: fileId,
      project_id: projectId,
      user_id: user.id,
      name: file.name,
      size: file.size,
      type: file.type,
      storage_path: storagePath,
      visibility: "private",
    });

    setUploading(false);
    fetchData();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    for (const file of Array.from(fileList)) {
      await uploadFile(file);
    }
    e.target.value = "";
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      for (const file of droppedFiles) {
        await uploadFile(file);
      }
    },
    [user, projectId],
  );

  const toggleVisibility = async (file: FileRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const newVis = file.visibility === "public" ? "private" : "public";
    await supabase.from("files").update({ visibility: newVis }).eq("id", file.id);
    fetchData();
  };

  const deleteFile = async (file: FileRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.storage.from("project-files").remove([file.storage_path]);
    await supabase.from("files").delete().eq("id", file.id);
    fetchData();
  };

  const copyLink = async (file: FileRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const { data } = supabase.storage.from("project-files").getPublicUrl(file.storage_path);
    await navigator.clipboard.writeText(data.publicUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyApiKey = async () => {
    if (project?.api_key) {
      await navigator.clipboard.writeText(project.api_key);
      toast({ title: "API key copied" });
    }
  };
  const renameFile = async (fileId: string) => {
    if (!editFileName.trim()) return;
    await supabase.from("files").update({ name: editFileName.trim() }).eq("id", fileId);
    setEditingFileId(null);
    fetchData();
  };

  if (!project) return null;

  return (
    <div className="animate-fade-in">
      {/* Project header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">{project.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          <Key className="h-3.5 w-3.5 text-muted-foreground" />
          <code className="text-xs text-muted-foreground font-mono">
            {showApiKey ? project.api_key : "••••••••••••••••"}
          </code>
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showApiKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={copyApiKey}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Upload area with drag & drop */}
      <label
        className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 transition-colors duration-150 ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-secondary hover:border-primary/40 hover:bg-muted"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} multiple />
        <CloudUpload className={`mb-2 h-8 w-8 ${dragOver ? "text-brand" : "text-muted-foreground/50"}`} />
        <p className="text-sm text-muted-foreground">
          {uploading ? "Uploading..." : "Drag & drop files here, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">Supports multiple files</p>
      </label>

      {/* File list */}
      {files.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No files in this project</p>
      ) : (
        <div className="space-y-1">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => navigate(`/app/file/${file.id}`)}
              className="group flex items-center gap-3 rounded-md px-3 py-2.5 hover-tint cursor-pointer"
            >
              <FileIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                {editingFileId === file.id ? (
                  <input
                    autoFocus
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") renameFile(file.id);
                      if (e.key === "Escape") setEditingFileId(null);
                    }}
                    onBlur={() => renameFile(file.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-sm bg-transparent outline-none border-b border-primary"
                  />
                ) : (
                  <p className="text-sm truncate">{file.name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)} · {file.visibility}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFileId(file.id);
                    setEditFileName(file.name);
                  }}
                  className="hover-tint rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Rename"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => copyLink(file, e)}
                  className="hover-tint rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy link"
                >
                  {copiedId === file.id ? (
                    <Check className="h-3.5 w-3.5 text-brand" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={(e) => toggleVisibility(file, e)}
                  className="hover-tint rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Toggle visibility"
                >
                  {file.visibility === "public" ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={(e) => deleteFile(file, e)}
                  className="hover-tint rounded p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;

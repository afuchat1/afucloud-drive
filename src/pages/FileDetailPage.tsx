import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  FileIcon,
  Download,
  ExternalLink,
  Calendar,
  HardDrive,
  Globe,
  Lock,
  Image,
  FileText,
  FileVideo,
  FileAudio,
} from "lucide-react";

interface FileRecord {
  id: string;
  name: string;
  size: number;
  type: string | null;
  visibility: string;
  storage_path: string;
  created_at: string;
  project_id: string;
}

interface ProjectRecord {
  id: string;
  name: string;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (type: string | null) => {
  if (!type) return FileIcon;
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (type.includes("pdf") || type.includes("text")) return FileText;
  return FileIcon;
};

const FileDetailPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<FileRecord | null>(null);
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!fileId) return;
    (async () => {
      const { data: f } = await supabase
        .from("files")
        .select("*")
        .eq("id", fileId)
        .single();

      if (!f) {
        setLoading(false);
        return;
      }
      setFile(f);

      const { data: p } = await supabase
        .from("projects")
        .select("id, name")
        .eq("id", f.project_id)
        .single();
      if (p) setProject(p);

      const { data: urlData } = supabase.storage
        .from("project-files")
        .getPublicUrl(f.storage_path);
      setPublicUrl(urlData.publicUrl);

      if (f.type?.startsWith("image/")) {
        setPreviewUrl(urlData.publicUrl);
      }

      setLoading(false);
    })();
  }, [fileId]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleVisibility = async () => {
    if (!file) return;
    const newVis = file.visibility === "public" ? "private" : "public";
    await supabase.from("files").update({ visibility: newVis }).eq("id", file.id);
    setFile({ ...file, visibility: newVis });
    toast({ title: `File is now ${newVis}` });
  };

  const deleteFile = async () => {
    if (!file) return;
    await supabase.storage.from("project-files").remove([file.storage_path]);
    await supabase.from("files").delete().eq("id", file.id);
    toast({ title: "File deleted" });
    navigate("/app");
  };

  const downloadFile = async () => {
    if (!file) return;
    const { data, error } = await supabase.storage
      .from("project-files")
      .download(file.storage_path);
    if (error || !data) {
      toast({ title: "Download failed", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Icon = file ? getFileIcon(file.type) : FileIcon;

  if (loading) {
    return (
      <AppLayout showProjects={false}>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Loading…</p>
        </div>
      </AppLayout>
    );
  }

  if (!file) {
    return (
      <AppLayout showProjects={false}>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">File not found</p>
          <Button variant="ghost" onClick={() => navigate("/app")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to files
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showProjects={false}>
      <div className="mx-auto max-w-3xl animate-fade-in space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/app")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to files
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold truncate">{file.name}</h1>
            {project && (
              <p className="text-sm text-muted-foreground">
                in <span className="text-foreground">{project.name}</span>
              </p>
            )}
          </div>
          <Badge variant={file.visibility === "public" ? "default" : "secondary"} className="flex-shrink-0">
            {file.visibility === "public" ? (
              <><Globe className="mr-1 h-3 w-3" /> Public</>
            ) : (
              <><Lock className="mr-1 h-3 w-3" /> Private</>
            )}
          </Badge>
        </div>

        {/* Preview */}
        {previewUrl && (
          <Card>
            <CardContent className="p-4">
              <img
                src={previewUrl}
                alt={file.name}
                className="mx-auto max-h-80 rounded-md object-contain"
              />
            </CardContent>
          </Card>
        )}

        {/* Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">File Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailRow icon={FileIcon} label="Name" value={file.name} />
            <DetailRow icon={HardDrive} label="Size" value={formatBytes(file.size)} />
            <DetailRow icon={FileText} label="Type" value={file.type ?? "Unknown"} />
            <DetailRow
              icon={Calendar}
              label="Uploaded"
              value={new Date(file.created_at).toLocaleString()}
            />
            <DetailRow icon={Globe} label="Visibility" value={file.visibility} />

            {/* Public URL */}
            <div className="flex items-start gap-3 pt-1">
              <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-1">Public URL</p>
                <code className="block truncate rounded bg-secondary px-2 py-1 text-xs font-mono">
                  {publicUrl}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={copyLink}>
              {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <Button size="sm" variant="outline" onClick={downloadFile}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Download
            </Button>
            <Button size="sm" variant="outline" onClick={toggleVisibility}>
              {file.visibility === "public" ? (
                <><EyeOff className="mr-1.5 h-3.5 w-3.5" /> Make private</>
              ) : (
                <><Eye className="mr-1.5 h-3.5 w-3.5" /> Make public</>
              )}
            </Button>
            <Button size="sm" variant="destructive" onClick={deleteFile}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

const DetailRow = ({
  icon: IconComp,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <IconComp className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm truncate">{value}</p>
    </div>
  </div>
);

export default FileDetailPage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PublicFile = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fileId) return;

    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/public-file/${fileId}`;

    // Redirect to the edge function which serves the file directly
    window.location.href = url;
  }, [fileId]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
};

export default PublicFile;

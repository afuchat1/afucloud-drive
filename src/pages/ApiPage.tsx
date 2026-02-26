import AppLayout from "@/components/AppLayout";

const endpointRows = [
  { method: "POST", path: "/v1/files/upload", purpose: "Upload a file with multipart/form-data" },
  { method: "GET", path: "/v1/files", purpose: "List files in the project" },
  { method: "PATCH", path: "/v1/files/:id", purpose: "Update file metadata (name/visibility)" },
  { method: "DELETE", path: "/v1/files/:id", purpose: "Delete a file" },
];

const ApiPage = () => {
  const apiBase = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/file-api`;

  return (
    <AppLayout showProjects={false}>
      <section className="mx-auto w-full max-w-4xl space-y-8 py-4">
        <header>
          <h1 className="text-2xl font-semibold text-foreground">Developer API</h1>
          <p className="mt-1 text-sm text-muted-foreground">Use your project API key in Authorization header.</p>
        </header>

        <div className="rounded-lg bg-secondary p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Base URL</p>
          <code className="mt-2 block text-sm text-foreground">{apiBase}</code>
        </div>

        <div className="space-y-2">
          {endpointRows.map((endpoint) => (
            <div key={endpoint.path} className="rounded-lg bg-secondary px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <code className="text-xs font-semibold text-brand">{endpoint.method}</code>
                <code className="text-sm text-foreground">{endpoint.path}</code>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{endpoint.purpose}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-foreground p-5">
          <p className="mb-2 text-xs uppercase tracking-wide text-primary-foreground/70">cURL example</p>
          <pre className="overflow-x-auto text-sm text-primary-foreground">
            <code>{`curl -X POST \\
  ${apiBase}/v1/files/upload \\
  -H "Authorization: Bearer PROJECT_API_KEY" \\
  -F "file=@example.png" \\
  -F "public=true"`}</code>
          </pre>
        </div>
      </section>
    </AppLayout>
  );
};

export default ApiPage;

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Copy, Check, Terminal, BookOpen, Zap, FileUp, List, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const endpoints = [
  {
    method: "POST",
    path: "/v1/files/upload",
    title: "Upload a file",
    desc: "Upload a file using multipart/form-data. Set public=true to make it immediately accessible via a public link.",
    icon: FileUp,
    example: `curl -X POST \\
  $BASE/v1/files/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@photo.png" \\
  -F "public=true"`,
    response: `{
  "id": "a1b2c3d4-...",
  "name": "photo.png",
  "size": 204800,
  "type": "image/png",
  "visibility": "public",
  "url": "https://cloud.afuchat.com/f/a1b2c3d4-..."
}`,
  },
  {
    method: "GET",
    path: "/v1/files",
    title: "List files",
    desc: "Retrieve all files in the project. Returns an array of file objects with metadata.",
    icon: List,
    example: `curl -X GET \\
  $BASE/v1/files \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    response: `[
  {
    "id": "a1b2c3d4-...",
    "name": "photo.png",
    "size": 204800,
    "type": "image/png",
    "visibility": "public"
  }
]`,
  },
  {
    method: "PATCH",
    path: "/v1/files/:id",
    title: "Update metadata",
    desc: "Update a file's name or visibility. Send a JSON body with the fields you want to change.",
    icon: Pencil,
    example: `curl -X PATCH \\
  $BASE/v1/files/FILE_ID \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"visibility": "private"}'`,
    response: `{
  "id": "a1b2c3d4-...",
  "name": "photo.png",
  "visibility": "private"
}`,
  },
  {
    method: "DELETE",
    path: "/v1/files/:id",
    title: "Delete a file",
    desc: "Permanently delete a file and its stored data. This action cannot be undone.",
    icon: Trash2,
    example: `curl -X DELETE \\
  $BASE/v1/files/FILE_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    response: `{
  "success": true
}`,
  },
];

const methodColor: Record<string, string> = {
  POST: "bg-emerald-500/10 text-emerald-500",
  GET: "bg-blue-500/10 text-blue-500",
  PATCH: "bg-amber-500/10 text-amber-500",
  DELETE: "bg-destructive/10 text-destructive",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors">
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

const ApiPage = () => {
  const apiBase = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/file-api`;
  const [selected, setSelected] = useState(0);
  const active = endpoints[selected];

  return (
    <AppLayout showProjects={false}>
      <section className="mx-auto w-full max-w-5xl space-y-8 py-4">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Developer API</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything you need to integrate AfuCloud into your workflow.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="h-3.5 w-3.5" /> Docs
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Terminal className="h-3.5 w-3.5" /> Playground
            </Button>
          </div>
        </header>

        {/* Quick start */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-semibold text-foreground">Quick start</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Authenticate every request with your project API key in the <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">Authorization</code> header.
            Find your key in <strong>Settings → API Key</strong>.
          </p>
          <div className="relative rounded-lg bg-foreground p-4">
            <CopyButton text={`Authorization: Bearer YOUR_API_KEY`} />
            <pre className="text-sm text-primary-foreground font-mono overflow-x-auto">
              <span className="text-muted-foreground/60">Header</span>{"\n"}
              Authorization: Bearer YOUR_API_KEY
            </pre>
          </div>
        </div>

        {/* Base URL */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Base URL</p>
          <div className="relative rounded-lg bg-muted p-3">
            <CopyButton text={apiBase} />
            <code className="text-sm text-foreground font-mono break-all">{apiBase}</code>
          </div>
        </div>

        {/* Endpoints */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div className="space-y-1">
            <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Endpoints</p>
            {endpoints.map((ep, i) => (
              <button
                key={ep.path + ep.method}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  selected === i ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <code className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${methodColor[ep.method]}`}>
                  {ep.method}
                </code>
                <span className="truncate">{ep.title}</span>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <active.icon className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold text-foreground">{active.title}</h3>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <code className={`rounded px-2 py-0.5 text-xs font-bold ${methodColor[active.method]}`}>
                  {active.method}
                </code>
                <code className="text-sm font-mono text-muted-foreground">{active.path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{active.desc}</p>
            </div>

            <Tabs defaultValue="request" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
              </TabsList>
              <TabsContent value="request">
                <div className="relative rounded-xl bg-foreground p-4">
                  <CopyButton text={active.example.replace("$BASE", apiBase)} />
                  <pre className="overflow-x-auto text-sm text-primary-foreground font-mono whitespace-pre">
                    {active.example.replace(/\$BASE/g, apiBase)}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="response">
                <div className="relative rounded-xl bg-foreground p-4">
                  <CopyButton text={active.response} />
                  <pre className="overflow-x-auto text-sm text-primary-foreground font-mono whitespace-pre">
                    {active.response}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default ApiPage;

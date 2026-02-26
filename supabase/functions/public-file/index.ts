import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  // Expected: /public-file/<fileId>
  const fileId = pathParts[1];

  if (!fileId) {
    return new Response(
      JSON.stringify({ error: "File ID required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Look up file
  const { data: file, error } = await supabaseAdmin
    .from("files")
    .select("id, name, type, storage_path, visibility")
    .eq("id", fileId)
    .maybeSingle();

  if (error || !file) {
    return new Response(
      JSON.stringify({ error: "File not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (file.visibility !== "public") {
    return new Response(
      JSON.stringify({ error: "File is not public" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Download file from storage
  const { data: fileData, error: downloadError } = await supabaseAdmin.storage
    .from("project-files")
    .download(file.storage_path);

  if (downloadError || !fileData) {
    return new Response(
      JSON.stringify({ error: "Failed to retrieve file" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(fileData, {
    headers: {
      ...corsHeaders,
      "Content-Type": file.type || "application/octet-stream",
      "Content-Disposition": `inline; filename="${file.name}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
});

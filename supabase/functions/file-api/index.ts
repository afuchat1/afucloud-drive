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
  // Expected paths: /file-api/v1/files, /file-api/v1/files/:id, /file-api/v1/files/upload

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Authenticate via API key
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing API key. Use: Authorization: Bearer YOUR_API_KEY" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  const apiKey = authHeader.replace("Bearer ", "");

  // Look up project by API key
  const { data: project, error: projectError } = await supabaseAdmin
    .from("projects")
    .select("id, user_id")
    .eq("api_key", apiKey)
    .maybeSingle();

  if (projectError || !project) {
    return new Response(
      JSON.stringify({ error: "Invalid API key" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    // Determine sub-path after "file-api"
    // pathParts[0] = "file-api", [1] = "v1", [2] = "files", [3] = "upload" or fileId
    const action = pathParts[3]; // "upload" or a file ID or undefined

    // POST /v1/files/upload
    if (req.method === "POST" && action === "upload") {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const isPublic = formData.get("public") === "true";

      if (!file) {
        return respond({ error: "No file provided" }, 400);
      }

      // Size limit: 50MB
      if (file.size > 50 * 1024 * 1024) {
        return respond({ error: "File exceeds 50MB limit" }, 413);
      }

      const fileId = crypto.randomUUID();
      const ext = file.name.split(".").pop() || "bin";
      const storagePath = `${project.id}/${fileId}.${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("project-files")
        .upload(storagePath, file, { contentType: file.type });

      if (uploadError) {
        return respond({ error: uploadError.message }, 500);
      }

      const { error: insertError } = await supabaseAdmin.from("files").insert({
        id: fileId,
        project_id: project.id,
        user_id: project.user_id,
        name: file.name,
        size: file.size,
        type: file.type,
        storage_path: storagePath,
        visibility: isPublic ? "public" : "private",
      });

      if (insertError) {
        return respond({ error: insertError.message }, 500);
      }

      const { data: urlData } = supabaseAdmin.storage
        .from("project-files")
        .getPublicUrl(storagePath);

      return respond({
        id: fileId,
        name: file.name,
        url: urlData.publicUrl,
        public: isPublic,
        size: file.size,
      }, 201);
    }

    // GET /v1/files — list files
    if (req.method === "GET" && !action) {
      const { data: files, error } = await supabaseAdmin
        .from("files")
        .select("id, name, size, type, visibility, created_at, storage_path")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });

      if (error) return respond({ error: error.message }, 500);

      const result = (files || []).map((f) => {
        const { data: urlData } = supabaseAdmin.storage
          .from("project-files")
          .getPublicUrl(f.storage_path);
        return {
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          visibility: f.visibility,
          url: f.visibility === "public" ? urlData.publicUrl : null,
          created_at: f.created_at,
        };
      });

      return respond({ files: result });
    }

    // DELETE /v1/files/:id
    if (req.method === "DELETE" && action) {
      const fileId = action;
      const { data: file } = await supabaseAdmin
        .from("files")
        .select("id, storage_path")
        .eq("id", fileId)
        .eq("project_id", project.id)
        .maybeSingle();

      if (!file) return respond({ error: "File not found" }, 404);

      await supabaseAdmin.storage.from("project-files").remove([file.storage_path]);
      await supabaseAdmin.from("files").delete().eq("id", fileId);

      return respond({ deleted: true });
    }

    // PATCH /v1/files/:id
    if (req.method === "PATCH" && action) {
      const fileId = action;
      const body = await req.json();
      const updates: Record<string, unknown> = {};

      if (body.visibility && ["public", "private"].includes(body.visibility)) {
        updates.visibility = body.visibility;
      }
      if (body.name) {
        updates.name = body.name;
      }

      if (Object.keys(updates).length === 0) {
        return respond({ error: "No valid fields to update" }, 400);
      }

      const { data: updated, error } = await supabaseAdmin
        .from("files")
        .update(updates)
        .eq("id", fileId)
        .eq("project_id", project.id)
        .select()
        .maybeSingle();

      if (error) return respond({ error: error.message }, 500);
      if (!updated) return respond({ error: "File not found" }, 404);

      return respond(updated);
    }

    return respond({ error: "Not found" }, 404);
  } catch (err) {
    return respond({ error: "Internal server error" }, 500);
  }
});

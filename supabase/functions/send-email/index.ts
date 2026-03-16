import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  reply_to?: string;
  template?: string;
  data?: Record<string, string>;
}

const TEMPLATES: Record<string, (data: Record<string, string>) => { subject: string; html: string }> = {
  welcome: (data) => ({
    subject: `Welcome to AfuCloud, ${data.name || "there"}!`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; background: #f07316; border-radius: 12px; line-height: 48px; color: #fff; font-weight: 700; font-size: 20px;">A</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 16px;">Welcome to AfuCloud</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #555;">Hey ${data.name || "there"},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #555;">Thanks for joining AfuCloud — your developer cloud storage platform. Upload files, get instant public links, and integrate with our REST API.</p>
        <a href="https://cloud.afuchat.com/app" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #f07316; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Go to Dashboard</a>
        <p style="font-size: 13px; color: #999; margin-top: 32px;">— The AfuCloud Team</p>
      </div>
    `,
  }),
  "file-shared": (data) => ({
    subject: `${data.sharer || "Someone"} shared a file with you on AfuCloud`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; background: #f07316; border-radius: 12px; line-height: 48px; color: #fff; font-weight: 700; font-size: 20px;">A</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 16px;">File Shared With You</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #555;"><strong>${data.sharer || "Someone"}</strong> shared <strong>${data.fileName || "a file"}</strong> with you.</p>
        <a href="${data.fileUrl || "https://cloud.afuchat.com/app"}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #f07316; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">View File</a>
        <p style="font-size: 13px; color: #999; margin-top: 32px;">— The AfuCloud Team</p>
      </div>
    `,
  }),
  "storage-warning": (data) => ({
    subject: "AfuCloud: You're running low on storage",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; background: #f07316; border-radius: 12px; line-height: 48px; color: #fff; font-weight: 700; font-size: 20px;">A</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 16px;">Storage Almost Full</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #555;">You've used <strong>${data.usedPercent || "90"}%</strong> of your storage. Consider upgrading your plan or removing unused files.</p>
        <a href="https://cloud.afuchat.com/pricing" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #f07316; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Upgrade Plan</a>
        <p style="font-size: 13px; color: #999; margin-top: 32px;">— The AfuCloud Team</p>
      </div>
    `,
  }),
  notification: (data) => ({
    subject: data.subject || "AfuCloud Notification",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; background: #f07316; border-radius: 12px; line-height: 48px; color: #fff; font-weight: 700; font-size: 20px;">A</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 16px;">${data.title || "Notification"}</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #555;">${data.message || ""}</p>
        ${data.actionUrl ? `<a href="${data.actionUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #f07316; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">${data.actionLabel || "View"}</a>` : ""}
        <p style="font-size: 13px; color: #999; margin-top: 32px;">— The AfuCloud Team</p>
      </div>
    `,
  }),
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const body: EmailRequest = await req.json();
    const { to, subject, html, text, from, reply_to, template, data } = body;

    if (!to) throw new Error("'to' is required");

    let finalSubject = subject;
    let finalHtml = html;

    // Use template if specified
    if (template && TEMPLATES[template]) {
      const rendered = TEMPLATES[template](data || {});
      finalSubject = finalSubject || rendered.subject;
      finalHtml = finalHtml || rendered.html;
    }

    if (!finalSubject) throw new Error("'subject' is required (or use a template)");
    if (!finalHtml && !text) throw new Error("'html' or 'text' is required (or use a template)");

    const emailPayload: Record<string, unknown> = {
      from: from || "AfuCloud <noreply@afuchat.com>",
      to: Array.isArray(to) ? to : [to],
      subject: finalSubject,
    };

    if (finalHtml) emailPayload.html = finalHtml;
    if (text) emailPayload.text = text;
    if (reply_to) emailPayload.reply_to = reply_to;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(`Resend API error [${res.status}]: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Email send error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

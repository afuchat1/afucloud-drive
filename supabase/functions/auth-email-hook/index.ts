import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Brand tokens (AfuCloud orange theme)
const BRAND = {
  primary: "hsl(24, 95%, 53%)",
  primaryForeground: "#ffffff",
  foreground: "hsl(222, 47%, 11%)",
  muted: "hsl(220, 9%, 46%)",
  radius: "8px",
  fontFamily: "Inter, Arial, sans-serif",
  logoHtml: `<div style="display:inline-block;width:48px;height:48px;background:hsl(24,95%,53%);border-radius:12px;line-height:48px;color:#fff;font-weight:700;font-size:20px;text-align:center;">A</div>`,
  company: "AfuChat Technologies Limited",
  appName: "AfuCloud",
  appUrl: "https://cloud.afuchat.com",
};

type AuthEmailType =
  | "signup"
  | "magiclink"
  | "recovery"
  | "invite"
  | "email_change"
  | "reauthentication";

interface AuthEmailPayload {
  type: AuthEmailType;
  email: string;
  new_email?: string;
  token?: string;
  token_hash?: string;
  redirect_to?: string;
  site_url?: string;
}

function buildConfirmUrl(payload: AuthEmailPayload): string {
  const siteUrl = payload.site_url || BRAND.appUrl;
  const tokenHash = payload.token_hash || "";
  const type = payload.type === "signup" ? "signup" : payload.type === "recovery" ? "recovery" : payload.type === "magiclink" ? "magiclink" : payload.type === "invite" ? "invite" : payload.type === "email_change" ? "email_change" : "signup";
  return `${siteUrl}/auth/confirm?token_hash=${tokenHash}&type=${type}`;
}

function wrapEmail(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:${BRAND.fontFamily};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="padding:40px 32px 0;text-align:center;">
          ${BRAND.logoHtml}
        </td></tr>
        <tr><td style="padding:24px 32px 0;">
          <h1 style="font-size:22px;font-weight:700;color:${BRAND.foreground};margin:0 0 16px;text-align:center;">${title}</h1>
        </td></tr>
        <tr><td style="padding:0 32px;">
          ${body}
        </td></tr>
        <tr><td style="padding:32px 32px 24px;text-align:center;">
          <p style="font-size:13px;color:${BRAND.muted};margin:0;">— The ${BRAND.appName} Team</p>
          <p style="font-size:11px;color:#bbb;margin:8px 0 0;">${BRAND.company}</p>
        </td></tr>
      </table>
      <p style="font-size:11px;color:#999;margin-top:24px;text-align:center;">
        If you didn't request this email, you can safely ignore it.
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `<div style="text-align:center;margin:24px 0;">
    <a href="${url}" style="display:inline-block;padding:14px 32px;background:${BRAND.primary};color:${BRAND.primaryForeground};text-decoration:none;border-radius:${BRAND.radius};font-weight:600;font-size:14px;">${text}</a>
  </div>`;
}

function paragraph(text: string): string {
  return `<p style="font-size:15px;line-height:1.6;color:#555;margin:0 0 12px;">${text}</p>`;
}

function renderEmail(payload: AuthEmailPayload): { subject: string; html: string } {
  const confirmUrl = buildConfirmUrl(payload);

  switch (payload.type) {
    case "signup":
      return {
        subject: `Verify your ${BRAND.appName} account`,
        html: wrapEmail("Confirm Your Email", [
          paragraph(`Hey there! Thanks for signing up for ${BRAND.appName}. Please verify your email address to get started.`),
          ctaButton("Verify Email", confirmUrl),
          paragraph(`If the button doesn't work, copy and paste this link into your browser:`),
          `<p style="font-size:12px;color:${BRAND.muted};word-break:break-all;">${confirmUrl}</p>`,
        ].join("")),
      };

    case "recovery":
      return {
        subject: `Reset your ${BRAND.appName} password`,
        html: wrapEmail("Reset Your Password", [
          paragraph(`We received a request to reset your ${BRAND.appName} password. Click the button below to choose a new one.`),
          ctaButton("Reset Password", confirmUrl),
          paragraph(`This link will expire in 1 hour. If you didn't request a password reset, you can ignore this email.`),
          `<p style="font-size:12px;color:${BRAND.muted};word-break:break-all;">${confirmUrl}</p>`,
        ].join("")),
      };

    case "magiclink":
      return {
        subject: `Your ${BRAND.appName} login link`,
        html: wrapEmail("Sign In to AfuCloud", [
          paragraph(`Click the button below to sign in to your ${BRAND.appName} account. No password needed.`),
          ctaButton("Sign In", confirmUrl),
          paragraph(`This link will expire in 10 minutes. If you didn't request this, you can safely ignore it.`),
          `<p style="font-size:12px;color:${BRAND.muted};word-break:break-all;">${confirmUrl}</p>`,
        ].join("")),
      };

    case "invite":
      return {
        subject: `You're invited to ${BRAND.appName}`,
        html: wrapEmail("You've Been Invited", [
          paragraph(`You've been invited to join ${BRAND.appName} — developer cloud storage that gets out of your way.`),
          ctaButton("Accept Invitation", confirmUrl),
          paragraph(`Click the button above to set up your account and get started.`),
          `<p style="font-size:12px;color:${BRAND.muted};word-break:break-all;">${confirmUrl}</p>`,
        ].join("")),
      };

    case "email_change":
      return {
        subject: `Confirm your new ${BRAND.appName} email`,
        html: wrapEmail("Confirm Email Change", [
          paragraph(`You requested to change your ${BRAND.appName} email address${payload.new_email ? ` to <strong>${payload.new_email}</strong>` : ""}. Please confirm this change.`),
          ctaButton("Confirm Email Change", confirmUrl),
          paragraph(`If you didn't request this change, please contact support immediately.`),
          `<p style="font-size:12px;color:${BRAND.muted};word-break:break-all;">${confirmUrl}</p>`,
        ].join("")),
      };

    case "reauthentication":
      return {
        subject: `${BRAND.appName} verification code`,
        html: wrapEmail("Verification Code", [
          paragraph(`Use the following code to verify your identity:`),
          `<div style="text-align:center;margin:24px 0;">
            <span style="display:inline-block;padding:16px 32px;background:#f4f4f5;border-radius:${BRAND.radius};font-size:28px;font-weight:700;letter-spacing:6px;color:${BRAND.foreground};font-family:'JetBrains Mono',monospace;">${payload.token || "------"}</span>
          </div>`,
          paragraph(`This code will expire in 5 minutes. If you didn't request this, please secure your account.`),
        ].join("")),
      };

    default:
      return {
        subject: `${BRAND.appName} Notification`,
        html: wrapEmail("Notification", [
          paragraph(`You have a new notification from ${BRAND.appName}.`),
          ctaButton("Go to Dashboard", BRAND.appUrl + "/app"),
        ].join("")),
      };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const payload: AuthEmailPayload = await req.json();
    const { subject, html } = renderEmail(payload);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${BRAND.appName} <noreply@afuchat.com>`,
        to: [payload.email],
        subject,
        html,
      }),
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
    console.error("Auth email error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

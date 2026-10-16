import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "Smart Assets <no-reply@example.com>";

function layout(title, bodyHtml) {
  return `<!doctype html><html><body style="margin:0;background:#04120c;padding:24px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#0c241a;border:1px solid #17382a;border-radius:12px;padding:28px;color:#e8f5ee;">
    <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#1fd18a;margin-bottom:12px;">Smart Assets Global Trade</div>
    <h1 style="font-size:20px;margin:0 0 16px;color:#fff;">${title}</h1>
    <div style="font-size:14px;line-height:1.6;color:#b6cfc3;">${bodyHtml}</div>
  </div></body></html>`;
}

// Escapes user-supplied text before it goes into an email.
export const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

// Always await this from API routes (Vercel serverless drops fire-and-forget work).
export async function sendEmail({ to, subject, title, html, bcc, replyTo }) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set; skipping email to", to);
    return { skipped: true };
  }
  try {
    const payload = { from: FROM, to, subject, html: layout(title, html) };
    if (bcc) payload.bcc = bcc;
    if (replyTo) payload.reply_to = replyTo;
    return await resend.emails.send(payload);
  } catch (err) {
    console.error("[email] failed:", err);
    return { error: true };
  }
}

export const adminEmail = () => process.env.ADMIN_NOTIFY_EMAIL || undefined;

// A separate alert to the admin (not a copy of the user's email).
// rows: [["Label", "value"], ...]  Values are escaped for you.
export async function notifyAdmin({ subject, title, rows = [], link, linkLabel = "Open admin panel" }) {
  const to = adminEmail();
  if (!to) return { skipped: true };
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6ee7b7;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:6px 0;color:#e8f5ee;word-break:break-all;">${esc(v)}</td></tr>`
    )
    .join("");
  const url = link ? `${siteUrl()}${link}` : "";
  return sendEmail({
    to,
    subject,
    title,
    html: `<table style="border-collapse:collapse;font-size:14px;">${table}</table>
           ${siteUrl() && link ? `<p style="margin-top:16px;"><a href="${url}" style="color:#1fd18a;">${esc(linkLabel)}</a></p>` : ""}`,
  });
}

// Public support inbox shown on the Contact page and used for contact-form messages.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "smartassetsglobal@gmail.com";
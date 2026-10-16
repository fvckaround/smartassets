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

// Always await this from API routes (Vercel serverless drops fire-and-forget work).
export async function sendEmail({ to, subject, title, html, bcc }) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set; skipping email to", to);
    return { skipped: true };
  }
  try {
    const payload = { from: FROM, to, subject, html: layout(title, html) };
    if (bcc) payload.bcc = bcc;
    return await resend.emails.send(payload);
  } catch (err) {
    console.error("[email] failed:", err);
    return { error: true };
  }
}

export const adminEmail = () => process.env.ADMIN_NOTIFY_EMAIL || undefined;
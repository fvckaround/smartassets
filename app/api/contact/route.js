import { NextResponse } from "next/server";
import { sendEmail, esc, CONTACT_EMAIL } from "@/lib/email";
import { cleanText } from "@/lib/survey";

export const runtime = "nodejs";

// Simple per-IP limit (resets when the server instance restarts). Enough to stop casual spam.
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_HITS;
}

export async function POST(req) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    if (limited(ip)) {
      return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));

    // Honeypot filled in => a bot. Pretend it worked.
    if (body.website) return NextResponse.json({ ok: true });

    const name = cleanText(body.name, 100);
    const email = cleanText(body.email, 200).toLowerCase();
    const subject = cleanText(body.subject, 150);
    const message = String(body.message || "").replace(/\r/g, "").trim().slice(0, 3000);

    if (!name || !subject || message.length < 10) {
      return NextResponse.json({ error: "Please fill in your name, a subject and a message." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // 1) To the support inbox. Reply-To is the visitor, so you can just hit Reply in Gmail.
    const forwarded = await sendEmail({
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      title: "New contact message",
      html: `<table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 12px 6px 0;color:#6ee7b7;">Name</td><td style="color:#e8f5ee;">${esc(name)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6ee7b7;">Email</td><td style="color:#e8f5ee;">${esc(email)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6ee7b7;">Subject</td><td style="color:#e8f5ee;">${esc(subject)}</td></tr>
      </table>
      <p style="white-space:pre-wrap;margin-top:16px;color:#e8f5ee;">${esc(message)}</p>
      <p style="margin-top:16px;font-size:12px;color:#7fa391;">Press Reply to answer ${esc(name)} directly.</p>`,
    });

    if (forwarded?.error || forwarded?.data === null || forwarded?.skipped) {
      console.error("[contact] could not deliver to support inbox", forwarded);
      return NextResponse.json(
        { error: `We could not send your message right now. Please email ${CONTACT_EMAIL} directly.` },
        { status: 502 }
      );
    }

    // 2) Confirmation to the visitor (best effort).
    await sendEmail({
      to: email,
      subject: "We received your message",
      title: "Thanks for contacting us",
      html: `<p>Hello ${esc(name)},</p>
      <p>We have received your message about <strong style="color:#fff;">${esc(subject)}</strong> and will reply as soon as we can, usually within one business day.</p>
      <p>If you need to add anything, simply reply to this email or write to ${esc(CONTACT_EMAIL)}.</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
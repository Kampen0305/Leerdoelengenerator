import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(s?: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

// Healthcheck: GET /api/feedback/selftest
export async function GET() {
  const to = process.env.FEEDBACK_TO_EMAIL;
  const hasKey = !!process.env.RESEND_API_KEY;
  return json(200, {
    ok: true,
    env: {
      FEEDBACK_TO_EMAIL: !!to,
      RESEND_API_KEY: hasKey,
      SITE_NAME: process.env.SITE_NAME ?? null,
    },
  });
}

// POST /api/feedback
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { stars, comment, path, ua } = body || {};

    const rating = Number(stars);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return json(400, { error: "Invalid stars (1–5)" });
    }

    const to = process.env.FEEDBACK_TO_EMAIL;
    if (!to) return json(500, { error: "FEEDBACK_TO_EMAIL not set" });

    const site = process.env.SITE_NAME || "LeerdoelenGenerator";
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return json(500, { error: "RESEND_API_KEY not set" });

    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial">
        <h2>Nieuwe feedback op ${escapeHtml(site)}</h2>
        <p><strong>Sterren:</strong> ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)</p>
        ${comment ? `<p><strong>Opmerking:</strong><br>${escapeHtml(comment)}</p>` : ""}
        <hr/>
        <p style="font-size:12px;color:#666">
          Pagina: ${escapeHtml(path || "-")}<br/>
          User-Agent: ${escapeHtml(ua || "-")}<br/>
          Timestamp: ${new Date().toISOString()}
        </p>
      </div>
    `;

    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: `⭐ ${rating}/5 feedback binnen op ${site}`,
      html,
    });

    if (error) return json(500, { error: String(error) });
    return json(200, { ok: true });
  } catch (e: any) {
    return json(500, { error: e?.message || "Failed to send" });
  }
}


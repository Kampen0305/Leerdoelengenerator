import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { stars, comment, path, ua } = await req.json();

    const n = Number(stars);
    if (!Number.isFinite(n) || n < 1 || n > 5) {
      return NextResponse.json({ ok: false, error: "invalid stars" }, { status: 400 });
    }

    const to = process.env.FEEDBACK_TO_EMAIL!;
    const site = process.env.SITE_NAME || "Website";

    const subject = `⭐ ${n}/5 feedback binnen op ${site}`;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial">
        <h2>Nieuwe feedback op ${site}</h2>
        <p><strong>Sterren:</strong> ${"★".repeat(n)}${"☆".repeat(5-n)} (${n}/5)</p>
        ${comment ? `<p><strong>Opmerking:</strong><br>${escapeHtml(comment)}</p>` : ""}
        <hr/>
        <p style="font-size:12px;color:#666">
          Pagina: ${escapeHtml(path || "-")}<br/>
          User-Agent: ${escapeHtml(ua || "-")}<br/>
          Timestamp: ${new Date().toISOString()}
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "feedback@learnedgen.local",
      to,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}

function escapeHtml(s?: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

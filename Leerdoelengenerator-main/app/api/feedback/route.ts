import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // Belangrijk: Resend werkt niet op Edge

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { stars, comment, path, ua } = await req.json();

    const n = Number(stars);
    if (!Number.isFinite(n) || n < 1 || n > 5) {
      return NextResponse.json({ ok: false, error: "Invalid stars (1–5)" }, { status: 400 });
    }
    if (!process.env.FEEDBACK_TO_EMAIL) {
      return NextResponse.json({ ok: false, error: "FEEDBACK_TO_EMAIL not set" }, { status: 500 });
    }

    const site = process.env.SITE_NAME || "LeerdoelenGenerator";
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial">
        <h2>Nieuwe feedback op ${escapeHtml(site)}</h2>
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

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Veilige afzender; eigen domein kan later
      to: process.env.FEEDBACK_TO_EMAIL!,
      subject: `⭐ ${n}/5 feedback binnen op ${site}`,
      html,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}

function escapeHtml(s?: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

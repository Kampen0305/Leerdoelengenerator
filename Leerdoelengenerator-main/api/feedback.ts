import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  try {
    const { stars, comment, path, ua } = req.body || {};
    const n = Number(stars);
    if (!Number.isFinite(n) || n < 1 || n > 5) {
      res.status(400).json({ ok: false, error: "invalid stars" });
      return;
    }

    const to = process.env.FEEDBACK_TO_EMAIL;
    if (!to) {
      res.status(500).json({ ok: false, error: "missing email config" });
      return;
    }
    const site = process.env.SITE_NAME || "Website";

    const subject = `⭐ ${n}/5 feedback binnen op ${site}`;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial">
        <h2>Nieuwe feedback op ${site}</h2>
        <p><strong>Sterren:</strong> ${"★".repeat(n)}${"☆".repeat(5 - n)} (${n}/5)</p>
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

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "server error" });
  }
}

function escapeHtml(s?: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


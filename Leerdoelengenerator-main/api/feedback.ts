import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { stars, comment, path, ua } = req.body || {};
  const rating = Number(stars);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid stars (1–5)" });
  }

  const to = process.env.FEEDBACK_TO_EMAIL;
  if (!to) {
    return res.status(500).json({ error: "FEEDBACK_TO_EMAIL not set" });
  }

  const site = process.env.SITE_NAME || "LeerdoelenGenerator";

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

  try {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev", // werkt zonder domeinvalidatie
      to,
      subject: `⭐ ${rating}/5 feedback binnen op ${site}`,
      html,
    });

    if (error) return res.status(500).json({ error: String(error) });
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to send" });
  }
}

function escapeHtml(s?: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

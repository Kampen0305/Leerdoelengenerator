import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const { stars, comment, path, ua } = req.body || {};
  const rating = Number(stars);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "invalid stars" });
  }
  try {
    await resend.emails.send({
      from: process.env.FEEDBACK_FROM || "feedback@example.com",
      to: process.env.FEEDBACK_TO || "dev@example.com",
      subject: `Feedback (${rating} stars)`,
      text: [
        `Stars: ${rating}`,
        comment ? `Comment: ${comment}` : undefined,
        path ? `Path: ${path}` : undefined,
        ua ? `User-Agent: ${ua}` : undefined,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to send" });
  }
  res.status(200).json({ ok: true });
}

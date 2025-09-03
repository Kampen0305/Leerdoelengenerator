export const config = { runtime: "edge" };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "GET") return json({ status: "ok" });

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const stars = Number(body?.stars);
    const comment = (body?.comment ?? "").toString().slice(0, 2000);
    const page = (body?.page ?? "").toString().slice(0, 500);
    const email = (body?.email ?? "").toString().slice(0, 320);
    const ua = (body?.ua ?? "").toString().slice(0, 500);
    const hp = (body?.hp ?? "").toString();

    if (hp) return json({ ok: true }); // honeypot
    if (!Number.isFinite(stars) || stars < 1 || stars > 5)
      return json({ error: "Invalid stars" }, 400);

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM || "Feedback <feedback@digited.nl>";
    const FEEDBACK_TO =
      process.env.FEEDBACK_TO?.split(",").map((s) => s.trim()).filter(Boolean) ??
      ["edwinspielhagen@gmail.com"];

    if (!RESEND_API_KEY) return json({ error: "Missing RESEND_API_KEY" }, 500);

    // Stuur mail via Resend REST API (Edge-safe)
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: FEEDBACK_TO,
        subject: `Nieuwe feedback (${stars}⭐)`,
        text: [
          `Sterren: ${stars}`,
          `Opmerking: ${comment || "-"}`,
          `Pagina: ${page || "-"}`,
          `Email (optioneel): ${email || "-"}`,
          `User-Agent: ${ua || "-"}`,
          `Timestamp: ${new Date().toISOString()}`,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return json({ error: "Resend failed", detail: msg }, 502);
    }

    return json({ ok: true });
  } catch (err: any) {
    return json({ error: "Server error", detail: String(err?.message ?? err) }, 500);
  }
}

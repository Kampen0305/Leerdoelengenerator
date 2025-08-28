import { NextResponse } from "next/server";
import { Resend } from "resend";
export const runtime = "nodejs";

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.FEEDBACK_TO_EMAIL;
    if (!to) return NextResponse.json({ ok: false, error: "FEEDBACK_TO_EMAIL not set" }, { status: 500 });

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Selftest: feedbackmailer werkt",
      html: `<p>Als je dit leest, werkt de mailer 🎉</p><p>${new Date().toISOString()}</p>`
    });

    if (error) return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}

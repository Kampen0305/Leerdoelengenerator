import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') return res.status(200).json({ status: 'ok' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { stars, comment, page, email, ua, hp } = (req.body as any) || {};
    if (hp) return res.status(200).json({ ok: true });

    const s = Number(stars);
    if (!Number.isFinite(s) || s < 1 || s > 5) {
      return res.status(400).json({ error: 'Invalid stars' });
    }
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
    }

    const toList =
      process.env.FEEDBACK_TO?.split(',').map((t) => t.trim()).filter(Boolean) ??
      ['edwinspielhagen@gmail.com'];

    const from = process.env.RESEND_FROM || 'Feedback <feedback@digited.nl>';

    await resend.emails.send({
      from,
      to: toList,
      subject: `Nieuwe feedback (${s}⭐)`,
      text: [
        `Sterren: ${s}`,
        `Opmerking: ${(comment ?? '').toString().slice(0, 2000) || '-'}`,
        `Pagina: ${(page ?? '').toString().slice(0, 500) || '-'}`,
        `Email (optioneel): ${(email ?? '').toString().slice(0, 320) || '-'}`,
        `User-Agent: ${(ua ?? '').toString().slice(0, 500) || '-'}`,
        `Timestamp: ${new Date().toISOString()}`,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('Feedback error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to send feedback' });
  }
}

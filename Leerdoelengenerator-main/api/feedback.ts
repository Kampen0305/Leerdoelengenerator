import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Resend client is initialised lazily so tests can stub the API key
const resend = new Resend(process.env.RESEND_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { stars, comment, path, ua } = body || {};

    const rating = Number(stars);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, error: 'Invalid stars (1–5)' });
    }

    const to = process.env.FEEDBACK_TO_EMAIL;
    if (!process.env.RESEND_API_KEY || !to) {
      console.error('feedback missing env', {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        FEEDBACK_TO_EMAIL: !!to,
      });
      return res.status(500).json({
        ok: false,
        code: 'MISSING_ENV',
        error: 'Missing env: RESEND_API_KEY or FEEDBACK_TO_EMAIL',
      });
    }

    const site = process.env.SITE_NAME || 'LeerdoelenGenerator';
    const subject = `⭐ ${rating}/5 feedback binnen op ${site}`;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial">
        <h2>Nieuwe feedback op ${escapeHtml(site)}</h2>
        <p><strong>Sterren:</strong> ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)</p>
        ${comment ? `<p><strong>Opmerking:</strong><br>${escapeHtml(comment)}</p>` : ''}
        <hr/>
        <p style="font-size:12px;color:#666">
          Pagina: ${escapeHtml(path || '-') }<br/>
          User-Agent: ${escapeHtml(ua || '-') }<br/>
          Timestamp: ${new Date().toISOString()}
        </p>
      </div>`;

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
    if ((result as any)?.error) {
      return res.status(502).json({ ok: false, code: 'RESEND_ERROR', error: String((result as any).error) });
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('feedback endpoint error:', err);
    return res.status(500).json({ ok: false, error: err?.message ?? 'Unknown error' });
  }
}

function escapeHtml(s: string) {
  return (s ?? '').replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]!));
}

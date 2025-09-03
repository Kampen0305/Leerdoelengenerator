import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

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
    const { rating, comment, page, meta } = body || {};

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, error: 'Invalid rating (1–5 required)' });
    }

    const to = process.env.FEEDBACK_TO;
    const from = process.env.FEEDBACK_FROM;
    if (!process.env.RESEND_API_KEY || !to || !from) {
      return res.status(500).json({
        ok: false,
        code: 'MISSING_ENV',
        error: 'Missing env: RESEND_API_KEY, FEEDBACK_TO, FEEDBACK_FROM',
        details: {
          RESEND_API_KEY: !!process.env.RESEND_API_KEY,
          FEEDBACK_FROM: !!from,
          FEEDBACK_TO: !!to,
        },
      });
    }

    const subject = `Nieuwe feedback (${rating}/5)${page ? ` — ${page}` : ''}`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
        <h2>Nieuwe feedback</h2>
        <p><strong>Rating:</strong> ${rating}/5</p>
        ${comment ? `<p><strong>Commentaar:</strong> ${escapeHtml(comment)}</p>` : ''}
        ${page ? `<p><strong>Pagina:</strong> ${escapeHtml(page)}</p>` : ''}
        ${
          meta
            ? `<pre style="background:#f6f8fa;padding:12px;border-radius:6px">${escapeHtml(
                JSON.stringify(meta, null, 2)
              )}</pre>`
            : ''
        }
      </div>
    `;

    const result = await resend.emails.send({ from, to, subject, html });
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
  return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]!));
}

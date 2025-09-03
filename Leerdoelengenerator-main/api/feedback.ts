import type { VercelRequest, VercelResponse } from '@vercel/node';

type Payload = {
  rating: number;
  comment?: string;
  page?: string;
  ua?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Healthcheck zodat je direct 404 kunt uitsluiten
    return res.status(200).json({ ok: true, route: '/api/feedback' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as Partial<Payload>;

    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    console.log('[feedback] rating=%s page=%s ua=%s', body.rating, body.page || '-', (body.ua || '').slice(0, 120));

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM || 'feedback@onresend.com';
    const RESEND_TO = process.env.RESEND_TO || 'edwinspielhagen@gmail.com';

    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
    }

    const subject = `Nieuwe feedback: ${body.rating}/5`;
    const text = [
      `Rating: ${body.rating}/5`,
      `Comment: ${body.comment || '-'}`,
      `Page: ${body.page || '-'}`,
      `User-Agent: ${body.ua || '-'}`,
      `Timestamp: ${new Date().toISOString()}`,
    ].join('\n');

    const rsp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: RESEND_TO,
        subject,
        text,
      }),
    });

    if (!rsp.ok) {
      const errTxt = await rsp.text();
      console.error('Resend error:', errTxt);
      return res.status(502).json({ error: 'Email failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return res.status(400).json({ error: 'Invalid request body' });
  }
}

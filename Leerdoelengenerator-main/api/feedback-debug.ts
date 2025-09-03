import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const info = {
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasFrom: !!process.env.FEEDBACK_FROM,
    hasTo: !!process.env.FEEDBACK_TO,
    nodeEnv: process.env.NODE_ENV,
  };
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ ok: true, info });
}

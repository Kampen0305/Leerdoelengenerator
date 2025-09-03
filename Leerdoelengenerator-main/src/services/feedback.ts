export async function submitFeedback(rating: number, comment: string, page?: string, meta?: any) {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment, page, meta }),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const data = await res.json(); if (data?.error) msg += ` – ${data.error}`; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

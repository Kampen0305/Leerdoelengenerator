export async function submitFeedback(rating: number, comment: string, page?: string, meta?: any) {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment, page, meta }),
  });

  let data: any;
  let msg = `HTTP ${res.status}`;
  try {
    data = await res.json();
    if (data?.error) msg += ` – ${data.error}`;
    if (data?.code) msg += ` [${data.code}]`;
  } catch {}

  if (!res.ok) throw new Error(msg);
  return data;
}

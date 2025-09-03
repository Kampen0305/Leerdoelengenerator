export type FeedbackPayload = {
  rating: number;
  comment?: string;
  page?: string;
  ua?: string;
};

export async function sendFeedback(payload: FeedbackPayload) {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Feedback POST failed: ${res.status} ${txt}`);
  }
  return res.json().catch(() => ({}));
}

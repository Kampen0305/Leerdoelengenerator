import { describe, expect, test, beforeEach, vi } from "vitest";
import handler from "../api/feedback";

function createRes() {
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: undefined as any,
    setHeader(key: string, value: string) {
      this.headers[key] = value;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.body = data;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

vi.mock("resend", () => {
  return {
    Resend: class {
      emails = { send: vi.fn().mockResolvedValue({}) };
    },
  };
});

describe("/api/feedback", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test";
    process.env.FEEDBACK_TO_EMAIL = "to@example.com";
  });

  test("returns ok on valid feedback", async () => {
    const req: any = {
      method: "POST",
      body: JSON.stringify({ stars: 5, comment: "top" }),
    };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test("rejects invalid stars", async () => {
    const req: any = { method: "POST", body: JSON.stringify({ stars: 0 }) };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });
});


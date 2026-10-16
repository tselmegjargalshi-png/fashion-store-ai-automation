import "server-only";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function badRequest(error: ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 400 });
}

export function tooManyRequests() {
  return NextResponse.json({ ok: false, error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

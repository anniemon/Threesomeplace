import { NextResponse } from "next/server";
import { appendSubmission, hasSheetsCredentials } from "@/lib/google-sheets";
import type { SubmissionPayload } from "@/lib/activity";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: SubmissionPayload;

  try {
    payload = (await request.json()) as SubmissionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateSubmission(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (!hasSheetsCredentials()) {
    return NextResponse.json({
      ok: true,
      stored: false,
      reason: "Google Sheets credentials are not configured.",
    });
  }

  try {
    await appendSubmission(payload);
    return NextResponse.json({ ok: true, stored: true });
  } catch (error) {
    console.error("Failed to append submission", error);
    return NextResponse.json(
      { error: "Failed to write submission" },
      { status: 500 },
    );
  }
}

function validateSubmission(payload: SubmissionPayload) {
  if (!payload || typeof payload !== "object") return "Missing payload";
  if (!payload.sessionId || typeof payload.sessionId !== "string") {
    return "Missing sessionId";
  }
  if (payload.shareId && typeof payload.shareId !== "string") {
    return "Invalid shareId";
  }
  if (!Array.isArray(payload.relationshipAreas)) return "Invalid relationshipAreas";
  if (!Array.isArray(payload.jealousyNeeds)) return "Invalid jealousyNeeds";
  if (!payload.sentences || typeof payload.sentences !== "object") {
    return "Missing sentences";
  }
  if (!payload.recipeTitle || typeof payload.recipeTitle !== "string") {
    return "Missing recipeTitle";
  }
  return null;
}

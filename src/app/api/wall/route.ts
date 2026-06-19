import { NextResponse } from "next/server";
import { hasSheetsCredentials, readSubmissionRows } from "@/lib/google-sheets";
import { rowsToSummary, sampleWallSummary } from "@/lib/wall";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSheetsCredentials()) {
    return NextResponse.json(sampleWallSummary);
  }

  try {
    const rows = await readSubmissionRows();
    return NextResponse.json(rowsToSummary(rows, true));
  } catch (error) {
    console.error("Failed to read wall data", error);
    return NextResponse.json(sampleWallSummary, { status: 200 });
  }
}

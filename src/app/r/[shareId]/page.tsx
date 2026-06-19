import Link from "next/link";
import { hasSheetsCredentials, readSubmissionByShareId } from "@/lib/google-sheets";
import { ResultContent } from "@/app/result/result-view";
import { SharedResultFallback } from "./shared-result-fallback";
import type { SharePayload } from "@/lib/result-code";

export const dynamic = "force-dynamic";

export default async function SharedResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ shareId: string }>;
  searchParams: Promise<{ local?: string }>;
}) {
  const [{ shareId }, query] = await Promise.all([params, searchParams]);
  const result = query.local === "1" ? null : await getSharedResult(shareId);

  return (
    <main className="app-shell">
      <div className="container">
        <header className="topbar">
          <Link className="brand" href="/" aria-label="쓰리썸플레이스 홈">
            <span className="brand-mark">
              <span>쓰리썸</span>
              <span>플레이스</span>
            </span>
          </Link>
        </header>
        {result ? (
          <ResultContent result={result} sharePath={`/r/${shareId}`} />
        ) : (
          <SharedResultFallback shareId={shareId} />
        )}
      </div>
    </main>
  );
}

async function getSharedResult(shareId: string): Promise<SharePayload | null> {
  if (!isValidShareId(shareId) || !hasSheetsCredentials()) return null;

  try {
    return await readSubmissionByShareId(shareId);
  } catch (error) {
    console.error("Failed to read shared result", error);
    return null;
  }
}

function isValidShareId(shareId: string) {
  return /^[A-Za-z0-9_-]{6,16}$/.test(shareId);
}

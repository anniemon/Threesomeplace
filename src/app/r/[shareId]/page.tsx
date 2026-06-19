import Link from "next/link";
import { hasSheetsCredentials, readSubmissionByShareId } from "@/lib/google-sheets";
import { MissingResult, ResultContent } from "@/app/result/result-view";
import type { SharePayload } from "@/lib/result-code";

export const dynamic = "force-dynamic";

export default async function SharedResultPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const result = await getSharedResult(shareId);

  return (
    <main className="app-shell">
      <div className="container">
        <header className="topbar">
          <Link className="brand" href="/">
            <span className="brand-mark">3</span>
            <span>
              쓰리썸
              <br />
              플레이스
            </span>
          </Link>
          <span className="pill">오늘의 관계 모양</span>
        </header>
        {result ? <ResultContent result={result} sharePath={`/r/${shareId}`} /> : <MissingResult />}
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

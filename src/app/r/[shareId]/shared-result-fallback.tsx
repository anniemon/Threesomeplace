"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MissingResult, ResultContent } from "@/app/result/result-view";
import type { SharePayload } from "@/lib/result-code";
import { transientResultKey } from "@/lib/transient-result";

export function SharedResultFallback({ shareId }: { shareId: string }) {
  const result = useSyncExternalStore(
    subscribeOnce,
    () => readTransientResult(shareId),
    () => undefined,
  );

  useEffect(() => {
    if (result) window.history.replaceState(null, "", `/r/${shareId}`);
  }, [result, shareId]);

  if (result === undefined) return <section className="panel card">결과를 여는 중</section>;
  if (!result) return <MissingResult />;

  return <ResultContent result={result} sharePath={`/r/${shareId}`} />;
}

function subscribeOnce(callback: () => void) {
  const timeoutId = window.setTimeout(callback, 0);
  return () => window.clearTimeout(timeoutId);
}

function readTransientResult(shareId: string) {
  try {
    const stored = window.sessionStorage.getItem(transientResultKey(shareId));
    return stored ? (JSON.parse(stored) as SharePayload) : null;
  } catch {
    return null;
  }
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  jealousyOptions,
  jealousyTriggerOptions,
  labelById,
  relationshipOptions,
  type SubmissionPayload,
} from "@/lib/activity";
import { buildRecipeSummary } from "@/lib/recipe";
import { decodeResult, type SharePayload } from "@/lib/result-code";

export function ResultView() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("r");
  const result = useMemo(() => (encoded ? decodeResult(encoded) : null), [encoded]);

  if (!result || !encoded) return <MissingResult />;

  return <ResultContent result={result} sharePath={`/result?r=${encodeURIComponent(encoded)}`} />;
}

export function ResultContent({
  result,
  sharePath,
}: {
  result: SharePayload;
  sharePath: string;
}) {
  const [copied, setCopied] = useState(false);
  const payload: SubmissionPayload = {
    ...result,
    jealousyTriggers: result.jealousyTriggers ?? [],
    jealousyTriggerOther: result.jealousyTriggerOther ?? "",
    sessionId: "shared",
  };
  const summary = buildRecipeSummary(payload);
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URL(sharePath, window.location.origin).toString();
  }, [sharePath]);

  async function share() {
    if (!shareUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: "나의 쓰리썸플레이스 관계 모양",
        text: result?.recipeTitle,
        url: shareUrl,
      });
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  const relationshipLabels = [
    ...payload.relationshipAreas.map((id) => labelById(relationshipOptions, id)),
    payload.relationshipOther,
  ].filter(Boolean);
  const jealousyTriggerLabels = [
    ...(payload.jealousyTriggers ?? []).map((id) => labelById(jealousyTriggerOptions, id)),
    payload.jealousyTriggerOther,
  ].filter(Boolean);
  const jealousyLabels = [
    ...payload.jealousyNeeds.map((id) => labelById(jealousyOptions, id)),
    payload.jealousyOther,
  ].filter(Boolean);

  return (
    <section className="panel card">
      <span className="pill">오늘의 관계 모양</span>
      <h1 className="recipe-title">{payload.recipeTitle}</h1>
      <div className="notice">
        {summary.map((line, index) => (
          <p key={`${index}-${line}`}>{line}</p>
        ))}
      </div>

      {jealousyTriggerLabels.length > 0 && (
        <div className="wall-section">
          <span className="pill">질투가 시작되는 순간</span>
          <div className="quote-cloud">
            {jealousyTriggerLabels.map((label, index) => (
              <span className="quote" key={`jealousy-trigger-${index}-${label}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="wall-section">
        <span className="pill">내가 고른 합의 요소</span>
        <div className="quote-cloud">
          {relationshipLabels.map((label, index) => (
            <span className="quote" key={`relationship-${index}-${label}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="wall-section">
        <span className="pill">질투가 통역해준 필요</span>
        <div className="quote-cloud">
          {jealousyLabels.map((label, index) => (
            <span className="quote" key={`jealousy-need-${index}-${label}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="wall-section">
        <span className="pill">내 합의 문장</span>
        <div className="quote-cloud">
          {payload.sentences.important && (
            <span className="quote">
              <small>나는 ______이 중요하다</small>
              {payload.sentences.important}
            </span>
          )}
          {payload.sentences.decideSeparately && (
            <span className="quote">
              <small>______은 각자 결정하고 싶다</small>
              {payload.sentences.decideSeparately}
            </span>
          )}
          {payload.sentences.notifyBefore && (
            <span className="quote">
              <small>______ 전에는 알려주면 좋겠다</small>
              {payload.sentences.notifyBefore}
            </span>
          )}
          {payload.sentences.undefinedThing && (
            <span className="quote">
              <small>아직 정의하고 싶지 않은 것은</small>
              {payload.sentences.undefinedThing}
            </span>
          )}
        </div>
      </div>

      {copied && <p className="status-line">공유 링크를 복사했어요.</p>}

      <div className="nav-row">
        <button className="button purple" type="button" onClick={share}>
          공유하기
        </button>
      </div>
      <div className="nav-row">
        <Link className="button secondary" href="/wall">
          다른 사람의 결과 보기
        </Link>
        <Link className="button" href="/play">
          다시 하기
        </Link>
      </div>
    </section>
  );
}

export function MissingResult() {
  return (
    <section className="panel card">
      <h1 className="question-title">결과를 찾지 못했어요</h1>
      <p className="notice">공유 링크가 잘렸거나 아직 관계 모양을 만들지 않았을 수 있어요.</p>
      <div className="nav-row">
        <Link className="button pink" href="/play">
          다시 하기
        </Link>
        <Link className="button secondary" href="/">
          처음으로
        </Link>
      </div>
    </section>
  );
}

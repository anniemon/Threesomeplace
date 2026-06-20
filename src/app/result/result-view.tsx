"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  jealousyOptions,
  jealousyTriggerOptions,
  labelById,
  relationshipOptions,
  tallyUrl,
  type SubmissionPayload,
} from "@/lib/activity";
import { decodeResult, type SharePayload } from "@/lib/result-code";

export function ResultView() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("r");
  const shareId = searchParams.get("sid");
  const result = useMemo(() => (encoded ? decodeResult(encoded) : null), [encoded]);

  if (!result || !encoded) return <MissingResult />;

  return (
    <ResultContent
      result={result}
      sharePath={shareId ? `/r/${shareId}` : `/result?r=${encodeURIComponent(encoded)}`}
    />
  );
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
    sentences: {
      important: result.sentences.important ?? "",
      decideSeparately: result.sentences.decideSeparately ?? "",
      doTogether: result.sentences.doTogether ?? "",
      notifyBefore: result.sentences.notifyBefore ?? "",
      undefinedThing: result.sentences.undefinedThing ?? "",
      partnerRole: result.sentences.partnerRole ?? "",
    },
    sessionId: "shared",
  };
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URL(sharePath, window.location.origin).toString();
  }, [sharePath]);

  async function share() {
    if (!shareUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: "나의 쓰리썸플레이스 관계 모양",
        text: "내가 원하는 관계 모양",
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
      <h1 className="recipe-title">내가 원하는 관계 모양</h1>

      {jealousyTriggerLabels.length > 0 && (
        <div className="wall-section">
          <span className="pill">질투를 느끼는 순간</span>
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
        <span className="pill">질투가 알려준 욕구</span>
        <div className="quote-cloud">
          {jealousyLabels.map((label, index) => (
            <span className="quote" key={`jealousy-need-${index}-${label}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

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
        <span className="pill">나에게 중요한 것들</span>
        <div className="quote-cloud">
          {payload.sentences.important && (
            <span className="quote">
              <small>나는 ______이(가) 중요하다</small>
              {payload.sentences.important}
            </span>
          )}
          {payload.sentences.decideSeparately && (
            <span className="quote">
              <small>______은(는) 각자 결정하고 싶다</small>
              {payload.sentences.decideSeparately}
            </span>
          )}
          {payload.sentences.doTogether && (
            <span className="quote">
              <small>______(은)는 꼭 함께 하고 싶다</small>
              {payload.sentences.doTogether}
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
              <small>아직 정의하고 싶지 않은 것은 ______(이)다</small>
              {payload.sentences.undefinedThing}
            </span>
          )}
          {payload.sentences.partnerRole && (
            <span className="quote">
              <small>나는 파트너에게 ______ 이고 싶다</small>
              {payload.sentences.partnerRole}
            </span>
          )}
        </div>
      </div>

      <div className="book-recommendation">
        <span className="pill color-lime">
          추천 도서{" "}
          <a
            className="book-title-link"
            href="https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=342917856"
            target="_blank"
            rel="noreferrer"
          >
            &lt;최선의 사랑&gt;
          </a>
          ,{" "}
          <a
            className="author-link"
            href="https://litt.ly/yein_jung"
            target="_blank"
            rel="noreferrer"
          >
            정예인
          </a>
        </span>
        <a
          href="https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=342917856"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="https://image.aladin.co.kr/product/34291/78/cover500/k742932175_1.jpg"
            alt="최선의 사랑 책 표지"
            width={500}
            height={725}
            sizes="(max-width: 620px) 64vw, 220px"
          />
        </a>
      </div>

      {copied && <p className="status-line">공유 링크를 복사했어요.</p>}

      <div className="nav-row">
        <button className="button purple" type="button" onClick={share}>
          공유하기
        </button>
        <a className="button secondary" href={tallyUrl} target="_blank">
          고민 상담 신청 폼 보기
        </a>
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

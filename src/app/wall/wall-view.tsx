"use client";

import { useEffect, useState } from "react";
import type { WallSummary } from "@/lib/activity";
import { sampleWallSummary } from "@/lib/wall";

const colors = ["var(--pink)", "var(--purple)", "var(--lime)", "var(--orange)", "var(--blue)", "var(--green)"];

export function WallView() {
  const [summary, setSummary] = useState<WallSummary>(sampleWallSummary);
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch("/api/wall", { cache: "no-store" });
        const data = (await response.json()) as WallSummary;
        if (isMounted) {
          setSummary(data);
          setUpdatedAt(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
        }
      } catch {
        if (isMounted) setSummary(sampleWallSummary);
      }
    }

    load();
    const interval = window.setInterval(load, 15000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="wall-grid">
      <div className="panel hero-copy">
        <h1 className="hero-title">지금 이곳의 관계 언어</h1>
        <p className="hero-text">
          객관식 응답은 많이 나온 말일수록 크게 보이고, 문장완성 응답은 모두 같은
          크기의 말풍선으로 놓입니다.
        </p>
        <p className="notice">
          총 {summary.total}개의 익명 응답
          {!summary.configured && " · 지금은 Google Sheets 인증 전 목 데이터"}
          {updatedAt && ` · ${updatedAt} 갱신`}
        </p>
      </div>

      <div className="panel wall-board">
        <WeightedWords
          title="관계 믹서: 꼭 합의하고 싶은 영역"
          words={summary.relationshipAreas}
        />
        <WeightedWords
          title="질투 통역소: 실제로 필요했던 것"
          words={summary.jealousyNeeds}
        />
        <SentenceWall summary={summary} />
      </div>
    </section>
  );
}

function WeightedWords({
  title,
  words,
}: {
  title: string;
  words: Array<{ label: string; count: number }>;
}) {
  const max = Math.max(...words.map((word) => word.count), 1);

  return (
    <section className="wall-section">
      <span className="pill color-lime">{title}</span>
      <div className="word-cloud">
        {words.map((word, index) => (
          <span
            className="wall-word"
            key={word.label}
            style={{
              color: colors[index % colors.length],
              fontSize: `${Math.round(24 + (word.count / max) * 34)}px`,
            }}
          >
            {word.label}
            <small> {word.count}</small>
          </span>
        ))}
      </div>
    </section>
  );
}

function SentenceWall({ summary }: { summary: WallSummary }) {
  return (
    <section className="wall-section">
      <span className="pill color-yellow">문장완성형 합의점검표</span>
      <div className="quote-cloud">
        {summary.sentences.important.map((sentence) => (
          <span className="quote" key={`important-${sentence}`}>
            <small>나는 ______이 중요하다</small>
            {sentence}
          </span>
        ))}
        {summary.sentences.decideSeparately.map((sentence) => (
          <span className="quote" key={`decide-${sentence}`}>
            <small>______은 각자 결정하고 싶다</small>
            {sentence}
          </span>
        ))}
        {summary.sentences.notifyBefore.map((sentence) => (
          <span className="quote" key={`notify-${sentence}`}>
            <small>______ 전에는 알려주면 좋겠다</small>
            {sentence}
          </span>
        ))}
        {summary.sentences.undefinedThing.map((sentence) => (
          <span className="quote" key={`undefined-${sentence}`}>
            <small>아직 정의하고 싶지 않은 것은</small>
            {sentence}
          </span>
        ))}
      </div>
    </section>
  );
}

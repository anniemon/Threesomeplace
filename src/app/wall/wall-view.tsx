"use client";

import { useEffect, useState } from "react";
import type { WallSummary } from "@/lib/activity";

const colors = [
  "var(--pink)",
  "var(--purple)",
  "var(--lime)",
  "var(--orange)",
  "var(--blue)",
  "var(--green)",
];

const rotations = [-4, 2, -1, 4, -3, 1, 3, -2];

export function WallView() {
  const [summary, setSummary] = useState<WallSummary | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch("/api/wall", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load wall data");
        }
        const data = (await response.json()) as WallSummary;
        if (isMounted) {
          setSummary(data);
          setErrorMessage("");
          setUpdatedAt(
            new Date().toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        }
      } catch {
        if (isMounted) {
          setErrorMessage("집계 데이터를 아직 불러오지 못했어요.");
          setUpdatedAt("");
        }
      }
    }

    load();
    const interval = window.setInterval(load, 15000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (!summary) {
    return (
      <section className="panel wall-loading-panel">
        <span className="pill color-yellow">
          {errorMessage || "집계 데이터를 불러오는 중"}
        </span>
        {errorMessage && (
          <p className="notice">환경변수와 Google Sheet 공유 권한을 확인한 뒤 새로고침해주세요.</p>
        )}
      </section>
    );
  }

  return (
    <section className="wall-grid">
      <div className="panel hero-copy">
        <h1 className="hero-title wall-title">관계의 말들</h1>
        <p className="hero-text wall-hero-text">
          객관식 응답은 많이 나온 말일수록 크게 보이고, 문장완성 응답은 모두 같은
          크기의 말풍선으로 놓입니다.
        </p>
        <p className="notice">
          총 {summary.total}개의 익명 응답{updatedAt ? ` · ${updatedAt} 갱신` : ""}
        </p>
      </div>

      <div className="panel wall-board">
        <WeightedWords
          title="질투 통역소: 질투를 느끼는 순간"
          words={summary.jealousyTriggers}
        />
        <WeightedWords
          title="질투 통역소: 실제로 필요했던 것"
          words={summary.jealousyNeeds}
        />
        <WeightedWords
          title="합의 요소 고르기: 꼭 합의하고 싶은 요소"
          words={summary.relationshipAreas}
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
        {words.length ? (
          words.map((word, index) => (
            <span
              className="wall-word"
              key={word.label}
              aria-label={`${word.label}, ${word.count}개 응답`}
              title={`${word.label}: ${word.count}`}
              style={getWordStyle(word.count, max, index)}
            >
              {word.label}
            </span>
          ))
        ) : (
          <span className="status-line">아직 응답이 없어요.</span>
        )}
      </div>
    </section>
  );
}

function SentenceWall({ summary }: { summary: WallSummary }) {
  const sentenceGroups = [
    {
      title: "나는 ______이(가) 중요하다",
      sentences: summary.sentences.important,
    },
    {
      title: "______은(는) 각자 결정하고 싶다",
      sentences: summary.sentences.decideSeparately,
    },
    {
      title: "______(은)는 꼭 함께 하고 싶다",
      sentences: summary.sentences.doTogether,
    },
    {
      title: "______ 전에는 알려주면 좋겠다",
      sentences: summary.sentences.notifyBefore,
    },
    {
      title: "아직 정의하고 싶지 않은 것은 ______(이)다",
      sentences: summary.sentences.undefinedThing,
    },
    {
      title: "나는 파트너에게 ______ 이고 싶다",
      sentences: summary.sentences.partnerRole,
    },
  ];
  const hasSentences = sentenceGroups.some(
    (group) => group.sentences.length > 0,
  );

  return (
    <section className="wall-section">
      <span className="pill color-yellow">문장완성형 합의점검표</span>
      <div className="sentence-groups">
        {hasSentences ? (
          sentenceGroups
            .filter((group) => group.sentences.length > 0)
            .map((group) => (
              <section className="sentence-group" key={group.title}>
                <h2 className="sentence-group-title">{group.title}</h2>
                <div className="quote-cloud sentence-quotes">
                  {group.sentences.map((sentence, index) => (
                    <span
                      className="quote sentence-quote"
                      key={`${group.title}-${index}-${sentence}`}
                    >
                      {sentence}
                    </span>
                  ))}
                </div>
              </section>
            ))
        ) : (
          <span className="status-line">아직 문장 응답이 없어요.</span>
        )}
      </div>
    </section>
  );
}

function getWordStyle(count: number, max: number, index: number) {
  const weight = count / max;
  const minSize = Math.round(22 + weight * 16);
  const maxSize = Math.round(24 + weight * 64);
  const viewportSize = Math.round(maxSize * 0.18);

  return {
    color: colors[index % colors.length],
    fontSize: `clamp(${minSize}px, ${viewportSize}vw, ${maxSize}px)`,
    transform: `rotate(${rotations[index % rotations.length]}deg)`,
  };
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  jealousyOptions,
  jealousyTriggerOptions,
  relationshipOptions,
  type ChoiceOption,
  type SubmissionPayload,
} from "@/lib/activity";
import { buildRecipeTitle } from "@/lib/recipe";
import { encodeResult, type SharePayload } from "@/lib/result-code";

type Sentences = SubmissionPayload["sentences"];

const emptySentences: Sentences = {
  important: "",
  decideSeparately: "",
  doTogether: "",
  notifyBefore: "",
  undefinedThing: "",
  partnerRole: "",
};

export function PlayExperience() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [jealousyTriggers, setJealousyTriggers] = useState<string[]>([]);
  const [jealousyTriggerOther, setJealousyTriggerOther] = useState("");
  const [relationshipAreas, setRelationshipAreas] = useState<string[]>([]);
  const [relationshipOther, setRelationshipOther] = useState("");
  const [jealousyNeeds, setJealousyNeeds] = useState<string[]>([]);
  const [jealousyOther, setJealousyOther] = useState("");
  const [sentences, setSentences] = useState<Sentences>(emptySentences);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canGoNext = useMemo(() => {
    if (step === 0) return jealousyTriggers.length > 0 || jealousyTriggerOther.trim();
    if (step === 1) return jealousyNeeds.length > 0 || jealousyOther.trim();
    if (step === 2) return relationshipAreas.length > 0 || relationshipOther.trim();
    return Object.values(sentences).some((value) => value.trim());
  }, [
    jealousyNeeds,
    jealousyOther,
    jealousyTriggerOther,
    jealousyTriggers,
    relationshipAreas,
    relationshipOther,
    sentences,
    step,
  ]);

  function finish() {
    setIsSubmitting(true);
    const shareId = createShareId();

    const payloadWithoutTitle = {
      sessionId: getSessionId(),
      shareId,
      jealousyTriggers,
      jealousyTriggerOther: jealousyTriggerOther.trim(),
      relationshipAreas,
      relationshipOther: relationshipOther.trim(),
      jealousyNeeds,
      jealousyOther: jealousyOther.trim(),
      sentences: trimSentences(sentences),
    };
    const recipeTitle = buildRecipeTitle();
    const payload: SubmissionPayload = { ...payloadWithoutTitle, recipeTitle };
    const sharePayload: SharePayload = {
      jealousyTriggers: payload.jealousyTriggers,
      jealousyTriggerOther: payload.jealousyTriggerOther,
      relationshipAreas: payload.relationshipAreas,
      relationshipOther: payload.relationshipOther,
      jealousyNeeds: payload.jealousyNeeds,
      jealousyOther: payload.jealousyOther,
      sentences: payload.sentences,
      recipeTitle,
    };
    const resultCode = encodeResult(sharePayload);

    submitInBackground(payload);
    router.push(
      `/result?r=${encodeURIComponent(resultCode)}&sid=${encodeURIComponent(shareId)}`,
    );
  }

  return (
    <section className="panel card">
      <div className="step-line">
        <span className="pill">카드 {step + 1} / 4</span>
        <span className="pill">
          {step <= 1 ? "질투 통역소" : step === 2 ? "합의 요소 고르기" : "합의 점검표"}
        </span>
      </div>

      {step === 0 && (
        <ChoiceStep
          title="질투 통역소"
          prompt={
            <>
              나는 파트너가 <span className="blank" /> 질투를 느낀다.
            </>
          }
          options={jealousyTriggerOptions}
          selected={jealousyTriggers}
          onToggle={(id) => setJealousyTriggers(toggleValue(jealousyTriggers, id))}
          otherLabel="다른 질투 순간을 직접 넣어도 좋아요"
          otherValue={jealousyTriggerOther}
          onOtherChange={setJealousyTriggerOther}
        />
      )}

      {step === 1 && (
        <ChoiceStep
          title="질투 통역소"
          prompt={
            <>
              내가 질투를 느꼈을 때 실제로 필요했던 것은{" "}
              <span className="blank" /> (이)다.
            </>
          }
          options={jealousyOptions}
          selected={jealousyNeeds}
          onToggle={(id) => setJealousyNeeds(toggleValue(jealousyNeeds, id))}
          otherLabel="내 말로 번역하기"
          otherValue={jealousyOther}
          onOtherChange={setJealousyOther}
        />
      )}

      {step === 2 && (
        <ChoiceStep
          title="합의 요소 고르기"
          prompt={
            <>
              내가 파트너와의 관계에서 꼭 합의하고 싶은 요소는{" "}
              <span className="blank" /> 다.
            </>
          }
          options={relationshipOptions}
          selected={relationshipAreas}
          onToggle={(id) => setRelationshipAreas(toggleValue(relationshipAreas, id))}
          otherLabel="기타를 직접 넣어도 좋아요"
          otherValue={relationshipOther}
          onOtherChange={setRelationshipOther}
        />
      )}

      {step === 3 && (
        <section>
          <h1 className="question-title">합의 점검표</h1>
          <p className="question-text">내 관계의 빈칸을 직접 채워요.</p>
          <SentenceField
            label="나는 ______이(가) 중요하다."
            value={sentences.important}
            onChange={(value) => setSentences({ ...sentences, important: value })}
            placeholder="예: 시간 약속 지키기"
          />
          <SentenceField
            label="______은(는) 각자 결정하고 싶다."
            value={sentences.decideSeparately}
            onChange={(value) => setSentences({ ...sentences, decideSeparately: value })}
            placeholder="예: 여가 시간을 보내는 법"
          />
          <SentenceField
            label="______(은)는 꼭 함께 하고 싶다."
            value={sentences.doTogether}
            onChange={(value) => setSentences({ ...sentences, doTogether: value })}
            placeholder="예: 생일, 여행"
          />
          <SentenceField
            label="______ 전에는 알려주면 좋겠다."
            value={sentences.notifyBefore}
            onChange={(value) => setSentences({ ...sentences, notifyBefore: value })}
            placeholder="예: 새로운 관계가 깊어지기"
          />
          <SentenceField
            label="아직 정의하고 싶지 않은 것은 ______(이)다."
            value={sentences.undefinedThing}
            onChange={(value) => setSentences({ ...sentences, undefinedThing: value })}
            placeholder="예: 우리 관계의 이름"
          />
          <SentenceField
            label="나는 파트너에게 ______ 이고 싶다."
            value={sentences.partnerRole}
            onChange={(value) => setSentences({ ...sentences, partnerRole: value })}
            placeholder="예: 기댈 수 있는 존재"
          />
        </section>
      )}

      <div className="nav-row">
        <button
          className="button secondary"
          disabled={step === 0 || isSubmitting}
          type="button"
          onClick={() => setStep(step - 1)}
        >
          이전
        </button>
        {step < 3 ? (
          <button
            className="button pink"
            disabled={!canGoNext}
            type="button"
            onClick={() => setStep(step + 1)}
          >
            다음 카드
          </button>
        ) : (
          <button
            className="button pink"
            disabled={!canGoNext || isSubmitting}
            type="button"
            onClick={finish}
          >
            {isSubmitting ? "결과 여는 중" : "관계 모양 보기"}
          </button>
        )}
      </div>
    </section>
  );
}

function submitInBackground(payload: SubmissionPayload) {
  void fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((error) => {
    console.error("Failed to submit response", error);
  });
}

function ChoiceStep({
  title,
  prompt,
  options,
  selected,
  onToggle,
  otherLabel,
  otherValue,
  onOtherChange,
}: {
  title: string;
  prompt: React.ReactNode;
  options: ChoiceOption[];
  selected: string[];
  onToggle: (id: string) => void;
  otherLabel: string;
  otherValue: string;
  onOtherChange: (value: string) => void;
}) {
  return (
    <section>
      <h1 className="question-title">{title}</h1>
      <p className="question-text">{prompt}</p>
      <div className="chips">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              className={`chip color-${option.color}${isSelected ? " selected" : ""}`}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="field">
        <label htmlFor={`${title}-other`}>{otherLabel}</label>
        <input
          className="input"
          id={`${title}-other`}
          value={otherValue}
          onChange={(event) => onOtherChange(event.target.value)}
          placeholder="직접 입력"
        />
      </div>
    </section>
  );
}

function SentenceField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea
        className="textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function trimSentences(sentences: Sentences): Sentences {
  return {
    important: sentences.important.trim(),
    decideSeparately: sentences.decideSeparately.trim(),
    doTogether: sentences.doTogether.trim(),
    notifyBefore: sentences.notifyBefore.trim(),
    undefinedThing: sentences.undefinedThing.trim(),
    partnerRole: sentences.partnerRole.trim(),
  };
}

function getSessionId() {
  const existing = window.localStorage.getItem("threesomeplace-session-id");
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.localStorage.setItem("threesomeplace-session-id", next);
  return next;
}

function createShareId() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

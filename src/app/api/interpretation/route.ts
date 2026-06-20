import { NextResponse } from "next/server";
import {
  hasSheetsCredentials,
  readInterpretationByShareId,
  saveInterpretationByShareId,
} from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

const fallbackMessage =
  "죄송합니다. 요청이 너무 많아 지금은 서비스가 불가합니다. 잠시 후 다시 시도해주세요.";

const requestBuckets = new Map<string, { count: number; resetAt: number }>();
const windowMs = 60 * 1000;
const maxRequestsPerWindow = 5;

type InterpretationRequest = {
  shareId?: string;
  jealousyTriggers: string[];
  jealousyNeeds: string[];
  relationshipAreas: string[];
  sentences: {
    important: string;
    decideSeparately: string;
    doTogether: string;
    notifyBefore: string;
    undefinedThing: string;
    partnerRole: string;
  };
};

export async function POST(request: Request) {
  let payload: InterpretationRequest;

  try {
    payload = (await request.json()) as InterpretationRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (payload.shareId && hasSheetsCredentials()) {
    try {
      const cached = await readInterpretationByShareId(payload.shareId);
      if (cached) return NextResponse.json({ interpretation: cached, cached: true });
    } catch (error) {
      console.error("Failed to read cached interpretation", error);
    }
  }

  if (!process.env.OPENAI_API_KEY) {
    return unavailable();
  }

  if (isRateLimited(request)) {
    return unavailable(429);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
        temperature: 0.45,
        max_output_tokens: 650,
        input: [
          {
            role: "system",
            content:
              "너는 행사 참여자의 관계 선택지를 부드럽게 읽어주는 한국어 해설자다. 심리 진단, 성격 판정, 단정, 치료적 조언을 하지 않는다. 선택지와 주관식 응답에 나온 내용만 근거로 삼아 자연스럽고 유기적으로 설명한다. 과한 해석을 피하고, '그럴 수 있다', '가까워 보인다', '읽을 수 있다'처럼 여지를 남긴다. 출력은 제목 없이 본문 2~3문단과 추천 질문 3~5개만 쓴다.",
          },
          {
            role: "user",
            content: buildPrompt(payload),
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("OpenAI interpretation failed", response.status, await response.text());
      return unavailable(response.status === 429 ? 429 : 503);
    }

    const data = (await response.json()) as { output_text?: string; output?: unknown };
    const interpretation = extractOutputText(data).trim();

    if (!interpretation) {
      return unavailable();
    }

    if (payload.shareId && hasSheetsCredentials()) {
      try {
        await saveInterpretationByShareId(payload.shareId, interpretation);
      } catch (error) {
        console.error("Failed to save cached interpretation", error);
      }
    }

    return NextResponse.json({ interpretation, cached: false });
  } catch (error) {
    console.error("Failed to generate interpretation", error);
    return unavailable();
  }
}

function buildPrompt(payload: InterpretationRequest) {
  return [
    "다음은 참여자가 고른 관계 결과다.",
    "",
    `질투를 느끼는 순간: ${payload.jealousyTriggers.join(", ") || "없음"}`,
    `질투가 알려준 욕구: ${payload.jealousyNeeds.join(", ") || "없음"}`,
    `합의하고 싶은 요소: ${payload.relationshipAreas.join(", ") || "없음"}`,
    "문장완성 응답:",
    `- 나는 ______이(가) 중요하다: ${payload.sentences.important || "없음"}`,
    `- ______은(는) 각자 결정하고 싶다: ${
      payload.sentences.decideSeparately || "없음"
    }`,
    `- ______(은)는 꼭 함께 하고 싶다: ${payload.sentences.doTogether || "없음"}`,
    `- ______ 전에는 알려주면 좋겠다: ${payload.sentences.notifyBefore || "없음"}`,
    `- 아직 정의하고 싶지 않은 것은 ______(이)다: ${
      payload.sentences.undefinedThing || "없음"
    }`,
    `- 나는 파트너에게 ______ 이고 싶다: ${payload.sentences.partnerRole || "없음"}`,
    "",
    "요청:",
    "- 위 응답을 바탕으로만 관계 모양을 설명한다.",
    "- 선택지를 나열하지 말고 서로 어떻게 연결되는지 자연스럽게 풀어쓴다.",
    "- 추천 질문은 3~5개만 bullet로 제시한다.",
    "- 질문은 참여자가 파트너와 실제로 합의해볼 수 있는 문장으로 쓴다.",
  ].join("\n");
}

function validatePayload(payload: InterpretationRequest) {
  if (!payload || typeof payload !== "object") return "Missing payload";
  if (
    payload.shareId &&
    (typeof payload.shareId !== "string" || !/^[A-Za-z0-9_-]{6,16}$/.test(payload.shareId))
  ) {
    return "Invalid shareId";
  }
  if (!Array.isArray(payload.jealousyTriggers)) return "Invalid jealousyTriggers";
  if (!Array.isArray(payload.jealousyNeeds)) return "Invalid jealousyNeeds";
  if (!Array.isArray(payload.relationshipAreas)) return "Invalid relationshipAreas";
  if (!payload.sentences || typeof payload.sentences !== "object") {
    return "Missing sentences";
  }
  return null;
}

function isRateLimited(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const current = requestBuckets.get(key);

  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  return current.count > maxRequestsPerWindow;
}

function unavailable(status = 503) {
  return NextResponse.json({ error: fallbackMessage }, { status });
}

function extractOutputText(data: { output_text?: string; output?: unknown }) {
  if (typeof data.output_text === "string") return data.output_text;

  if (!Array.isArray(data.output)) return "";

  return data.output
    .flatMap((item) => {
      if (!item || typeof item !== "object" || !("content" in item)) return [];
      const content = (item as { content?: unknown }).content;
      if (!Array.isArray(content)) return [];
      return content.map((contentItem) => {
        if (!contentItem || typeof contentItem !== "object") return "";
        if ("text" in contentItem && typeof contentItem.text === "string") {
          return contentItem.text;
        }
        return "";
      });
    })
    .join("\n");
}

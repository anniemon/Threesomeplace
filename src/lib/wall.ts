import {
  jealousyOptions,
  labelById,
  relationshipOptions,
  type WallSummary,
} from "./activity";

export const sheetHeaders = [
  "createdAt",
  "sessionId",
  "relationshipAreas",
  "relationshipOther",
  "jealousyNeeds",
  "jealousyOther",
  "important",
  "decideSeparately",
  "notifyBefore",
  "undefinedThing",
  "recipeTitle",
  "shareId",
];

export type SheetRow = Record<(typeof sheetHeaders)[number], string>;

export const sampleWallSummary: WallSummary = {
  configured: false,
  total: 24,
  relationshipAreas: [
    { label: "시간과 연락", count: 18 },
    { label: "개인 공간", count: 12 },
    { label: "성적 관계와 성건강", count: 9 },
    { label: "가족·친구·SNS 공개 범위", count: 7 },
  ],
  jealousyNeeds: [
    { label: "애정 표현", count: 15 },
    { label: "내 선택권", count: 11 },
    { label: "합의가 지켜졌다는 신뢰", count: 10 },
    { label: "충분한 정보", count: 8 },
  ],
  sentences: {
    important: ["각자의 속도", "다시 묻는 시간", "불안을 숨기지 않는 것"],
    decideSeparately: ["친구와 만나는 방식", "혼자 보내는 밤", "나의 몸"],
    notifyBefore: ["새로운 관계가 깊어지기", "공개 범위를 바꾸기", "일정이 크게 달라지기"],
    undefinedThing: ["우리의 이름", "미래의 모양", "지금 이 감정"],
  },
};

export function rowsToSummary(rows: SheetRow[], configured = true): WallSummary {
  const relationshipCounts = countChoices(rows, "relationshipAreas", relationshipOptions);
  const jealousyCounts = countChoices(rows, "jealousyNeeds", jealousyOptions);

  return {
    configured,
    total: rows.length,
    relationshipAreas: relationshipCounts,
    jealousyNeeds: jealousyCounts,
    sentences: {
      important: collectSentences(rows, "important"),
      decideSeparately: collectSentences(rows, "decideSeparately"),
      notifyBefore: collectSentences(rows, "notifyBefore"),
      undefinedThing: collectSentences(rows, "undefinedThing"),
    },
  };
}

function countChoices(
  rows: SheetRow[],
  key: "relationshipAreas" | "jealousyNeeds",
  options: typeof relationshipOptions,
) {
  const counts = new Map<string, number>();

  rows.forEach((row) => {
    splitCell(row[key]).forEach((value) => {
      const label = labelById(options, value);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function collectSentences(rows: SheetRow[], key: keyof SheetRow) {
  return rows
    .map((row) => row[key]?.trim())
    .filter(Boolean)
    .slice(-18);
}

function splitCell(value: string) {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

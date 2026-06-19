export type ChoiceOption = {
  id: string;
  label: string;
  color: "pink" | "lime" | "yellow" | "purple" | "blue" | "orange" | "green";
};

export type SubmissionPayload = {
  sessionId: string;
  shareId?: string;
  relationshipAreas: string[];
  relationshipOther: string;
  jealousyNeeds: string[];
  jealousyOther: string;
  sentences: {
    important: string;
    decideSeparately: string;
    notifyBefore: string;
    undefinedThing: string;
  };
  recipeTitle: string;
};

export type WallSummary = {
  configured: boolean;
  relationshipAreas: Array<{ label: string; count: number }>;
  jealousyNeeds: Array<{ label: string; count: number }>;
  sentences: {
    important: string[];
    decideSeparately: string[];
    notifyBefore: string[];
    undefinedThing: string[];
  };
  total: number;
};

export const relationshipOptions: ChoiceOption[] = [
  { id: "time-contact", label: "함께하는 시간", color: "pink" },
  { id: "contact-frequency", label: "연락 빈도", color: "lime" },
  { id: "sex-health", label: "스킨십과 성생활", color: "yellow" },
  { id: "home-space", label: "동거 여부", color: "purple" },
  { id: "personal-space", label: "개인적인 공간과 시간", color: "green" },
  { id: "money", label: "데이트 비용이나 생활비", color: "orange" },
  { id: "hobby", label: "취미 생활", color: "blue" },
  { id: "public-range", label: "가족·친구·SNS 공개 범위", color: "green" },
  { id: "future-law", label: "가족 계획", color: "yellow" },
  { id: "open-relationship", label: "오픈 릴레이션십", color: "pink" },
  { id: "conflict-resolution", label: "갈등 해결 방식", color: "lime" },
];

export const jealousyOptions: ChoiceOption[] = [
  { id: "information", label: "충분한 정보", color: "lime" },
  { id: "time-together", label: "함께 보내는 시간", color: "pink" },
  { id: "affection", label: "애정 표현", color: "yellow" },
  { id: "predictability", label: "예측 가능성", color: "purple" },
  { id: "confirmation", label: "중요한 사람이라는 확인", color: "blue" },
  { id: "choice", label: "내 선택권", color: "orange" },
  { id: "trust", label: "합의가 지켜졌다는 신뢰", color: "green" },
  { id: "alone-time", label: "혼자 진정할 시간", color: "yellow" },
  { id: "unknown", label: "아직 모르겠음", color: "lime" },
  { id: "never", label: "질투해본 적 없음", color: "pink" },
];

export const tallyUrl = "https://tally.so/r/aQlQ5B";

export function labelById(options: ChoiceOption[], id: string) {
  return options.find((option) => option.id === id)?.label ?? id;
}

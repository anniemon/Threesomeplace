export type ChoiceOption = {
  id: string;
  label: string;
  color: "pink" | "lime" | "yellow" | "purple" | "blue" | "orange" | "green";
};

export type SubmissionPayload = {
  sessionId: string;
  shareId?: string;
  jealousyTriggers: string[];
  jealousyTriggerOther: string;
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
  jealousyTriggers: Array<{ label: string; count: number }>;
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

export const jealousyTriggerOptions: ChoiceOption[] = [
  { id: "special-friendship", label: "파트너가 남다른 우정의 소유자일", color: "pink" },
  { id: "workaholic", label: "파트너가 워커홀릭일", color: "lime" },
  { id: "hobby-fandom", label: "파트너가 취미/덕질에 몰두할 때", color: "yellow" },
  { id: "ex-talk", label: "파트너가 전애인 얘기할", color: "purple" },
  { id: "no-contact-with-others", label: "파트너가 다른 사람과 있느라 연락이 없을", color: "blue" },
  { id: "family-attachment", label: "파트너가 원가족에 대한 애착이 강할", color: "orange" },
  { id: "cares-for-my-people", label: "파트너가 내 친구/지인을 잘 챙겨줄 때", color: "green" },
];

export const relationshipOptions: ChoiceOption[] = [
  { id: "time-contact", label: "함께하는 시간", color: "pink" },
  { id: "contact-frequency", label: "연락 빈도", color: "lime" },
  { id: "sex-health", label: "스킨십과 성생활", color: "yellow" },
  { id: "home-space", label: "동거 여부", color: "purple" },
  { id: "personal-space", label: "개인적인 공간과 시간", color: "green" },
  { id: "money", label: "데이트 비용이나 생활비", color: "orange" },
  { id: "hobby", label: "취미 생활", color: "blue" },
  { id: "public-range", label: "가족·친구·SNS 공개 범위", color: "green" },
  { id: "relationship-definition", label: "호칭 또는 관계 정의", color: "purple" },
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

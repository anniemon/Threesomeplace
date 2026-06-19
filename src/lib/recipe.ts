import {
  jealousyOptions,
  labelById,
  relationshipOptions,
  type SubmissionPayload,
} from "./activity";

const fallbackTitles = [
  "나는 빈칸을 서두르지 않는 사람",
  "나는 합의를 다시 발명하는 사람",
  "나는 관계의 속도를 직접 고르는 사람",
];

export function buildRecipeTitle(payload: Omit<SubmissionPayload, "recipeTitle">) {
  const relationship = payload.relationshipAreas[0]
    ? labelById(relationshipOptions, payload.relationshipAreas[0])
    : payload.relationshipOther || "관계의 빈칸";
  const jealousy = payload.jealousyNeeds[0]
    ? labelById(jealousyOptions, payload.jealousyNeeds[0])
    : payload.jealousyOther || "나의 감각";

  if (relationship && jealousy) {
    return `나는 “${relationship}”와 “${jealousy}”을 섞는 사람`;
  }

  return fallbackTitles[Math.floor(Math.random() * fallbackTitles.length)];
}

export function buildRecipeSummary(payload: SubmissionPayload) {
  const relationshipLabels = payload.relationshipAreas.map((id) =>
    labelById(relationshipOptions, id),
  );
  const jealousyLabels = payload.jealousyNeeds.map((id) =>
    labelById(jealousyOptions, id),
  );

  const firstLine = relationshipLabels.length
    ? `합의하고 싶은 요소: ${relationshipLabels.join(", ")}`
    : "아직 합의하고 싶은 요소를 고르는 중";
  const secondLine = jealousyLabels.length
    ? `질투가 말해준 필요: ${jealousyLabels.join(", ")}`
    : "질투의 언어는 아직 번역 중";

  return [firstLine, secondLine];
}

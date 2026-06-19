# Threesomeplace

여성민우회 행사 부스에서 사용하는 모바일 참여형 웹입니다. 참여자는 합의 영역 고르기, 질투 통역소, 합의 점검표를 지나 개인 결과를 링크로 공유하고, 익명 응답은 Google Sheets에 저장되어 현장 전시 월에 집계됩니다.

## Routes

- `/`: QR 진입 첫 화면
- `/play`: 넘버링된 참여 카드
- `/result?r=...`: 공유 가능한 개인 관계 모양
- `/wall`: 현장 전시 월
- `/api/submissions`: Google Sheets 익명 응답 저장
- `/api/wall`: Google Sheets 응답 집계

# Threesomeplace

여성민우회 행사 부스에서 사용하는 모바일 참여형 웹입니다. 참여자는 질투 통역소, 합의 요소 고르기, 합의 점검표를 지나 개인 결과를 링크로 공유하고, 익명 응답은 Google Sheets에 저장되어 현장 전시 월에 집계됩니다.

## Routes

- `/`: QR 진입 첫 화면
- `/play`: 넘버링된 참여 카드
- `/result?r=...`: 공유 가능한 개인 관계 모양
- `/wall`: 현장 전시 월
- `/api/submissions`: Google Sheets 익명 응답 저장
- `/api/wall`: Google Sheets 응답 집계

## Environment Variables

- `GOOGLE_SHEETS_SPREADSHEET_ID`: Google Sheet 문서 ID
- `GOOGLE_SHEETS_SHEET_NAME`: 응답을 저장할 시트 이름, 기본값 `responses`
- `GOOGLE_SHEETS_CLIENT_EMAIL`: 서비스 계정 이메일
- `GOOGLE_SHEETS_PRIVATE_KEY`: 서비스 계정 private key. 줄바꿈은 `\n` 형태로 넣어도 됩니다.

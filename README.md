# Threesomeplace

여성민우회 행사 부스에서 사용하는 모바일 참여형 웹입니다. 참여자는 관계 믹서, 질투 통역소, 합의 점검표를 지나 개인 결과를 링크로 공유하고, 익명 응답은 Google Sheets에 저장되어 현장 전시 월에 집계됩니다.

## Routes

- `/`: QR 진입 첫 화면
- `/play`: 넘버링된 참여 카드
- `/result?r=...`: 공유 가능한 개인 관계 레시피
- `/wall`: 현장 전시 월
- `/api/submissions`: Google Sheets 익명 응답 저장
- `/api/wall`: Google Sheets 응답 집계

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Google Sheets credentials are optional for local UI work. Without them, submissions return success without writing, and `/wall` shows mock data.

## Google Sheets Setup

Target sheet:

`https://docs.google.com/spreadsheets/d/1bY2V9pMMEmtPUKbG42CQxdgI5jMBWJjn94_eVyTCqbQ/edit`

Create a Google Cloud service account with Google Sheets API enabled, then share the spreadsheet with the service account email using Editor access.

Required environment variables:

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=1bY2V9pMMEmtPUKbG42CQxdgI5jMBWJjn94_eVyTCqbQ
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SHEET_NAME=responses
```

The app creates the `responses` tab and header row if they do not exist.

## Deployment

Recommended: Vercel.

Vercel is the simplest fit because this app uses Next.js route handlers to keep Google Sheets credentials server-side. Netlify and Cloudflare Pages are also viable if configured with serverless/Next.js support.

GitHub Pages is not recommended for this implementation because it is static-only. It would require a separate Google Apps Script or backend endpoint for writes to Google Sheets.

## Verification

```bash
npm run lint
npm run build
```

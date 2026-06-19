# Threesomeplace Implementation Plan

## Goal

Build a mobile-first web app for the booth activity. Participants enter from a QR code, complete three playful cards, receive a shareable relationship recipe, and submit anonymous data to Google Sheets for a separate live wall view.

## Product Flow

1. Landing page `/`
   - Show the Threesomeplace header, short description, privacy note, and `섞으러 가기` button.
   - Link to the existing Tally pre-registration form as a secondary action.

2. Participant flow `/play`
   - Card 1: 합의 영역 고르기
     - Prompt: `내가 파트너와의 관계에서 꼭 합의하고 싶은 영역은 ___ 다.`
     - Multi-select chips plus an optional direct input.
   - Card 2: 질투 통역소
     - Prompt: `내가 질투를 느꼈을 때 실제로 필요했던 것은 ______다.`
     - Multi-select chips plus an optional direct input.
   - Card 3: 문장완성형 합의점검표
     - Free text fields:
       - `나는 ______이 중요하다.`
       - `______은 각자 결정하고 싶다.`
       - `______ 전에는 알려주면 좋겠다.`
       - `아직 정의하고 싶지 않은 것은 ______이다.`

3. Result page `/result`
   - Generate a relationship recipe title and short summary from selected answers.
   - Support link sharing by serializing the participant's local result into the URL.
   - Submit anonymous data to Google Sheets separately from the share link.

4. Live wall `/wall`
   - Read Google Sheets data through a server route.
   - Show objective choice responses with weighted visual emphasis.
   - Show subjective sentence responses as equal-size quote chips grouped by source question.
   - Keep the wall visually suitable for a booth monitor or tablet.

## Data Model

Each Google Sheets row should include:

- `createdAt`
- `sessionId`
- `relationshipAreas`
- `relationshipOther`
- `jealousyNeeds`
- `jealousyOther`
- `important`
- `decideSeparately`
- `notifyBefore`
- `undefinedThing`
- `recipeTitle`

All values are anonymous. `sessionId` is a random browser-generated identifier, not a user identity.

## Implementation Steps

1. [x] Scaffold a Next.js App Router project with TypeScript.
2. [x] Move the visual direction from `design-mockup.html` into reusable CSS and React components.
3. [x] Implement client-side state for the three-card `/play` flow.
4. [x] Implement result encoding/decoding for shareable URLs.
5. [x] Add `/api/submissions` to write anonymous submissions to Google Sheets.
6. [x] Add `/api/wall` to read rows and return aggregate data for `/wall`.
7. [x] Show a loading/error state for wall data when Google credentials are missing.
8. [x] Run build verification and document required deployment environment variables.

## Current Status

The MVP implementation is complete locally. GitHub repository creation and real Google Sheets writes are pending external credentials/authentication.

## Deployment Recommendation

Recommended: Vercel.

Reasons:

- Native Next.js support.
- Simple environment variable management.
- Serverless route handlers keep Google credentials private.
- Quick preview deployments for design review.

Alternatives:

- Netlify: also supports serverless functions and Next.js, suitable if the account already uses Netlify.
- Cloudflare Pages: good performance, but Google API/private key handling may need extra care.
- GitHub Pages: not recommended for the main implementation because it is static-only. It can work only if Google Apps Script or another backend receives submissions.

## Credentials Needed

To finish live Google Sheets writes, provide either:

1. A Google Cloud service account JSON key with Sheets API enabled, and share the sheet with that service account email.
2. Or, if using GitHub Pages, a deployed Google Apps Script web app URL that accepts anonymous POST requests and writes to the sheet.

This plan assumes option 1.

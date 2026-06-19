# AGENTS.md

## Project

Threesomeplace is a mobile-first event participation web app for a booth activity that questions the exclusive/non-exclusive relationship binary. Participants answer playful prompts, receive a shareable relationship recipe, and optionally contribute anonymous aggregate data to a live wall.

## Working Rules

- Keep the first screen playful and direct: participants should understand the activity and start within a few seconds.
- Avoid making the experience feel like a formal survey. Use cards, chips, short transitions, and colorful interaction states.
- Do not collect names, phone numbers, email addresses, or relationship-identifying personal data.
- Treat all participant submissions as anonymous public-event data. Make this clear before submission.
- Keep subjective sentence responses visually equal in aggregate displays. Do not rank or weight them.
- Show objective choice responses with visible weighting, such as bar size, word size, or count.

## Technical Direction

- Use Next.js App Router so Google Sheets credentials stay server-side.
- Keep Google Sheets access inside route handlers or server-only utility modules.
- Never expose service account keys, private keys, or Apps Script secrets to client components.
- Use environment variables for all credentials.
- Favor simple deploy targets with serverless function support: Vercel, Netlify, or Cloudflare Pages.
- GitHub Pages is only suitable if a separate backend, such as Google Apps Script, handles writes to Google Sheets.

## Required Environment Variables

- `GOOGLE_SHEETS_SPREADSHEET_ID`: `1bY2V9pMMEmtPUKbG42CQxdgI5jMBWJjn94_eVyTCqbQ`
- `GOOGLE_SHEETS_CLIENT_EMAIL`: Google service account client email
- `GOOGLE_SHEETS_PRIVATE_KEY`: Google service account private key, with newline escapes preserved
- `GOOGLE_SHEETS_SHEET_NAME`: sheet tab name, default `responses`

## Google Sheet Access

Share the target Google Sheet with the service account email using Editor access. The app writes anonymous rows and reads aggregate data for the wall.

## Verification

- Run `npm run build` before handing off implementation changes.
- Manually verify mobile widths, result sharing, submission error states, and wall refresh behavior.

import "server-only";

import { google, sheets_v4 } from "googleapis";
import { sheetHeaders, type SheetRow } from "./wall";
import type { SubmissionPayload } from "./activity";
import type { SharePayload } from "./result-code";

let sheetsClient: sheets_v4.Sheets | null = null;

const spreadsheetId =
  process.env.GOOGLE_SHEETS_SPREADSHEET_ID ??
  "1bY2V9pMMEmtPUKbG42CQxdgI5jMBWJjn94_eVyTCqbQ";

const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME ?? "responses";

export function hasSheetsCredentials() {
  return Boolean(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY,
  );
}

async function getSheetsClient() {
  if (!sheetsClient) {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheetsClient = google.sheets({ version: "v4", auth });
  }

  return sheetsClient;
}

export async function appendSubmission(payload: SubmissionPayload) {
  const sheets = await getSheetsClient();
  await ensureSheet(sheets);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:P`,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          payload.sessionId,
          payload.relationshipAreas.join("|"),
          payload.relationshipOther,
          payload.jealousyNeeds.join("|"),
          payload.jealousyOther,
          payload.sentences.important,
          payload.sentences.decideSeparately,
          payload.sentences.notifyBefore,
          payload.sentences.undefinedThing,
          payload.recipeTitle,
          payload.shareId ?? "",
          payload.jealousyTriggers.join("|"),
          payload.jealousyTriggerOther,
          payload.sentences.doTogether,
          payload.sentences.partnerRole,
        ],
      ],
    },
  });
}

export async function readSubmissionRows(): Promise<SheetRow[]> {
  const sheets = await getSheetsClient();
  await ensureSheet(sheets);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:P`,
  });

  return (response.data.values ?? []).map((row) =>
    Object.fromEntries(sheetHeaders.map((header, index) => [header, row[index] ?? ""])),
  ) as SheetRow[];
}

export async function readSubmissionByShareId(shareId: string): Promise<SharePayload | null> {
  const rows = await readSubmissionRows();
  const row = rows.findLast((item) => item.shareId === shareId);
  if (!row) return null;

  return {
    shareId: row.shareId,
    jealousyTriggers: splitCell(row.jealousyTriggers),
    jealousyTriggerOther: row.jealousyTriggerOther,
    relationshipAreas: splitCell(row.relationshipAreas),
    relationshipOther: row.relationshipOther,
    jealousyNeeds: splitCell(row.jealousyNeeds),
    jealousyOther: row.jealousyOther,
    sentences: {
      important: row.important,
      decideSeparately: row.decideSeparately,
      doTogether: row.doTogether,
      notifyBefore: row.notifyBefore,
      undefinedThing: row.undefinedThing,
      partnerRole: row.partnerRole,
    },
    recipeTitle: row.recipeTitle,
  };
}

async function ensureSheet(sheets: sheets_v4.Sheets) {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const found = spreadsheet.data.sheets?.some(
    (sheet) => sheet.properties?.title === sheetName,
  );

  if (!found) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: sheetName } } }],
      },
    });
  }

  const headers = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:P1`,
  });

  const currentHeaders = headers.data.values?.[0] ?? [];
  const needsHeaderUpdate = sheetHeaders.some(
    (header, index) => currentHeaders[index] !== header,
  );

  if (!currentHeaders.length || needsHeaderUpdate) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:P1`,
      valueInputOption: "RAW",
      requestBody: { values: [sheetHeaders] },
    });
  }
}

function splitCell(value: string) {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

import type { SubmissionPayload } from "./activity";

export type SharePayload = Omit<SubmissionPayload, "sessionId">;

export function encodeResult(payload: SharePayload) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeResult(encoded: string): SharePayload | null {
  try {
    const padded = encoded.replaceAll("-", "+").replaceAll("_", "/").padEnd(
      Math.ceil(encoded.length / 4) * 4,
      "=",
    );
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as SharePayload;
  } catch {
    return null;
  }
}

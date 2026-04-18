import { UserAnswers, SmokingStatus } from "./types";
import { countries } from "./countries";

// Version 1 encoding: 16 bytes packed into base64url
// byte 0:  version (1)
// byte 1:  age (18-100)
// byte 2:  sex (0=male, 1=female)
// byte 3:  country index (0-199)
// byte 4:  whoopEnabled (0/1)
// byte 5:  whoopAge integer part (0-100, 255 if null)
// byte 6:  whoopAge decimal (0-9, tenths)
// byte 7:  exerciseDays (0-7, 255 if null)
// byte 8:  sleepHours * 2 (8-20, 255 if null)
// byte 9:  smoking (0-3)
// byte 10: upf (0-100)
// byte 11: body (0-100)
// byte 12: workMovement (0-100)
// byte 13: workStress (0-100)
// byte 14: closeTies (0-5)
// byte 15: monday (0-100)
// byte 16: optimism (0-100)

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function encodeAnswers(answers: UserAnswers): string {
  const countryIndex = countries.findIndex((c) => c.code === answers.country);
  const bytes = new Uint8Array(17);

  bytes[0] = 1; // version
  bytes[1] = answers.age;
  bytes[2] = answers.sex === "male" ? 0 : 1;
  bytes[3] = countryIndex >= 0 ? countryIndex : 255;
  bytes[4] = answers.whoopEnabled ? 1 : 0;
  bytes[5] = answers.whoopAge !== null ? Math.floor(answers.whoopAge) : 255;
  bytes[6] = answers.whoopAge !== null ? Math.round((answers.whoopAge % 1) * 10) : 0;
  bytes[7] = answers.exerciseDays !== null ? answers.exerciseDays : 255;
  bytes[8] = answers.sleepHours !== null ? Math.round(answers.sleepHours * 2) : 255;
  bytes[9] = answers.smoking;
  bytes[10] = answers.upf;
  bytes[11] = answers.body;
  bytes[12] = answers.workMovement;
  bytes[13] = answers.workStress;
  bytes[14] = answers.closeTies;
  bytes[15] = answers.monday;
  bytes[16] = answers.optimism;

  return toBase64Url(bytes);
}

export function decodeAnswers(encoded: string): UserAnswers | null {
  try {
    const bytes = fromBase64Url(encoded);
    if (bytes[0] !== 1 || bytes.length < 17) return null;

    const countryIndex = bytes[3];
    const country =
      countryIndex < countries.length ? countries[countryIndex].code : "XX";

    const whoopEnabled = bytes[4] === 1;

    return {
      age: bytes[1],
      sex: bytes[2] === 0 ? "male" : "female",
      country,
      whoopEnabled,
      whoopAge: whoopEnabled && bytes[5] !== 255 ? bytes[5] + bytes[6] / 10 : null,
      exerciseDays: !whoopEnabled && bytes[7] !== 255 ? bytes[7] : null,
      sleepHours: !whoopEnabled && bytes[8] !== 255 ? bytes[8] / 2 : null,
      smoking: bytes[9] as SmokingStatus,
      upf: bytes[10],
      body: bytes[11],
      workMovement: bytes[12],
      workStress: bytes[13],
      closeTies: bytes[14],
      monday: bytes[15],
      optimism: bytes[16],
    };
  } catch {
    return null;
  }
}

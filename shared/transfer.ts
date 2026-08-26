// Offline patient-data transfer: OTP is the signing key and is never put in the QR.

export const TRANSFER_VERSION = 1 as const;
export const TRANSFER_TTL_MS = 15 * 60 * 1000;

export type Sha256HexFn = (message: string) => Promise<string>;

export interface TransferPayload {
  v: typeof TRANSFER_VERSION;
  patient: Record<string, unknown>;
  records: unknown[];
  prescriptions: unknown[];
  appointments: unknown[];
  labResults: unknown[];
  vitals: unknown[];
  generatedAt: string;
  expiresAt: string;
  signature: string;
}

export type VerifyResult =
  | { ok: true; payload: TransferPayload }
  | { ok: false; error: string };

function sortValue(value: unknown): unknown {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  const obj = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    const entry = obj[key];
    if (entry === undefined) continue;
    sorted[key] = sortValue(entry);
  }
  return sorted;
}

export function canonicalize(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

export function stripInternalFields<T>(item: T): T {
  if (!item || typeof item !== 'object') return item;
  const clone = { ...(item as Record<string, unknown>) };
  delete clone._encrypted;
  delete clone._accessError;
  return clone as T;
}

export function unsignedFromPatientData(data: {
  patient: unknown;
  records?: unknown[];
  prescriptions?: unknown[];
  appointments?: unknown[];
  labResults?: unknown[];
  vitals?: unknown[];
  generatedAt: string;
  expiresAt: string;
}): Omit<TransferPayload, 'signature'> {
  return {
    v: TRANSFER_VERSION,
    patient: stripInternalFields(data.patient) as Record<string, unknown>,
    records: (data.records || []).map((record) => stripInternalFields(record)),
    prescriptions: (data.prescriptions || []).map((item) => stripInternalFields(item)),
    appointments: (data.appointments || []).map((item) => stripInternalFields(item)),
    labResults: (data.labResults || []).map((item) => stripInternalFields(item)),
    vitals: (data.vitals || []).map((item) => stripInternalFields(item)),
    generatedAt: data.generatedAt,
    expiresAt: data.expiresAt
  };
}

export async function signTransfer(
  otp: string,
  unsigned: Omit<TransferPayload, 'signature'>,
  sha256: Sha256HexFn
): Promise<TransferPayload> {
  const signature = await sha256(`${otp}:${canonicalize(unsigned)}`);
  return { ...unsigned, signature };
}

export function isExpired(expiresAt: string, now = Date.now()): boolean {
  const timestamp = Date.parse(expiresAt);
  return Number.isNaN(timestamp) || timestamp <= now;
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function isTransferPayload(value: unknown): value is TransferPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;
  if ('otp' in payload) return false;
  const patient = payload.patient as Record<string, unknown> | null;
  return (
    payload.v === TRANSFER_VERSION &&
    typeof patient === 'object' &&
    patient !== null &&
    typeof patient.id === 'string' &&
    Array.isArray(payload.records) &&
    Array.isArray(payload.prescriptions) &&
    Array.isArray(payload.appointments) &&
    Array.isArray(payload.labResults) &&
    Array.isArray(payload.vitals) &&
    typeof payload.generatedAt === 'string' &&
    typeof payload.expiresAt === 'string' &&
    typeof payload.signature === 'string' &&
    /^[a-f0-9]{64}$/.test(payload.signature)
  );
}

export function parseTransferJson(
  raw: string
): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false, error: 'Transfer data is not valid JSON.' };
  }
}

export async function verifyTransfer(
  value: unknown,
  otp: string,
  sha256: Sha256HexFn,
  isReplay: (signature: string) => boolean
): Promise<VerifyResult> {
  if (value && typeof value === 'object' && 'otp' in (value as object)) {
    return {
      ok: false,
      error: 'This QR uses an old format. Ask the patient to generate a new code.'
    };
  }

  if (!isTransferPayload(value)) {
    return {
      ok: false,
      error: 'Invalid transfer data. Ask the patient to generate a new QR code.'
    };
  }

  if (!/^\d{6}$/.test(otp)) {
    return {
      ok: false,
      error: "Enter the 6-digit verification code shown on the patient's phone."
    };
  }

  if (isExpired(value.expiresAt)) {
    return {
      ok: false,
      error: 'This transfer code has expired. Ask the patient to generate a new one.'
    };
  }

  const { signature, ...unsigned } = value;
  const expected = await sha256(`${otp}:${canonicalize(unsigned)}`);
  if (!timingSafeEqual(expected, signature)) {
    return { ok: false, error: 'Incorrect verification code.' };
  }

  if (isReplay(value.signature)) {
    return { ok: false, error: 'This transfer code has already been used.' };
  }

  return { ok: true, payload: value };
}

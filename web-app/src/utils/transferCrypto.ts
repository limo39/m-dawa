import { verifyTransfer, type TransferPayload } from '../../../shared/transfer';

const USED_KEY = 'mdawa_used_transfers';

interface UsedTransfer {
  signature: string;
  usedAt: string;
  expiresAt: string;
}

export async function sha256Hex(message: string): Promise<string> {
  const encoded = new TextEncoder().encode(message);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function loadUsed(): UsedTransfer[] {
  try {
    const stored = localStorage.getItem(USED_KEY);
    const parsed = stored ? (JSON.parse(stored) as UsedTransfer[]) : [];
    const now = Date.now();
    const active = parsed.filter((item) => Date.parse(item.expiresAt) > now);
    if (active.length !== parsed.length) {
      localStorage.setItem(USED_KEY, JSON.stringify(active));
    }
    return active;
  } catch {
    return [];
  }
}

export function hasUsedSignature(signature: string): boolean {
  return loadUsed().some((item) => item.signature === signature);
}

export function markTransferUsed(payload: TransferPayload): void {
  const used = loadUsed();
  if (used.some((item) => item.signature === payload.signature)) return;
  used.push({
    signature: payload.signature,
    usedAt: new Date().toISOString(),
    expiresAt: payload.expiresAt
  });
  localStorage.setItem(USED_KEY, JSON.stringify(used));
}

export async function verifyIncomingTransfer(payload: unknown, otp: string) {
  return verifyTransfer(payload, otp, sha256Hex, hasUsedSignature);
}

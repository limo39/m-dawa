import * as Crypto from 'expo-crypto';
import {
  TRANSFER_TTL_MS,
  signTransfer,
  unsignedFromPatientData
} from '../../../shared/transfer';

async function sha256Hex(message: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, message);
}

export async function generateSecureOtp(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(4);
  const n = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
  return String(100000 + (n % 900000));
}

export async function createSignedTransfer(patientData: {
  patient: unknown;
  records?: unknown[];
  prescriptions?: unknown[];
  appointments?: unknown[];
  labResults?: unknown[];
  vitals?: unknown[];
}): Promise<{ otp: string; json: string; expiresAt: Date }> {
  const otp = await generateSecureOtp();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TRANSFER_TTL_MS);
  const unsigned = unsignedFromPatientData({
    patient: patientData.patient,
    records: patientData.records,
    prescriptions: patientData.prescriptions,
    appointments: patientData.appointments,
    labResults: patientData.labResults,
    vitals: patientData.vitals,
    generatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  });
  const payload = await signTransfer(otp, unsigned, sha256Hex);
  return { otp, json: JSON.stringify(payload), expiresAt };
}

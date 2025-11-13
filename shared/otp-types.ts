// Shared OTP types for M-dawa system

export interface OTPTransferData {
  otp: string;
  patientId: string;
  patientName: string;
  patient: any;
  records: any[];
  prescriptions: any[];
  appointments?: any[];
  labResults?: any[];
  vitals?: any[];
  generatedAt: string;
  expiresAt: string;
}

export interface OTPVerificationResult {
  success: boolean;
  data?: OTPTransferData;
  error?: string;
}

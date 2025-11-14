// OTP System Types

export interface OTPSession {
  otp: string;
  patientId: string;
  patientData: any;
  expiresAt: Date;
  createdAt: Date;
  used: boolean;
}

export interface OTPGenerateRequest {
  patientId: string;
  patientData: any;
}

export interface OTPVerifyRequest {
  otp: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  patientData?: any;
  error?: string;
}

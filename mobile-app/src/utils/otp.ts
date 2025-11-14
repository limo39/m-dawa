// OTP Generation and Management for Mobile App

export interface OTPData {
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with patient data (in-memory for now, could use AsyncStorage)
let currentOTP: OTPData | null = null;

export const createOTP = (): OTPData => {
  const otp = generateOTP();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes expiry
  
  currentOTP = {
    otp,
    expiresAt,
    createdAt: now
  };
  
  return currentOTP;
};

export const getCurrentOTP = (): OTPData | null => {
  if (!currentOTP) return null;
  
  // Check if expired
  if (new Date() > currentOTP.expiresAt) {
    currentOTP = null;
    return null;
  }
  
  return currentOTP;
};

export const clearOTP = (): void => {
  currentOTP = null;
};

export const isOTPValid = (otp: string): boolean => {
  const current = getCurrentOTP();
  if (!current) return false;
  return current.otp === otp;
};

export const getOTPTimeRemaining = (): number => {
  const current = getCurrentOTP();
  if (!current) return 0;
  
  const now = new Date();
  const remaining = current.expiresAt.getTime() - now.getTime();
  return Math.max(0, Math.floor(remaining / 1000)); // seconds
};

export const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

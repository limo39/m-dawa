// OTP Generation and Management for M-dawa

export interface OTPData {
  code: string;
  patientId: string;
  patientName: string;
  generatedAt: Date;
  expiresAt: Date;
  used: boolean;
}

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if OTP is expired (valid for 15 minutes)
export const isOTPExpired = (expiresAt: Date): boolean => {
  return new Date() > new Date(expiresAt);
};

// Create OTP data with expiration
export const createOTPData = (patientId: string, patientName: string): OTPData => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

  return {
    code: generateOTP(),
    patientId,
    patientName,
    generatedAt: now,
    expiresAt,
    used: false
  };
};

// Format time remaining
export const getTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const diff = new Date(expiresAt).getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

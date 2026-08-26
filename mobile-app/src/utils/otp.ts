// OTP Generation and Management for Mobile App

export interface OTPData {
  code: string;
  patientId: string;
  patientName: string;
  expiresAt: Date;
  createdAt: Date;
  used: boolean;
}

export const createOtpDisplay = (
  code: string,
  patientId: string,
  patientName: string,
  expiresAt: Date
): OTPData => {
  return {
    code,
    patientId,
    patientName,
    expiresAt,
    createdAt: new Date(),
    used: false
  };
};

// Get time remaining in human-readable format
export const getTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const remaining = expiresAt.getTime() - now.getTime();
  
  if (remaining <= 0) {
    return 'Expired';
  }
  
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format time for display
export const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

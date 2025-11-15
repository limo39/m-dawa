// OTP Service for Web/Desktop Apps
// This simulates a backend service using localStorage

interface OTPSession {
  otp: string;
  patientData: any;
  expiresAt: string;
  used: boolean;
}

const OTP_STORAGE_KEY = 'mdawa_otp_sessions';

// In a real app, this would be a backend API
// For now, we'll use a simple in-memory store that can be shared via QR/manual entry

export const verifyOTP = async (otp: string): Promise<{ success: boolean; patientData?: any; error?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if OTP matches expected format (6 digits)
  if (!/^\d{6}$/.test(otp)) {
    return {
      success: false,
      error: 'Invalid OTP format. Must be 6 digits.'
    };
  }
  
  // Check localStorage for OTP sessions (stored when QR/JSON is scanned)
  const sessions = getOTPSessions();
  const session = sessions[otp];
  
  if (!session) {
    return {
      success: false,
      error: 'OTP not found. Please use QR code or JSON transfer first, then enter the OTP.'
    };
  }
  
  // Check if expired
  if (new Date(session.expiresAt) < new Date()) {
    return {
      success: false,
      error: 'OTP has expired. Please generate a new one.'
    };
  }
  
  // Check if already used
  if (session.used) {
    return {
      success: false,
      error: 'OTP has already been used.'
    };
  }
  
  // Mark as used
  markOTPAsUsed(otp);
  
  return {
    success: true,
    patientData: session.patientData
  };
};

export const storeOTPSession = (otp: string, patientData: any, expiresAt: Date): void => {
  const sessions = getOTPSessions();
  sessions[otp] = {
    otp,
    patientData,
    expiresAt: expiresAt.toISOString(),
    used: false
  };
  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(sessions));
};

export const getOTPSessions = (): Record<string, OTPSession> => {
  const stored = localStorage.getItem(OTP_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const markOTPAsUsed = (otp: string): void => {
  const sessions = getOTPSessions();
  if (sessions[otp]) {
    sessions[otp].used = true;
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(sessions));
  }
};

export const cleanExpiredOTPs = (): void => {
  const sessions = getOTPSessions();
  const now = new Date();
  
  Object.keys(sessions).forEach(otp => {
    const session = sessions[otp];
    if (new Date(session.expiresAt) < now || session.used) {
      delete sessions[otp];
    }
  });
  
  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(sessions));
};

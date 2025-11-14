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
  
  // In production, this would call a backend API
  // For demo, we'll check against a hardcoded OTP or localStorage
  
  // Check if OTP matches expected format (6 digits)
  if (!/^\d{6}$/.test(otp)) {
    return {
      success: false,
      error: 'Invalid OTP format. Must be 6 digits.'
    };
  }
  
  // For demo purposes, accept any 6-digit OTP and return mock data
  // In production, this would verify against the backend
  
  return {
    success: true,
    patientData: {
      patient: {
        id: 'otp-patient-' + otp,
        firstName: 'OTP',
        lastName: 'Patient',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        phoneNumber: '+1234567890',
        bloodType: 'O+',
        allergies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      records: [],
      prescriptions: [],
      appointments: [],
      labResults: [],
      vitals: []
    }
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

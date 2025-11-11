// Shared TypeScript types for M-dawa system

export enum UserRole {
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  bloodType?: string;
  allergies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prescription {
  id: string;
  recordId: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'checkup' | 'followup' | 'emergency' | 'consultation';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LabResult {
  id: string;
  patientId: string;
  doctorId: string;
  testName: string;
  testType: 'blood' | 'urine' | 'xray' | 'mri' | 'ct' | 'other';
  result: string;
  normalRange?: string;
  status: 'pending' | 'completed' | 'abnormal';
  notes?: string;
  testDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vitals {
  id: string;
  patientId: string;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  oxygenSaturation?: number;
  recordedAt: Date;
  recordedBy: string;
}

export interface TransferData {
  patient: Patient;
  records: MedicalRecord[];
  prescriptions: Prescription[];
  appointments?: Appointment[];
  labResults?: LabResult[];
  vitals?: Vitals[];
  timestamp: Date;
  signature: string; // For data integrity verification
}

// LocalStorage-based storage for web app
const STORAGE_PREFIX = 'mdawa_';

export const storage = {
  get: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: (key: string, value: any) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  delete: (key: string) => {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },

  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};

// Initialize demo data if not exists
export const initDemoData = () => {
  if (!storage.get('users')) {
    storage.set('users', [
      {
        id: '1',
        name: 'Dr. Smith',
        email: 'doctor@mdawa.com',
        password: 'password123',
        role: 'DOCTOR',
        createdAt: new Date().toISOString()
      }
    ]);

    storage.set('patients', [
      {
        id: 'patient-1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1985-05-15',
        gender: 'male',
        phoneNumber: '+1234567890',
        bloodType: 'O+',
        allergies: ['Penicillin'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    storage.set('medicalRecords', [
      {
        id: 'record-1',
        patientId: 'patient-1',
        doctorId: '1',
        diagnosis: 'Common Cold',
        symptoms: 'Fever, cough, sore throat',
        notes: 'Rest and hydration recommended',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    storage.set('prescriptions', [
      {
        id: 'prescription-1',
        recordId: 'record-1',
        patientId: 'patient-1',
        doctorId: '1',
        medication: 'Paracetamol',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '5 days',
        instructions: 'Take after meals',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    storage.set('appointments', [
      {
        id: 'appointment-1',
        patientId: 'patient-1',
        doctorId: '1',
        date: futureDate.toISOString().split('T')[0],
        time: '10:00',
        type: 'followup',
        status: 'scheduled',
        notes: 'Follow-up for cold symptoms',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);

    storage.set('labResults', [
      {
        id: 'lab-1',
        patientId: 'patient-1',
        doctorId: '1',
        testName: 'Complete Blood Count (CBC)',
        testType: 'blood',
        result: 'WBC: 7.5, RBC: 5.2, Hemoglobin: 14.5 g/dL',
        normalRange: 'WBC: 4-11, RBC: 4.5-5.5, Hb: 13-17',
        status: 'completed',
        notes: 'All values within normal range',
        testDate: pastDate.toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    storage.set('vitals', [
      {
        id: 'vital-1',
        patientId: 'patient-1',
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 37.0,
        weight: 75.5,
        height: 175,
        oxygenSaturation: 98,
        recordedAt: new Date().toISOString(),
        recordedBy: '1'
      }
    ]);

    console.log('✅ Demo data initialized');
  }
};

// Run this to initialize demo data for testing
const Store = require('electron-store');
const store = new Store();

// Create demo doctor user
const users = [
  {
    id: '1',
    name: 'Dr. Smith',
    email: 'doctor@mdawa.com',
    password: 'password123',
    role: 'DOCTOR',
    createdAt: new Date()
  }
];

// Create demo patient
const patients = [
  {
    id: 'patient-1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    phoneNumber: '+1234567890',
    bloodType: 'O+',
    allergies: ['Penicillin'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create demo medical records
const medicalRecords = [
  {
    id: 'record-1',
    patientId: 'patient-1',
    doctorId: '1',
    diagnosis: 'Common Cold',
    symptoms: 'Fever, cough, sore throat',
    notes: 'Rest and hydration recommended',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create demo prescriptions
const prescriptions = [
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
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create demo appointments
const appointments = [
  {
    id: 'appointment-1',
    patientId: 'patient-1',
    doctorId: '1',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    type: 'followup',
    status: 'scheduled',
    notes: 'Follow-up for cold symptoms',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create demo lab results
const labResults = [
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
    testDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create demo vitals
const vitals = [
  {
    id: 'vital-1',
    patientId: 'patient-1',
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 37.0,
    weight: 75.5,
    height: 175,
    oxygenSaturation: 98,
    recordedAt: new Date(),
    recordedBy: '1'
  }
];

store.set('users', users);
store.set('patients', patients);
store.set('medicalRecords', medicalRecords);
store.set('prescriptions', prescriptions);
store.set('appointments', appointments);
store.set('labResults', labResults);
store.set('vitals', vitals);

console.log('✅ Demo data initialized successfully!');
console.log('Login credentials:');
console.log('  Email: doctor@mdawa.com');
console.log('  Password: password123');
console.log('\nDemo data includes:');
console.log('  - 1 Patient (John Doe)');
console.log('  - 1 Medical Record');
console.log('  - 1 Prescription');
console.log('  - 1 Appointment');
console.log('  - 1 Lab Result');
console.log('  - 1 Vital Signs Record');

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

store.set('users', users);
store.set('patients', patients);
store.set('medicalRecords', medicalRecords);
store.set('prescriptions', prescriptions);

console.log('✅ Demo data initialized successfully!');
console.log('Login credentials:');
console.log('  Email: doctor@mdawa.com');
console.log('  Password: password123');

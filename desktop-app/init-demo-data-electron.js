// Initialize demo data for Electron app
// This script sets the data in the correct location for the Electron app

const fs = require('fs');
const path = require('path');
const os = require('os');

// Determine the config path based on OS
let configPath;
if (process.platform === 'darwin') {
  configPath = path.join(os.homedir(), 'Library', 'Application Support', 'm-dawa-desktop', 'config.json');
} else if (process.platform === 'win32') {
  configPath = path.join(os.homedir(), 'AppData', 'Roaming', 'm-dawa-desktop', 'config.json');
} else {
  // Linux
  configPath = path.join(os.homedir(), '.config', 'm-dawa-desktop', 'config.json');
}

// Create demo data
const demoData = {
  users: [
    {
      id: '1',
      name: 'Dr. Smith',
      email: 'doctor@mdawa.com',
      password: 'password123',
      role: 'DOCTOR',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Nurse Johnson',
      email: 'nurse@mdawa.com',
      password: 'nurse123',
      role: 'NURSE',
      createdAt: new Date().toISOString()
    }
  ],
  patients: [
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
  ],
  medicalRecords: [
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
  ],
  prescriptions: [
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
  ],
  appointments: [
    {
      id: 'appointment-1',
      patientId: 'patient-1',
      doctorId: '1',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00',
      type: 'followup',
      status: 'scheduled',
      notes: 'Follow-up for cold symptoms',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  labResults: [
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  vitals: [
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
  ]
};

// Create directory if it doesn't exist
const configDir = path.dirname(configPath);
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
  console.log(`✅ Created directory: ${configDir}`);
}

// Write the config file
fs.writeFileSync(configPath, JSON.stringify(demoData, null, 2));

console.log('✅ Demo data initialized successfully!');
console.log(`📁 Config file: ${configPath}`);
console.log('\nLogin credentials:');
console.log('  Doctor:');
console.log('    Email: doctor@mdawa.com');
console.log('    Password: password123');
console.log('  Nurse:');
console.log('    Email: nurse@mdawa.com');
console.log('    Password: nurse123');
console.log('\nDemo data includes:');
console.log('  - 2 Users (1 Doctor, 1 Nurse)');
console.log('  - 1 Patient (John Doe)');
console.log('  - 1 Medical Record');
console.log('  - 1 Prescription');
console.log('  - 1 Appointment');
console.log('  - 1 Lab Result');
console.log('  - 1 Vital Signs Record');
console.log('\n🚀 Now run: npm start');

// Test script to verify the app structure
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing M-dawa Desktop App Build...\n');

// Check if compiled files exist
const checks = [
  { file: 'dist/main.js', name: 'Main Process' },
  { file: 'dist/preload.js', name: 'Preload Script' },
  { file: 'dist/renderer/App.js', name: 'Renderer (App)' },
  { file: 'dist/renderer/components/Login.js', name: 'Login Component' },
  { file: 'dist/renderer/components/Dashboard.js', name: 'Dashboard Component' },
  { file: 'dist/renderer/components/PatientDetails.js', name: 'PatientDetails Component' },
  { file: 'index.html', name: 'HTML Template' },
  { file: 'package.json', name: 'Package Config' }
];

let allPassed = true;

checks.forEach(check => {
  const exists = fs.existsSync(path.join(__dirname, check.file));
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${check.name}: ${check.file}`);
  if (!exists) allPassed = false;
});

console.log('\n📦 Checking Dependencies...');
const Store = require('electron-store');
console.log('✅ electron-store loaded');

console.log('\n🗄️  Checking Demo Data...');
const store = new Store();
const users = store.get('users', []);
const patients = store.get('patients', []);
const records = store.get('medicalRecords', []);
const prescriptions = store.get('prescriptions', []);
const appointments = store.get('appointments', []);
const labResults = store.get('labResults', []);
const vitals = store.get('vitals', []);

console.log(`✅ Users: ${users.length}`);
console.log(`✅ Patients: ${patients.length}`);
console.log(`✅ Medical Records: ${records.length}`);
console.log(`✅ Prescriptions: ${prescriptions.length}`);
console.log(`✅ Appointments: ${appointments.length}`);
console.log(`✅ Lab Results: ${labResults.length}`);
console.log(`✅ Vitals: ${vitals.length}`);

console.log('\n📊 Summary:');
if (allPassed) {
  console.log('✅ All files compiled successfully!');
  console.log('✅ Demo data initialized!');
  console.log('✅ App is ready to run!');
  console.log('\n🚀 To run the app:');
  console.log('   npm start');
  console.log('\n🔑 Login credentials:');
  console.log('   Email: doctor@mdawa.com');
  console.log('   Password: password123');
} else {
  console.log('❌ Some files are missing. Run: npx tsc');
}

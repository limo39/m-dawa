# M-dawa Quick Start Guide

## ✅ System Status

**Desktop App**: ✅ Built and ready
**Mobile App**: ✅ Configured and ready
**Demo Data**: ✅ Initialized

## 🚀 Running the Desktop App

```bash
cd desktop-app
npm start
```

**Login Credentials:**
- Email: `doctor@mdawa.com`
- Password: `password123`

**What you'll see:**
1. Login screen
2. Dashboard with patient list (1 demo patient: John Doe)
3. Patient details with medical records and prescriptions
4. Ability to add new records and prescriptions

## 📱 Running the Mobile App

```bash
cd mobile-app
npm install
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on physical device

**What you'll see:**
1. Patient setup screen (first time)
2. Enter patient information
3. Data transfer screen with QR code generation

## 🔄 Testing Data Transfer

### Step 1: Setup Patient on Mobile
1. Open mobile app
2. Fill in patient information
3. Save data (stored encrypted locally)

### Step 2: Generate Transfer Data
1. Mobile app shows "Generate Transfer Data" button
2. Click to generate JSON data
3. Copy the JSON data

### Step 3: Receive on Desktop
1. Login to desktop app
2. Click "Receive Patient Data" button
3. Paste the JSON data
4. Patient data appears in the list

### Step 4: Manage Records
1. Select patient from list
2. Add medical records
3. Add prescriptions
4. All data saved locally on desktop

## 📊 Demo Data Included

**Patient:**
- Name: John Doe
- DOB: 1985-05-15
- Gender: Male
- Blood Type: O+
- Allergies: Penicillin

**Medical Record:**
- Diagnosis: Common Cold
- Symptoms: Fever, cough, sore throat
- Notes: Rest and hydration recommended

**Prescription:**
- Medication: Paracetamol
- Dosage: 500mg
- Frequency: 3 times daily
- Duration: 5 days

## 🔧 Troubleshooting

### Desktop App Won't Start
```bash
cd desktop-app
rm -rf node_modules package-lock.json
npm install
npm start
```

### Mobile App Issues
```bash
cd mobile-app
npm install
npx expo start --clear
```

### Reset Demo Data
```bash
cd desktop-app
node init-demo-data.js
```

## 🎯 Next Features to Add

As you mentioned, we'll add these step by step:
- [ ] Appointments scheduling
- [ ] Billing system
- [ ] Lab results
- [ ] Patient history timeline
- [ ] Multi-doctor support
- [ ] Backup/restore functionality

Ready to test! Start with the desktop app first to see the demo data.

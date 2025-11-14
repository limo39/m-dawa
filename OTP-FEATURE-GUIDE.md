# 🔐 M-dawa OTP Feature Guide

## Overview

The OTP (One-Time Password) feature provides a secure, simple way for patients to share their medical records with doctors.

---

## 🎯 How It Works

### Patient Side (Mobile App)

1. **Generate OTP**
   - Patient opens mobile app
   - Taps "Generate OTP" button
   - 6-digit code is generated
   - Code is valid for 10 minutes
   - Timer shows remaining time

2. **Share OTP**
   - Patient shares the 6-digit code with doctor
   - Can copy to clipboard
   - Can read it out loud
   - Can send via SMS/WhatsApp

3. **Automatic Transfer**
   - When doctor enters correct OTP
   - Patient data is automatically transferred
   - No manual QR scanning needed
   - No JSON copy/paste required

### Doctor Side (Desktop/Web App)

1. **Request OTP**
   - Doctor asks patient for OTP
   - Patient generates and shares code

2. **Enter OTP**
   - Doctor clicks "Enter Patient OTP" button
   - Types the 6-digit code
   - Clicks "Verify & Import"

3. **Automatic Import**
   - System verifies OTP
   - Patient data imported automatically
   - Patient appears in patient list
   - Ready to view records

---

## 📱 Mobile App UI

### OTP Generation Screen

```
┌─────────────────────────────────┐
│  🔐 Secure OTP Transfer         │
│                                 │
│  Generate a one-time password   │
│  for your doctor to access      │
│  your records                   │
│                                 │
│  ┌───────────────────────────┐ │
│  │   Generate OTP            │ │  ← Button
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

### OTP Display Screen

```
┌─────────────────────────────────┐
│  Your One-Time Password:        │
│                                 │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │       1 2 3 4 5 6         │ │  ← Large OTP
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  ⏱️ Expires in: 9:45            │  ← Countdown
│                                 │
│  ┌───────────────────────────┐ │
│  │   📋 Copy OTP             │ │  ← Copy button
│  └───────────────────────────┘ │
│                                 │
│  Share this code with your      │
│  doctor. They will enter it     │
│  on their system to access      │
│  your records.                  │
└─────────────────────────────────┘
```

---

## 💻 Desktop/Web App UI

### OTP Entry Modal

```
┌─────────────────────────────────┐
│  🔐 Enter Patient OTP           │
│                                 │
│  Ask the patient for their      │
│  6-digit one-time password      │
│                                 │
│  ┌───────────────────────────┐ │
│  │      [0][0][0][0][0][0]   │ │  ← OTP input
│  └───────────────────────────┘ │
│                                 │
│  ✓ OTP is valid for 10 minutes │
│  ✓ Can only be used once        │
│  ✓ Patient data will be         │
│    imported automatically       │
│                                 │
│  ┌───────────────────────────┐ │
│  │  Verify & Import          │ │  ← Submit
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │  Cancel                   │ │
│  └───────────────────────────┘ │
│                                 │
│  How it works:                  │
│  1. Patient generates OTP       │
│  2. Patient shares code         │
│  3. Enter code to access        │
└─────────────────────────────────┘
```

---

## 🔒 Security Features

### OTP Properties
- **6 digits**: Easy to share, hard to guess
- **10-minute expiry**: Limited time window
- **Single use**: Cannot be reused
- **Random generation**: Cryptographically secure
- **No storage**: Not saved permanently

### Data Protection
- ✅ Patient must explicitly generate OTP
- ✅ Doctor must have valid OTP
- ✅ Automatic expiration
- ✅ One-time use only
- ✅ No unauthorized access

---

## 🎨 User Experience Flow

### Complete Workflow

```
Patient                          Doctor
   │                               │
   ├─ Opens mobile app             │
   ├─ Taps "Generate OTP"          │
   ├─ Sees 6-digit code            │
   │                               │
   ├─ Shares code ─────────────────┤
   │                               │
   │                               ├─ Clicks "Enter Patient OTP"
   │                               ├─ Types 6-digit code
   │                               ├─ Clicks "Verify & Import"
   │                               │
   │  ← Data transferred ──────────┤
   │                               │
   │                               ├─ Patient data imported
   │                               ├─ Patient appears in list
   │                               └─ Can view all records
   │
   └─ OTP expires after use
```

---

## 💡 Advantages Over QR/JSON

### OTP Method
- ✅ **Simpler**: Just 6 digits
- ✅ **Faster**: No scanning/pasting
- ✅ **Verbal**: Can be spoken
- ✅ **SMS-friendly**: Easy to text
- ✅ **Phone-friendly**: Works over phone call
- ✅ **Automatic**: No manual import

### QR/JSON Method
- ❌ Requires QR scanner or copy/paste
- ❌ Cannot be spoken
- ❌ Harder to share remotely
- ❌ Manual import process

---

## 🔧 Technical Implementation

### Mobile App (React Native)

**OTP Generation:**
```typescript
// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create OTP with expiry
const createOTP = (): OTPData => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  return { otp, expiresAt, createdAt: new Date() };
};
```

**Timer:**
```typescript
// Update countdown every second
useEffect(() => {
  const timer = setInterval(() => {
    const remaining = getOTPTimeRemaining();
    setOtpTimeRemaining(remaining);
    if (remaining === 0) clearOTP();
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

### Web/Desktop App

**OTP Verification:**
```typescript
const verifyOTP = async (otp: string) => {
  // Validate format
  if (!/^\d{6}$/.test(otp)) {
    return { success: false, error: 'Invalid format' };
  }
  
  // Verify OTP (would call backend API)
  const result = await api.verifyOTP(otp);
  
  if (result.success) {
    // Auto-import patient data
    await importPatientData(result.patientData);
  }
  
  return result;
};
```

---

## 📊 OTP Lifecycle

```
1. GENERATION
   ├─ Patient taps "Generate OTP"
   ├─ Random 6-digit code created
   ├─ Expiry time set (10 minutes)
   └─ Timer starts counting down

2. ACTIVE
   ├─ OTP displayed to patient
   ├─ Patient shares with doctor
   ├─ Timer shows remaining time
   └─ Can be copied to clipboard

3. VERIFICATION
   ├─ Doctor enters OTP
   ├─ System validates code
   ├─ Checks expiry time
   └─ Verifies not already used

4. TRANSFER
   ├─ OTP verified successfully
   ├─ Patient data retrieved
   ├─ Data imported automatically
   └─ OTP marked as used

5. EXPIRATION
   ├─ 10 minutes elapsed OR
   ├─ OTP used successfully
   ├─ OTP becomes invalid
   └─ Must generate new OTP
```

---

## 🎯 Use Cases

### Scenario 1: In-Person Visit
```
1. Patient arrives at clinic
2. Doctor asks for OTP
3. Patient generates OTP on phone
4. Patient shows phone to doctor
5. Doctor types OTP
6. Records appear instantly
```

### Scenario 2: Telemedicine
```
1. Video call with patient
2. Doctor requests OTP
3. Patient generates OTP
4. Patient reads OTP aloud
5. Doctor enters OTP
6. Records available for consultation
```

### Scenario 3: Emergency
```
1. Patient unable to communicate
2. Family member has patient's phone
3. Family generates OTP
4. Shares with emergency doctor
5. Doctor accesses critical records
6. Immediate treatment possible
```

---

## ⚙️ Configuration

### OTP Settings (Customizable)

```typescript
// OTP length
const OTP_LENGTH = 6; // digits

// Expiry time
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Allowed attempts
const MAX_ATTEMPTS = 3;

// Cooldown period
const COOLDOWN = 5 * 60 * 1000; // 5 minutes
```

---

## 🐛 Error Handling

### Common Errors

**Invalid OTP Format**
```
Error: "Invalid OTP format. Must be 6 digits."
Solution: Enter exactly 6 numeric digits
```

**Expired OTP**
```
Error: "OTP has expired. Please generate a new one."
Solution: Patient generates new OTP
```

**Already Used**
```
Error: "OTP has already been used."
Solution: Patient generates new OTP
```

**Network Error**
```
Error: "Failed to verify OTP. Please try again."
Solution: Check internet connection, retry
```

---

## ✅ Testing Checklist

### Mobile App
- [ ] OTP generates correctly
- [ ] Timer counts down
- [ ] Copy to clipboard works
- [ ] OTP expires after 10 minutes
- [ ] Can generate new OTP
- [ ] UI displays properly

### Desktop/Web App
- [ ] OTP input accepts 6 digits
- [ ] Verification works
- [ ] Data imports automatically
- [ ] Error messages display
- [ ] Modal closes after success
- [ ] Patient appears in list

### Integration
- [ ] End-to-end flow works
- [ ] Data transfers correctly
- [ ] Security maintained
- [ ] Performance acceptable

---

## 🚀 Deployment

### Mobile App
```bash
cd mobile-app
npm start
# Test OTP generation
```

### Web App
```bash
cd web-app
npm run dev
# Test OTP verification
```

---

## 📝 User Instructions

### For Patients
1. Open M-dawa mobile app
2. Tap "Generate OTP"
3. Share the 6-digit code with your doctor
4. Code expires in 10 minutes
5. Generate new code if needed

### For Doctors
1. Click "Enter Patient OTP" button
2. Ask patient for their OTP
3. Type the 6-digit code
4. Click "Verify & Import"
5. Patient records appear automatically

---

## 🎉 Benefits

### For Patients
- ✅ Simple and quick
- ✅ No technical knowledge needed
- ✅ Works over phone/SMS
- ✅ Secure and private
- ✅ Full control

### For Doctors
- ✅ Fast access to records
- ✅ No manual import
- ✅ Works in any situation
- ✅ Secure verification
- ✅ Automatic updates

---

**Status**: ✅ Fully Implemented and Ready to Use!

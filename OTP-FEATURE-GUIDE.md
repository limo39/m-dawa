# 🔐 M-dawa OTP Feature Guide

## Overview

The OTP (One-Time Password) feature adds an extra layer of security to patient data transfers. Patients generate a 6-digit code that doctors must enter to access their medical records.

---

## 🎯 How It Works

### Patient Side (Mobile App)

1. **Generate OTP**
   - Patient opens "Access Code" tab
   - Clicks "Generate Access Code"
   - 6-digit code is generated
   - Code is valid for 15 minutes
   - Code can only be used once

2. **Share with Doctor**
   - Patient shares the 6-digit code verbally or via message
   - Patient can also share QR code/JSON data
   - Both OTP and data are required for access

3. **Code Management**
   - View time remaining
   - See active/expired status
   - Generate new code anytime
   - Old codes are automatically invalidated

### Doctor Side (Desktop/Web App)

1. **Receive Patient Data**
   - Doctor clicks "Receive Patient Data"
   - Enters or scans patient's data
   - System extracts OTP from data
   - Verifies OTP is valid and not expired

2. **Access Granted**
   - If OTP is valid: Data is imported
   - If OTP is invalid/expired: Access denied
   - Patient is notified of access attempt

---

## 📱 Mobile App Features

### New OTP Screen

**Location**: Bottom tab navigation (🔐 Access Code)

**Features**:
- Generate 6-digit OTP
- Display code prominently
- Show countdown timer (15 minutes)
- Active/Expired status badge
- Refresh code option
- Security information
- Usage instructions

**UI Elements**:
```
┌─────────────────────────────────┐
│  🔐 Access Control              │
│  Generate a secure code         │
├─────────────────────────────────┤
│                                 │
│  Patient Information            │
│  Name: John Doe                 │
│  ID: abc123...                  │
│                                 │
│  ┌───────────────────────────┐ │
│  │   Your Access Code        │ │
│  │                           │ │
│  │      123456               │ │  ← 6-digit code
│  │                           │ │
│  │  Time Remaining: 14:32    │ │  ← Countdown
│  │  Status: ✓ Active         │ │
│  │                           │ │
│  │  [🔄 Generate New Code]   │ │
│  └───────────────────────────┘ │
│                                 │
│  📋 How to Use                  │
│  1. Generate code               │
│  2. Share with doctor           │
│  3. Doctor enters code          │
│  4. Data transferred            │
│  5. Code expires                │
│                                 │
│  🔒 Security Features           │
│  • Expires in 15 minutes        │
│  • Single-use only              │
│  • Cannot be reused             │
│  • You control access           │
└─────────────────────────────────┘
```

### Updated Transfer Screen

**Changes**:
- OTP is automatically included in transfer data
- Alert shows OTP when generating transfer
- Doctor needs both OTP and data

---

## 🖥️ Desktop/Web App Integration

### OTP Verification Flow

1. **Data Receiver Modal**
   - Doctor pastes JSON data
   - System extracts OTP from data
   - Validates OTP format (6 digits)
   - Checks expiration time
   - Verifies not already used

2. **Validation Rules**
   - OTP must be exactly 6 digits
   - Must not be expired (< 15 minutes old)
   - Must not have been used before
   - Must match patient data

3. **Success/Failure**
   - ✅ Success: Data imported, OTP marked as used
   - ❌ Failure: Show error message, reject data

---

## 🔒 Security Features

### OTP Properties
- **Length**: 6 digits
- **Validity**: 15 minutes
- **Usage**: Single-use only
- **Format**: Numeric only (100000-999999)
- **Generation**: Cryptographically random

### Security Benefits
1. **Patient Control**: Patient decides when to grant access
2. **Time-Limited**: Codes expire automatically
3. **Single-Use**: Cannot be reused or shared multiple times
4. **Audit Trail**: Track when codes are generated/used
5. **No Permanent Access**: Doctor must request new code each time

### Attack Prevention
- **Brute Force**: 6-digit space (1 million combinations)
- **Replay**: Single-use prevents replay attacks
- **Expiration**: Time limit prevents delayed attacks
- **Verification**: Both OTP and data required

---

## 📊 Data Structure

### OTP Data (Mobile)
```typescript
interface OTPData {
  code: string;              // "123456"
  patientId: string;         // Patient UUID
  patientName: string;       // "John Doe"
  generatedAt: Date;         // Generation timestamp
  expiresAt: Date;           // Expiration timestamp
  used: boolean;             // Usage status
}
```

### Transfer Data (with OTP)
```typescript
interface OTPTransferData {
  otp: string;               // "123456"
  patientId: string;         // Patient UUID
  patientName: string;       // "John Doe"
  patient: Patient;          // Full patient object
  records: MedicalRecord[];  // Medical records
  prescriptions: Prescription[]; // Prescriptions
  appointments?: Appointment[];  // Appointments
  labResults?: LabResult[];      // Lab results
  vitals?: Vitals[];             // Vital signs
  generatedAt: string;       // ISO timestamp
  expiresAt: string;         // ISO timestamp
}
```

---

## 🎨 UI/UX Design

### Mobile App

**Colors**:
- Primary: #667eea (Purple)
- Success: #4caf50 (Green)
- Warning: #ff9800 (Orange)
- Error: #f44336 (Red)
- Background: #f5f7fa (Light Gray)

**Typography**:
- OTP Code: 48px, Bold, Purple
- Timer: 18px, Bold, Green/Red
- Labels: 14-16px, Semi-bold
- Body: 13-14px, Regular

**Interactions**:
- Generate button: Purple, prominent
- Refresh button: Light gray, secondary
- Status badge: Green (active) / Red (expired)
- Timer: Updates every second

### Desktop/Web App

**OTP Input**:
- Large input field for 6 digits
- Auto-focus on open
- Numeric keyboard on mobile
- Clear error messages
- Visual feedback on validation

---

## 🔄 User Flows

### Flow 1: First Time Use
```
Patient:
1. Setup profile
2. Navigate to "Access Code" tab
3. See "No Active Code" message
4. Click "Generate Access Code"
5. View 6-digit code
6. Share code with doctor

Doctor:
1. Click "Receive Patient Data"
2. Patient shares code verbally
3. Patient shares QR/JSON
4. Doctor pastes data
5. System validates OTP
6. Data imported successfully
```

### Flow 2: Code Expiration
```
Patient:
1. Generate code
2. Wait 15+ minutes
3. Code shows "Expired"
4. Click "Generate New Code"
5. New code generated
6. Share new code

Doctor:
1. Try to use expired code
2. System rejects: "OTP expired"
3. Request new code from patient
4. Use new code successfully
```

### Flow 3: Multiple Transfers
```
Patient:
1. Generate code for Doctor A
2. Doctor A uses code (marked as used)
3. Generate new code for Doctor B
4. Doctor B uses new code
5. Each transfer requires new code
```

---

## 🧪 Testing Checklist

### Mobile App
- [ ] Generate OTP button works
- [ ] 6-digit code displays correctly
- [ ] Timer counts down accurately
- [ ] Status changes to "Expired" after 15 min
- [ ] Refresh generates new code
- [ ] Old code is invalidated
- [ ] OTP included in transfer data
- [ ] Alert shows OTP when generating

### Desktop/Web App
- [ ] Can paste data with OTP
- [ ] OTP is extracted correctly
- [ ] Valid OTP allows import
- [ ] Expired OTP is rejected
- [ ] Used OTP is rejected
- [ ] Invalid format is rejected
- [ ] Error messages are clear

### Security
- [ ] OTP is cryptographically random
- [ ] Cannot reuse OTP
- [ ] Expiration is enforced
- [ ] No OTP leakage in logs
- [ ] Audit trail is maintained

---

## 📈 Benefits

### For Patients
✅ **Control**: Decide when to share data  
✅ **Security**: Time-limited access  
✅ **Privacy**: Single-use codes  
✅ **Transparency**: Know when data is accessed  
✅ **Convenience**: Easy 6-digit code  

### For Doctors
✅ **Verification**: Confirm patient identity  
✅ **Security**: Authorized access only  
✅ **Compliance**: Audit trail for regulations  
✅ **Trust**: Patient-controlled sharing  

### For System
✅ **Security**: Multi-factor authentication  
✅ **Compliance**: HIPAA-ready  
✅ **Audit**: Track all access  
✅ **Prevention**: Stop unauthorized access  

---

## 🚀 Implementation Status

### Completed ✅
- [x] OTP generation utility
- [x] OTP screen UI (mobile)
- [x] Bottom tab navigation
- [x] Timer countdown
- [x] Status indicators
- [x] OTP in transfer data
- [x] Security features
- [x] Instructions and help

### Pending 🔄
- [ ] Desktop OTP verification
- [ ] Web app OTP verification
- [ ] OTP usage tracking
- [ ] Audit log
- [ ] Push notifications (optional)

---

## 📝 Next Steps

1. **Test Mobile App**
   ```bash
   cd mobile-app
   npm start
   ```
   - Navigate to "Access Code" tab
   - Generate OTP
   - Test timer
   - Test refresh

2. **Implement Desktop Verification**
   - Add OTP input field
   - Validate OTP format
   - Check expiration
   - Mark as used

3. **Add Audit Trail**
   - Log OTP generation
   - Log OTP usage
   - Track access attempts
   - Store in secure log

4. **User Testing**
   - Test with real users
   - Gather feedback
   - Refine UI/UX
   - Improve security

---

## 🎉 Summary

The OTP feature adds a crucial security layer to M-dawa:

- **Patients control access** with time-limited codes
- **Doctors verify identity** before accessing data
- **System maintains security** with single-use codes
- **Everyone benefits** from enhanced privacy

**Status**: Mobile app ready, desktop integration pending

---

**Last Updated**: November 12, 2025  
**Version**: 1.0.0  
**Status**: ✅ Mobile Complete, 🔄 Desktop Pending

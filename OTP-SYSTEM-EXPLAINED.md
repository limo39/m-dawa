# OTP System - How It Works

## Current Implementation

The M-dawa OTP system works differently than a typical OTP system because **there is no backend server**. Here's how it actually works:

### The Problem
- Mobile app generates an OTP code (e.g., "123456")
- Desktop/Web app needs to verify the OTP and get patient data
- **BUT**: There's no server to store the OTP-to-patient-data mapping

### The Solution: Hybrid Transfer

The system uses a **two-step process**:

#### Step 1: Transfer Data (QR Code or JSON)
1. Patient opens mobile app → "Transfer Data" screen
2. Patient clicks "Generate Transfer Code"
3. Mobile app creates a JSON package containing:
   - OTP code
   - Patient information
   - All medical records
   - Expiration time
4. Patient shares this via:
   - **QR Code** (doctor scans it)
   - **Copy/Paste** (patient copies JSON, doctor pastes it)

#### Step 2: Verify with OTP (Optional Security Layer)
1. Doctor receives the data (via QR or JSON)
2. Doctor can optionally verify by asking patient for the OTP
3. Patient tells doctor the 6-digit code
4. Doctor enters it to confirm authenticity

### Why This Design?

**Without a backend server**, the OTP alone cannot retrieve patient data. The data must be transferred directly from mobile to desktop. The OTP serves as:
- A verification code to confirm the transfer is legitimate
- A security measure (expires in 15 minutes)
- A single-use token (can't be reused)

### How to Use It

**For Patients (Mobile App):**
1. Go to "Transfer Data" tab
2. Click "Generate Transfer Code"
3. Choose method:
   - Show QR code to doctor
   - OR copy the text data and send it to doctor
4. Tell doctor the 6-digit OTP code for verification

**For Doctors (Desktop/Web App):**
1. Click "Receive Patient Data"
2. Scan QR code OR paste JSON data
3. Optionally: Ask patient for OTP and verify it
4. Patient data is imported

### Future Enhancement: Add Backend

To make OTP work standalone (without QR/JSON transfer), you would need:

1. **Backend Server** (Node.js/Express, Python/Flask, etc.)
2. **API Endpoints:**
   ```
   POST /api/otp/generate - Mobile app stores OTP + patient data
   POST /api/otp/verify   - Desktop app retrieves patient data
   ```
3. **Database** (Redis for temporary storage, expires after 15 min)

Example flow with backend:
```
Mobile App → Generate OTP → Send to Server → Server stores OTP + Data
Desktop App → Enter OTP → Query Server → Server returns Data
```

### Current Workaround

The current system works well for the use case:
- Patient and doctor are in the same room
- Doctor can scan QR code or patient can share data directly
- OTP provides additional security verification
- No internet/server required (works offline)

This is actually a **feature** for privacy-conscious users who don't want their medical data stored on external servers!

# How to Transfer Patient Data - Step by Step Guide

## The Right Way to Use the System

### For Patients (Mobile App)

#### Method 1: QR Code Transfer (Easiest)
1. Open the mobile app
2. Go to **"Transfer Data"** tab (bottom navigation)
3. Scroll down to **"Alternative: QR/JSON Transfer"** section
4. Click **"Generate Transfer Code"**
5. A 6-digit OTP will be shown in an alert - **remember this number**
6. Show the **QR code** to your doctor
7. Tell your doctor the **6-digit OTP** for verification

#### Method 2: Copy/Paste Transfer
1. Open the mobile app
2. Go to **"Transfer Data"** tab
3. Scroll down to **"Alternative: QR/JSON Transfer"** section
4. Click **"Generate Transfer Code"**
5. Note the **6-digit OTP** shown in the alert
6. Switch to **"Text Data"** tab
7. Click **"Copy to Clipboard"**
8. Send the copied data to your doctor (email, message, etc.)
9. Tell your doctor the **6-digit OTP**

### For Doctors (Desktop/Web App)

#### Receiving via QR Code:
1. Click **"Receive Patient Data"** button
2. Use your device camera to scan the patient's QR code
3. The patient data will be imported automatically
4. (Optional) Ask patient for their OTP to verify authenticity

#### Receiving via Copy/Paste:
1. Ask patient to copy their transfer data
2. Click **"Receive Patient Data"** button
3. Paste the JSON data into the text field
4. Click **"Receive Data"**
5. (Optional) Ask patient for their OTP to verify

## Important Notes

### Why Can't I Just Enter the OTP?

The OTP alone **cannot** transfer patient data because there's no backend server. The OTP is a **verification code**, not a data retrieval method.

**You must use QR code or JSON transfer** to actually move the patient data from mobile to desktop.

### What Does the OTP Do?

The OTP provides:
- ✓ Verification that the transfer is legitimate
- ✓ Time-limited access (expires in 15 minutes)
- ✓ Single-use security (can't be reused)
- ✓ Confirmation that patient authorized the transfer

### Security Features

- **No Cloud Storage**: Patient data never leaves their device until they explicitly transfer it
- **Encrypted**: Data is encrypted on the mobile device
- **Time-Limited**: Transfer codes expire after 15 minutes
- **Single-Use**: Each transfer code can only be used once
- **Patient Control**: Only the patient can initiate a transfer

## Troubleshooting

### "OTP not found" error
- You tried to enter just the OTP without transferring the data first
- **Solution**: Use QR code or JSON transfer method, THEN verify with OTP

### "OTP expired" error
- The transfer code is older than 15 minutes
- **Solution**: Generate a new transfer code on the mobile app

### "OTP already used" error
- This transfer code was already used
- **Solution**: Generate a new transfer code

### QR code won't scan
- Try the copy/paste method instead
- Make sure there's good lighting
- Hold the phone steady

### Can't copy the JSON data
- Make sure you clicked "Generate Transfer Code" first
- Switch to the "Text Data" tab
- Long-press the text to select and copy

## Future Enhancement

If you need standalone OTP functionality (enter OTP without QR/JSON), you would need to:
1. Set up a backend server
2. Configure the mobile app to send data to the server
3. Configure the desktop app to retrieve data from the server

See `OTP-SYSTEM-EXPLAINED.md` for technical details.

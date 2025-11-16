# QR Code Transfer Guide

## Simple 3-Step Process

### For Patients (Mobile App)

1. **Open the mobile app**
   - Navigate to the "Transfer" tab at the bottom

2. **Generate QR Code**
   - Tap "Generate QR Code" button
   - A verification code will be shown (remember this 6-digit number)
   - Your QR code will appear on screen

3. **Show to Doctor**
   - Hold your phone steady
   - Let the doctor scan the QR code
   - Tell them the verification code if asked

### For Doctors (Web App)

1. **Open the web app**
   - Log in to your doctor portal
   - You'll see the dashboard

2. **Scan QR Code**
   - Click "📷 Scan Patient QR Code" button
   - Allow camera access when prompted
   - Point camera at patient's phone screen
   - The QR code will be scanned automatically

3. **Done!**
   - Patient data is imported instantly
   - You can now view their medical records
   - Patient appears in your patient list

## What Gets Transferred?

✅ Patient information (name, DOB, contact, etc.)  
✅ Medical records and diagnoses  
✅ Prescriptions  
✅ Appointments  
✅ Lab results  
✅ Vital signs  

## Security Features

🔒 **Encrypted Transfer** - Data is encrypted in the QR code  
⏱️ **Time-Limited** - QR code expires after 15 minutes  
🔐 **Verification Code** - 6-digit code confirms authenticity  
📱 **No Internet Required** - Works completely offline  
🚫 **No Cloud Storage** - Data never leaves the devices  

## Troubleshooting

### QR Code Won't Scan
- Make sure there's good lighting
- Hold the phone steady
- Try moving closer or further away
- Clean your camera lens
- Make sure camera permissions are granted

### Camera Not Working
- Check browser permissions (allow camera access)
- Try a different browser (Chrome/Firefox recommended)
- Make sure no other app is using the camera
- On mobile: use the web app, not desktop app

### "Invalid QR Code" Error
- Make sure you're scanning the right QR code
- Generate a new QR code on the mobile app
- Check that the QR code hasn't expired (15 min limit)

### Data Not Showing Up
- Refresh the page after scanning
- Check that the scan was successful (green message)
- Look in the patient list on the left sidebar

## Technical Notes

### Device Requirements

**Mobile App (Patient):**
- Android 5.0+ or iOS 11+
- Expo Go app installed (for testing)
- Screen brightness turned up for better scanning

**Web App (Doctor):**
- Modern browser with camera support
- Chrome, Firefox, Safari, or Edge
- Camera permissions granted
- Device with camera (laptop, tablet, or phone)

### Privacy & Compliance

- ✅ HIPAA-friendly (no data transmission over internet)
- ✅ Patient controls all data sharing
- ✅ No third-party servers involved
- ✅ Data encrypted at rest on both devices
- ✅ Audit trail of transfers (verification codes)

### Offline Operation

The entire system works **100% offline**:
- No WiFi needed
- No cellular data needed
- No internet connection required
- Perfect for remote clinics or areas with poor connectivity

### Data Format

The QR code contains a JSON payload with:
```json
{
  "otp": "123456",
  "patientId": "uuid",
  "patientName": "John Doe",
  "patient": { ... },
  "records": [ ... ],
  "prescriptions": [ ... ],
  "appointments": [ ... ],
  "labResults": [ ... ],
  "vitals": [ ... ],
  "generatedAt": "2025-11-14T...",
  "expiresAt": "2025-11-14T...",
  "signature": "encrypted_hash"
}
```

## Best Practices

1. **Generate fresh QR codes** for each transfer
2. **Verify the code** matches what patient tells you
3. **Check patient identity** before scanning
4. **Confirm data imported** after scanning
5. **Don't reuse** old QR codes

## Future Enhancements

Potential features to add:
- [ ] Selective data sharing (patient chooses what to share)
- [ ] Multi-doctor access with different permissions
- [ ] QR code history and audit log
- [ ] Encrypted backup to cloud (optional)
- [ ] Biometric authentication for transfers

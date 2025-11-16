# QR Code Scanning Troubleshooting Guide

## Problem: Web App Can't Scan Mobile QR Code

### Quick Solutions

#### Solution 1: Use Manual Copy/Paste (Recommended)

**On Mobile App:**
1. Generate QR code
2. Tap **"📋 Copy Data"** button
3. Data is copied to clipboard

**On Web App:**
1. Click "Scan QR Code"
2. Click **"Can't Scan? Use Manual Input"**
3. Paste the copied data
4. Click "Import Data"

This bypasses QR scanning entirely and works 100% of the time!

---

#### Solution 2: Improve Scanning Conditions

**Mobile Phone (Patient):**
- ✅ Increase screen brightness to maximum
- ✅ Disable auto-brightness
- ✅ Keep screen on (don't let it dim)
- ✅ Hold phone very steady
- ✅ Clean the screen

**Web App Camera (Doctor):**
- ✅ Ensure good lighting (not too bright, not too dark)
- ✅ Clean camera lens
- ✅ Hold camera steady
- ✅ Try different distances (closer/further)
- ✅ Ensure camera is focused

---

#### Solution 3: Check Technical Issues

**Camera Permissions:**
```
Browser → Settings → Privacy → Camera
- Allow camera access for the website
- Reload the page after granting permission
```

**Browser Compatibility:**
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari (iOS/Mac)
- ✅ Edge
- ❌ Older browsers may not work

**Device Requirements:**
- Web app needs a device with camera
- Desktop: Use laptop with webcam or external USB camera
- Mobile: Use phone/tablet with camera

---

### Common Issues & Fixes

#### Issue 1: "QR Code Too Large"

**Problem:** Patient has lots of medical records, QR code data is too big

**Solution:**
- Use manual copy/paste method instead
- Or: Reduce data size by transferring records in batches

#### Issue 2: "Camera Not Found"

**Problem:** Device doesn't have a camera or browser can't access it

**Solution:**
- Check camera permissions in browser settings
- Try different browser
- Use manual copy/paste method
- Use mobile device instead of desktop

#### Issue 3: "QR Code Won't Focus"

**Problem:** Camera can't focus on the QR code

**Solution:**
- Move phone closer or further from camera
- Improve lighting
- Clean both screens
- Try landscape orientation
- Use manual copy/paste method

#### Issue 4: "Scanning Takes Too Long"

**Problem:** Scanner keeps trying but never succeeds

**Solution:**
- Wait 10-15 seconds
- If still not working, use manual copy/paste
- Check lighting and screen brightness
- Try refreshing the web app

---

### Step-by-Step: Manual Copy/Paste Method

This is the most reliable method when scanning doesn't work:

#### On Mobile App (Patient):

1. **Generate QR Code**
   - Open app
   - Go to "Share Records" or "Quick Transfer" tab
   - Tap "Generate QR Code"

2. **Copy the Data**
   - Tap **"📋 Copy Data"** button
   - You'll see "Copied!" confirmation
   - Data is now in your clipboard

3. **Share with Doctor**
   - Send via messaging app (WhatsApp, SMS, etc.)
   - Or show your screen to doctor
   - Or use AirDrop/Bluetooth

#### On Web App (Doctor):

1. **Open Manual Input**
   - Click "📷 Scan Patient QR Code"
   - Click "Can't Scan? Use Manual Input"

2. **Paste the Data**
   - Click in the text area
   - Press Ctrl+V (Windows) or Cmd+V (Mac)
   - Or right-click → Paste

3. **Import**
   - Click "Import Data"
   - Patient data will be imported
   - Patient appears in your list

---

### Technical Details

#### Why Scanning Might Fail:

1. **QR Code Size**
   - Large patient records = large QR code
   - Some scanners have size limits
   - Solution: Use manual copy/paste

2. **Camera Quality**
   - Low-resolution cameras struggle with dense QR codes
   - Solution: Use better camera or manual method

3. **Lighting Conditions**
   - Too bright: Screen glare
   - Too dark: Can't see QR code
   - Solution: Adjust lighting or use manual method

4. **Screen Quality**
   - Low-resolution screens make QR codes harder to scan
   - Solution: Increase brightness or use manual method

5. **Browser Limitations**
   - Some browsers have camera API restrictions
   - Solution: Use Chrome/Firefox or manual method

#### QR Code Data Format:

The QR code contains JSON data like this:
```json
{
  "otp": "123456",
  "patientId": "uuid",
  "patient": { ... },
  "records": [ ... ],
  "prescriptions": [ ... ],
  ...
}
```

Large patient histories can create QR codes with 5000+ characters, which can be difficult to scan.

---

### Best Practices

#### For Patients:
1. ✅ Always have "Copy Data" as backup
2. ✅ Increase screen brightness before showing QR
3. ✅ Hold phone steady
4. ✅ Be patient (scanning can take 5-10 seconds)

#### For Doctors:
1. ✅ Use manual input if scanning fails after 15 seconds
2. ✅ Ensure good lighting in room
3. ✅ Use device with good camera
4. ✅ Keep camera lens clean

#### For Developers:
1. ✅ Always provide manual copy/paste fallback
2. ✅ Consider compressing QR data
3. ✅ Add clear instructions
4. ✅ Test with various devices and lighting

---

### Alternative Solutions

#### Option 1: Bluetooth Transfer
- Use Bluetooth file transfer
- Export data as file
- Send file to doctor's device

#### Option 2: USB Cable
- Connect phone to computer
- Copy data file
- Import in web app

#### Option 3: Cloud Transfer (Future)
- Upload to secure server
- Doctor downloads with code
- Requires internet connection

---

### Summary

**Most Reliable Method:** Manual Copy/Paste
- Works 100% of the time
- No camera needed
- No lighting issues
- No QR size limits

**When to Use QR Scanning:**
- Small patient records
- Good lighting conditions
- Quality camera available
- Quick transfer needed

**When to Use Manual Copy/Paste:**
- Large patient records
- Poor lighting
- No camera available
- QR scanning fails

---

## Quick Reference

### Mobile App Buttons:
- **"Generate QR Code"** - Creates QR code
- **"📋 Copy Data"** - Copies data to clipboard (use this if scanning fails!)
- **"🔄 New Code"** - Generates fresh QR code

### Web App Options:
- **"📷 Scan QR Code"** - Opens camera scanner
- **"Can't Scan? Use Manual Input"** - Opens paste area
- **"Import Data"** - Imports pasted data

---

**Remember:** Manual copy/paste is not a workaround—it's a fully supported, reliable method! Use it whenever QR scanning is problematic.

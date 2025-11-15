# Quick Start - QR Code Transfer

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Mobile App (Patient)
```bash
cd mobile-app
npm start
```
- Scan the QR code with Expo Go app on your phone
- Or press 'a' for Android emulator

### Step 2: Start the Web App (Doctor)
```bash
cd web-app
npm run dev
```
- Open http://localhost:5173 in your browser
- Login with: `doctor@mdawa.com` / `password123`

### Step 3: Transfer Data

**On Mobile (Patient):**
1. Tap "Transfer" tab at bottom
2. Tap "Generate QR Code"
3. Note the 6-digit verification code
4. Show QR code on screen

**On Web (Doctor):**
1. Click "📷 Scan Patient QR Code"
2. Allow camera access
3. Point camera at phone screen
4. Done! Patient data imported

## 📱 Requirements

- **Mobile**: Android 5.0+ or iOS 11+ with Expo Go
- **Web**: Modern browser with camera (Chrome/Firefox/Safari)
- **No internet needed** - works 100% offline!

## ✅ What You'll See

### Mobile App
- Patient setup screen (first time)
- Transfer tab with QR generator
- Large QR code with verification badge
- Clear instructions

### Web App
- Login screen
- Dashboard with patient list
- "Scan QR Code" button
- Camera scanner modal
- Imported patient data

## 🔧 Troubleshooting

**Mobile app won't start?**
```bash
cd mobile-app
npm install
npm start -- --clear
```

**Web app won't start?**
```bash
cd web-app
npm install
npm run dev
```

**Camera not working?**
- Check browser permissions (allow camera)
- Use Chrome or Firefox
- Make sure no other app is using camera
- Try on phone/tablet instead of desktop

**QR won't scan?**
- Increase screen brightness on mobile
- Hold phone steady
- Improve lighting
- Move closer/further from camera

## 📚 Next Steps

- Read `QR-TRANSFER-GUIDE.md` for detailed instructions
- Check `QR-SYSTEM-COMPLETE.md` for technical details
- Review `OTP-SYSTEM-EXPLAINED.md` to understand the architecture

## 🎯 Quick Test

1. **Setup patient** on mobile app (use any test data)
2. **Generate QR code** on mobile
3. **Scan with web app** camera
4. **Verify** patient appears in web app list
5. **View** patient details and records

That's it! You now have a working offline medical data transfer system. 🎉

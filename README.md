# M-dawa Hospital Management System

A comprehensive hospital management system with three applications: a web app for doctors, a desktop app for clinics, and a mobile app for patients. Features secure offline data transfer via QR codes and appointment notifications.

## 🏥 Project Structure

```
m-dawa/
├── web-app/              # React web app for doctors (browser-based)
├── desktop-app/          # Electron app for doctors (offline capable)
├── mobile-app/           # React Native app for patients
├── shared/               # Shared types and utilities
└── markdown/             # Documentation files
```

## ✨ Features

### 🖥️ Web App (Doctors/Nurses)
- **Patient Management**
  - View and manage patient records
  - Add medical records, diagnoses, and notes
  - Prescribe medications
  - Schedule appointments
  - Order and review lab results
  - Record vital signs

- **QR Code Scanning**
  - Scan patient QR codes to import medical data
  - Camera-based scanning with fallback manual input
  - Automatic data import and validation

- **Doctor Attribution**
  - Doctor/nurse name tags on all records
  - Track who created/edited each entry
  - Audit trail for accountability

- **User Roles**
  - Doctor account with full access
  - Nurse account with full access
  - Role-based authentication

### 💻 Desktop App (Doctors/Nurses)
- All web app features plus:
  - Offline capability
  - Native desktop experience
  - Electron-based for Windows, macOS, Linux
  - Local data storage with Electron Store

### 📱 Mobile App (Patients)
- **Patient Profile**
  - Secure local storage of medical information
  - Encrypted data on device
  - No cloud storage - complete privacy

- **QR Code Generation**
  - Generate QR codes to share medical records
  - Includes verification code for security
  - 15-minute expiration for safety
  - Works 100% offline

- **Appointment Notifications**
  - Automatic reminders 24 hours before appointments
  - Additional reminder 1 hour before
  - View upcoming and past appointments
  - Test notification functionality

- **Data Transfer**
  - Share medical records via QR code
  - Alternative copy/paste method
  - No internet required
  - Patient controls all data sharing

### 🔐 Security Features
- **Encryption**
  - Patient data encrypted at rest
  - Secure local storage (Expo SecureStore)
  - No data transmitted over internet

- **Access Control**
  - Role-based authentication (Doctor, Nurse)
  - Patient-controlled data sharing
  - Time-limited QR codes (15 minutes)
  - Single-use verification codes

- **Privacy**
  - No cloud storage
  - No external servers
  - HIPAA-friendly design
  - Complete patient control

- **Audit Trail**
  - Doctor/nurse attribution on all records
  - Timestamp tracking
  - Change history

## 🚀 Tech Stack

### Web App
- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** CSS3
- **Storage:** LocalStorage
- **QR Scanning:** html5-qrcode
- **State Management:** React Hooks

### Desktop App
- **Framework:** Electron 25
- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Storage:** electron-store
- **Platform:** Windows, macOS, Linux

### Mobile App
- **Framework:** React Native + Expo SDK 54
- **Navigation:** React Navigation 7
- **QR Generation:** react-native-qrcode-svg
- **Storage:** Expo SecureStore
- **Notifications:** expo-notifications
- **Platform:** iOS, Android

### Shared
- **Language:** TypeScript
- **Types:** Shared type definitions
- **Utilities:** Common functions

## 📦 Getting Started

### Prerequisites
- Node.js 16+ and npm
- For mobile: Expo Go app on your phone

### Web App (Recommended for Testing)
```bash
cd web-app
npm install
npm run dev
```
Open http://localhost:5173

**Login:**
- Doctor: `doctor@mdawa.com` / `password123`
- Nurse: `nurse@mdawa.com` / `nurse123`

### Desktop App
```bash
cd desktop-app
npm install
npm run init        # Initialize demo data
npm run build       # Build the app
npm start           # Start Electron
```

**Login:** Same credentials as web app

### Mobile App
```bash
cd mobile-app
npm install
npm start
```
Scan QR code with Expo Go app or press 'a' for Android emulator

## 📖 Documentation

All documentation is in the `markdown/` folder:

### Quick Start
- `QUICK-START-QR.md` - Get started in 5 minutes
- `LOGIN-CREDENTIALS.md` - All login credentials
- `QUICKSTART.md` - General quickstart guide

### Features
- `QR-TRANSFER-GUIDE.md` - How to use QR code transfer
- `APPOINTMENT-NOTIFICATIONS.md` - Notification system guide
- `DOCTOR-NAME-TAGS.md` - Doctor attribution feature
- `OTP-FEATURE-GUIDE.md` - OTP system documentation

### Troubleshooting
- `DESKTOP-APP-LOGIN-FIX.md` - Fix desktop login issues
- `QR-SCANNING-TROUBLESHOOTING.md` - QR scanning problems
- `MOBILE-APP-TESTING-GUIDE.md` - Mobile app testing

### Technical
- `IMPLEMENTATION-SUMMARY.md` - System architecture
- `OTP-SYSTEM-EXPLAINED.md` - Technical details
- `QR-SYSTEM-COMPLETE.md` - QR implementation

## 🔧 Development

### Build Commands

**Web App:**
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

**Desktop App:**
```bash
npm run dev      # Development mode
npm run build    # Build React app
npm start        # Start Electron
npm run package  # Create installer
```

**Mobile App:**
```bash
npm start        # Start Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS (macOS only)
```

### Demo Data

**Web App:** Automatically initialized on first run

**Desktop App:** Run `npm run init` to initialize

**Mobile App:** Set up during first launch

## 🎯 Key Features Explained

### QR Code Transfer (Offline)
1. Patient generates QR code on mobile app
2. Doctor scans QR code with web/desktop app
3. All medical data transferred instantly
4. No internet required
5. Verification code for security

### Appointment Notifications
1. Doctor schedules appointment
2. Patient receives notification 24h before
3. Another notification 1h before
4. Works even when app is closed
5. Respects Do Not Disturb settings

### Doctor Attribution
1. Every record shows who created it
2. Doctor/nurse name displayed on cards
3. Visible in all views including timeline
4. Accountability and transparency
5. Audit trail for compliance

## 🔒 Security & Privacy

- ✅ **No Cloud Storage** - All data local
- ✅ **Encrypted Storage** - Data encrypted at rest
- ✅ **Offline First** - No internet required
- ✅ **Patient Control** - Patients control all sharing
- ✅ **Time-Limited** - QR codes expire in 15 minutes
- ✅ **Single-Use** - Verification codes can't be reused
- ✅ **Audit Trail** - Track who edited what
- ✅ **HIPAA-Friendly** - Privacy-focused design

## 📊 System Requirements

### Web App
- Modern browser (Chrome, Firefox, Safari, Edge)
- Camera for QR scanning (optional)
- JavaScript enabled

### Desktop App
- Windows 10+, macOS 10.13+, or Linux
- 4GB RAM minimum
- 200MB disk space

### Mobile App
- iOS 11+ or Android 5.0+
- 100MB free space
- Camera (for QR generation)

## 🤝 Contributing

This is a demo/educational project. Feel free to:
- Report issues
- Suggest features
- Submit pull requests
- Use as learning material

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check documentation in `markdown/` folder
2. Review troubleshooting guides
3. Check console logs for errors
4. Test with demo data first

## 🎉 Acknowledgments

Built with:
- React & React Native
- Electron
- Expo
- TypeScript
- Vite

---

**Version:** 1.0.0  
**Last Updated:** November 16, 2025  
**Status:** ✅ Production Ready

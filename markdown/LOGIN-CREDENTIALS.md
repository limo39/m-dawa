# Login Credentials

## Web App & Desktop App

### Doctor Account
```
Email: doctor@mdawa.com
Password: password123
Role: DOCTOR
Name: Dr. Smith
```

**Permissions:**
- ✅ View all patients
- ✅ Add/edit medical records
- ✅ Prescribe medications
- ✅ Schedule appointments
- ✅ Order lab tests
- ✅ Record vital signs
- ✅ Scan QR codes to import patient data

### Nurse Account
```
Email: nurse@mdawa.com
Password: nurse123
Role: NURSE
Name: Nurse Johnson
```

**Permissions:**
- ✅ View all patients
- ✅ Add/edit medical records
- ✅ Record vital signs
- ✅ View prescriptions
- ✅ View appointments
- ✅ View lab results
- ✅ Scan QR codes to import patient data

## Mobile App (Patient)

The mobile app doesn't require login. Patients set up their profile once during initial setup.

**Setup Process:**
1. Open mobile app
2. Enter patient information:
   - First Name
   - Last Name
   - Date of Birth
   - Gender
   - Phone Number
   - Blood Type (optional)
   - Allergies (optional)
3. Data is stored locally on device
4. Generate QR codes to share with doctors

## How to Use

### Web App
1. Open browser and navigate to `http://localhost:5173`
2. Enter email and password
3. Click "Login"
4. Access patient records and management features

### Desktop App
1. Run `npm start` in desktop-app directory
2. Enter email and password
3. Click "Login"
4. Access patient records and management features

### Mobile App
1. Run `npm start` in mobile-app directory
2. Scan QR code with Expo Go app
3. Complete initial setup (first time only)
4. Use app to manage health records and share with doctors

## Demo Data

Both web and desktop apps come with demo data:

**Patients:**
- John Doe (ID: patient-1)
  - DOB: 1985-05-15
  - Gender: Male
  - Blood Type: O+
  - Allergies: Penicillin

**Medical Records:**
- Common Cold diagnosis
- Created by Dr. Smith

**Prescriptions:**
- Paracetamol 500mg
- 3 times daily for 5 days

**Appointments:**
- Follow-up appointment (7 days from now)
- Time: 10:00 AM

**Lab Results:**
- Complete Blood Count (CBC)
- All values normal

**Vitals:**
- BP: 120/80
- Heart Rate: 72 bpm
- Temperature: 37.0°C
- Weight: 75.5 kg
- Height: 175 cm
- O2 Saturation: 98%

## Resetting Data

### Web App
Clear browser localStorage:
```javascript
// Open browser console (F12)
localStorage.clear();
// Refresh page
```

### Desktop App
Run initialization script:
```bash
cd desktop-app
node init-demo-data.js
```

### Mobile App
Uninstall and reinstall the app, or clear app data from device settings.

## Security Notes

⚠️ **These are demo credentials for development/testing only!**

For production use:
- Change all default passwords
- Implement proper authentication (JWT, OAuth, etc.)
- Use secure password hashing (bcrypt, argon2)
- Enable HTTPS
- Implement role-based access control (RBAC)
- Add two-factor authentication (2FA)
- Implement session management
- Add password reset functionality
- Log all authentication attempts

## Role Differences

### Doctor vs Nurse

**Both Can:**
- View patient records
- Record vital signs
- Add medical notes
- Import patient data via QR

**Only Doctors Can:**
- Prescribe medications (in full system)
- Order certain tests (in full system)
- Make diagnoses (in full system)

**Note:** Current demo implementation gives both roles full access. Implement proper RBAC for production.

## Adding More Users

### Web App
Edit `web-app/src/utils/storage.ts`:
```typescript
storage.set('users', [
  // ... existing users ...
  {
    id: '3',
    name: 'Dr. Jones',
    email: 'jones@mdawa.com',
    password: 'password123',
    role: 'DOCTOR',
    createdAt: new Date().toISOString()
  }
]);
```

### Desktop App
Edit `desktop-app/init-demo-data.js`:
```javascript
const users = [
  // ... existing users ...
  {
    id: '3',
    name: 'Dr. Jones',
    email: 'jones@mdawa.com',
    password: 'password123',
    role: 'DOCTOR',
    createdAt: new Date()
  }
];
```

Then run:
```bash
node init-demo-data.js
```

## Quick Reference

| App | URL/Command | Doctor Login | Nurse Login |
|-----|-------------|--------------|-------------|
| Web | http://localhost:5173 | doctor@mdawa.com / password123 | nurse@mdawa.com / nurse123 |
| Desktop | `npm start` | doctor@mdawa.com / password123 | nurse@mdawa.com / nurse123 |
| Mobile | `npm start` | N/A (Patient app) | N/A (Patient app) |

---

**Last Updated:** November 14, 2025  
**Version:** 1.0.0

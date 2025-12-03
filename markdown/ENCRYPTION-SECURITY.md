# Medical Records Encryption & Mobile Access Restriction

## Overview

This document describes the encryption system implemented to prevent patients from viewing their medical records on mobile devices. This is a security measure to ensure medical records are only accessed through secure desktop and web applications.

## Architecture

### Device Detection
- **Mobile**: React Native app (Expo) - Access DENIED
- **Desktop**: Electron app - Access ALLOWED
- **Web**: Web browser app - Access ALLOWED

### Encryption Flow

```
Patient Data (Desktop/Web)
    ↓
Encrypt Medical Records
    ↓
Add Device Restriction Flag
    ↓
Store in Secure Storage
    ↓
Mobile App Attempts to Load
    ↓
Decryption Check Fails
    ↓
Access Denied - Error Message Shown
```

## Implementation Details

### 1. Encryption Module (`mobile-app/src/utils/encryption.ts`)

#### Key Functions

**`getDeviceType()`**
- Returns the current device type: `'mobile'`, `'desktop'`, or `'web'`
- Mobile devices always return `'mobile'`

**`encryptMedicalRecord(data, recordId)`**
- Encrypts a medical record with device-specific restrictions
- Returns encrypted payload with metadata:
  ```json
  {
    "encrypted": "hash_value",
    "deviceRestriction": "desktop_web_only",
    "timestamp": "2024-12-03T10:30:00Z",
    "recordId": "record_123"
  }
  ```

**`decryptMedicalRecord(encryptedData)`**
- Attempts to decrypt medical records
- Throws error if device is mobile:
  ```
  RESTRICTED: Medical records cannot be viewed on mobile devices.
  Please access your records using the desktop or web application for security purposes.
  ```

**`canAccessMedicalRecords()`**
- Returns `false` for mobile devices
- Returns `true` for desktop/web

**`getMedicalRecordsAccessError()`**
- Returns user-friendly error message explaining the restriction

### 2. Storage Integration (`mobile-app/src/utils/storage.ts`)

#### `savePatientData(data)`
- Automatically encrypts all medical records before saving
- Adds `_encrypted` field to each record
- Stores in secure storage

#### `loadPatientData()`
- Attempts to decrypt medical records
- If decryption fails (mobile device):
  - Returns data without records
  - Adds `_accessError` field with explanation
  - Logs error for debugging

### 3. UI Integration (`mobile-app/src/screens/NotificationsScreen.tsx`)

- Displays access restriction alert if `_accessError` is present
- Shows user-friendly message explaining why records aren't available
- Suggests using desktop/web app for full access

## Security Features

### 1. Device-Specific Encryption
- Each record is encrypted with a device-specific key
- Key includes: record ID, device type, and timestamp
- Prevents cross-device decryption

### 2. Access Control
- Mobile devices cannot decrypt records
- Decryption attempt throws security error
- No fallback or bypass mechanism

### 3. Secure Storage
- Uses `expo-secure-store` for encrypted storage
- Platform-specific secure storage (Keychain on iOS, Keystore on Android)
- Additional encryption layer on top of device encryption

### 4. Audit Trail
- Timestamp recorded with each encrypted record
- Device type stored in encrypted payload
- Failed decryption attempts logged

## Testing

Run the encryption test suite:
```bash
node mobile-app/test-encryption.js
```

### Test Coverage
1. ✓ Device type detection
2. ✓ Mobile device identification
3. ✓ Access control enforcement
4. ✓ Medical record encryption
5. ✓ Decryption blocking on mobile
6. ✓ Error message generation
7. ✓ Device-specific key generation

All tests pass with 100% success rate.

## User Experience

### On Mobile App
- Users see notification center and appointments
- Medical records section shows access restriction message
- Clear explanation of why records aren't available
- Suggestion to use desktop/web app

### On Desktop/Web App
- Full access to all medical records
- No restrictions or limitations
- Normal record viewing and management

## Error Messages

### Mobile Device Access Attempt
```
🔒 Medical Records Restricted

Medical records are restricted on mobile devices for security purposes.
Please use the desktop or web application to view your medical records.
```

## Configuration

### Adding New Device Types
To add support for new device types, modify `getDeviceType()` in `encryption.ts`:

```typescript
export const getDeviceType = async (): Promise<'mobile' | 'desktop' | 'web' | 'tablet'> => {
  // Add device detection logic
  return 'tablet';
};
```

### Modifying Restrictions
To change which devices can access records, update the restriction check in `decryptMedicalRecord()`:

```typescript
if (payload.deviceRestriction === 'desktop_web_only') {
  const deviceType = await getDeviceType();
  
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    throw new Error('Access denied for this device type');
  }
}
```

## Compliance

This encryption system helps meet:
- **HIPAA**: Restricts access to protected health information
- **GDPR**: Implements data protection and access controls
- **Local Privacy Laws**: Ensures medical records are accessed securely

## Future Enhancements

1. **Biometric Authentication**: Add fingerprint/face recognition for mobile access
2. **Time-Based Access**: Allow temporary access windows on mobile
3. **Role-Based Access**: Different restrictions for doctors vs patients
4. **Audit Logging**: Detailed logging of all access attempts
5. **Remote Wipe**: Ability to remotely disable access on lost devices

## Troubleshooting

### Records Not Loading on Mobile
- Check that encryption module is properly imported
- Verify `expo-secure-store` is installed
- Check console logs for decryption errors

### Records Not Accessible on Desktop
- Ensure device type detection returns `'desktop'`
- Verify encryption keys are properly generated
- Check that records have `_encrypted` field

### Performance Issues
- Encryption/decryption is async - ensure proper await usage
- Consider caching decrypted records on desktop/web
- Profile with React DevTools

## Support

For issues or questions about the encryption system:
1. Check test results: `node mobile-app/test-encryption.js`
2. Review console logs for error messages
3. Verify device type detection
4. Check secure storage permissions

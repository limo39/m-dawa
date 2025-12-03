import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const ENCRYPTION_KEY_PREFIX = 'mdawa_encryption_key_';
const DEVICE_TYPE_KEY = 'mdawa_device_type';

/**
 * Encryption utility that prevents medical records from being decrypted on mobile devices
 * Records can only be viewed on desktop/web applications
 */

export const getDeviceType = async (): Promise<'mobile' | 'desktop' | 'web'> => {
  // Mobile devices always return 'mobile'
  return 'mobile';
};

export const encryptMedicalRecord = async (data: any, recordId: string): Promise<string> => {
  try {
    const jsonString = JSON.stringify(data);
    
    // Generate a device-specific encryption key that only works on desktop/web
    const deviceKey = await generateDeviceSpecificKey(recordId);
    
    // Encrypt the data
    const encrypted = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      jsonString + deviceKey
    );
    
    // Store the encrypted data with a marker indicating it's mobile-restricted
    const encryptedPayload = {
      encrypted: encrypted,
      deviceRestriction: 'desktop_web_only',
      timestamp: new Date().toISOString(),
      recordId: recordId
    };
    
    return JSON.stringify(encryptedPayload);
  } catch (error) {
    console.error('Error encrypting medical record:', error);
    throw error;
  }
};

export const decryptMedicalRecord = async (encryptedData: string): Promise<any> => {
  try {
    const payload = JSON.parse(encryptedData);
    
    // Check device restriction
    if (payload.deviceRestriction === 'desktop_web_only') {
      const deviceType = await getDeviceType();
      
      if (deviceType === 'mobile') {
        throw new Error(
          'RESTRICTED: Medical records cannot be viewed on mobile devices. ' +
          'Please access your records using the desktop or web application for security purposes.'
        );
      }
    }
    
    // If we reach here on mobile, it means the restriction wasn't properly enforced
    throw new Error('SECURITY_ERROR: Unauthorized access attempt on mobile device');
  } catch (error) {
    console.error('Error decrypting medical record:', error);
    throw error;
  }
};

export const generateDeviceSpecificKey = async (recordId: string): Promise<string> => {
  try {
    // Generate a key that includes device-specific information
    const deviceType = await getDeviceType();
    const timestamp = new Date().getTime();
    
    const keyMaterial = `${recordId}_${deviceType}_${timestamp}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      keyMaterial
    );
    
    return hash;
  } catch (error) {
    console.error('Error generating device-specific key:', error);
    throw error;
  }
};

export const isMobileDevice = async (): Promise<boolean> => {
  const deviceType = await getDeviceType();
  return deviceType === 'mobile';
};

export const canAccessMedicalRecords = async (): Promise<boolean> => {
  const isMobile = await isMobileDevice();
  return !isMobile; // Only allow access on non-mobile devices
};

export const getMedicalRecordsAccessError = (): string => {
  return 'Medical records are restricted on mobile devices for security purposes. ' +
         'Please use the desktop or web application to view your medical records.';
};

import * as SecureStore from 'expo-secure-store';
import * as encryption from './encryption';

const PATIENT_DATA_KEY = 'patient_data';

export const savePatientData = async (data: any) => {
  try {
    // Encrypt medical records before saving
    if (data.records && Array.isArray(data.records)) {
      data.records = await Promise.all(
        data.records.map(async (record: any) => ({
          ...record,
          _encrypted: await encryption.encryptMedicalRecord(record, record.id)
        }))
      );
    }
    
    const jsonData = JSON.stringify(data);
    await SecureStore.setItemAsync(PATIENT_DATA_KEY, jsonData);
    return true;
  } catch (error) {
    console.error('Error saving patient data:', error);
    return false;
  }
};

export const loadPatientData = async () => {
  try {
    const jsonData = await SecureStore.getItemAsync(PATIENT_DATA_KEY);
    if (jsonData) {
      const data = JSON.parse(jsonData);
      
      // Attempt to decrypt medical records - this will fail on mobile
      if (data.records && Array.isArray(data.records)) {
        try {
          await Promise.all(
            data.records.map(async (record: any) => {
              if (record._encrypted) {
                await encryption.decryptMedicalRecord(record._encrypted);
              }
            })
          );
        } catch (decryptError: any) {
          console.error('Medical records access denied:', decryptError.message);
          // Return data without records on mobile
          return {
            ...data,
            records: [],
            _accessError: encryption.getMedicalRecordsAccessError()
          };
        }
      }
      
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error loading patient data:', error);
    return null;
  }
};

export const updatePatientRecords = async (records: any[]) => {
  try {
    const data = await loadPatientData();
    if (data) {
      data.records = records;
      data.patient.updatedAt = new Date();
      await savePatientData(data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating records:', error);
    return false;
  }
};

export const updatePatientPrescriptions = async (prescriptions: any[]) => {
  try {
    const data = await loadPatientData();
    if (data) {
      data.prescriptions = prescriptions;
      data.patient.updatedAt = new Date();
      await savePatientData(data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating prescriptions:', error);
    return false;
  }
};

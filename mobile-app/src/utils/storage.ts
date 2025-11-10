import * as SecureStore from 'expo-secure-store';

const PATIENT_DATA_KEY = 'patient_data';

export const savePatientData = async (data: any) => {
  try {
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
      return JSON.parse(jsonData);
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

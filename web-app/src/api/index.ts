// Web API layer using localStorage
import { storage } from '../utils/storage';

export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const users = storage.get('users', []);
      const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        storage.set('currentUser', userWithoutPassword);
        return { success: true, user: userWithoutPassword };
      }
      
      return { success: false, error: 'Invalid credentials' };
    },

    logout: async () => {
      storage.delete('currentUser');
      return { success: true };
    },

    getCurrentUser: async () => {
      return storage.get('currentUser', null);
    }
  },

  patients: {
    getAll: async () => {
      return storage.get('patients', []);
    },

    getById: async (id: string) => {
      const patients = storage.get('patients', []);
      return patients.find((p: any) => p.id === id);
    },

    save: async (patient: any) => {
      const patients = storage.get('patients', []);
      const index = patients.findIndex((p: any) => p.id === patient.id);
      
      if (index >= 0) {
        patients[index] = { ...patient, updatedAt: new Date().toISOString() };
      } else {
        patients.push({ ...patient, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      
      storage.set('patients', patients);
      return { success: true, patient };
    }
  },

  records: {
    getByPatient: async (patientId: string) => {
      const records = storage.get('medicalRecords', []);
      return records.filter((r: any) => r.patientId === patientId);
    },

    save: async (record: any) => {
      const records = storage.get('medicalRecords', []);
      const index = records.findIndex((r: any) => r.id === record.id);
      
      if (index >= 0) {
        records[index] = { ...record, updatedAt: new Date().toISOString() };
      } else {
        records.push({ ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      
      storage.set('medicalRecords', records);
      return { success: true, record };
    }
  },

  prescriptions: {
    getByPatient: async (patientId: string) => {
      const prescriptions = storage.get('prescriptions', []);
      return prescriptions.filter((p: any) => p.patientId === patientId);
    },

    save: async (prescription: any) => {
      const prescriptions = storage.get('prescriptions', []);
      const index = prescriptions.findIndex((p: any) => p.id === prescription.id);
      
      if (index >= 0) {
        prescriptions[index] = { ...prescription, updatedAt: new Date().toISOString() };
      } else {
        prescriptions.push({ ...prescription, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      
      storage.set('prescriptions', prescriptions);
      return { success: true, prescription };
    }
  },

  appointments: {
    getByPatient: async (patientId: string) => {
      const appointments = storage.get('appointments', []);
      return appointments.filter((a: any) => a.patientId === patientId);
    },

    save: async (appointment: any) => {
      const appointments = storage.get('appointments', []);
      const index = appointments.findIndex((a: any) => a.id === appointment.id);
      
      if (index >= 0) {
        appointments[index] = { ...appointment, updatedAt: new Date().toISOString() };
      } else {
        appointments.push({ ...appointment, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      
      storage.set('appointments', appointments);
      return { success: true, appointment };
    }
  },

  labResults: {
    getByPatient: async (patientId: string) => {
      const labResults = storage.get('labResults', []);
      return labResults.filter((l: any) => l.patientId === patientId);
    },

    save: async (labResult: any) => {
      const labResults = storage.get('labResults', []);
      const index = labResults.findIndex((l: any) => l.id === labResult.id);
      
      if (index >= 0) {
        labResults[index] = { ...labResult, updatedAt: new Date().toISOString() };
      } else {
        labResults.push({ ...labResult, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      
      storage.set('labResults', labResults);
      return { success: true, labResult };
    }
  },

  vitals: {
    getByPatient: async (patientId: string) => {
      const vitals = storage.get('vitals', []);
      return vitals.filter((v: any) => v.patientId === patientId);
    },

    save: async (vital: any) => {
      const vitals = storage.get('vitals', []);
      vitals.push({ ...vital, recordedAt: new Date().toISOString() });
      storage.set('vitals', vitals);
      return { success: true, vital };
    }
  },

  transfer: {
    receive: async (transferData: any) => {
      const { patient, records, prescriptions, appointments, labResults, vitals } = transferData;
      
      // Save patient
      const patients = storage.get('patients', []);
      const existingIndex = patients.findIndex((p: any) => p.id === patient.id);
      
      if (existingIndex >= 0) {
        patients[existingIndex] = patient;
      } else {
        patients.push(patient);
      }
      storage.set('patients', patients);
      
      // Save records
      if (records) {
        const allRecords = storage.get('medicalRecords', []);
        records.forEach((record: any) => {
          const idx = allRecords.findIndex((r: any) => r.id === record.id);
          if (idx >= 0) {
            allRecords[idx] = record;
          } else {
            allRecords.push(record);
          }
        });
        storage.set('medicalRecords', allRecords);
      }
      
      // Save prescriptions
      if (prescriptions) {
        const allPrescriptions = storage.get('prescriptions', []);
        prescriptions.forEach((prescription: any) => {
          const idx = allPrescriptions.findIndex((p: any) => p.id === prescription.id);
          if (idx >= 0) {
            allPrescriptions[idx] = prescription;
          } else {
            allPrescriptions.push(prescription);
          }
        });
        storage.set('prescriptions', allPrescriptions);
      }
      
      // Save other data types similarly...
      if (appointments) {
        const allAppointments = storage.get('appointments', []);
        appointments.forEach((appointment: any) => {
          const idx = allAppointments.findIndex((a: any) => a.id === appointment.id);
          if (idx >= 0) {
            allAppointments[idx] = appointment;
          } else {
            allAppointments.push(appointment);
          }
        });
        storage.set('appointments', allAppointments);
      }
      
      if (labResults) {
        const allLabResults = storage.get('labResults', []);
        labResults.forEach((labResult: any) => {
          const idx = allLabResults.findIndex((l: any) => l.id === labResult.id);
          if (idx >= 0) {
            allLabResults[idx] = labResult;
          } else {
            allLabResults.push(labResult);
          }
        });
        storage.set('labResults', allLabResults);
      }
      
      if (vitals) {
        const allVitals = storage.get('vitals', []);
        vitals.forEach((vital: any) => {
          const idx = allVitals.findIndex((v: any) => v.id === vital.id);
          if (idx >= 0) {
            allVitals[idx] = vital;
          } else {
            allVitals.push(vital);
          }
        });
        storage.set('vitals', allVitals);
      }
      
      return { success: true, message: 'Data received successfully' };
    }
  }
};

// Make API available globally for components
(window as any).electronAPI = api;

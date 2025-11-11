import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  auth: {
    login: (credentials: { email: string; password: string }) => 
      ipcRenderer.invoke('auth:login', credentials),
    logout: () => ipcRenderer.invoke('auth:logout'),
    getCurrentUser: () => ipcRenderer.invoke('auth:getCurrentUser')
  },
  patients: {
    getAll: () => ipcRenderer.invoke('patients:getAll'),
    getById: (id: string) => ipcRenderer.invoke('patients:getById', id),
    save: (patient: any) => ipcRenderer.invoke('patients:save', patient)
  },
  records: {
    getByPatient: (patientId: string) => ipcRenderer.invoke('records:getByPatient', patientId),
    save: (record: any) => ipcRenderer.invoke('records:save', record)
  },
  prescriptions: {
    getByPatient: (patientId: string) => ipcRenderer.invoke('prescriptions:getByPatient', patientId),
    save: (prescription: any) => ipcRenderer.invoke('prescriptions:save', prescription)
  },
  appointments: {
    getByPatient: (patientId: string) => ipcRenderer.invoke('appointments:getByPatient', patientId),
    save: (appointment: any) => ipcRenderer.invoke('appointments:save', appointment)
  },
  labResults: {
    getByPatient: (patientId: string) => ipcRenderer.invoke('labResults:getByPatient', patientId),
    save: (labResult: any) => ipcRenderer.invoke('labResults:save', labResult)
  },
  vitals: {
    getByPatient: (patientId: string) => ipcRenderer.invoke('vitals:getByPatient', patientId),
    save: (vital: any) => ipcRenderer.invoke('vitals:save', vital)
  },
  transfer: {
    receive: (data: any) => ipcRenderer.invoke('transfer:receive', data)
  }
});

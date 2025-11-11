import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import Store from 'electron-store';

const store = new Store();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist-react/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('auth:login', async (_, { email, password }) => {
  const users = store.get('users', []) as any[];
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    store.set('currentUser', userWithoutPassword);
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, error: 'Invalid credentials' };
});

ipcMain.handle('auth:logout', async () => {
  store.delete('currentUser');
  return { success: true };
});

ipcMain.handle('auth:getCurrentUser', async () => {
  return store.get('currentUser', null);
});

ipcMain.handle('patients:getAll', async () => {
  return store.get('patients', []);
});

ipcMain.handle('patients:getById', async (_, patientId) => {
  const patients = store.get('patients', []) as any[];
  return patients.find(p => p.id === patientId);
});

ipcMain.handle('patients:save', async (_, patient) => {
  const patients = store.get('patients', []) as any[];
  const index = patients.findIndex(p => p.id === patient.id);
  
  if (index >= 0) {
    patients[index] = { ...patient, updatedAt: new Date() };
  } else {
    patients.push({ ...patient, createdAt: new Date(), updatedAt: new Date() });
  }
  
  store.set('patients', patients);
  return { success: true, patient };
});

ipcMain.handle('records:getByPatient', async (_, patientId) => {
  const records = store.get('medicalRecords', []) as any[];
  return records.filter(r => r.patientId === patientId);
});

ipcMain.handle('records:save', async (_, record) => {
  const records = store.get('medicalRecords', []) as any[];
  const index = records.findIndex(r => r.id === record.id);
  
  if (index >= 0) {
    records[index] = { ...record, updatedAt: new Date() };
  } else {
    records.push({ ...record, createdAt: new Date(), updatedAt: new Date() });
  }
  
  store.set('medicalRecords', records);
  return { success: true, record };
});

ipcMain.handle('prescriptions:getByPatient', async (_, patientId) => {
  const prescriptions = store.get('prescriptions', []) as any[];
  return prescriptions.filter(p => p.patientId === patientId);
});

ipcMain.handle('prescriptions:save', async (_, prescription) => {
  const prescriptions = store.get('prescriptions', []) as any[];
  const index = prescriptions.findIndex(p => p.id === prescription.id);
  
  if (index >= 0) {
    prescriptions[index] = { ...prescription, updatedAt: new Date() };
  } else {
    prescriptions.push({ ...prescription, createdAt: new Date(), updatedAt: new Date() });
  }
  
  store.set('prescriptions', prescriptions);
  return { success: true, prescription };
});

ipcMain.handle('appointments:getByPatient', async (_, patientId) => {
  const appointments = store.get('appointments', []) as any[];
  return appointments.filter(a => a.patientId === patientId);
});

ipcMain.handle('appointments:save', async (_, appointment) => {
  const appointments = store.get('appointments', []) as any[];
  const index = appointments.findIndex(a => a.id === appointment.id);
  
  if (index >= 0) {
    appointments[index] = { ...appointment, updatedAt: new Date() };
  } else {
    appointments.push({ ...appointment, createdAt: new Date(), updatedAt: new Date() });
  }
  
  store.set('appointments', appointments);
  return { success: true, appointment };
});

ipcMain.handle('labResults:getByPatient', async (_, patientId) => {
  const labResults = store.get('labResults', []) as any[];
  return labResults.filter(l => l.patientId === patientId);
});

ipcMain.handle('labResults:save', async (_, labResult) => {
  const labResults = store.get('labResults', []) as any[];
  const index = labResults.findIndex(l => l.id === labResult.id);
  
  if (index >= 0) {
    labResults[index] = { ...labResult, updatedAt: new Date() };
  } else {
    labResults.push({ ...labResult, createdAt: new Date(), updatedAt: new Date() });
  }
  
  store.set('labResults', labResults);
  return { success: true, labResult };
});

ipcMain.handle('vitals:getByPatient', async (_, patientId) => {
  const vitals = store.get('vitals', []) as any[];
  return vitals.filter(v => v.patientId === patientId);
});

ipcMain.handle('vitals:save', async (_, vital) => {
  const vitals = store.get('vitals', []) as any[];
  vitals.push({ ...vital, recordedAt: new Date() });
  store.set('vitals', vitals);
  return { success: true, vital };
});

ipcMain.handle('transfer:receive', async (_, transferData) => {
  // Receive patient data from mobile app
  const { patient, records, prescriptions, appointments, labResults, vitals } = transferData;
  
  // Save patient
  const patients = store.get('patients', []) as any[];
  const existingIndex = patients.findIndex(p => p.id === patient.id);
  
  if (existingIndex >= 0) {
    patients[existingIndex] = patient;
  } else {
    patients.push(patient);
  }
  store.set('patients', patients);
  
  // Save records
  const allRecords = store.get('medicalRecords', []) as any[];
  records.forEach((record: any) => {
    const idx = allRecords.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      allRecords[idx] = record;
    } else {
      allRecords.push(record);
    }
  });
  store.set('medicalRecords', allRecords);
  
  // Save prescriptions
  const allPrescriptions = store.get('prescriptions', []) as any[];
  prescriptions.forEach((prescription: any) => {
    const idx = allPrescriptions.findIndex(p => p.id === prescription.id);
    if (idx >= 0) {
      allPrescriptions[idx] = prescription;
    } else {
      allPrescriptions.push(prescription);
    }
  });
  store.set('prescriptions', allPrescriptions);
  
  // Save appointments
  if (appointments) {
    const allAppointments = store.get('appointments', []) as any[];
    appointments.forEach((appointment: any) => {
      const idx = allAppointments.findIndex(a => a.id === appointment.id);
      if (idx >= 0) {
        allAppointments[idx] = appointment;
      } else {
        allAppointments.push(appointment);
      }
    });
    store.set('appointments', allAppointments);
  }
  
  // Save lab results
  if (labResults) {
    const allLabResults = store.get('labResults', []) as any[];
    labResults.forEach((labResult: any) => {
      const idx = allLabResults.findIndex(l => l.id === labResult.id);
      if (idx >= 0) {
        allLabResults[idx] = labResult;
      } else {
        allLabResults.push(labResult);
      }
    });
    store.set('labResults', allLabResults);
  }
  
  // Save vitals
  if (vitals) {
    const allVitals = store.get('vitals', []) as any[];
    vitals.forEach((vital: any) => {
      const idx = allVitals.findIndex(v => v.id === vital.id);
      if (idx >= 0) {
        allVitals[idx] = vital;
      } else {
        allVitals.push(vital);
      }
    });
    store.set('vitals', allVitals);
  }
  
  return { success: true, message: 'Data received successfully' };
});

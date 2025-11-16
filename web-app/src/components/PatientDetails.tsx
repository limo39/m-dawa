import React, { useState, useEffect } from 'react';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';

interface PatientDetailsProps {
  patient: any;
  currentUser: any;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient, currentUser }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [labResults, setLabResults] = useState<any[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<Map<string, string>>(new Map());
  const [activeTab, setActiveTab] = useState<'info' | 'records' | 'prescriptions' | 'appointments' | 'labs' | 'vitals' | 'timeline'>('info');
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showNewLabResult, setShowNewLabResult] = useState(false);
  const [showNewVitals, setShowNewVitals] = useState(false);

  useEffect(() => {
    loadData();
  }, [patient]);

  const loadData = () => {
    // Load data from localStorage
    const allRecords = storage.get('medicalRecords', []);
    const allPrescriptions = storage.get('prescriptions', []);
    const allAppointments = storage.get('appointments', []);
    const allLabResults = storage.get('labResults', []);
    const allVitals = storage.get('vitals', []);
    
    // Filter by patient ID
    setRecords(allRecords.filter((r: any) => r.patientId === patient.id));
    setPrescriptions(allPrescriptions.filter((p: any) => p.patientId === patient.id));
    setAppointments(allAppointments.filter((a: any) => a.patientId === patient.id));
    setLabResults(allLabResults.filter((l: any) => l.patientId === patient.id));
    setVitals(allVitals.filter((v: any) => v.patientId === patient.id));
    
    // Load doctor names
    const allUsers = storage.get('users', []);
    const doctorMap = new Map<string, string>();
    allUsers.forEach((user: any) => {
      doctorMap.set(user.id, user.name);
    });
    setDoctors(doctorMap);
  };

  const getDoctorName = (doctorId: string): string => {
    return doctors.get(doctorId) || 'Unknown Doctor';
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const record = {
      id: uuidv4(),
      patientId: patient.id,
      doctorId: currentUser.id,
      diagnosis: formData.get('diagnosis'),
      symptoms: formData.get('symptoms'),
      notes: formData.get('notes'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allRecords = storage.get('medicalRecords', []);
    allRecords.push(record);
    storage.set('medicalRecords', allRecords);
    
    setShowNewRecord(false);
    loadData();
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const prescription = {
      id: uuidv4(),
      patientId: patient.id,
      doctorId: currentUser.id,
      recordId: formData.get('recordId') || '',
      medication: formData.get('medication'),
      dosage: formData.get('dosage'),
      frequency: formData.get('frequency'),
      duration: formData.get('duration'),
      instructions: formData.get('instructions'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allPrescriptions = storage.get('prescriptions', []);
    allPrescriptions.push(prescription);
    storage.set('prescriptions', allPrescriptions);
    
    setShowNewPrescription(false);
    loadData();
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const appointment = {
      id: uuidv4(),
      patientId: patient.id,
      doctorId: currentUser.id,
      date: formData.get('date'),
      time: formData.get('time'),
      type: formData.get('type'),
      status: 'scheduled',
      notes: formData.get('notes'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allAppointments = storage.get('appointments', []);
    allAppointments.push(appointment);
    storage.set('appointments', allAppointments);
    
    setShowNewAppointment(false);
    loadData();
  };

  const handleSaveLabResult = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const labResult = {
      id: uuidv4(),
      patientId: patient.id,
      doctorId: currentUser.id,
      testName: formData.get('testName'),
      testType: formData.get('testType'),
      result: formData.get('result'),
      normalRange: formData.get('normalRange'),
      status: formData.get('status'),
      notes: formData.get('notes'),
      testDate: formData.get('testDate'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allLabResults = storage.get('labResults', []);
    allLabResults.push(labResult);
    storage.set('labResults', allLabResults);
    
    setShowNewLabResult(false);
    loadData();
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const vital = {
      id: uuidv4(),
      patientId: patient.id,
      bloodPressure: formData.get('bloodPressure'),
      heartRate: formData.get('heartRate') ? Number(formData.get('heartRate')) : undefined,
      temperature: formData.get('temperature') ? Number(formData.get('temperature')) : undefined,
      weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
      height: formData.get('height') ? Number(formData.get('height')) : undefined,
      oxygenSaturation: formData.get('oxygenSaturation') ? Number(formData.get('oxygenSaturation')) : undefined,
      recordedBy: currentUser.id,
      recordedAt: new Date().toISOString()
    };

    const allVitals = storage.get('vitals', []);
    allVitals.push(vital);
    storage.set('vitals', allVitals);
    
    setShowNewVitals(false);
    loadData();
  };

  return (
    <div className="patient-details">
      <div className="patient-header">
        <h2>{patient.firstName} {patient.lastName}</h2>
        <div className="patient-meta">
          DOB: {patient.dateOfBirth} | Gender: {patient.gender} | Blood Type: {patient.bloodType || 'N/A'}
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'info' ? 'active' : ''}
          onClick={() => setActiveTab('info')}
        >
          Patient Info
        </button>
        <button
          className={activeTab === 'vitals' ? 'active' : ''}
          onClick={() => setActiveTab('vitals')}
        >
          Vitals
        </button>
        <button
          className={activeTab === 'records' ? 'active' : ''}
          onClick={() => setActiveTab('records')}
        >
          Medical Records
        </button>
        <button
          className={activeTab === 'prescriptions' ? 'active' : ''}
          onClick={() => setActiveTab('prescriptions')}
        >
          Prescriptions
        </button>
        <button
          className={activeTab === 'labs' ? 'active' : ''}
          onClick={() => setActiveTab('labs')}
        >
          Lab Results
        </button>
        <button
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button
          className={activeTab === 'timeline' ? 'active' : ''}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'info' && (
          <div className="patient-info">
            <p><strong>Phone:</strong> {patient.phoneNumber}</p>
            <p><strong>Allergies:</strong> {patient.allergies?.join(', ') || 'None'}</p>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="records-section">
            <button onClick={() => setShowNewRecord(true)} className="btn-primary">
              Add Medical Record
            </button>
            
            {showNewRecord && (
              <form onSubmit={handleSaveRecord} className="form-card">
                <h3>New Medical Record</h3>
                <div className="form-group">
                  <label>Diagnosis</label>
                  <input name="diagnosis" required />
                </div>
                <div className="form-group">
                  <label>Symptoms</label>
                  <textarea name="symptoms" required />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" onClick={() => setShowNewRecord(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="records-list">
              {records.map(record => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <h4>{record.diagnosis}</h4>
                    <span className="doctor-tag">👨‍⚕️ {getDoctorName(record.doctorId)}</span>
                  </div>
                  <p><strong>Symptoms:</strong> {record.symptoms}</p>
                  {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                  <p className="record-date">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="prescriptions-section">
            <button onClick={() => setShowNewPrescription(true)} className="btn-primary">
              Add Prescription
            </button>

            {showNewPrescription && (
              <form onSubmit={handleSavePrescription} className="form-card">
                <h3>New Prescription</h3>
                <div className="form-group">
                  <label>Medication</label>
                  <input name="medication" required />
                </div>
                <div className="form-group">
                  <label>Dosage</label>
                  <input name="dosage" required />
                </div>
                <div className="form-group">
                  <label>Frequency</label>
                  <input name="frequency" placeholder="e.g., 3 times daily" required />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input name="duration" placeholder="e.g., 7 days" required />
                </div>
                <div className="form-group">
                  <label>Instructions</label>
                  <textarea name="instructions" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" onClick={() => setShowNewPrescription(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="prescriptions-list">
              {prescriptions.map(prescription => (
                <div key={prescription.id} className="prescription-card">
                  <div className="prescription-header">
                    <h4>{prescription.medication}</h4>
                    <span className="doctor-tag">👨‍⚕️ {getDoctorName(prescription.doctorId)}</span>
                  </div>
                  <p><strong>Dosage:</strong> {prescription.dosage}</p>
                  <p><strong>Frequency:</strong> {prescription.frequency}</p>
                  <p><strong>Duration:</strong> {prescription.duration}</p>
                  {prescription.instructions && (
                    <p><strong>Instructions:</strong> {prescription.instructions}</p>
                  )}
                  <p className="prescription-date">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="vitals-section">
            <button onClick={() => setShowNewVitals(true)} className="btn-primary">
              Record Vitals
            </button>

            {showNewVitals && (
              <form onSubmit={handleSaveVitals} className="form-card">
                <h3>Record Vital Signs</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Blood Pressure</label>
                    <input name="bloodPressure" placeholder="120/80" />
                  </div>
                  <div className="form-group">
                    <label>Heart Rate (bpm)</label>
                    <input name="heartRate" type="number" placeholder="72" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Temperature (°C)</label>
                    <input name="temperature" type="number" step="0.1" placeholder="37.0" />
                  </div>
                  <div className="form-group">
                    <label>O2 Saturation (%)</label>
                    <input name="oxygenSaturation" type="number" placeholder="98" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input name="weight" type="number" step="0.1" placeholder="70.5" />
                  </div>
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input name="height" type="number" placeholder="175" />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" onClick={() => setShowNewVitals(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="vitals-list">
              {vitals.map(vital => (
                <div key={vital.id} className="vital-card">
                  <div className="vital-header">
                    <span className="doctor-tag">👨‍⚕️ {getDoctorName(vital.recordedBy)}</span>
                  </div>
                  <div className="vital-grid">
                    {vital.bloodPressure && <div><strong>BP:</strong> {vital.bloodPressure}</div>}
                    {vital.heartRate && <div><strong>HR:</strong> {vital.heartRate} bpm</div>}
                    {vital.temperature && <div><strong>Temp:</strong> {vital.temperature}°C</div>}
                    {vital.oxygenSaturation && <div><strong>O2:</strong> {vital.oxygenSaturation}%</div>}
                    {vital.weight && <div><strong>Weight:</strong> {vital.weight} kg</div>}
                    {vital.height && <div><strong>Height:</strong> {vital.height} cm</div>}
                  </div>
                  <p className="vital-date">
                    {new Date(vital.recordedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="labs-section">
            <button onClick={() => setShowNewLabResult(true)} className="btn-primary">
              Add Lab Result
            </button>

            {showNewLabResult && (
              <form onSubmit={handleSaveLabResult} className="form-card">
                <h3>New Lab Result</h3>
                <div className="form-group">
                  <label>Test Name</label>
                  <input name="testName" required />
                </div>
                <div className="form-group">
                  <label>Test Type</label>
                  <select name="testType" required>
                    <option value="blood">Blood Test</option>
                    <option value="urine">Urine Test</option>
                    <option value="xray">X-Ray</option>
                    <option value="mri">MRI</option>
                    <option value="ct">CT Scan</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Result</label>
                  <textarea name="result" required />
                </div>
                <div className="form-group">
                  <label>Normal Range</label>
                  <input name="normalRange" placeholder="e.g., 70-100 mg/dL" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" required>
                    <option value="completed">Normal</option>
                    <option value="abnormal">Abnormal</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Test Date</label>
                  <input name="testDate" type="date" required />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" onClick={() => setShowNewLabResult(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="labs-list">
              {labResults.map(lab => (
                <div key={lab.id} className={`lab-card status-${lab.status}`}>
                  <div className="lab-header">
                    <h4>{lab.testName}</h4>
                    <span className="doctor-tag">👨‍⚕️ {getDoctorName(lab.doctorId)}</span>
                  </div>
                  <p><strong>Type:</strong> {lab.testType}</p>
                  <p><strong>Result:</strong> {lab.result}</p>
                  {lab.normalRange && <p><strong>Normal Range:</strong> {lab.normalRange}</p>}
                  <p><strong>Status:</strong> <span className={`status-badge ${lab.status}`}>{lab.status}</span></p>
                  {lab.notes && <p><strong>Notes:</strong> {lab.notes}</p>}
                  <p className="lab-date">
                    Test Date: {new Date(lab.testDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <button onClick={() => setShowNewAppointment(true)} className="btn-primary">
              Schedule Appointment
            </button>

            {showNewAppointment && (
              <form onSubmit={handleSaveAppointment} className="form-card">
                <h3>New Appointment</h3>
                <div className="form-group">
                  <label>Date</label>
                  <input name="date" type="date" required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input name="time" type="time" required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" required>
                    <option value="checkup">Check-up</option>
                    <option value="followup">Follow-up</option>
                    <option value="consultation">Consultation</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" onClick={() => setShowNewAppointment(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="appointments-list">
              {appointments.map(appointment => (
                <div key={appointment.id} className={`appointment-card status-${appointment.status}`}>
                  <div className="appointment-header-row">
                    <h4>{appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}</h4>
                    <span className="doctor-tag">👨‍⚕️ {getDoctorName(appointment.doctorId)}</span>
                  </div>
                  <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Status:</strong> <span className={`status-badge ${appointment.status}`}>{appointment.status}</span></p>
                  {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-section">
            <h3>Patient Timeline</h3>
            <div className="timeline">
              {[...records, ...prescriptions, ...appointments, ...labResults, ...vitals]
                .sort((a, b) => new Date(b.createdAt || b.recordedAt || b.testDate).getTime() - new Date(a.createdAt || a.recordedAt || a.testDate).getTime())
                .map((item, index) => {
                  const date = item.createdAt || item.recordedAt || item.testDate;
                  let type = '';
                  let content = '';
                  let doctorId = item.doctorId || item.recordedBy;
                  
                  if (item.diagnosis) {
                    type = 'Medical Record';
                    content = item.diagnosis;
                  } else if (item.medication) {
                    type = 'Prescription';
                    content = item.medication;
                  } else if (item.type && item.date) {
                    type = 'Appointment';
                    content = item.type;
                  } else if (item.testName) {
                    type = 'Lab Result';
                    content = item.testName;
                  } else if (item.bloodPressure || item.heartRate) {
                    type = 'Vitals';
                    content = 'Vital signs recorded';
                  }
                  
                  return (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="timeline-type">{type}</div>
                        <div className="timeline-text">{content}</div>
                        <div className="timeline-date">{new Date(date).toLocaleString()}</div>
                        {doctorId && (
                          <div className="timeline-doctor">👨‍⚕️ {getDoctorName(doctorId)}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;

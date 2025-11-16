import React, { useState, useEffect } from 'react';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

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

  const loadData = async () => {
    const recordsData = await window.electronAPI.records.getByPatient(patient.id);
    const prescriptionsData = await window.electronAPI.prescriptions.getByPatient(patient.id);
    const appointmentsData = await window.electronAPI.appointments.getByPatient(patient.id);
    const labResultsData = await window.electronAPI.labResults.getByPatient(patient.id);
    const vitalsData = await window.electronAPI.vitals.getByPatient(patient.id);
    setRecords(recordsData);
    setPrescriptions(prescriptionsData);
    setAppointments(appointmentsData);
    setLabResults(labResultsData);
    setVitals(vitalsData);
  };

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const record = {
      id: uuidv4(),
      patientId: patient.id,
      doctorId: currentUser.id,
      diagnosis: formData.get('diagnosis'),
      symptoms: formData.get('symptoms'),
      notes: formData.get('notes')
    };

    await window.electronAPI.records.save(record);
    setShowNewRecord(false);
    loadData();
  };

  const handleSavePrescription = async (e: React.FormEvent) => {
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
      instructions: formData.get('instructions')
    };

    await window.electronAPI.prescriptions.save(prescription);
    setShowNewPrescription(false);
    loadData();
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
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
      notes: formData.get('notes')
    };

    await window.electronAPI.appointments.save(appointment);
    setShowNewAppointment(false);
    loadData();
  };

  const handleSaveLabResult = async (e: React.FormEvent) => {
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
      testDate: formData.get('testDate')
    };

    await window.electronAPI.labResults.save(labResult);
    setShowNewLabResult(false);
    loadData();
  };

  const handleSaveVitals = async (e: React.FormEvent) => {
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
      recordedBy: currentUser.id
    };

    await window.electronAPI.vitals.save(vital);
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
                  <h4>{record.diagnosis}</h4>
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
                  <h4>{prescription.medication}</h4>
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
                  <h4>{lab.testName}</h4>
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
                  <h4>{appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}</h4>
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

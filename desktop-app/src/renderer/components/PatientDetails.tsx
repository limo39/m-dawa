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
  const [activeTab, setActiveTab] = useState<'info' | 'records' | 'prescriptions'>('info');
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [showNewPrescription, setShowNewPrescription] = useState(false);

  useEffect(() => {
    loadData();
  }, [patient]);

  const loadData = async () => {
    const recordsData = await window.electronAPI.records.getByPatient(patient.id);
    const prescriptionsData = await window.electronAPI.prescriptions.getByPatient(patient.id);
    setRecords(recordsData);
    setPrescriptions(prescriptionsData);
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
      </div>
    </div>
  );
};

export default PatientDetails;

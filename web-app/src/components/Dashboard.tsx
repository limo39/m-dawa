import React, { useState } from 'react';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';
import QRScanner from './QRScanner';
import { savePatientData } from '../utils/storage';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');

  const handleQRScan = async (data: string) => {
    try {
      const patientData = JSON.parse(data);
      
      // Validate the data structure
      if (!patientData.patient || !patientData.otp) {
        setScanStatus('Invalid QR code data');
        return;
      }

      // Save patient data
      await savePatientData(patientData);
      
      setScanStatus('Patient data received successfully!');
      setShowScanner(false);
      
      // Reload the page to show new patient
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setScanStatus('Failed to process QR code. Please try again.');
      console.error('QR scan error:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>M-dawa - Doctor Portal</h1>
        <div className="user-info">
          <span>{user.name} ({user.role})</span>
          <button onClick={() => setShowScanner(true)} className="btn-primary">
            📷 Scan Patient QR Code
          </button>
          <button onClick={onLogout} className="btn-secondary">Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="sidebar">
          <PatientList onSelectPatient={setSelectedPatient} />
        </div>
        
        <div className="main-content">
          {selectedPatient ? (
            <PatientDetails patient={selectedPatient} currentUser={user} />
          ) : (
            <div className="empty-state">
              <p>Select a patient to view their records</p>
            </div>
          )}
        </div>
      </div>

      {showScanner && (
        <QRScanner 
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {scanStatus && (
        <div className="status-toast">
          {scanStatus}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

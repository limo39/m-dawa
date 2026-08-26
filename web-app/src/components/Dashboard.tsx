import React, { useState } from 'react';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';
import QRScanner from './QRScanner';
import DataReceiver from './DataReceiver';
import OTPVerification from './OTPVerification';
import { savePatientData } from '../utils/storage';
import { markTransferUsed } from '../utils/transferCrypto';
import { parseTransferJson, type TransferPayload } from '../../../shared/transfer';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showReceiver, setShowReceiver] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<unknown | null>(null);
  const [scanStatus, setScanStatus] = useState<string>('');

  const beginVerification = (raw: string) => {
    setShowScanner(false);
    setShowReceiver(false);
    const parsed = parseTransferJson(raw);
    if (!parsed.ok) {
      setScanStatus(parsed.error);
      return;
    }
    setPendingTransfer(parsed.value);
  };

  const handleVerifiedImport = async (payload: TransferPayload) => {
    const result = await savePatientData(payload);
    if (!result.success) {
      setScanStatus('Verified, but saving the patient data failed.');
      return;
    }
    markTransferUsed(payload);
    setPendingTransfer(null);
    setScanStatus('Patient data imported.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>M-dawa - Doctor Portal</h1>
        <div className="user-info">
          <span>{user.name} ({user.role})</span>
          <button onClick={() => setShowScanner(true)} className="btn-primary">
            Scan patient QR code
          </button>
          <button onClick={() => setShowReceiver(true)} className="btn-secondary">
            Paste transfer data
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
          onScan={beginVerification}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showReceiver && (
        <DataReceiver
          onParsed={beginVerification}
          onClose={() => setShowReceiver(false)}
        />
      )}

      {pendingTransfer !== null ? (
        <OTPVerification
          payload={pendingTransfer}
          onSuccess={handleVerifiedImport}
          onCancel={() => setPendingTransfer(null)}
        />
      ) : null}

      {scanStatus && (
        <div className="status-toast">
          {scanStatus}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

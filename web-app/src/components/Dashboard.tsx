import React, { useState, useEffect } from 'react';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';
import DataReceiver from './DataReceiver';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showReceiver, setShowReceiver] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>M-dawa - Doctor Portal</h1>
        <div className="user-info">
          <span>{user.name} ({user.role})</span>
          <button onClick={() => setShowReceiver(true)} className="btn-secondary">
            Receive Patient Data
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

      {showReceiver && (
        <DataReceiver onClose={() => setShowReceiver(false)} />
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';

interface PatientListProps {
  onSelectPatient: (patient: any) => void;
}

const PatientList: React.FC<PatientListProps> = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const data = await window.electronAPI.patients.getAll();
    setPatients(data);
  };

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="patient-list">
      <h3>Patients</h3>
      <input
        type="text"
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="patient-items">
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            className="patient-item"
            onClick={() => onSelectPatient(patient)}
          >
            <div className="patient-name">
              {patient.firstName} {patient.lastName}
            </div>
            <div className="patient-info">
              {patient.gender} • {patient.phoneNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;

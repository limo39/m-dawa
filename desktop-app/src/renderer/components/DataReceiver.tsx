import React, { useState } from 'react';

interface DataReceiverProps {
  onClose: () => void;
}

const DataReceiver: React.FC<DataReceiverProps> = ({ onClose }) => {
  const [jsonData, setJsonData] = useState('');
  const [status, setStatus] = useState('');

  const handleReceive = async () => {
    try {
      const data = JSON.parse(jsonData);
      
      // Store OTP session if OTP is present
      if (data.otp && data.expiresAt) {
        const otpSession = {
          otp: data.otp,
          patientData: data,
          expiresAt: data.expiresAt,
          used: false
        };
        localStorage.setItem(`mdawa_otp_${data.otp}`, JSON.stringify(otpSession));
      }
      
      const result = await window.electronAPI.transfer.receive(data);
      
      if (result.success) {
        setStatus('Data received successfully!');
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        setStatus('Error receiving data');
      }
    } catch (error) {
      setStatus('Invalid JSON data');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Receive Patient Data</h2>
        <p>Paste the JSON data from patient's mobile app:</p>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder='{"patient": {...}, "records": [...], "prescriptions": [...]}'
          rows={10}
        />
        {status && <p className="status-message">{status}</p>}
        <div className="modal-actions">
          <button onClick={handleReceive} className="btn-primary">Receive Data</button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DataReceiver;

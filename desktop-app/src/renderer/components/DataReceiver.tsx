import React, { useState } from 'react';

interface DataReceiverProps {
  onParsed: (raw: string) => void;
  onClose: () => void;
}

const DataReceiver: React.FC<DataReceiverProps> = ({ onParsed, onClose }) => {
  const [jsonData, setJsonData] = useState('');
  const [status, setStatus] = useState('');

  const handleReceive = () => {
    const trimmed = jsonData.trim();
    if (!trimmed) {
      setStatus('Paste the transfer data from the patient app.');
      return;
    }
    try {
      JSON.parse(trimmed);
    } catch {
      setStatus('Invalid JSON data');
      return;
    }
    onParsed(trimmed);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Paste patient transfer data</h2>
        <p>Paste the JSON copied from the patient's phone. You will be asked for the 6-digit verification code next.</p>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder='{"v":1,"patient":{...},"signature":"..."}'
          rows={10}
        />
        {status && <p className="status-message">{status}</p>}
        <div className="modal-actions">
          <button onClick={handleReceive} className="btn-primary">Continue</button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DataReceiver;

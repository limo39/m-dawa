import React, { useState } from 'react';
import { verifyIncomingTransfer } from '../utils/transferCrypto';
import type { TransferPayload } from '../../../../shared/transfer';

interface OTPVerificationProps {
  payload: unknown;
  onSuccess: (patientData: TransferPayload) => void;
  onCancel: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ payload, onSuccess, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyIncomingTransfer(payload, otp);
      if (result.ok) {
        onSuccess(result.payload);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to verify the code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal otp-modal">
        <h2>Enter verification code</h2>
        <p className="otp-description">
          Ask the patient for the 6-digit code shown on their phone. It is not in the QR code.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-container">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={handleOTPChange}
              placeholder="000000"
              maxLength={6}
              className="otp-input"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="otp-info">
            <p>Valid for 15 minutes</p>
            <p>Can only be imported once on this device</p>
            <p>Wrong code cannot decrypt or import the records</p>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={otp.length !== 6 || loading}
            >
              {loading ? 'Verifying...' : 'Verify and import'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;

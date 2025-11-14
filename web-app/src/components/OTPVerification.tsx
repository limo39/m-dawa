import React, { useState } from 'react';
import { verifyOTP } from '../utils/otpService';

interface OTPVerificationProps {
  onSuccess: (patientData: any) => void;
  onCancel: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onSuccess, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyOTP(otp);
      
      if (result.success && result.patientData) {
        onSuccess(result.patientData);
      } else {
        setError(result.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
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
        <h2>🔐 Enter Patient OTP</h2>
        <p className="otp-description">
          Ask the patient for their 6-digit one-time password
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-container">
            <input
              type="text"
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
              ❌ {error}
            </div>
          )}

          <div className="otp-info">
            <p>✓ OTP is valid for 10 minutes</p>
            <p>✓ Can only be used once</p>
            <p>✓ Patient data will be imported automatically</p>
          </div>

          <div className="modal-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={otp.length !== 6 || loading}
            >
              {loading ? 'Verifying...' : 'Verify & Import'}
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

        <div className="otp-help">
          <p><strong>How it works:</strong></p>
          <p>1. Patient generates OTP on their mobile app</p>
          <p>2. Patient shares the 6-digit code with you</p>
          <p>3. Enter the code above to access their records</p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;

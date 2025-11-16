import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualData, setManualData] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader';

  useEffect(() => {
    if (!showManualInput) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [showManualInput]);

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = scanner;

      // Try to get available cameras
      const cameras = await Html5Qrcode.getCameras();
      console.log('Available cameras:', cameras);

      const cameraId = cameras.length > 0 ? cameras[0].id : { facingMode: 'environment' };

      await scanner.start(
        cameraId,
        {
          fps: 5,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
          disableFlip: false
        },
        (decodedText) => {
          console.log('QR Code scanned:', decodedText.substring(0, 100) + '...');
          setScanning(true);
          onScan(decodedText);
          stopScanner();
        },
        () => {
          // Ignore continuous scanning errors
        }
      );
    } catch (err: any) {
      console.error('Scanner error:', err);
      setError(err.message || 'Failed to start camera. Please check permissions.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  const handleManualSubmit = () => {
    if (manualData.trim()) {
      onScan(manualData);
      onClose();
    }
  };

  const toggleManualInput = async () => {
    if (!showManualInput) {
      await stopScanner();
    }
    setShowManualInput(!showManualInput);
  };

  return (
    <div className="modal-overlay">
      <div className="modal qr-scanner-modal">
        <h2>📷 Scan Patient QR Code</h2>
        
        {showManualInput ? (
          <div className="manual-input-container">
            <p className="manual-instructions">
              If scanning doesn't work, you can paste the QR code data manually:
            </p>
            <textarea
              value={manualData}
              onChange={(e) => setManualData(e.target.value)}
              placeholder='Paste QR code data here (JSON format)...'
              rows={8}
              className="manual-textarea"
            />
            <div className="modal-actions">
              <button onClick={handleManualSubmit} className="btn-primary">
                Import Data
              </button>
              <button onClick={toggleManualInput} className="btn-secondary">
                Back to Scanner
              </button>
              <button onClick={handleClose} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">❌ {error}</p>
            <p className="error-help">
              Make sure you've granted camera permissions and your device has a camera.
            </p>
            <button onClick={toggleManualInput} className="btn-secondary" style={{ marginTop: '15px' }}>
              Use Manual Input Instead
            </button>
          </div>
        ) : (
          <>
            <div className="scanner-instructions">
              <p>Position the QR code within the frame</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                Hold steady and ensure good lighting
              </p>
            </div>
            
            <div id={qrCodeRegionId} className="qr-reader"></div>
            
            {scanning && (
              <div className="scanning-indicator">
                <p>✓ QR Code detected! Processing...</p>
              </div>
            )}

            <div className="scanner-tips">
              <p><strong>Tips for better scanning:</strong></p>
              <ul>
                <li>Increase phone screen brightness</li>
                <li>Hold phone steady</li>
                <li>Ensure good lighting</li>
                <li>Move closer or further away</li>
              </ul>
            </div>

            <button onClick={toggleManualInput} className="btn-secondary" style={{ marginTop: '10px' }}>
              Can't Scan? Use Manual Input
            </button>
          </>
        )}

        {!showManualInput && (
          <div className="modal-actions">
            <button onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;

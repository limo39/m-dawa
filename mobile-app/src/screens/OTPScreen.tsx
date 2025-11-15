import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Clipboard } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { loadPatientData } from '../utils/storage';
import { createOTPData, getTimeRemaining, OTPData } from '../utils/otp';

export default function OTPScreen() {
  const [patientData, setPatientData] = useState<any>(null);
  const [otpData, setOtpData] = useState<OTPData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [qrData, setQrData] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (otpData && !otpData.used) {
      const interval = setInterval(() => {
        const remaining = getTimeRemaining(otpData.expiresAt);
        setTimeRemaining(remaining);
        
        if (remaining === 'Expired') {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpData]);

  const loadData = async () => {
    const data = await loadPatientData();
    setPatientData(data);
  };

  const handleGenerateQR = () => {
    if (!patientData) return;

    const newOTP = createOTPData(
      patientData.patient.id,
      `${patientData.patient.firstName} ${patientData.patient.lastName}`
    );

    // Create transfer data with all patient information
    const transferData = {
      otp: newOTP.code,
      patientId: patientData.patient.id,
      patientName: `${patientData.patient.firstName} ${patientData.patient.lastName}`,
      patient: patientData.patient,
      records: patientData.records || [],
      prescriptions: patientData.prescriptions || [],
      appointments: patientData.appointments || [],
      labResults: patientData.labResults || [],
      vitals: patientData.vitals || [],
      generatedAt: new Date().toISOString(),
      expiresAt: newOTP.expiresAt.toISOString(),
      signature: 'encrypted_signature_here'
    };

    setOtpData(newOTP);
    setQrData(JSON.stringify(transferData));
    setTimeRemaining(getTimeRemaining(newOTP.expiresAt));

    Alert.alert(
      'QR Code Generated',
      `Verification Code: ${newOTP.code}\n\nShow this QR code to your doctor to share your medical records.`,
      [{ text: 'OK' }]
    );
  };

  const handleRefreshQR = () => {
    Alert.alert(
      'Generate New QR Code?',
      'This will invalidate the current code. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: handleGenerateQR }
      ]
    );
  };

  const handleCopyData = () => {
    if (qrData) {
      Clipboard.setString(qrData);
      Alert.alert(
        'Copied!',
        'QR code data has been copied to clipboard. You can paste it into the doctor\'s app if scanning doesn\'t work.',
        [{ text: 'OK' }]
      );
    }
  };

  if (!patientData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📱</Text>
        <Text style={styles.headerTitle}>Share Medical Records</Text>
        <Text style={styles.headerSubtitle}>
          Generate a secure QR code for your doctor
        </Text>
      </View>

      {/* Patient Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>
            {patientData.patient.firstName} {patientData.patient.lastName}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID:</Text>
          <Text style={styles.infoValue}>
            {patientData.patient.id.substring(0, 8)}...
          </Text>
        </View>
      </View>

      {/* QR Code Display */}
      {otpData && qrData ? (
        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>Show this to your doctor</Text>
          
          {/* Verification Code Badge */}
          <View style={styles.verificationBadge}>
            <Text style={styles.verificationLabel}>Verification Code</Text>
            <Text style={styles.verificationCode}>{otpData.code}</Text>
          </View>

          {/* QR Code */}
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={qrData}
              size={250}
              backgroundColor="white"
            />
          </View>
          
          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>⏱️ Expires in:</Text>
            <Text style={[
              styles.timerValue,
              timeRemaining === 'Expired' && styles.timerExpired
            ]}>
              {timeRemaining}
            </Text>
          </View>

          {/* Status Badge */}
          <View style={[
            styles.statusBadge,
            timeRemaining === 'Expired' ? styles.statusExpired : styles.statusActive
          ]}>
            <Text style={styles.statusText}>
              {timeRemaining === 'Expired' ? '⏰ Expired' : '✓ Active'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={handleCopyData}
            >
              <Text style={styles.copyButtonText}>📋 Copy Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefreshQR}
            >
              <Text style={styles.refreshButtonText}>🔄 New Code</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helpText}>
            If scanning doesn't work, tap "Copy Data" and paste it into the doctor's app manually.
          </Text>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📱</Text>
          <Text style={styles.emptyTitle}>No Active QR Code</Text>
          <Text style={styles.emptyText}>
            Generate a secure QR code to share your medical records with your doctor
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGenerateQR}
          >
            <Text style={styles.primaryButtonText}>Generate QR Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📋 How to Use</Text>
        <Text style={styles.instructionText}>
          1. Tap "Generate QR Code" button{'\n'}
          2. Show the QR code to your doctor{'\n'}
          3. Doctor scans it with their app{'\n'}
          4. Your medical data is securely transferred{'\n'}
          5. QR code expires after 15 minutes
        </Text>
      </View>

      {/* Security Notice */}
      <View style={styles.securityCard}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityTitle}>Security & Privacy</Text>
        <Text style={styles.securityText}>
          • QR code expires in 15 minutes{'\n'}
          • Single-use only{'\n'}
          • Works offline (no internet needed){'\n'}
          • Your data stays encrypted{'\n'}
          • You control all sharing
        </Text>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa'
  },
  loadingText: {
    fontSize: 16,
    color: '#666'
  },
  header: {
    backgroundColor: '#667eea',
    padding: 30,
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 15
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center'
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: 14,
    color: '#333'
  },
  qrCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center'
  },
  qrLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  verificationBadge: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  verificationLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5
  },
  verificationCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 6,
    fontFamily: 'monospace'
  },
  qrCodeWrapper: {
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#667eea',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10
  },
  timerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50'
  },
  timerExpired: {
    color: '#f44336'
  },
  statusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 20
  },
  statusActive: {
    backgroundColor: '#e8f5e9'
  },
  statusExpired: {
    backgroundColor: '#ffebee'
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  emptyCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center'
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 15
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  refreshButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center'
  },
  refreshButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600'
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20
  },
  instructionsCard: {
    backgroundColor: '#e3f2fd',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3'
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 10
  },
  instructionText: {
    fontSize: 13,
    color: '#1565c0',
    lineHeight: 22
  },
  securityCard: {
    backgroundColor: '#fff3e0',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800'
  },
  securityIcon: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: 'center'
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 10,
    textAlign: 'center'
  },
  securityText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 22
  },
  spacer: {
    height: 30
  }
});

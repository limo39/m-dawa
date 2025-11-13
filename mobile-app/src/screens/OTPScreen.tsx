import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loadPatientData } from '../utils/storage';
import { createOTPData, getTimeRemaining, OTPData } from '../utils/otp';

export default function OTPScreen() {
  const [patientData, setPatientData] = useState<any>(null);
  const [otpData, setOtpData] = useState<OTPData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

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

  const handleGenerateOTP = () => {
    if (!patientData) return;

    const newOTP = createOTPData(
      patientData.patient.id,
      `${patientData.patient.firstName} ${patientData.patient.lastName}`
    );

    setOtpData(newOTP);
    setTimeRemaining(getTimeRemaining(newOTP.expiresAt));

    Alert.alert(
      'OTP Generated',
      'Share this code with your doctor to grant access to your medical records.',
      [{ text: 'OK' }]
    );
  };

  const handleRefreshOTP = () => {
    Alert.alert(
      'Generate New OTP?',
      'This will invalidate the current code. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: handleGenerateOTP }
      ]
    );
  };

  if (!patientData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔐</Text>
        <Text style={styles.headerTitle}>Access Control</Text>
        <Text style={styles.headerSubtitle}>
          Generate a secure code for your doctor
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

      {/* OTP Display */}
      {otpData ? (
        <View style={styles.otpCard}>
          <Text style={styles.otpLabel}>Your Access Code</Text>
          <View style={styles.otpDisplay}>
            <Text style={styles.otpCode}>{otpData.code}</Text>
          </View>
          
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time Remaining:</Text>
            <Text style={[
              styles.timerValue,
              timeRemaining === 'Expired' && styles.timerExpired
            ]}>
              {timeRemaining}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              timeRemaining === 'Expired' ? styles.statusExpired : styles.statusActive
            ]}>
              <Text style={styles.statusText}>
                {timeRemaining === 'Expired' ? '⏰ Expired' : '✓ Active'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleRefreshOTP}
          >
            <Text style={styles.secondaryButtonText}>🔄 Generate New Code</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🔒</Text>
          <Text style={styles.emptyTitle}>No Active Code</Text>
          <Text style={styles.emptyText}>
            Generate a secure 6-digit code to share with your doctor
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGenerateOTP}
          >
            <Text style={styles.primaryButtonText}>Generate Access Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📋 How to Use</Text>
        <Text style={styles.instructionText}>
          1. Generate an access code{'\n'}
          2. Share the 6-digit code with your doctor{'\n'}
          3. Doctor enters the code in their app{'\n'}
          4. Your medical data is securely transferred{'\n'}
          5. Code expires after 15 minutes or one use
        </Text>
      </View>

      {/* Security Notice */}
      <View style={styles.securityCard}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityTitle}>Security Features</Text>
        <Text style={styles.securityText}>
          • Code expires in 15 minutes{'\n'}
          • Single-use only{'\n'}
          • Cannot be reused{'\n'}
          • Your data stays encrypted{'\n'}
          • You control access
        </Text>
      </View>
    </View>
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
  otpCard: {
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
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15
  },
  otpDisplay: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#667eea',
    marginBottom: 20
  },
  otpCode: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#667eea',
    letterSpacing: 8
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
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
  statusContainer: {
    marginBottom: 20
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20
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
    fontSize: 60,
    marginBottom: 15
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20
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
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600'
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
  }
});

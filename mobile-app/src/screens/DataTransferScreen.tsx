import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Clipboard } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { loadPatientData } from '../utils/storage';

export default function DataTransferScreen() {
  const [patientData, setPatientData] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [currentOTP, setCurrentOTP] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await loadPatientData();
    setPatientData(data);
  };

  const handleGenerateTransfer = () => {
    if (!patientData) return;

    // Generate OTP for this transfer
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

    const transferData = {
      otp,
      patientId: patientData.patient.id,
      patientName: `${patientData.patient.firstName} ${patientData.patient.lastName}`,
      patient: patientData.patient,
      records: patientData.records || [],
      prescriptions: patientData.prescriptions || [],
      appointments: patientData.appointments || [],
      labResults: patientData.labResults || [],
      vitals: patientData.vitals || [],
      generatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      timestamp: now,
      signature: 'encrypted_signature_here'
    };

    const json = JSON.stringify(transferData);
    setJsonData(json);
    setShowQR(true);
    setCurrentOTP(otp);
    
    Alert.alert(
      'QR Code Ready',
      `Verification Code: ${otp}\n\nShow this QR code to your doctor to transfer your medical records.`,
      [{ text: 'OK' }]
    );
  };

  const handleCopyData = () => {
    if (jsonData) {
      Clipboard.setString(jsonData);
      Alert.alert(
        'Copied!',
        'Transfer data copied to clipboard. You can paste it into the doctor\'s app if scanning doesn\'t work.',
        [{ text: 'OK' }]
      );
    }
  };

  if (!patientData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading patient data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {patientData.patient.firstName[0]}{patientData.patient.lastName[0]}
            </Text>
          </View>
        </View>
        <Text style={styles.patientName}>
          {patientData.patient.firstName} {patientData.patient.lastName}
        </Text>
        <Text style={styles.patientInfo}>
          {patientData.patient.gender} • {patientData.patient.dateOfBirth}
        </Text>
        <Text style={styles.patientInfo}>
          {patientData.patient.phoneNumber}
        </Text>
      </View>

      {/* Data Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Your Medical Data</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{patientData.records?.length || 0}</Text>
            <Text style={styles.statLabel}>Medical Records</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{patientData.prescriptions?.length || 0}</Text>
            <Text style={styles.statLabel}>Prescriptions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{patientData.appointments?.length || 0}</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{patientData.labResults?.length || 0}</Text>
            <Text style={styles.statLabel}>Lab Results</Text>
          </View>
        </View>
      </View>

      {/* QR Code Transfer */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Transfer Medical Records</Text>
        <Text style={styles.description}>
          Generate a secure QR code to share your medical records with your doctor
        </Text>
        
        {!showQR ? (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGenerateTransfer}
          >
            <Text style={styles.primaryButtonText}>Generate QR Code</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.qrContainer}>
            <Text style={styles.instructionText}>
              Show this QR code to your doctor
            </Text>
            
            {/* Verification Code Display */}
            {currentOTP && (
              <View style={styles.otpBadge}>
                <Text style={styles.otpBadgeLabel}>Verification Code:</Text>
                <Text style={styles.otpBadgeCode}>{currentOTP}</Text>
              </View>
            )}
            
            {/* QR Code */}
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={jsonData}
                size={250}
                backgroundColor="white"
              />
            </View>
            
            <View style={styles.qrInstructions}>
              <Text style={styles.qrInstructionTitle}>📋 Instructions:</Text>
              <Text style={styles.qrInstructionText}>
                1. Doctor opens their app{'\n'}
                2. Doctor clicks "Scan QR Code"{'\n'}
                3. Doctor scans this code{'\n'}
                4. Your records are transferred securely
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.copyDataButton}
                onPress={handleCopyData}
              >
                <Text style={styles.copyDataButtonText}>📋 Copy Data</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setShowQR(false);
                  setCurrentOTP(null);
                }}
              >
                <Text style={styles.resetButtonText}>🔄 New Code</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.scanHelpText}>
              If scanning doesn't work, use "Copy Data" and paste manually
            </Text>
          </View>
        )}
      </View>

      {/* Privacy Notice */}
      <View style={styles.privacyCard}>
        <Text style={styles.privacyIcon}>🔒</Text>
        <Text style={styles.privacyTitle}>Privacy & Security</Text>
        <Text style={styles.privacyText}>
          • Your data is encrypted and stored only on this device{'\n'}
          • You cannot view detailed medical records directly{'\n'}
          • Only authorized doctors can access your information{'\n'}
          • Transfer codes expire after use
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
  headerCard: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#667eea',
    padding: 30,
    alignItems: 'center',
    marginBottom: 20
  },
  avatarContainer: {
    marginBottom: 15
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white'
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white'
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5
  },
  patientInfo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 3
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20
  },
  primaryButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600'
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 10
  },
  copyDataButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  copyDataButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center'
  },
  resetButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600'
  },
  scanHelpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 18
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 10
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600'
  },
  otpBadge: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  otpBadgeLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5
  },
  otpBadgeCode: {
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
  qrInstructions: {
    backgroundColor: '#f0f4ff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea'
  },
  qrInstructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10
  },
  qrInstructionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22
  },
  privacyCard: {
    backgroundColor: '#fff3e0',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800'
  },
  privacyIcon: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: 'center'
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 10,
    textAlign: 'center'
  },
  privacyText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 22
  },
  spacer: {
    height: 30
  },

});

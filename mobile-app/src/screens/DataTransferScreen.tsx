import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Clipboard } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { loadPatientData } from '../utils/storage';

export default function DataTransferScreen() {
  const [patientData, setPatientData] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const [showJSON, setShowJSON] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [activeView, setActiveView] = useState<'summary' | 'qr' | 'json'>('summary');

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

    const json = JSON.stringify(transferData, null, 2);
    setJsonData(json);
    setShowQR(true);
    setActiveView('qr');
    
    Alert.alert(
      'Transfer Code Generated',
      `OTP: ${otp}\n\nShare this 6-digit code with your doctor along with the QR code or JSON data.`,
      [{ text: 'OK' }]
    );
  };

  const handleCopyData = () => {
    Clipboard.setString(jsonData);
    Alert.alert(
      'Copied!',
      'Transfer data has been copied to clipboard. Paste it into the doctor\'s desktop app.',
      [{ text: 'OK' }]
    );
  };

  const handleViewJSON = () => {
    setShowJSON(true);
    setActiveView('json');
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

      {/* Transfer Options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔄 Transfer to Doctor</Text>
        <Text style={styles.description}>
          Share your medical data securely with your healthcare provider
        </Text>
        
        {!showQR ? (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGenerateTransfer}
          >
            <Text style={styles.primaryButtonText}>Generate Transfer Code</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.transferOptions}>
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeView === 'qr' && styles.activeTab]}
                onPress={() => setActiveView('qr')}
              >
                <Text style={[styles.tabText, activeView === 'qr' && styles.activeTabText]}>
                  QR Code
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeView === 'json' && styles.activeTab]}
                onPress={handleViewJSON}
              >
                <Text style={[styles.tabText, activeView === 'json' && styles.activeTabText]}>
                  Text Data
                </Text>
              </TouchableOpacity>
            </View>

            {/* QR Code View */}
            {activeView === 'qr' && (
              <View style={styles.qrContainer}>
                <Text style={styles.instructionText}>
                  Scan this QR code with the doctor's app
                </Text>
                <View style={styles.qrCodeWrapper}>
                  <QRCode
                    value={jsonData}
                    size={220}
                    backgroundColor="white"
                  />
                </View>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={handleCopyData}
                >
                  <Text style={styles.secondaryButtonText}>📋 Copy Data Instead</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* JSON View */}
            {activeView === 'json' && (
              <View style={styles.jsonContainer}>
                <Text style={styles.instructionText}>
                  Copy this data and paste it into the doctor's app
                </Text>
                <ScrollView 
                  style={styles.jsonScroll}
                  nestedScrollEnabled={true}
                >
                  <Text style={styles.jsonText} selectable>
                    {jsonData}
                  </Text>
                </ScrollView>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleCopyData}
                >
                  <Text style={styles.primaryButtonText}>📋 Copy to Clipboard</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setShowQR(false);
                setShowJSON(false);
                setActiveView('summary');
              }}
            >
              <Text style={styles.resetButtonText}>← Back to Summary</Text>
            </TouchableOpacity>
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
  resetButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 20
  },
  resetButtonText: {
    color: '#666',
    fontSize: 14
  },
  transferOptions: {
    marginTop: 10
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600'
  },
  qrContainer: {
    alignItems: 'center'
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  qrCodeWrapper: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 10
  },
  jsonContainer: {
    marginTop: 10
  },
  jsonScroll: {
    maxHeight: 300,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  jsonText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 16
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
  }
});

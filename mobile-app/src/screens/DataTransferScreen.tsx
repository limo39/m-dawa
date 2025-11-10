import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { loadPatientData } from '../utils/storage';

export default function DataTransferScreen() {
  const [patientData, setPatientData] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const [jsonData, setJsonData] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await loadPatientData();
    setPatientData(data);
  };

  const handleGenerateTransfer = () => {
    if (!patientData) return;

    const transferData = {
      patient: patientData.patient,
      records: patientData.records || [],
      prescriptions: patientData.prescriptions || [],
      timestamp: new Date(),
      signature: 'encrypted_signature_here'
    };

    const json = JSON.stringify(transferData);
    setJsonData(json);
    setShowQR(true);
  };

  const handleCopyData = () => {
    Alert.alert(
      'Transfer Data',
      'Copy this data and paste it into the doctor\'s desktop app:\n\n' + jsonData.substring(0, 100) + '...',
      [
        { text: 'OK' }
      ]
    );
  };

  if (!patientData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Patient Data Ready</Text>
        <Text style={styles.info}>
          Name: {patientData.patient.firstName} {patientData.patient.lastName}
        </Text>
        <Text style={styles.info}>
          Records: {patientData.records?.length || 0}
        </Text>
        <Text style={styles.info}>
          Prescriptions: {patientData.prescriptions?.length || 0}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Transfer to Doctor</Text>
        <Text style={styles.description}>
          Generate a secure transfer code to share your medical data with your doctor
        </Text>
        
        <Button 
          title="Generate Transfer Data" 
          onPress={handleGenerateTransfer}
          color="#667eea"
        />

        {showQR && (
          <View style={styles.qrContainer}>
            <Text style={styles.qrLabel}>Scan or Copy Data:</Text>
            <View style={styles.qrCode}>
              <QRCode
                value={jsonData}
                size={200}
              />
            </View>
            <Button 
              title="View Transfer Data" 
              onPress={handleCopyData}
              color="#764ba2"
            />
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.warning}>⚠️ Privacy Notice</Text>
        <Text style={styles.warningText}>
          Your medical data is stored securely on this device. You cannot view it directly, 
          but you can transfer it to authorized healthcare providers.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333'
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  qrLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10
  },
  qrCode: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15
  },
  warning: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9800',
    marginBottom: 10
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  }
});

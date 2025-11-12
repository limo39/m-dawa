import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { savePatientData } from '../utils/storage';

export default function SetupScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodType, setBloodType] = useState('');

  const handleSetup = async () => {
    if (!firstName || !lastName || !dateOfBirth || !gender || !phoneNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const patient = {
      id: uuidv4(),
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      bloodType,
      allergies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const patientData = {
      patient,
      records: [],
      prescriptions: []
    };

    await savePatientData(patientData);
    Alert.alert('Success', 'Patient data saved securely', [
      { text: 'OK', onPress: () => navigation.replace('Transfer') }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🏥</Text>
        <Text style={styles.title}>Welcome to M-dawa</Text>
        <Text style={styles.subtitle}>
          Set up your secure medical profile
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Patient Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Date of Birth <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD (e.g., 1990-01-15)"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Gender <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={gender}
              onChangeText={setGender}
              placeholder="male, female, or other"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+1234567890"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood Type</Text>
            <TextInput
              style={styles.input}
              value={bloodType}
              onChangeText={setBloodType}
              placeholder="A+, B-, O+, AB+, etc."
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSetup}>
              <Text style={styles.buttonText}>💾 Save My Information</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            🔒 Your information is encrypted and stored securely on this device only. 
            It will not be shared without your explicit consent.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa'
  },
  header: {
    backgroundColor: '#667eea',
    padding: 30,
    paddingTop: 50,
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 15
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  formContainer: {
    padding: 20
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 18
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  required: {
    color: '#f44336'
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#333'
  },
  inputFocused: {
    borderColor: '#667eea',
    backgroundColor: 'white'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden'
  },
  buttonContainer: {
    marginTop: 25
  },
  button: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3'
  },
  infoText: {
    fontSize: 13,
    color: '#1565c0',
    lineHeight: 20
  }
});

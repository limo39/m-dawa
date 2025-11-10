import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
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
      <Text style={styles.title}>Patient Information Setup</Text>
      <Text style={styles.subtitle}>
        Your data will be stored securely on this device
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
        />

        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
        />

        <Text style={styles.label}>Date of Birth * (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="1990-01-01"
        />

        <Text style={styles.label}>Gender *</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
          placeholder="male/female/other"
        />

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+1234567890"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Blood Type</Text>
        <TextInput
          style={styles.input}
          value={bloodType}
          onChangeText={setBloodType}
          placeholder="A+, B-, O+, etc."
        />

        <Button title="Save Patient Data" onPress={handleSetup} color="#667eea" />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    gap: 15
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10
  }
});

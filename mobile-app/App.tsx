import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SetupScreen from './src/screens/SetupScreen';
import DataTransferScreen from './src/screens/DataTransferScreen';
import { loadPatientData } from './src/utils/storage';

// Polyfill for TextEncoder/TextDecoder (needed for QR code)
import { TextEncoder, TextDecoder } from 'text-encoding';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

const Stack = createStackNavigator();

export default function App() {
  const [hasPatient, setHasPatient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPatientData();
  }, []);

  const checkPatientData = async () => {
    const data = await loadPatientData();
    setHasPatient(!!data);
    setLoading(false);
  };

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={hasPatient ? 'Transfer' : 'Setup'}
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen 
          name="Setup" 
          component={SetupScreen}
          options={{ 
            title: 'M-dawa Patient Setup'
          }}
        />
        <Stack.Screen 
          name="Transfer" 
          component={DataTransferScreen}
          options={{ 
            title: 'M-dawa',
            headerLeft: () => null,
            gestureEnabled: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

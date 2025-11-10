import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SetupScreen from './src/screens/SetupScreen';
import DataTransferScreen from './src/screens/DataTransferScreen';
import { loadPatientData } from './src/utils/storage';

const Stack = createStackNavigator();

export default function App() {
  const [hasPatient, setHasPatient] = useState(false);

  useEffect(() => {
    checkPatientData();
  }, []);

  const checkPatientData = async () => {
    const data = await loadPatientData();
    setHasPatient(!!data);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!hasPatient ? (
          <Stack.Screen 
            name="Setup" 
            component={SetupScreen}
            options={{ title: 'M-dawa Patient Setup' }}
          />
        ) : (
          <Stack.Screen 
            name="Transfer" 
            component={DataTransferScreen}
            options={{ title: 'M-dawa Data Transfer' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

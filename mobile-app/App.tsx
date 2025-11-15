import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SetupScreen from './src/screens/SetupScreen';
import DataTransferScreen from './src/screens/DataTransferScreen';
import OTPScreen from './src/screens/OTPScreen';
import { loadPatientData } from './src/utils/storage';
import { Text } from 'react-native';

// Polyfill for TextEncoder/TextDecoder (needed for QR code)
import { TextEncoder, TextDecoder } from 'text-encoding';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
    return null;
  }

  // Main tabs for authenticated users
  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        }
      }}
    >
      <Tab.Screen 
        name="Share" 
        component={OTPScreen}
        options={{
          title: 'Share Records',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📱</Text>,
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Transfer" 
        component={DataTransferScreen}
        options={{
          title: 'Quick Transfer',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚡</Text>,
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={hasPatient ? 'Main' : 'Setup'}
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
          name="Main" 
          component={MainTabs}
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

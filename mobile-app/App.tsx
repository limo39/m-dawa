import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import SetupScreen from './src/screens/SetupScreen';
import DataTransferScreen from './src/screens/DataTransferScreen';
import OTPScreen from './src/screens/OTPScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import { loadPatientData } from './src/utils/storage';
import { requestNotificationPermissions, scheduleAllAppointmentNotifications } from './src/utils/notifications';
import { Text, Alert } from 'react-native';

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
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    checkPatientData();
    setupNotifications();

    // Notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      const data = response.notification.request.content.data;
      if (data.type === 'appointment') {
        Alert.alert(
          'Appointment Reminder',
          'Don\'t forget your upcoming appointment!',
          [{ text: 'OK' }]
        );
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const checkPatientData = async () => {
    const data = await loadPatientData();
    setHasPatient(!!data);
    setLoading(false);

    // Schedule notifications for appointments if patient data exists
    if (data && data.appointments) {
      await scheduleAllAppointmentNotifications(data.appointments);
    }
  };

  const setupNotifications = async () => {
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      console.log('Notification permissions granted');
    } else {
      console.log('Notification permissions denied');
    }
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
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔔</Text>,
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📅</Text>,
          headerShown: false
        }}
      />
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

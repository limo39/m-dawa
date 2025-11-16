import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { loadPatientData } from '../utils/storage';
import { 
  scheduleAllAppointmentNotifications, 
  getScheduledNotifications,
  sendTestNotification 
} from '../utils/notifications';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    loadAppointments();
    checkScheduledNotifications();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await loadPatientData();
      if (data && data.appointments) {
        // Sort appointments by date
        const sorted = [...data.appointments].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setAppointments(sorted);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setLoading(false);
    }
  };

  const checkScheduledNotifications = async () => {
    const scheduled = await getScheduledNotifications();
    setNotificationCount(scheduled.length);
  };

  const handleRefreshNotifications = async () => {
    try {
      await scheduleAllAppointmentNotifications(appointments);
      const scheduled = await getScheduledNotifications();
      setNotificationCount(scheduled.length);
      
      Alert.alert(
        'Notifications Updated',
        `${scheduled.length} appointment reminders scheduled`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update notifications');
    }
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
    Alert.alert(
      'Test Sent',
      'Check your notifications!',
      [{ text: 'OK' }]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const isPast = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#4caf50';
      case 'completed': return '#2196f3';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return '📅';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  const upcomingAppointments = appointments.filter(apt => 
    isUpcoming(apt.date) && apt.status !== 'cancelled'
  );
  const pastAppointments = appointments.filter(apt => 
    isPast(apt.date) || apt.status === 'cancelled'
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📅</Text>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <Text style={styles.headerSubtitle}>
          View and manage your medical appointments
        </Text>
      </View>

      {/* Notification Status */}
      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Reminders Active</Text>
            <Text style={styles.notificationText}>
              {notificationCount} notification{notificationCount !== 1 ? 's' : ''} scheduled
            </Text>
          </View>
        </View>
        <View style={styles.notificationActions}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleRefreshNotifications}
          >
            <Text style={styles.notificationButtonText}>🔄 Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={handleTestNotification}
          >
            <Text style={styles.testButtonText}>Test</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {upcomingAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentIcon}>
                  {getStatusIcon(appointment.status)}
                </Text>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentDate}>
                    {formatDate(appointment.date)}
                  </Text>
                  <Text style={styles.appointmentTime}>
                    {appointment.time || 'Time not set'}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(appointment.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(appointment.status) }
                  ]}>
                    {appointment.status}
                  </Text>
                </View>
              </View>
              
              {appointment.type && (
                <View style={styles.appointmentDetail}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>{appointment.type}</Text>
                </View>
              )}
              
              {appointment.notes && (
                <View style={styles.appointmentDetail}>
                  <Text style={styles.detailLabel}>Notes:</Text>
                  <Text style={styles.detailValue}>{appointment.notes}</Text>
                </View>
              )}

              <View style={styles.reminderInfo}>
                <Text style={styles.reminderText}>
                  🔔 You'll be reminded 24 hours and 1 hour before
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Appointments</Text>
          {pastAppointments.map((appointment) => (
            <View key={appointment.id} style={[styles.appointmentCard, styles.pastCard]}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentIcon}>
                  {getStatusIcon(appointment.status)}
                </Text>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentDate}>
                    {formatDate(appointment.date)}
                  </Text>
                  <Text style={styles.appointmentTime}>
                    {appointment.time || 'Time not set'}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(appointment.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(appointment.status) }
                  ]}>
                    {appointment.status}
                  </Text>
                </View>
              </View>
              
              {appointment.notes && (
                <View style={styles.appointmentDetail}>
                  <Text style={styles.detailLabel}>Notes:</Text>
                  <Text style={styles.detailValue}>{appointment.notes}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {appointments.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No Appointments</Text>
          <Text style={styles.emptyText}>
            Your appointments will appear here once your doctor schedules them
          </Text>
        </View>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoTitle}>About Notifications</Text>
        <Text style={styles.infoText}>
          • You'll receive reminders 24 hours before each appointment{'\n'}
          • Another reminder will be sent 1 hour before{'\n'}
          • Make sure notifications are enabled in your device settings{'\n'}
          • Notifications work even when the app is closed
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
  notificationCard: {
    backgroundColor: '#e3f2fd',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3'
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  notificationIcon: {
    fontSize: 32,
    marginRight: 15
  },
  notificationInfo: {
    flex: 1
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 4
  },
  notificationText: {
    fontSize: 14,
    color: '#1976d2'
  },
  notificationActions: {
    flexDirection: 'row',
    gap: 10
  },
  notificationButton: {
    flex: 1,
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  notificationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  testButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196f3'
  },
  testButtonText: {
    color: '#2196f3',
    fontSize: 14,
    fontWeight: '600'
  },
  section: {
    marginTop: 20,
    marginHorizontal: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 5
  },
  appointmentCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  pastCard: {
    opacity: 0.7
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  appointmentIcon: {
    fontSize: 32,
    marginRight: 15
  },
  appointmentInfo: {
    flex: 1
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666'
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  appointmentDetail: {
    flexDirection: 'row',
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
    width: 60
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  reminderInfo: {
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },
  reminderText: {
    fontSize: 12,
    color: '#e65100',
    lineHeight: 18
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22
  },
  infoCard: {
    backgroundColor: '#f0f4ff',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea'
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: 'center'
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
    textAlign: 'center'
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 22
  },
  spacer: {
    height: 30
  }
});

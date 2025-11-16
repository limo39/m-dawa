import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // For Android, create notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('appointments', {
        name: 'Appointments',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#667eea',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Schedule appointment notification
export const scheduleAppointmentNotification = async (
  appointment: any
): Promise<string | null> => {
  try {
    const appointmentDate = new Date(appointment.date);
    const appointmentTime = appointment.time || '00:00';
    const [hours, minutes] = appointmentTime.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Schedule notification 24 hours before
    const notificationDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
    
    // Don't schedule if appointment is in the past
    if (notificationDate < new Date()) {
      console.log('Appointment is in the past, not scheduling notification');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏥 Appointment Reminder',
        body: `You have an appointment tomorrow at ${appointmentTime}`,
        data: { appointmentId: appointment.id, type: 'appointment' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: notificationDate,
    });

    console.log('Scheduled notification:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Schedule notification for appointment on the same day (1 hour before)
export const scheduleAppointmentDayNotification = async (
  appointment: any
): Promise<string | null> => {
  try {
    const appointmentDate = new Date(appointment.date);
    const appointmentTime = appointment.time || '00:00';
    const [hours, minutes] = appointmentTime.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Schedule notification 1 hour before
    const notificationDate = new Date(appointmentDate.getTime() - 60 * 60 * 1000);
    
    // Don't schedule if appointment is in the past
    if (notificationDate < new Date()) {
      console.log('Appointment is in the past, not scheduling notification');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Appointment Soon',
        body: `Your appointment is in 1 hour at ${appointmentTime}`,
        data: { appointmentId: appointment.id, type: 'appointment' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: notificationDate,
    });

    console.log('Scheduled day-of notification:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling day-of notification:', error);
    return null;
  }
};

// Schedule all notifications for appointments
export const scheduleAllAppointmentNotifications = async (
  appointments: any[]
): Promise<void> => {
  try {
    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Filter upcoming appointments
    const upcomingAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate > new Date() && apt.status !== 'cancelled';
    });

    console.log(`Scheduling notifications for ${upcomingAppointments.length} appointments`);

    // Schedule notifications for each appointment
    for (const appointment of upcomingAppointments) {
      await scheduleAppointmentNotification(appointment);
      await scheduleAppointmentDayNotification(appointment);
    }
  } catch (error) {
    console.error('Error scheduling all notifications:', error);
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// Get all scheduled notifications (for debugging)
export const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', notifications.length);
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

// Send immediate test notification
export const sendTestNotification = async (): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Notifications Enabled',
        body: 'You will receive reminders for upcoming appointments',
        sound: true,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};

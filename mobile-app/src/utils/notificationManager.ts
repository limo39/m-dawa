import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type NotificationType = 'appointment' | 'lab_result' | 'message' | 'reminder';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data: {
    appointmentId?: string;
    labResultId?: string;
    messageId?: string;
    doctorName?: string;
    timestamp?: string;
  };
}

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

    // For Android, create notification channels
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('appointments', {
        name: 'Appointments',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#667eea',
      });

      await Notifications.setNotificationChannelAsync('lab_results', {
        name: 'Lab Results',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4caf50',
      });

      await Notifications.setNotificationChannelAsync('messages', {
        name: 'Messages',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2196f3',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Send appointment reminder notification
export const sendAppointmentReminder = async (
  appointmentId: string,
  doctorName: string,
  appointmentTime: string,
  hoursUntil: number
): Promise<string | null> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📅 Appointment Reminder',
        body: `Your appointment with ${doctorName} is in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''} at ${appointmentTime}`,
        data: {
          appointmentId,
          doctorName,
          timestamp: new Date().toISOString(),
        },
        sound: true,
        priority: 'high',
      },
      trigger: null, // Send immediately
    });

    console.log('Appointment reminder sent:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error sending appointment reminder:', error);
    return null;
  }
};

// Send lab result ready notification
export const sendLabResultNotification = async (
  labResultId: string,
  testName: string,
  doctorName: string
): Promise<string | null> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧪 Lab Results Ready',
        body: `Your ${testName} results are ready. Review them with ${doctorName}.`,
        data: {
          labResultId,
          doctorName,
          testName,
          timestamp: new Date().toISOString(),
        },
        sound: true,
        priority: 'high',
      },
      trigger: null, // Send immediately
    });

    console.log('Lab result notification sent:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error sending lab result notification:', error);
    return null;
  }
};

// Send doctor message notification
export const sendDoctorMessageNotification = async (
  messageId: string,
  doctorName: string,
  messagePreview: string
): Promise<string | null> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `💬 Message from ${doctorName}`,
        body: messagePreview.substring(0, 100) + (messagePreview.length > 100 ? '...' : ''),
        data: {
          messageId,
          doctorName,
          timestamp: new Date().toISOString(),
        },
        sound: true,
        priority: 'max',
      },
      trigger: null, // Send immediately
    });

    console.log('Doctor message notification sent:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error sending doctor message notification:', error);
    return null;
  }
};

// Send generic notification
export const sendNotification = async (
  payload: NotificationPayload
): Promise<string | null> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sound: true,
        priority: 'high',
      },
      trigger: null, // Send immediately
    });

    console.log('Notification sent:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};

// Schedule notification for specific time
export const scheduleNotificationForTime = async (
  payload: NotificationPayload,
  triggerDate: Date
): Promise<string | null> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sound: true,
        priority: 'high',
      },
      trigger: triggerDate,
    });

    console.log('Scheduled notification:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancel notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notification cancelled:', notificationId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

// Get all scheduled notifications
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

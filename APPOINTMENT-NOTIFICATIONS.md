# Appointment Notifications Feature

## Overview

The mobile app now includes automatic appointment reminders to help patients never miss their medical appointments.

## Features

### ✅ Automatic Reminders
- **24-hour reminder**: Notification sent one day before appointment
- **1-hour reminder**: Notification sent one hour before appointment
- **Smart scheduling**: Only schedules for upcoming appointments
- **Auto-update**: Notifications refresh when new appointments are added

### 🔔 Notification Types

**24-Hour Reminder:**
```
🏥 Appointment Reminder
You have an appointment tomorrow at 10:00 AM
```

**1-Hour Reminder:**
```
⏰ Appointment Soon
Your appointment is in 1 hour at 10:00 AM
```

**Test Notification:**
```
✅ Notifications Enabled
You will receive reminders for upcoming appointments
```

## How It Works

### Automatic Setup
1. App requests notification permissions on first launch
2. Loads patient appointments from storage
3. Schedules notifications for all upcoming appointments
4. Updates notifications when new appointments are added

### User Interface

**New Appointments Tab:**
- View all upcoming appointments
- See past appointments
- Check notification status
- Test notifications
- Refresh notification schedule

**Notification Status Card:**
- Shows number of scheduled notifications
- Refresh button to update notifications
- Test button to send immediate notification

## Implementation Details

### Files Added

**`mobile-app/src/utils/notifications.ts`**
- Notification permission handling
- Scheduling functions
- Notification management

**`mobile-app/src/screens/AppointmentsScreen.tsx`**
- Appointments list view
- Notification controls
- Status display

### Files Modified

**`mobile-app/App.tsx`**
- Added notification initialization
- Added notification listeners
- Added Appointments tab
- Auto-schedule on app launch

**`mobile-app/app.json`**
- Added expo-notifications plugin
- Configured notification settings

**`mobile-app/package.json`**
- Added expo-notifications dependency

### Dependencies

```json
{
  "expo-notifications": "~0.28.0"
}
```

## Usage

### For Patients

**View Appointments:**
1. Open app
2. Tap "Appointments" tab (📅)
3. See upcoming and past appointments

**Test Notifications:**
1. Go to Appointments tab
2. Tap "Test" button
3. Check notification appears

**Refresh Notifications:**
1. Go to Appointments tab
2. Tap "🔄 Refresh" button
3. Notifications are rescheduled

### For Developers

**Schedule Notifications:**
```typescript
import { scheduleAllAppointmentNotifications } from './src/utils/notifications';

// Schedule for all appointments
await scheduleAllAppointmentNotifications(appointments);
```

**Request Permissions:**
```typescript
import { requestNotificationPermissions } from './src/utils/notifications';

const hasPermission = await requestNotificationPermissions();
```

**Send Test Notification:**
```typescript
import { sendTestNotification } from './src/utils/notifications';

await sendTestNotification();
```

**Get Scheduled Notifications:**
```typescript
import { getScheduledNotifications } from './src/utils/notifications';

const notifications = await getScheduledNotifications();
console.log(`${notifications.length} notifications scheduled`);
```

## Notification Scheduling Logic

### When Notifications Are Scheduled

1. **App Launch**: When app starts and patient data exists
2. **Data Transfer**: When new appointments are received from doctor
3. **Manual Refresh**: When user taps refresh button

### Scheduling Rules

- ✅ Only upcoming appointments (future dates)
- ✅ Only non-cancelled appointments
- ✅ 24-hour reminder scheduled
- ✅ 1-hour reminder scheduled
- ❌ Past appointments ignored
- ❌ Cancelled appointments ignored

### Example Timeline

```
Appointment: Friday, Nov 17, 2025 at 2:00 PM

Notifications Scheduled:
1. Thursday, Nov 16, 2025 at 2:00 PM (24 hours before)
   "🏥 You have an appointment tomorrow at 2:00 PM"

2. Friday, Nov 17, 2025 at 1:00 PM (1 hour before)
   "⏰ Your appointment is in 1 hour at 2:00 PM"
```

## Platform-Specific Behavior

### Android
- Notifications appear in notification drawer
- Sound and vibration enabled
- High priority notifications
- Custom notification channel "Appointments"
- Badge count supported

### iOS
- Notifications appear in notification center
- Sound enabled
- Banner style notifications
- Badge count supported
- Requires user permission

## Permissions

### Android
```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

### iOS
```
Notifications permission requested on first launch
User can enable/disable in iOS Settings
```

## Testing

### Test Notifications

**Method 1: Test Button**
1. Open Appointments tab
2. Tap "Test" button
3. Notification appears immediately

**Method 2: Schedule Near-Future Appointment**
```typescript
// Create appointment 2 minutes in future
const testAppointment = {
  id: 'test-1',
  date: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
  time: '10:00',
  status: 'scheduled',
  type: 'test',
  notes: 'Test appointment'
};

// Schedule notification (will fire in 2 minutes)
await scheduleAppointmentDayNotification(testAppointment);
```

### Debug Scheduled Notifications

```typescript
import { getScheduledNotifications } from './src/utils/notifications';

const notifications = await getScheduledNotifications();
notifications.forEach(notif => {
  console.log('ID:', notif.identifier);
  console.log('Trigger:', notif.trigger);
  console.log('Content:', notif.content);
});
```

## Troubleshooting

### Notifications Not Appearing

**Check Permissions:**
```typescript
import * as Notifications from 'expo-notifications';

const { status } = await Notifications.getPermissionsAsync();
console.log('Permission status:', status);
// Should be 'granted'
```

**Check Scheduled Notifications:**
```typescript
const scheduled = await getScheduledNotifications();
console.log('Scheduled:', scheduled.length);
// Should be > 0 if appointments exist
```

**Check Device Settings:**
- Android: Settings → Apps → M-dawa → Notifications → Enabled
- iOS: Settings → M-dawa → Notifications → Allow Notifications

### Notifications Not Scheduling

**Common Issues:**
1. Appointments are in the past
2. Appointments are cancelled
3. No appointments in patient data
4. Permissions not granted

**Solution:**
```typescript
// Manually refresh notifications
await scheduleAllAppointmentNotifications(appointments);
```

### Notifications Firing at Wrong Time

**Check Appointment Data:**
```typescript
console.log('Appointment date:', appointment.date);
console.log('Appointment time:', appointment.time);
// Ensure date is ISO format: "2025-11-17"
// Ensure time is HH:MM format: "14:00"
```

## Future Enhancements

### Planned Features
- [ ] Custom notification times (user chooses when to be reminded)
- [ ] Snooze functionality
- [ ] Notification history
- [ ] Multiple reminders per appointment
- [ ] Medication reminders
- [ ] Lab result notifications
- [ ] Prescription refill reminders

### Possible Improvements
- [ ] Rich notifications with actions (Confirm/Reschedule)
- [ ] Integration with device calendar
- [ ] Sync with doctor's scheduling system
- [ ] SMS backup reminders
- [ ] Email reminders

## Security & Privacy

### Data Handling
- ✅ Notifications stored locally on device
- ✅ No data sent to external servers
- ✅ Notifications cleared after delivery
- ✅ User controls all notification settings

### Privacy Features
- Notification content is minimal (no sensitive medical info)
- User can disable notifications anytime
- Notifications respect device Do Not Disturb settings
- No tracking or analytics

## API Reference

### Main Functions

**`requestNotificationPermissions()`**
- Requests notification permissions from user
- Returns: `Promise<boolean>`

**`scheduleAppointmentNotification(appointment)`**
- Schedules 24-hour reminder
- Returns: `Promise<string | null>` (notification ID)

**`scheduleAppointmentDayNotification(appointment)`**
- Schedules 1-hour reminder
- Returns: `Promise<string | null>` (notification ID)

**`scheduleAllAppointmentNotifications(appointments)`**
- Schedules all notifications for array of appointments
- Returns: `Promise<void>`

**`cancelAllNotifications()`**
- Cancels all scheduled notifications
- Returns: `Promise<void>`

**`getScheduledNotifications()`**
- Gets list of scheduled notifications
- Returns: `Promise<NotificationRequest[]>`

**`sendTestNotification()`**
- Sends immediate test notification
- Returns: `Promise<void>`

## Summary

The appointment notification system provides:
- ✅ Automatic reminders for upcoming appointments
- ✅ Multiple reminder times (24h and 1h before)
- ✅ Easy-to-use interface
- ✅ Test functionality
- ✅ Manual refresh capability
- ✅ Privacy-focused design
- ✅ Works offline
- ✅ Cross-platform (iOS & Android)

**Status:** ✅ COMPLETE AND READY TO USE  
**Last Updated:** November 14, 2025  
**Version:** 1.0.0

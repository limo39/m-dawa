# Mobile App Notification Features

## Overview

The mobile app now includes comprehensive pop-up notifications for three key events:
- 📅 Appointment reminders
- 🧪 Lab test results ready
- 💬 Doctor-patient messages

## Features

### 1. Appointment Reminders
- Automatic notifications 24 hours before appointment
- Additional reminder 1 hour before
- Shows doctor name and appointment time
- Works even when app is closed
- Respects device Do Not Disturb settings

### 2. Lab Results Ready Notifications
- Instant notification when lab results are available
- Shows test name and doctor name
- High priority alert
- Encourages patient to review results

### 3. Doctor-Patient Messaging
- Real-time notifications for new messages from doctor
- Shows doctor name and message preview
- Maximum priority (interrupts other notifications)
- Helps maintain communication between doctor and patient

## Notifications Center

### New Tab: Notifications
- View all notifications in one place
- Mark notifications as read
- Delete individual notifications
- Clear all notifications at once
- Shows unread count in header
- Displays notification timestamp

### Notification Types Display
- 📅 Appointment reminders (blue)
- 🧪 Lab results ready (green)
- 💬 Messages from doctor (blue)

## Technical Implementation

### Files Added

**`mobile-app/src/utils/notificationManager.ts`**
- Core notification management system
- Functions for sending different notification types
- Scheduling and cancellation
- Android notification channels setup

**`mobile-app/src/screens/NotificationsScreen.tsx`**
- Notifications Center UI
- Display all notifications
- Mark as read/delete functionality
- Empty state handling

### Updated Files

**`mobile-app/App.tsx`**
- Added NotificationsScreen import
- Added Notifications tab to main navigation
- Integrated notification listeners

## API Reference

### Send Notifications

**Appointment Reminder:**
```typescript
import { sendAppointmentReminder } from './src/utils/notificationManager';

await sendAppointmentReminder(
  appointmentId,
  'Dr. Smith',
  '10:00 AM',
  2 // hours until appointment
);
```

**Lab Result Ready:**
```typescript
import { sendLabResultNotification } from './src/utils/notificationManager';

await sendLabResultNotification(
  labResultId,
  'Complete Blood Count (CBC)',
  'Dr. Smith'
);
```

**Doctor Message:**
```typescript
import { sendDoctorMessageNotification } from './src/utils/notificationManager';

await sendDoctorMessageNotification(
  messageId,
  'Dr. Smith',
  'Your lab results are ready. Please review them at your earliest convenience.'
);
```

**Generic Notification:**
```typescript
import { sendNotification } from './src/utils/notificationManager';

await sendNotification({
  type: 'appointment',
  title: '📅 Appointment Reminder',
  body: 'Your appointment is coming up',
  data: {
    appointmentId: '123',
    doctorName: 'Dr. Smith'
  }
});
```

### Schedule for Specific Time

```typescript
import { scheduleNotificationForTime } from './src/utils/notificationManager';

const triggerDate = new Date();
triggerDate.setHours(triggerDate.getHours() + 2);

await scheduleNotificationForTime(
  {
    type: 'appointment',
    title: '📅 Appointment Reminder',
    body: 'Your appointment is in 2 hours',
    data: { appointmentId: '123' }
  },
  triggerDate
);
```

### Manage Notifications

```typescript
import { 
  cancelNotification, 
  cancelAllNotifications,
  getScheduledNotifications 
} from './src/utils/notificationManager';

// Cancel specific notification
await cancelNotification(notificationId);

// Cancel all notifications
await cancelAllNotifications();

// Get all scheduled notifications
const scheduled = await getScheduledNotifications();
```

## User Experience

### Notification Flow

1. **Doctor schedules appointment** → Patient receives notification 24h before
2. **Lab results are ready** → Patient receives instant notification
3. **Doctor sends message** → Patient receives immediate notification
4. **Patient opens Notifications tab** → Sees all notifications with timestamps
5. **Patient can manage** → Mark as read, delete, or clear all

### Notification Channels (Android)

- **Appointments**: High importance, vibration pattern
- **Lab Results**: High importance, vibration pattern
- **Messages**: Maximum importance, vibration pattern

### Notification Behavior

- Sound enabled for all notifications
- Vibration pattern: 250ms on, 250ms off, 250ms on
- Badge count updated
- Works in background
- Respects system Do Not Disturb

## Integration Points

### From Web/Desktop App

Doctors can trigger notifications by:
1. Scheduling appointments (triggers 24h and 1h reminders)
2. Marking lab results as ready
3. Sending messages to patients

### From Mobile App

Patients can:
1. View all notifications in Notifications Center
2. Mark notifications as read
3. Delete individual notifications
4. Clear all notifications

## Future Enhancements

- [ ] Notification preferences (enable/disable by type)
- [ ] Custom notification sounds
- [ ] Notification history/archive
- [ ] Notification categories/filtering
- [ ] Notification actions (reply, reschedule, etc.)
- [ ] Push notifications via backend
- [ ] Email notifications as fallback
- [ ] SMS notifications for critical alerts

## Testing

### Manual Testing

1. **Appointment Reminder:**
   - Schedule appointment in web/desktop app
   - Wait for notification or manually trigger
   - Verify notification appears with correct details

2. **Lab Results:**
   - Mark lab result as ready in web/desktop app
   - Verify notification appears immediately
   - Check notification shows test name

3. **Doctor Message:**
   - Send message from web/desktop app
   - Verify notification appears with message preview
   - Check doctor name is displayed

### Automated Testing

```typescript
// Test notification sending
import { sendAppointmentReminder } from './src/utils/notificationManager';

const notificationId = await sendAppointmentReminder(
  'test-apt-1',
  'Dr. Test',
  '10:00 AM',
  1
);

expect(notificationId).toBeDefined();
```

## Troubleshooting

### Notifications Not Appearing

1. **Check permissions:**
   - iOS: Settings → M-dawa → Notifications → Allow
   - Android: Settings → Apps → M-dawa → Notifications → Allow

2. **Check Do Not Disturb:**
   - Disable Do Not Disturb or add app to exceptions

3. **Check notification channels (Android):**
   - Settings → Apps → M-dawa → Notifications
   - Ensure channels are enabled

4. **Check app state:**
   - Notifications work in background
   - Verify app isn't force-stopped

### Notifications Not Clearing

- Manually clear from Notifications Center
- Or use "Clear All" button
- Notifications auto-clear after 24 hours

## Summary

The notification system provides:
- ✅ Real-time alerts for important events
- ✅ Centralized Notifications Center
- ✅ Multiple notification types
- ✅ Works in background
- ✅ Respects system settings
- ✅ Easy to manage and clear

---

**Status:** ✅ COMPLETE  
**Last Updated:** November 16, 2025  
**Version:** 1.0.0

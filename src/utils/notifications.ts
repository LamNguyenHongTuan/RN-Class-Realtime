import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Booking } from '../types';

// Configure notification behavior in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldPresentAlert: true,
  }),
});

export interface InAppAlert {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'success' | 'warning' | 'info';
  timestamp: string;
  booking?: Booking;
}

type AlertListener = (alert: InAppAlert) => void;
const listeners: AlertListener[] = [];

export function subscribeToInAppAlerts(cb: AlertListener): () => void {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function broadcastInAppAlert(alert: InAppAlert): void {
  listeners.forEach((l) => l(alert));
}

/**
 * Requests device notification permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      return res === 'granted';
    }
    return true;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

/**
 * Dispatches an immediate notification for quick testing
 */
export async function sendImmediateNotification(title: string, body: string, booking?: Booking): Promise<void> {
  // Broadcast in-app banner for guaranteed feedback on all platforms
  broadcastInAppAlert({
    id: `alert-${Date.now()}`,
    title,
    message: body,
    type: 'reminder',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    booking
  });

  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      }
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { bookingId: booking?.id },
        },
        trigger: null, // immediate
      });
    }
  } catch (err) {
    console.warn('[Notifications] Could not trigger native alert:', err);
  }
}

/**
 * Schedules a notification 15 minutes before slot start
 */
export async function scheduleBookingReminder(booking: Booking): Promise<void> {
  const [startH, startM] = booking.startTime.split(':').map(Number);
  const bookingDate = new Date(`${booking.date}T00:00:00`);
  bookingDate.setHours(startH, startM, 0, 0);

  // 15 minutes before
  const reminderTime = new Date(bookingDate.getTime() - 15 * 60 * 1000);
  const now = new Date();
  const diffSeconds = Math.round((reminderTime.getTime() - now.getTime()) / 1000);

  console.log(`[expo-notifications] Booking ${booking.passCode} starts at ${booking.startTime}. Reminder scheduled for ${reminderTime.toISOString()} (${diffSeconds}s away)`);

  if (diffSeconds > 0) {
    try {
      if (Platform.OS !== 'web') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🔔 VKU Check-in Reminder (15m Notice)',
            body: `Your booking for ${booking.roomName} begins at ${booking.startTime}. Prepare your QR Pass for door check-in.`,
            sound: true,
            data: { bookingId: booking.id, passCode: booking.passCode },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: diffSeconds,
          },
        });
      }
    } catch (e) {
      console.warn('[expo-notifications] Schedule error:', e);
    }
  }
}

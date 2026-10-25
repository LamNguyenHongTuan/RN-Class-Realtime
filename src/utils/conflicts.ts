import { Booking, TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-1', label: '07:30 - 09:30', startTime: '07:30', endTime: '09:30', shift: 'Morning' },
  { id: 'slot-2', label: '09:30 - 11:30', startTime: '09:30', endTime: '11:30', shift: 'Morning' },
  { id: 'slot-3', label: '13:00 - 15:00', startTime: '13:00', endTime: '15:00', shift: 'Afternoon' },
  { id: 'slot-4', label: '15:00 - 17:00', startTime: '15:00', endTime: '17:00', shift: 'Afternoon' },
  { id: 'slot-5', label: '17:30 - 19:30', startTime: '17:30', endTime: '19:30', shift: 'Evening' },
];

export interface DayOption {
  dateString: string; // "2026-10-25"
  dayName: string; // "Today" or "Mon"
  dayNumber: number; // 25
  monthName: string; // "Oct"
  isToday: boolean;
  fullLabel: string;
}

export function getUpcoming7Days(): DayOption[] {
  const days: DayOption[] = [];
  const now = new Date();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    
    days.push({
      dateString,
      dayName: i === 0 ? 'Today' : dayName,
      dayNumber: d.getDate(),
      monthName,
      isToday: i === 0,
      fullLabel: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    });
  }
  
  return days;
}

export function checkSlotConflict(
  bookings: Booking[],
  roomId: string,
  date: string,
  slotId: string
): { isConflict: boolean; conflictingBooking?: Booking } {
  const match = bookings.find(
    (b) =>
      b.roomId === roomId &&
      b.date === date &&
      b.slotId === slotId &&
      (b.status === 'active' || b.status === 'checked_in')
  );

  return {
    isConflict: Boolean(match),
    conflictingBooking: match
  };
}

export function isRoomCurrentlyOccupied(
  roomId: string,
  bookings: Booking[]
): boolean {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeVal = currentHours * 60 + currentMinutes;

  const currentSlot = TIME_SLOTS.find((s) => {
    const [startH, startM] = s.startTime.split(':').map(Number);
    const [endH, endM] = s.endTime.split(':').map(Number);
    const startVal = startH * 60 + startM;
    const endVal = endH * 60 + endM;
    return currentTimeVal >= startVal && currentTimeVal <= endVal;
  });

  if (!currentSlot) return false;

  return bookings.some(
    (b) =>
      b.roomId === roomId &&
      b.date === todayStr &&
      b.slotId === currentSlot.id &&
      (b.status === 'active' || b.status === 'checked_in')
  );
}

export function generatePassCode(building: string, roomNumber: string): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const cleanRoom = roomNumber.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return `VKU-${building}${cleanRoom}-${randomSuffix}`;
}

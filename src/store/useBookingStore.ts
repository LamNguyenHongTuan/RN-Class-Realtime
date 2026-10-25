import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Room, 
  Booking, 
  UserProfile, 
  FilterState, 
  BuildingCode, 
  EquipmentType 
} from '../types';
import { INITIAL_ROOMS } from '../data/mockRooms';
import { INITIAL_USER, getInitialBookings } from '../data/mockBookings';
import { generatePassCode, checkSlotConflict } from '../utils/conflicts';
import { scheduleBookingReminder, sendImmediateNotification } from '../utils/notifications';

interface BookingStoreState {
  user: UserProfile;
  rooms: Room[];
  bookings: Booking[];
  filters: FilterState;

  // Selected Room & Modal state
  selectedRoomForBooking: Room | null;
  selectedBookingForPass: Booking | null;
  isBookingModalVisible: boolean;
  isPassModalVisible: boolean;

  // Session Actions
  setUser: (user: UserProfile) => void;
  updateUser: (patch: Partial<UserProfile>) => void;

  // Filter Actions
  setSearchQuery: (query: string) => void;
  setSelectedBuilding: (building: BuildingCode | 'ALL') => void;
  setMinCapacity: (cap: number) => void;
  toggleEquipment: (eq: EquipmentType) => void;
  toggleOnlyAvailableNow: () => void;
  resetFilters: () => void;

  // Modal Actions
  openBookingModal: (room: Room) => void;
  closeBookingModal: () => void;
  openPassModal: (booking: Booking) => void;
  closePassModal: () => void;

  // Booking Actions
  createBooking: (params: {
    roomId: string;
    date: string;
    slotId: string;
    slotLabel: string;
    startTime: string;
    endTime: string;
    purpose: string;
    attendeesCount: number;
  }) => { success: boolean; error?: string; booking?: Booking };

  cancelBooking: (bookingId: string) => void;
  checkInBooking: (bookingId: string) => void;
  checkInByPassCode: (code: string) => { success: boolean; message: string; booking?: Booking };

  // Conflict query
  isSlotBooked: (roomId: string, date: string, slotId: string) => boolean;

  // Reset demo
  resetDemoData: () => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  selectedBuilding: 'ALL',
  minCapacity: 0,
  selectedEquipment: [],
  onlyAvailableNow: false,
};

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER,
      rooms: INITIAL_ROOMS,
      bookings: getInitialBookings(),
      filters: defaultFilters,

      selectedRoomForBooking: null,
      selectedBookingForPass: null,
      isBookingModalVisible: false,
      isPassModalVisible: false,

      setUser: (user) => set({ user }),
      updateUser: (patch) =>
        set((state) => ({ user: { ...state.user, ...patch } })),

      setSearchQuery: (searchQuery) =>
        set((state) => ({ filters: { ...state.filters, searchQuery } })),

      setSelectedBuilding: (selectedBuilding) =>
        set((state) => ({ filters: { ...state.filters, selectedBuilding } })),

      setMinCapacity: (minCapacity) =>
        set((state) => ({ filters: { ...state.filters, minCapacity } })),

      toggleEquipment: (eq) =>
        set((state) => {
          const current = state.filters.selectedEquipment;
          const exists = current.includes(eq);
          const next = exists ? current.filter((item) => item !== eq) : [...current, eq];
          return { filters: { ...state.filters, selectedEquipment: next } };
        }),

      toggleOnlyAvailableNow: () =>
        set((state) => ({
          filters: { ...state.filters, onlyAvailableNow: !state.filters.onlyAvailableNow },
        })),

      resetFilters: () => set({ filters: defaultFilters }),

      openBookingModal: (room) =>
        set({ selectedRoomForBooking: room, isBookingModalVisible: true }),

      closeBookingModal: () =>
        set({ selectedRoomForBooking: null, isBookingModalVisible: false }),

      openPassModal: (booking) =>
        set({ selectedBookingForPass: booking, isPassModalVisible: true }),

      closePassModal: () =>
        set({ selectedBookingForPass: null, isPassModalVisible: false }),

      isSlotBooked: (roomId, date, slotId) => {
        const { isConflict } = checkSlotConflict(get().bookings, roomId, date, slotId);
        return isConflict;
      },

      createBooking: ({ roomId, date, slotId, slotLabel, startTime, endTime, purpose, attendeesCount }) => {
        const state = get();
        const room = state.rooms.find((r) => r.id === roomId);
        if (!room) {
          return { success: false, error: 'Room not found' };
        }

        // Real-time conflict engine validation
        const conflict = checkSlotConflict(state.bookings, roomId, date, slotId);
        if (conflict.isConflict) {
          return {
            success: false,
            error: `Conflict detected! Slot is already reserved by ${conflict.conflictingBooking?.userName || 'another student'}.`
          };
        }

        const passCode = generatePassCode(room.building, room.roomNumber);
        const newBooking: Booking = {
          id: `book-${Date.now()}`,
          passCode,
          roomId: room.id,
          roomName: room.name,
          building: room.building,
          date,
          slotId,
          slotLabel,
          startTime,
          endTime,
          purpose: purpose.trim() || 'Academic Study Session',
          attendeesCount: attendeesCount || 1,
          userId: state.user.id,
          userName: state.user.fullName,
          userStudentId: state.user.studentId,
          status: 'active',
          createdAt: new Date().toISOString(),
          reminderScheduled: state.user.notificationEnabled,
        };

        const updatedBookings = [newBooking, ...state.bookings];

        set({
          bookings: updatedBookings,
          isBookingModalVisible: false,
          selectedRoomForBooking: null,
          selectedBookingForPass: newBooking,
          isPassModalVisible: true,
        });

        // Trigger local notification reminder
        if (state.user.notificationEnabled) {
          scheduleBookingReminder(newBooking);
        }

        sendImmediateNotification(
          '🎉 Booking Confirmed!',
          `${room.name} booked for ${date} (${slotLabel}). Pass: ${passCode}`,
          newBooking
        );

        return { success: true, booking: newBooking };
      },

      cancelBooking: (bookingId) => {
        set((state) => {
          const updated = state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
          );
          return {
            bookings: updated,
            isPassModalVisible: state.selectedBookingForPass?.id === bookingId ? false : state.isPassModalVisible,
          };
        });

        sendImmediateNotification(
          'Reservation Cancelled',
          'The study room slot has been released back to campus.'
        );
      },

      checkInBooking: (bookingId) => {
        set((state) => {
          const updated = state.bookings.map((b) =>
            b.id === bookingId
              ? { ...b, status: 'checked_in' as const, checkedInAt: new Date().toISOString() }
              : b
          );
          const currentPass = state.selectedBookingForPass?.id === bookingId
            ? { ...state.selectedBookingForPass, status: 'checked_in' as const, checkedInAt: new Date().toISOString() }
            : state.selectedBookingForPass;

          return { bookings: updated, selectedBookingForPass: currentPass };
        });

        sendImmediateNotification(
          '✅ Door Check-in Verified!',
          'Welcome to your study room. Electronic door lock opened.'
        );
      },

      checkInByPassCode: (code) => {
        const state = get();
        const trimmed = code.trim().toUpperCase();
        const match = state.bookings.find(
          (b) => b.passCode.toUpperCase() === trimmed && b.status === 'active'
        );

        if (!match) {
          return {
            success: false,
            message: 'Invalid pass code or booking is already checked-in/cancelled.'
          };
        }

        get().checkInBooking(match.id);
        return {
          success: true,
          message: `Verified pass for ${match.roomName} (${match.slotLabel})!`,
          booking: match
        };
      },

      resetDemoData: () => {
        set({
          rooms: INITIAL_ROOMS,
          bookings: getInitialBookings(),
          filters: defaultFilters,
          user: INITIAL_USER,
        });
      },
    }),
    {
      name: 'vku-booking-storage-async',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

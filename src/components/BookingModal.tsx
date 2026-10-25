import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '../store/useBookingStore';
import { TIME_SLOTS, getUpcoming7Days, checkSlotConflict } from '../utils/conflicts';

export const BookingModal: React.FC = () => {
  const { 
    selectedRoomForBooking: room, 
    isBookingModalVisible, 
    closeBookingModal, 
    bookings, 
    createBooking, 
    user 
  } = useBookingStore();

  const days = getUpcoming7Days();
  const [selectedDate, setSelectedDate] = useState<string>(days[0].dateString);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('Academic Study & Capstone Research');
  const [attendeesCount, setAttendeesCount] = useState<string>('4');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isBookingModalVisible || !room) return null;

  const currentDay = days.find((d) => d.dateString === selectedDate) || days[0];
  const selectedSlot = TIME_SLOTS.find((s) => s.id === selectedSlotId);

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlotId('');
    setErrorMessage(null);
  };

  const handleSlotSelect = (slotId: string, isConflict: boolean) => {
    if (isConflict) return;
    setSelectedSlotId(slotId);
    setErrorMessage(null);
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      setErrorMessage('Please choose an available 2-hour time slot');
      return;
    }

    const count = parseInt(attendeesCount, 10) || 1;
    const res = createBooking({
      roomId: room.id,
      date: selectedDate,
      slotId: selectedSlot.id,
      slotLabel: selectedSlot.label,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      purpose,
      attendeesCount: count,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to reserve slot');
    }
  };

  return (
    <Modal
      visible={isBookingModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeBookingModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <LinearGradient
            colors={['#dc2626', '#b91c1c']}
            style={styles.modalHeader}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.headerSubtitleRow}>
                <Ionicons name="location" size={12} color="#fca5a5" />
                <Text style={styles.headerSubtitleText}>
                  Building {room.building} • Floor {room.floor}
                </Text>
              </View>
              <Text style={styles.headerTitle}>{room.name}</Text>
              <Text style={styles.headerMeta}>
                Capacity: {room.capacity} students • #{room.roomNumber}
              </Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={closeBookingModal}>
              <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Modal Content Scroll */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* 7-Day Date Selector */}
            <Text style={styles.sectionTitle}>1. Select Date (7-Day Rolling Availability)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              {days.map((d) => {
                const isSelected = selectedDate === d.dateString;
                return (
                  <TouchableOpacity
                    key={d.dateString}
                    style={[styles.dateCard, isSelected && styles.dateCardActive]}
                    onPress={() => handleDateSelect(d.dateString)}
                  >
                    <Text style={[styles.dayNameText, isSelected && styles.textWhite]}>
                      {d.dayName}
                    </Text>
                    <Text style={[styles.dayNumText, isSelected && styles.textWhite]}>
                      {d.dayNumber}
                    </Text>
                    <Text style={[styles.monthText, isSelected && styles.textWhite]}>
                      {d.monthName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <Text style={styles.dateSubtext}>
              Selected: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{currentDay.fullLabel}</Text>
            </Text>

            {/* Time Slot Selector & Conflict Engine */}
            <View style={styles.slotHeaderRow}>
              <Text style={styles.sectionTitle}>2. 2-Hour Time Slots & Conflict Engine</Text>
              <Text style={styles.slotBadgeInfo}>Real-time check</Text>
            </View>

            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map((slot) => {
                const conflict = checkSlotConflict(bookings, room.id, selectedDate, slot.id);
                const isConflict = conflict.isConflict;
                const isSelected = selectedSlotId === slot.id;

                return (
                  <TouchableOpacity
                    key={slot.id}
                    disabled={isConflict}
                    style={[
                      styles.slotItem,
                      isConflict && styles.slotItemOccupied,
                      isSelected && styles.slotItemActive
                    ]}
                    onPress={() => handleSlotSelect(slot.id, isConflict)}
                  >
                    <View style={styles.slotTopRow}>
                      <Text style={[styles.slotLabel, isSelected && styles.slotLabelActive]}>
                        {slot.label}
                      </Text>
                      <View style={[
                        styles.slotStatusBadge,
                        isConflict ? styles.badgeOccupied : isSelected ? styles.badgeSelected : styles.badgeAvailable
                      ]}>
                        <Text style={[
                          styles.slotStatusText,
                          isConflict ? styles.textOccupied : isSelected ? styles.textSelected : styles.textAvailable
                        ]}>
                          {isConflict ? 'Occupied' : isSelected ? 'Selected' : 'Available'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.slotBottomRow}>
                      <Text style={styles.slotShiftText}>{slot.shift} Shift</Text>
                      {isConflict && conflict.conflictingBooking && (
                        <Text style={styles.conflictUserText} numberOfLines={1}>
                          Booked by {conflict.conflictingBooking.userName.split(' ').slice(-1)[0]}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Purpose input */}
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>3. Study Purpose & Group Details</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Capstone Project Teamwork, ICPC Contest Prep..."
              placeholderTextColor="#94a3b8"
              value={purpose}
              onChangeText={setPurpose}
            />

            <View style={styles.rowTwoCols}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>Attendees Count:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={attendeesCount}
                  onChangeText={setAttendeesCount}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.inputLabel}>Reserved By:</Text>
                <View style={styles.userInfoBox}>
                  <Text style={styles.userInfoText} numberOfLines={1}>
                    {user.fullName} ({user.studentId})
                  </Text>
                </View>
              </View>
            </View>

            {errorMessage && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#dc2626" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeBookingModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn, !selectedSlotId && styles.confirmBtnDisabled]}
                disabled={!selectedSlotId}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmBtnText}>Confirm & Generate QR</Text>
                <Ionicons name="arrow-forward" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerSubtitleText: {
    color: '#fee2e2',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  headerMeta: {
    color: '#fecaca',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  dateScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateCard: {
    width: 58,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    marginRight: 8,
  },
  dateCardActive: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  dayNameText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  dayNumText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 2,
  },
  monthText: {
    fontSize: 9,
    color: '#94a3b8',
  },
  textWhite: {
    color: '#ffffff',
  },
  dateSubtext: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 16,
  },
  slotHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slotBadgeInfo: {
    fontSize: 10,
    color: '#64748b',
  },
  slotsGrid: {
    gap: 8,
  },
  slotItem: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  slotItemOccupied: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    opacity: 0.6,
  },
  slotItemActive: {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
    borderWidth: 2,
  },
  slotTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  slotLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  slotLabelActive: {
    color: '#991b1b',
  },
  slotStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeAvailable: {
    backgroundColor: '#ecfdf5',
  },
  badgeOccupied: {
    backgroundColor: '#fee2e2',
  },
  badgeSelected: {
    backgroundColor: '#dc2626',
  },
  slotStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  textAvailable: {
    color: '#059669',
  },
  textOccupied: {
    color: '#b91c1c',
  },
  textSelected: {
    color: '#ffffff',
  },
  slotBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotShiftText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  conflictUserText: {
    fontSize: 11,
    color: '#d97706',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 10,
  },
  rowTwoCols: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  userInfoBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  userInfoText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  confirmBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirmBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});

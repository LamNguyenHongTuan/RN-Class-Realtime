import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '../store/useBookingStore';
import { sendImmediateNotification } from '../utils/notifications';

export const QRCodeModal: React.FC = () => {
  const { 
    selectedBookingForPass: booking, 
    isPassModalVisible, 
    closePassModal, 
    checkInBooking, 
    cancelBooking 
  } = useBookingStore();

  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);

  if (!isPassModalVisible || !booking) return null;

  const isCheckedIn = booking.status === 'checked_in';
  const isCancelled = booking.status === 'cancelled';

  const handleSimulateCheckIn = () => {
    checkInBooking(booking.id);
  };

  const handleTriggerTestReminder = () => {
    sendImmediateNotification(
      '🔔 VKU Check-in Reminder (15 Min Notice)',
      `Reminder: Your reservation for ${booking.roomName} begins at ${booking.startTime}. Scan your pass at the door reader.`,
      booking
    );
  };

  const handleConfirmCancel = () => {
    cancelBooking(booking.id);
    setConfirmCancelVisible(false);
  };

  const qrPayload = JSON.stringify({
    passCode: booking.passCode,
    room: booking.roomName,
    date: booking.date,
    slot: booking.slotLabel,
    studentId: booking.userStudentId,
    verifiedBy: 'VKU-ACCESS-GATEWAY'
  });

  return (
    <Modal
      visible={isPassModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closePassModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.passSheet}>
          {/* Header Gradient */}
          <LinearGradient
            colors={['#dc2626', '#b91c1c']}
            style={styles.passHeader}
          >
            <TouchableOpacity style={styles.closeBtn} onPress={closePassModal}>
              <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.badgePill}>
              <Ionicons name="sparkles" size={12} color="#fef08a" />
              <Text style={styles.badgePillText}>VKU Digital Room Access Pass</Text>
            </View>

            <Text style={styles.passRoomTitle}>{booking.roomName}</Text>
            <Text style={styles.passRoomSubtitle}>
              Building {booking.building} • {booking.slotLabel}
            </Text>
          </LinearGradient>

          {/* Notch divider */}
          <View style={styles.notchContainer}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          {/* Pass Body Scroll */}
          <ScrollView contentContainerStyle={styles.passBody}>
            {/* QR Card Container */}
            <View style={styles.qrCard}>
              <View style={styles.statusPill}>
                {isCheckedIn ? (
                  <View style={styles.statusVerifiedRow}>
                    <Ionicons name="shield-checkmark" size={14} color="#059669" />
                    <Text style={styles.statusVerifiedText}>DOOR CHECK-IN VERIFIED</Text>
                  </View>
                ) : isCancelled ? (
                  <Text style={styles.statusCancelledText}>CANCELLED</Text>
                ) : (
                  <View style={styles.statusReadyRow}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.statusReadyText}>READY TO SCAN AT DOOR</Text>
                  </View>
                )}
              </View>

              {/* Native SVG QR Code */}
              <View style={styles.qrWrapper}>
                <QRCode
                  value={qrPayload}
                  size={160}
                  color="#0f172a"
                  backgroundColor="#ffffff"
                />
              </View>

              <Text style={styles.passCodeLabel}>ACCESS PASS CODE</Text>
              <Text style={styles.passCodeValue}>{booking.passCode}</Text>
            </View>

            {/* Meta details list */}
            <View style={styles.metaList}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Date:</Text>
                <Text style={styles.metaVal}>{booking.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Time Slot:</Text>
                <Text style={styles.metaVal}>{booking.slotLabel} ({booking.startTime} - {booking.endTime})</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Student:</Text>
                <Text style={styles.metaVal}>{booking.userName} ({booking.userStudentId})</Text>
              </View>
              <View style={[styles.metaItem, { borderBottomWidth: 0 }]}>
                <Text style={styles.metaLabel}>Topic:</Text>
                <Text style={styles.metaVal} numberOfLines={1}>{booking.purpose}</Text>
              </View>
            </View>

            {/* Interactive Simulator Buttons */}
            <View style={styles.actionButtonsCol}>
              {!isCheckedIn && !isCancelled && (
                <TouchableOpacity
                  style={styles.simulateCheckInBtn}
                  onPress={handleSimulateCheckIn}
                >
                  <Ionicons name="key-outline" size={16} color="#ffffff" />
                  <Text style={styles.simulateCheckInText}>Simulate Door QR Check-in</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.reminderTestBtn}
                onPress={handleTriggerTestReminder}
              >
                <Ionicons name="notifications-outline" size={16} color="#d97706" />
                <Text style={styles.reminderTestText}>Test 15-Minute Reminder Alert</Text>
              </TouchableOpacity>

              {!isCancelled && !confirmCancelVisible && (
                <TouchableOpacity
                  style={styles.cancelPassBtn}
                  onPress={() => setConfirmCancelVisible(true)}
                >
                  <Ionicons name="trash-outline" size={14} color="#94a3b8" />
                  <Text style={styles.cancelPassText}>Cancel Reservation</Text>
                </TouchableOpacity>
              )}

              {confirmCancelVisible && (
                <View style={styles.confirmCancelBox}>
                  <Text style={styles.confirmCancelQuestion}>
                    Cancel this room reservation?
                  </Text>
                  <View style={styles.confirmCancelActions}>
                    <TouchableOpacity
                      style={styles.btnKeep}
                      onPress={() => setConfirmCancelVisible(false)}
                    >
                      <Text style={styles.btnKeepText}>Keep</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnConfirmCancel}
                      onPress={handleConfirmCancel}
                    >
                      <Text style={styles.btnConfirmCancelText}>Confirm Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  passSheet: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
    maxHeight: '92%',
  },
  passHeader: {
    padding: 18,
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 6,
  },
  badgePillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  passRoomTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  passRoomSubtitle: {
    color: '#fee2e2',
    fontSize: 12,
    marginTop: 2,
  },
  notchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: -8,
    zIndex: 10,
  },
  notchLeft: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    marginLeft: -8,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    marginHorizontal: 4,
  },
  notchRight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    marginRight: -8,
  },
  passBody: {
    padding: 18,
  },
  qrCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  statusPill: {
    marginBottom: 10,
  },
  statusVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusVerifiedText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  statusReadyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusReadyText: {
    color: '#b91c1c',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  statusCancelledText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#dc2626',
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  passCodeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  passCodeValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 1,
  },
  metaList: {
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    maxWidth: '65%',
  },
  actionButtonsCol: {
    gap: 8,
  },
  simulateCheckInBtn: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    gap: 6,
  },
  simulateCheckInText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  reminderTestBtn: {
    backgroundColor: '#fef3c7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  reminderTestText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 4,
  },
  cancelPassText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  confirmCancelBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmCancelQuestion: {
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '700',
    marginBottom: 8,
  },
  confirmCancelActions: {
    flexDirection: 'row',
    gap: 8,
  },
  btnKeep: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  btnKeepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  btnConfirmCancel: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  btnConfirmCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});

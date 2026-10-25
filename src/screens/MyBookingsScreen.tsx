import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { Booking } from '../types';
import { useTheme } from '../hooks/useTheme';

export const MyBookingsScreen: React.FC = () => {
  const { bookings, user, openPassModal, cancelBooking } = useBookingStore();
  const [tabType, setTabType] = useState<'upcoming' | 'history'>('upcoming');
  const theme = useTheme();

  const userBookings = bookings.filter((b) => b.userId === user.id);

  const upcomingBookings = userBookings.filter(
    (b) => b.status === 'active' || b.status === 'checked_in'
  );

  const historyBookings = userBookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const displayed = tabType === 'upcoming' ? upcomingBookings : historyBookings;

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isCheckedIn = item.status === 'checked_in';
    const isCancelled = item.status === 'cancelled';

    return (
      <View style={[styles.bookingCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        {/* Status stripe */}
        <View style={[
          styles.stripe,
          isCheckedIn ? styles.stripeGreen : isCancelled ? styles.stripeGrey : styles.stripeRed
        ]} />

        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={12} color="#dc2626" />
                <Text style={styles.metaText}>Bldg {item.building} • Pass: {item.passCode}</Text>
              </View>
              <Text style={[styles.roomName, { color: theme.textPrimary }]}>{item.roomName}</Text>
            </View>

            <View style={[
              styles.statusPill,
              isCheckedIn ? styles.pillGreen : isCancelled ? styles.pillGrey : styles.pillRed
            ]}>
              <Text style={[
                styles.statusPillText,
                isCheckedIn ? styles.textGreen : isCancelled ? styles.textGrey : styles.textRed
              ]}>
                {isCheckedIn ? 'Checked In' : isCancelled ? 'Cancelled' : 'Ready'}
              </Text>
            </View>
          </View>

          {/* Time & Date Box */}
          <View style={[styles.timeBox, { backgroundColor: theme.sectionBg }]}>
            <View style={styles.timeItem}>
              <Ionicons name="calendar-outline" size={13} color="#dc2626" />
              <Text style={styles.timeItemText}>{item.date}</Text>
            </View>
            <View style={styles.timeItem}>
              <Ionicons name="time-outline" size={13} color="#2563eb" />
              <Text style={styles.timeItemText}>{item.slotLabel}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.openPassBtn}
              onPress={() => openPassModal(item)}
            >
              <Ionicons name="qr-code-outline" size={14} color="#ffffff" />
              <Text style={styles.openPassText}>View QR Pass</Text>
            </TouchableOpacity>

            {!isCancelled && !isCheckedIn && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => cancelBooking(item.id)}
              >
                <Ionicons name="trash-outline" size={14} color="#64748b" />
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Tab Switcher */}
      <View style={[styles.tabSwitchContainer, { backgroundColor: theme.isDark ? '#1e293b' : '#e2e8f0' }]}>
        <TouchableOpacity
          style={[styles.switchBtn, tabType === 'upcoming' && [styles.switchBtnActive, { backgroundColor: theme.card }]]}
          onPress={() => setTabType('upcoming')}
        >
          <Text style={[styles.switchText, { color: theme.textMuted }, tabType === 'upcoming' && styles.switchTextActive]}>
            Active Passes ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchBtn, tabType === 'history' && [styles.switchBtnActive, { backgroundColor: theme.card }]]}
          onPress={() => setTabType('history')}
        >
          <Text style={[styles.switchText, { color: theme.textMuted }, tabType === 'history' && styles.switchTextActive]}>
            History ({historyBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayed}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={48} color="#94a3b8" />
            <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>
              {tabType === 'upcoming' ? 'No active passes' : 'No reservation history'}
            </Text>
            <Text style={[styles.emptySub, { color: theme.textMuted }]}>
              {tabType === 'upcoming'
                ? 'Reserve a 2-hour slot to access campus labs and study rooms.'
                : 'Past bookings and cancellations will appear here.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    margin: 14,
    borderRadius: 12,
    padding: 3,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  switchBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  switchText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  switchTextActive: {
    color: '#dc2626',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 90,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  stripe: {
    width: 6,
  },
  stripeGreen: {
    backgroundColor: '#10b981',
  },
  stripeRed: {
    backgroundColor: '#dc2626',
  },
  stripeGrey: {
    backgroundColor: '#cbd5e1',
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaText: {
    fontSize: 10,
    color: '#64748b',
    marginLeft: 3,
    fontWeight: '600',
  },
  roomName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pillGreen: {
    backgroundColor: '#ecfdf5',
  },
  pillRed: {
    backgroundColor: '#fee2e2',
  },
  pillGrey: {
    backgroundColor: '#f1f5f9',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  textGreen: {
    color: '#059669',
  },
  textRed: {
    color: '#b91c1c',
  },
  textGrey: {
    color: '#64748b',
  },
  timeBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeItemText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  openPassBtn: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 5,
  },
  openPassText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  cancelText: {
    fontSize: 11,
    color: '#64748b',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
});

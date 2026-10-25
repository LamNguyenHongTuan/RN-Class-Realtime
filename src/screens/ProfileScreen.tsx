import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Switch, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '../store/useBookingStore';
import { sendImmediateNotification } from '../utils/notifications';

export const ProfileScreen: React.FC = () => {
  const { user, updateUser, bookings, resetDemoData } = useBookingStore();

  const userBookings = bookings.filter((b) => b.userId === user.id);
  const activeCount = userBookings.filter((b) => b.status === 'active' || b.status === 'checked_in').length;
  const completedCount = userBookings.filter((b) => b.status === 'checked_in').length;
  const totalHours = userBookings.filter((b) => b.status !== 'cancelled').length * 2;

  const handleTestAlert = () => {
    sendImmediateNotification(
      '🔔 VKU Check-in Reminder (15 Min Notice)',
      `Hello ${user.fullName}! Your reservation begins in 15 minutes. Prepare for electronic door scanning.`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* VKU Virtual Student ID Card */}
      <LinearGradient
        colors={['#dc2626', '#b91c1c', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.idCard}
      >
        <View style={styles.idHeader}>
          <View style={styles.vkuLogoBox}>
            <Text style={styles.vkuLogoText}>VKU</Text>
          </View>
          <View>
            <Text style={styles.idSubLabel}>VIETNAM - KOREA UNIVERSITY</Text>
            <Text style={styles.idTitle}>Digital Student Identity</Text>
          </View>
          <View style={styles.activeStudentPill}>
            <Text style={styles.activeStudentText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.idBody}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
          <View style={styles.idInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.studentIdText}>ID: {user.studentId}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
            <Text style={styles.userDept} numberOfLines={1}>{user.department}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Counter Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: '#dc2626' }]}>{activeCount}</Text>
          <Text style={styles.statLabel}>Active Passes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: '#059669' }]}>{completedCount}</Text>
          <Text style={styles.statLabel}>Checked-in</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: '#2563eb' }]}>{totalHours}h</Text>
          <Text style={styles.statLabel}>Total Reserved</Text>
        </View>
      </View>

      {/* Settings Card */}
      <View style={styles.settingsCard}>
        <Text style={styles.settingsHeader}>Notification & Reminder Engine</Text>

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>15-Minute Advance Reminder</Text>
            <Text style={styles.settingSub}>expo-notifications alert before slot starts</Text>
          </View>
          <Switch
            value={user.notificationEnabled}
            onValueChange={(val) => updateUser({ notificationEnabled: val })}
            trackColor={{ false: '#cbd5e1', true: '#fca5a5' }}
            thumbColor={user.notificationEnabled ? '#dc2626' : '#f8fafc'}
          />
        </View>

        <TouchableOpacity style={styles.testAlertBtn} onPress={handleTestAlert}>
          <Ionicons name="notifications-outline" size={16} color="#ffffff" />
          <Text style={styles.testAlertBtnText}>Test 15-Minute Alert Now</Text>
        </TouchableOpacity>
      </View>

      {/* Reset Demo */}
      <View style={styles.resetCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.resetTitle}>Reset Demo Data</Text>
          <Text style={styles.resetSub}>Restores default rooms and sample reservations</Text>
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={resetDemoData}>
          <Ionicons name="refresh-outline" size={14} color="#dc2626" />
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  idCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  idHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  vkuLogoBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  vkuLogoText: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 12,
  },
  idSubLabel: {
    color: '#fecaca',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  idTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  activeStudentPill: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activeStudentText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  idBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    marginRight: 12,
  },
  idInfo: {
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  studentIdText: {
    color: '#fde047',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  userEmail: {
    color: '#fee2e2',
    fontSize: 11,
    marginTop: 2,
  },
  userDept: {
    color: '#fca5a5',
    fontSize: 10,
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  settingsHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 12,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  settingSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  testAlertBtn: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  testAlertBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  resetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  resetSub: {
    fontSize: 10,
    color: '#64748b',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  resetBtnText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
  },
});

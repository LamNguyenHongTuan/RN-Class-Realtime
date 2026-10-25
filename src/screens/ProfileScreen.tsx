import React from 'react';
import { 
  View, Text, StyleSheet, Image, Switch, 
  TouchableOpacity, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useBookingStore } from '../store/useBookingStore';
import { sendImmediateNotification } from '../utils/notifications';
import { VKULogo } from '../components/VKULogo';
import { VKU_COLORS } from '../constants/colors';
import { useTheme } from '../hooks/useTheme';

export const ProfileScreen: React.FC = () => {
  const { user, updateUser, bookings, resetDemoData, toggleTheme } = useBookingStore();
  const theme = useTheme();

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
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.bg }]} 
      contentContainerStyle={styles.content}
    >
      {/* VKU Virtual Student ID Card */}
      <LinearGradient
        colors={[VKU_COLORS.darkBlue, VKU_COLORS.navy, '#111827']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.idCard}
      >
        <View style={styles.idHeader}>
          <View style={styles.vkuLogoBadge}>
            <VKULogo width={64} height={32} />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
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

        <View style={styles.triColorStrip}>
          <View style={[styles.stripSegment, { backgroundColor: VKU_COLORS.red }]} />
          <View style={[styles.stripSegment, { backgroundColor: VKU_COLORS.gold }]} />
          <View style={[styles.stripSegment, { backgroundColor: VKU_COLORS.blue }]} />
        </View>
      </LinearGradient>

      {/* Stats Counter Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.statNum, { color: VKU_COLORS.red }]}>{activeCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Active Passes</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.statNum, { color: '#059669' }]}>{completedCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Checked-in</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.statNum, { color: VKU_COLORS.blue }]}>{totalHours}h</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Total Reserved</Text>
        </View>
      </View>

      {/* Appearance Card — Dark/Light Mode Toggle */}
      <View style={[styles.settingsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.settingsHeader, { color: theme.textMuted }]}>Appearance</Text>

        <View style={[styles.settingRow, { borderBottomColor: theme.divider }]}>
          <View style={styles.settingLabelRow}>
            <Ionicons 
              name={theme.isDark ? 'moon' : 'sunny'} 
              size={18} 
              color={VKU_COLORS.gold} 
              style={styles.settingIcon}
            />
            <View>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>
                {theme.isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={[styles.settingSub, { color: theme.textMuted }]}>
                {theme.isDark ? 'Nền tối đang bật' : 'Nền sáng đang bật'}
              </Text>
            </View>
          </View>
          <Switch
            value={theme.isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#cbd5e1', true: VKU_COLORS.darkBlue }}
            thumbColor={theme.isDark ? VKU_COLORS.gold : '#f8fafc'}
            ios_backgroundColor="#cbd5e1"
          />
        </View>
      </View>

      {/* Notification Settings Card */}
      <View style={[styles.settingsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.settingsHeader, { color: theme.textMuted }]}>Notification & Reminder Engine</Text>

        <View style={[styles.settingRow, { borderBottomColor: theme.divider }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>15-Minute Advance Reminder</Text>
            <Text style={[styles.settingSub, { color: theme.textMuted }]}>expo-notifications alert before slot starts</Text>
          </View>
          <Switch
            value={user.notificationEnabled}
            onValueChange={(val) => updateUser({ notificationEnabled: val })}
            trackColor={{ false: '#cbd5e1', true: VKU_COLORS.lightGold }}
            thumbColor={user.notificationEnabled ? VKU_COLORS.gold : '#f8fafc'}
          />
        </View>

        <TouchableOpacity style={styles.testAlertBtn} onPress={handleTestAlert}>
          <Ionicons name="notifications-outline" size={16} color="#ffffff" />
          <Text style={styles.testAlertBtnText}>Test 15-Minute Alert Now</Text>
        </TouchableOpacity>
      </View>

      {/* Reset Demo */}
      <View style={[styles.resetCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.resetTitle, { color: theme.textPrimary }]}>Reset Demo Data</Text>
          <Text style={[styles.resetSub, { color: theme.textMuted }]}>Restores default rooms and sample reservations</Text>
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={resetDemoData}>
          <Ionicons name="refresh-outline" size={14} color={VKU_COLORS.red} />
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 90 },
  idCard: { borderRadius: 22, padding: 18, marginBottom: 16, overflow: 'hidden' },
  idHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  vkuLogoBadge: { backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  idSubLabel: { color: VKU_COLORS.gold, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  idTitle: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  activeStudentPill: { backgroundColor: 'rgba(16, 185, 129, 0.9)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  activeStudentText: { color: '#ffffff', fontSize: 9, fontWeight: '800' },
  idBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarImage: { width: 62, height: 62, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)', marginRight: 12 },
  idInfo: { flex: 1 },
  userName: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  studentIdText: { color: VKU_COLORS.gold, fontSize: 13, fontWeight: '800', marginTop: 1 },
  userEmail: { color: '#cbd5e1', fontSize: 11, marginTop: 2 },
  userDept: { color: '#94a3b8', fontSize: 10, marginTop: 1 },
  triColorStrip: { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 4 },
  stripSegment: { flex: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1 },
  statNum: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 10, marginTop: 2 },
  settingsCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 14 },
  settingsHeader: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, marginBottom: 12 },
  settingLabelRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { marginRight: 10 },
  settingTitle: { fontSize: 13, fontWeight: '700' },
  settingSub: { fontSize: 11, marginTop: 2 },
  testAlertBtn: { backgroundColor: VKU_COLORS.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, gap: 6 },
  testAlertBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  resetCard: { borderRadius: 16, padding: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  resetTitle: { fontSize: 12, fontWeight: '700' },
  resetSub: { fontSize: 10 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, gap: 4 },
  resetBtnText: { color: VKU_COLORS.red, fontSize: 11, fontWeight: '700' },
});

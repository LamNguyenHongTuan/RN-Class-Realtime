import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VKULogo } from '../components/VKULogo';
import { VKU_COLORS } from '../constants/colors';

export const ReportScreen: React.FC = () => {
  const handlePrint = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Print action bar for Web/PWA */}
      {Platform.OS === 'web' && (
        <View style={styles.actionBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionBarTitle}>Official Project Report (2–4 Pages)</Text>
            <Text style={styles.actionBarSub}>
              Adhering to official template: Checklist, Architecture & Conflict Engine.
            </Text>
          </View>
          <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
            <Ionicons name="print-outline" size={16} color="#ffffff" />
            <Text style={styles.printBtnText}>Save as PDF</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Report Document */}
      <View style={styles.reportSheet}>
        {/* Header with Official Logo */}
        <View style={styles.docHeader}>
          <View style={styles.logoRow}>
            <VKULogo width={90} height={46} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.univText}>VIETNAM - KOREA UNIVERSITY OF ICT (VKU)</Text>
              <Text style={styles.reportTitle}>MINI-PROJECT 2 TECHNICAL REPORT</Text>
            </View>
          </View>
          <Text style={styles.reportSubtitle}>
            Real-time Study Room Booking App (React Native & Expo SDK)
          </Text>
          <Text style={styles.metaRow}>
            Student ID: 21IT001 • Major: Computer Science • Date: October 2026
          </Text>
        </View>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>1. Project Overview & Problem Scenario</Text>
          <Text style={styles.bodyText}>
            VKU students and study squads require a fast, reliable mobile app to check real-time availability and reserve campus computer labs and study rooms without physical door checks or booking collisions across Buildings A, B, C, and V.
          </Text>
          <Text style={styles.bodyText}>
            This application is constructed using React Native, Expo SDK, TypeScript, Zustand with AsyncStorage persistence, and React Navigation. The UI is designed according to VKU's brand identity with 3 core colors: Crimson Red (#C81F32), Gold/Orange (#F6961E), and Navy Blue (#364E8A).
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>2. Core Functional Feature Checklist</Text>

          <View style={styles.checkCard}>
            <Text style={styles.checkTitle}>✓ Room Discovery & Multi-Parameter Filter</Text>
            <Text style={styles.checkItem}>• High-performance FlatList feed with 60fps scrolling</Text>
            <Text style={styles.checkItem}>• Dynamic status badges: Available Now vs In Use Now</Text>
            <Text style={styles.checkItem}>• Instant search with debouncing across room names</Text>
            <Text style={styles.checkItem}>• Building filter chips: Buildings A, B, C, and V</Text>
            <Text style={styles.checkItem}>• Capacity slider/threshold filter (2–20 students)</Text>
            <Text style={styles.checkItem}>• Equipment chips: Projector, Whiteboard, High-spec PC, AC</Text>
          </View>

          <View style={styles.checkCard}>
            <Text style={styles.checkTitle}>✓ Interactive Time-Slot Selector & Conflict Engine</Text>
            <Text style={styles.checkItem}>• 7-day rolling calendar selector</Text>
            <Text style={styles.checkItem}>• 2-hour discrete slots: 07:30–09:30, 09:30–11:30, 13:00–15:00, 15:00–17:00, 17:30–19:30</Text>
            <Text style={styles.checkItem}>• Real-time conflict engine: occupied slots are disabled</Text>
            <Text style={styles.checkItem}>• Cryptographic booking pass code & SVG QR code modal</Text>
          </View>

          <View style={styles.checkCard}>
            <Text style={styles.checkTitle}>✓ Zustand Store & AsyncStorage Persistence</Text>
            <Text style={styles.checkItem}>• Dedicated useBookingStore managing session & active reservations</Text>
            <Text style={styles.checkItem}>• Persistence via @react-native-async-storage/async-storage</Text>
            <Text style={styles.checkItem}>• Optimistic reservation updates & cancellation actions</Text>
          </View>

          <View style={styles.checkCard}>
            <Text style={styles.checkTitle}>✓ Local Notifications & Door Scanner Simulator</Text>
            <Text style={styles.checkItem}>• Integrates expo-notifications for 15-minute advance reminder</Text>
            <Text style={styles.checkItem}>• Optical reticle simulator for pass code verification</Text>
            <Text style={styles.checkItem}>• 1-click test simulation for instant evaluation</Text>
          </View>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>3. FlatList 60fps Optimization Analysis</Text>
          <Text style={styles.bodyText}>
            The list feed utilizes React Native's native {'<FlatList />'} configured with:
          </Text>
          <Text style={styles.codeSnippet}>
            {`<FlatList\n  data={filteredRooms}\n  renderItem={renderRoomItem}\n  initialNumToRender={4}\n  maxToRenderPerBatch={4}\n  windowSize={5}\n  removeClippedSubviews={true}\n/>`}
          </Text>
          <Text style={styles.bodyText}>
            RoomCard is wrapped in React.memo with a custom comparator checking id, occupancy, capacity, and name, eliminating redundant re-renders during high-speed vertical gestures.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>4. Submission Package Deliverables</Text>
          <Text style={styles.bodyText}>1. Live Demo PWA: Exportable with "npx expo export -p web" to dist/ for Cloudflare Pages / Vercel.</Text>
          <Text style={styles.bodyText}>2. GitHub Repository: Public repo with modular architecture & README.md.</Text>
          <Text style={styles.bodyText}>3. Technical Report (PDF): Generated from this document.</Text>
        </View>
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
  actionBar: {
    backgroundColor: VKU_COLORS.lightBlue,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  actionBarTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: VKU_COLORS.darkBlue,
  },
  actionBarSub: {
    fontSize: 11,
    color: VKU_COLORS.blue,
  },
  printBtn: {
    backgroundColor: VKU_COLORS.red,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  printBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  reportSheet: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  docHeader: {
    borderBottomWidth: 2,
    borderBottomColor: VKU_COLORS.blue,
    paddingBottom: 12,
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  univText: {
    fontSize: 10,
    fontWeight: '800',
    color: VKU_COLORS.red,
    letterSpacing: 0.5,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: VKU_COLORS.darkBlue,
    marginTop: 2,
  },
  reportSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  metaRow: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: VKU_COLORS.darkBlue,
    borderLeftWidth: 4,
    borderLeftColor: VKU_COLORS.red,
    paddingLeft: 8,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#334155',
    marginBottom: 6,
  },
  checkCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  checkTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: VKU_COLORS.darkBlue,
    marginBottom: 4,
  },
  checkItem: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    marginLeft: 6,
  },
  codeSnippet: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#0f172a',
    color: '#a7f3d0',
    fontSize: 11,
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
});

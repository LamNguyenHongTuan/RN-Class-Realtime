import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { VKU_COLORS } from '../constants/colors';

export const QRScannerScreen: React.FC = () => {
  const { checkInByPassCode, bookings } = useBookingStore();
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string; room?: string } | null>(null);

  const activeBookings = bookings.filter((b) => b.status === 'active');

  const handleValidate = (codeToTest: string) => {
    const res = checkInByPassCode(codeToTest);
    if (res.success && res.booking) {
      setResult({
        success: true,
        message: res.message,
        room: res.booking.roomName
      });
    } else {
      setResult({
        success: false,
        message: res.message
      });
    }
    setManualCode('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Door Access Scanner</Text>
      <Text style={styles.screenSub}>
        Point camera at the room door scanner or enter your pass code
      </Text>

      {/* Camera Simulator Reticle */}
      <View style={styles.viewfinderCard}>
        <View style={styles.reticleBox}>
          {/* Corner brackets */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          <Ionicons name="camera-outline" size={42} color="rgba(255,255,255,0.4)" />
          <Text style={styles.reticleText}>Target Door QR Pass</Text>
        </View>

        <View style={styles.statusIndicator}>
          <View style={styles.pingDot} />
          <Text style={styles.indicatorText}>Optical Sensor Simulator Active</Text>
        </View>
      </View>

      {/* Verification Feedback Result */}
      {result && (
        <View style={[styles.resultCard, result.success ? styles.resultSuccess : styles.resultError]}>
          <Ionicons 
            name={result.success ? "lock-open-outline" : "alert-circle-outline"} 
            size={24} 
            color={result.success ? "#059669" : VKU_COLORS.red} 
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.resultTitle, result.success ? styles.textGreen : styles.textRed]}>
              {result.success ? 'Door Unlocked: Access Granted!' : 'Verification Failed'}
            </Text>
            <Text style={styles.resultMsg}>{result.message}</Text>
          </View>
          <TouchableOpacity onPress={() => setResult(null)}>
            <Ionicons name="close" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>
      )}

      {/* Manual Code Input */}
      <View style={styles.inputCard}>
        <Text style={styles.inputCardLabel}>ENTER PASS CODE MANUALLY</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.codeInput}
            placeholder="e.g. VKU-V401-7821"
            placeholderTextColor="#94a3b8"
            autoCapitalize="characters"
            value={manualCode}
            onChangeText={setManualCode}
          />
          <TouchableOpacity 
            style={[styles.checkInBtn, !manualCode.trim() && styles.checkInBtnDisabled]}
            disabled={!manualCode.trim()}
            onPress={() => handleValidate(manualCode)}
          >
            <Text style={styles.checkInBtnText}>Check In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Test Passes */}
      {activeBookings.length > 0 && (
        <View style={styles.quickTestCard}>
          <View style={styles.quickTestHeader}>
            <Ionicons name="flash" size={14} color={VKU_COLORS.gold} />
            <Text style={styles.quickTestTitle}>Quick-Test Active Passes (1-Click):</Text>
          </View>
          <View style={styles.quickTestWrap}>
            {activeBookings.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={styles.quickPill}
                onPress={() => handleValidate(b.passCode)}
              >
                <View style={styles.greenDot} />
                <Text style={styles.quickPillText}>{b.passCode}</Text>
                <Text style={styles.quickPillSub}>({b.roomName.split(' ')[0]})</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  screenSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  viewfinderCard: {
    backgroundColor: '#090d16',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  reticleBox: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: 'rgba(246, 150, 30, 0.4)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: VKU_COLORS.red,
  },
  cornerTL: {
    top: 4,
    left: 4,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cornerTR: {
    top: 4,
    right: 4,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
  },
  cornerBL: {
    bottom: 4,
    left: 4,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cornerBR: {
    bottom: 4,
    right: 4,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
  },
  reticleText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: VKU_COLORS.gold,
    marginRight: 6,
  },
  indicatorText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  resultSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  resultError: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  resultMsg: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  textGreen: {
    color: '#059669',
  },
  textRed: {
    color: VKU_COLORS.red,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  inputCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    fontWeight: '700',
  },
  checkInBtn: {
    backgroundColor: VKU_COLORS.red,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  checkInBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  checkInBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  quickTestCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickTestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  quickTestTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  quickTestWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: VKU_COLORS.blue,
  },
  quickPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  quickPillSub: {
    fontSize: 10,
    color: '#94a3b8',
  },
});

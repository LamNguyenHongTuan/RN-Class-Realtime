import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InAppAlert, subscribeToInAppAlerts } from '../utils/notifications';
import { useBookingStore } from '../store/useBookingStore';

export const NotificationBanner: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<InAppAlert | null>(null);
  const { openPassModal } = useBookingStore();
  const slideAnim = useState(new Animated.Value(-100))[0];

  useEffect(() => {
    const unsub = subscribeToInAppAlerts((alert) => {
      setActiveAlert(alert);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -120,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setActiveAlert(null));
      }, 5000);

      return () => clearTimeout(timer);
    });

    return unsub;
  }, []);

  if (!activeAlert) return null;

  const handleOpenPass = () => {
    if (activeAlert.booking) {
      openPassModal(activeAlert.booking);
      setActiveAlert(null);
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.alertCard}>
        <Ionicons name="notifications" size={20} color="#dc2626" style={styles.icon} />
        
        <View style={{ flex: 1 }}>
          <View style={styles.topRow}>
            <Text style={styles.title}>{activeAlert.title}</Text>
            <Text style={styles.time}>{activeAlert.timestamp}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>{activeAlert.message}</Text>

          {activeAlert.booking && (
            <TouchableOpacity style={styles.passBtn} onPress={handleOpenPass}>
              <Ionicons name="qr-code" size={12} color="#ffffff" />
              <Text style={styles.passBtnText}>Open QR Pass</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => setActiveAlert(null)} style={styles.closeBtn}>
          <Ionicons name="close" size={16} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 14 : 50,
    left: 14,
    right: 14,
    zIndex: 9999,
  },
  alertCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  time: {
    color: '#94a3b8',
    fontSize: 10,
  },
  message: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
  },
  passBtn: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    gap: 4,
  },
  passBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
    marginLeft: 6,
  },
});

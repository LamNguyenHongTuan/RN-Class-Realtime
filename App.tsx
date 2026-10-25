import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { BookingModal } from './src/components/BookingModal';
import { QRCodeModal } from './src/components/QRCodeModal';
import { NotificationBanner } from './src/components/NotificationBanner';
import { requestNotificationPermission } from './src/utils/notifications';

export default function App() {
  useEffect(() => {
    // Request notification permissions on mount
    requestNotificationPermission();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#dc2626" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <BookingModal />
        <QRCodeModal />
        <NotificationBanner />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

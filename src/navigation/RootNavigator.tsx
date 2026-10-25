import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ExploreScreen } from '../screens/ExploreScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { useBookingStore } from '../store/useBookingStore';
import { VKULogo } from '../components/VKULogo';
import { VKU_COLORS } from '../constants/colors';
import { useTheme } from '../hooks/useTheme';

export type RootTabParamList = {
  Explore: undefined;
  Bookings: undefined;
  Scanner: undefined;
  Profile: undefined;
  Report: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator: React.FC = () => {
  const { bookings, user } = useBookingStore();
  const theme = useTheme();

  const activeCount = bookings.filter(
    (b) => b.userId === user.id && (b.status === 'active' || b.status === 'checked_in')
  ).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: VKU_COLORS.darkBlue,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 16,
          color: '#ffffff',
        },
        headerLeft: () => (
          <View style={styles.headerLeftContainer}>
            <View style={styles.logoBadgeContainer}>
              <VKULogo width={54} height={28} />
            </View>
          </View>
        ),
        tabBarActiveTintColor: VKU_COLORS.red,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBorder,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerTitle: 'StudySpot',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Bookings"
        component={MyBookingsScreen}
        options={{
          headerTitle: 'My Reservations',
          tabBarLabel: 'Bookings',
          tabBarBadge: activeCount > 0 ? activeCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: VKU_COLORS.gold,
            color: '#ffffff',
            fontWeight: '800',
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Scanner"
        component={QRScannerScreen}
        options={{
          headerTitle: 'Door Sensor Scanner',
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: 'VKU Student ID',
          tabBarLabel: 'VKU ID',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          headerTitle: 'Technical Report',
          tabBarLabel: 'Report PDF',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeftContainer: {
    paddingLeft: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

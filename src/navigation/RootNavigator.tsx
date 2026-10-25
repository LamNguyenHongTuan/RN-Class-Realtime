import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ExploreScreen } from '../screens/ExploreScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { useBookingStore } from '../store/useBookingStore';

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

  const activeCount = bookings.filter(
    (b) => b.userId === user.id && (b.status === 'active' || b.status === 'checked_in')
  ).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#dc2626',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 16,
        },
        tabBarActiveTintColor: '#dc2626',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerTitle: 'VKU StudySpot',
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
          headerTitle: 'Official Technical Report',
          tabBarLabel: 'Report PDF',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

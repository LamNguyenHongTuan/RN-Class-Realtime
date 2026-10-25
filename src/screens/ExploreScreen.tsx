import React, { useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterBar } from '../components/FilterBar';
import { RoomCard } from '../components/RoomCard';
import { Room } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { isRoomCurrentlyOccupied } from '../utils/conflicts';

export const ExploreScreen: React.FC = () => {
  const { rooms, bookings, filters, openBookingModal, resetFilters } = useBookingStore();

  const handleBook = useCallback(
    (room: Room) => {
      openBookingModal(room);
    },
    [openBookingModal]
  );

  // Compute occupancy map
  const occupancyMap = useMemo(() => {
    const map = new Map<string, boolean>();
    rooms.forEach((r) => {
      map.set(r.id, isRoomCurrentlyOccupied(r.id, bookings));
    });
    return map;
  }, [rooms, bookings]);

  // Multi-parameter filter pipeline
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      // 1. Search text
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCode = r.roomNumber.toLowerCase().includes(q);
        const matchesDesc = r.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesDesc) return false;
      }

      // 2. Building
      if (filters.selectedBuilding !== 'ALL' && r.building !== filters.selectedBuilding) {
        return false;
      }

      // 3. Minimum capacity
      if (filters.minCapacity > 0 && r.capacity < filters.minCapacity) {
        return false;
      }

      // 4. Equipment multi-select
      if (filters.selectedEquipment.length > 0) {
        const hasAll = filters.selectedEquipment.every((eq) => r.equipment.includes(eq));
        if (!hasAll) return false;
      }

      // 5. Available now filter
      if (filters.onlyAvailableNow) {
        const isOccupied = occupancyMap.get(r.id);
        if (isOccupied) return false;
      }

      return true;
    });
  }, [rooms, filters, occupancyMap]);

  // Memoized renderItem for FlatList 60fps performance
  const renderRoomItem = useCallback(
    ({ item }: { item: Room }) => {
      const isOccupied = occupancyMap.get(item.id) || false;
      return (
        <RoomCard
          room={item}
          onBook={handleBook}
          isOccupiedNow={isOccupied}
        />
      );
    },
    [occupancyMap, handleBook]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <View style={styles.container}>
      {/* Sticky Filter Bar */}
      <FilterBar />

      {/* High-Performance FlatList */}
      <FlatList
        data={filteredRooms}
        renderItem={renderRoomItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>
              Showing {filteredRooms.length} available study {filteredRooms.length === 1 ? 'room' : 'rooms'}
            </Text>
            <Text style={styles.fpsBadge}>FlatList 60fps Scrolling</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No study rooms found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your building, capacity or equipment filter chips.
            </Text>
            <TouchableOpacity style={styles.resetEmptyBtn} onPress={resetFilters}>
              <Text style={styles.resetEmptyBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
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
  listContent: {
    padding: 14,
    paddingBottom: 90,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  listHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  fpsBadge: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  resetEmptyBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetEmptyBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});

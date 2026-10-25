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
import { BuildingCode, EquipmentType } from '../types';
import { useBookingStore } from '../store/useBookingStore';

const BUILDINGS: { code: BuildingCode | 'ALL'; label: string }[] = [
  { code: 'ALL', label: 'All' },
  { code: 'A', label: 'Bldg A' },
  { code: 'B', label: 'Bldg B' },
  { code: 'C', label: 'Bldg C' },
  { code: 'V', label: 'Bldg V' },
];

const ALL_EQUIPMENT: EquipmentType[] = [
  'Projector',
  'Whiteboard',
  'High-spec PC',
  'Air Conditioner',
  'Smart TV',
  'High-Speed LAN',
];

const CAPACITIES = [0, 4, 8, 12, 16];

export const FilterBar: React.FC = () => {
  const {
    filters,
    setSearchQuery,
    setSelectedBuilding,
    setMinCapacity,
    toggleEquipment,
    toggleOnlyAvailableNow,
    resetFilters,
  } = useBookingStore();

  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

  const activeFiltersCount = 
    (filters.selectedBuilding !== 'ALL' ? 1 : 0) +
    (filters.minCapacity > 0 ? 1 : 0) +
    filters.selectedEquipment.length +
    (filters.onlyAvailableNow ? 1 : 0);

  return (
    <View style={styles.container}>
      {/* Search Input Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={16} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search room (e.g. Lab V-401, B-305)..."
            placeholderTextColor="#94a3b8"
            value={filters.searchQuery}
            onChangeText={setSearchQuery}
          />
          {filters.searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
              <Ionicons name="close-circle" size={16} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.filterToggleBtn, (isAdvancedVisible || activeFiltersCount > 0) && styles.filterToggleActive]}
          onPress={() => setIsAdvancedVisible(!isAdvancedVisible)}
        >
          <Ionicons 
            name="options-outline" 
            size={18} 
            color={activeFiltersCount > 0 || isAdvancedVisible ? '#dc2626' : '#64748b'} 
          />
          {activeFiltersCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Horizontal Building Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {BUILDINGS.map((b) => {
          const isSelected = filters.selectedBuilding === b.code;
          return (
            <TouchableOpacity
              key={b.code}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => setSelectedBuilding(b.code)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {b.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        {/* Quick Available Now chip */}
        <TouchableOpacity
          style={[styles.chip, filters.onlyAvailableNow && styles.chipGreenActive]}
          onPress={toggleOnlyAvailableNow}
        >
          <View style={[styles.dot, { backgroundColor: filters.onlyAvailableNow ? '#ffffff' : '#10b981' }]} />
          <Text style={[styles.chipText, filters.onlyAvailableNow && styles.chipTextActive]}>
            Available Now
          </Text>
        </TouchableOpacity>

        {activeFiltersCount > 0 && (
          <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
            <Ionicons name="refresh-outline" size={14} color="#dc2626" />
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Collapsible Advanced Filters */}
      {isAdvancedVisible && (
        <View style={styles.advancedContainer}>
          {/* Capacity options */}
          <Text style={styles.sectionLabel}>Minimum Capacity:</Text>
          <View style={styles.capacityRow}>
            {CAPACITIES.map((cap) => {
              const isSelected = filters.minCapacity === cap;
              return (
                <TouchableOpacity
                  key={cap}
                  style={[styles.capacityBtn, isSelected && styles.capacityBtnActive]}
                  onPress={() => setMinCapacity(cap)}
                >
                  <Text style={[styles.capacityBtnText, isSelected && styles.capacityBtnTextActive]}>
                    {cap === 0 ? 'Any' : `${cap}+`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Equipment multi-select */}
          <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Required Equipment:</Text>
          <View style={styles.equipmentWrap}>
            {ALL_EQUIPMENT.map((eq) => {
              const isSelected = filters.selectedEquipment.includes(eq);
              return (
                <TouchableOpacity
                  key={eq}
                  style={[styles.eqBtn, isSelected && styles.eqBtnActive]}
                  onPress={() => toggleEquipment(eq)}
                >
                  {isSelected && <Ionicons name="checkmark" size={12} color="#ffffff" style={{ marginRight: 3 }} />}
                  <Text style={[styles.eqBtnText, isSelected && styles.eqBtnTextActive]}>
                    {eq}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    paddingVertical: 0,
  },
  clearIcon: {
    padding: 4,
  },
  filterToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterToggleActive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCountText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  chipsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#dc2626',
  },
  chipGreenActive: {
    backgroundColor: '#059669',
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 2,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetBtnText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  advancedContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  capacityRow: {
    flexDirection: 'row',
    gap: 6,
  },
  capacityBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  capacityBtnActive: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  capacityBtnText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  capacityBtnTextActive: {
    color: '#ffffff',
  },
  equipmentWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  eqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  eqBtnActive: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  eqBtnText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  eqBtnTextActive: {
    color: '#ffffff',
  },
});

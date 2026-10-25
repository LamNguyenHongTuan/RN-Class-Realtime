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
import { VKU_COLORS } from '../constants/colors';
import { useTheme } from '../hooks/useTheme';

const BUILDINGS: { code: BuildingCode | 'ALL'; label: string; color: string }[] = [
  { code: 'ALL', label: 'All', color: VKU_COLORS.blue },
  { code: 'A', label: 'Bldg A', color: VKU_COLORS.red },
  { code: 'B', label: 'Bldg B', color: VKU_COLORS.blue },
  { code: 'C', label: 'Bldg C', color: '#059669' },
  { code: 'V', label: 'Bldg V', color: VKU_COLORS.gold },
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
  const theme = useTheme();

  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

  const activeFiltersCount = 
    (filters.selectedBuilding !== 'ALL' ? 1 : 0) +
    (filters.minCapacity > 0 ? 1 : 0) +
    filters.selectedEquipment.length +
    (filters.onlyAvailableNow ? 1 : 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
      {/* Search Input Row */}
      <View style={styles.searchRow}>
        <View style={[styles.searchInputWrapper, { backgroundColor: theme.searchBg, borderColor: theme.border }]}>
          <Ionicons name="search" size={16} color={VKU_COLORS.blue} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
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
          style={[styles.filterToggleBtn, { backgroundColor: theme.searchBg, borderColor: theme.border }, (isAdvancedVisible || activeFiltersCount > 0) && styles.filterToggleActive]}
          onPress={() => setIsAdvancedVisible(!isAdvancedVisible)}
        >
          <Ionicons 
            name="options-outline" 
            size={18} 
            color={activeFiltersCount > 0 || isAdvancedVisible ? VKU_COLORS.red : VKU_COLORS.blue} 
          />
          {activeFiltersCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Horizontal Building Chips with 3-color palette */}
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
              style={[
                styles.chip,
                { backgroundColor: theme.chipBg, borderColor: theme.chipBorderColor },
                isSelected && { backgroundColor: b.color, borderColor: b.color }
              ]}
              onPress={() => setSelectedBuilding(b.code)}
            >
              <Text style={[styles.chipText, { color: theme.chipText }, isSelected && styles.chipTextActive]}>
                {b.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        {/* Quick Available Now chip */}
        <TouchableOpacity
          style={[styles.chip, { backgroundColor: theme.chipBg, borderColor: theme.chipBorderColor }, filters.onlyAvailableNow && styles.chipGreenActive]}
          onPress={toggleOnlyAvailableNow}
        >
          <View style={[styles.dot, { backgroundColor: filters.onlyAvailableNow ? '#ffffff' : '#10b981' }]} />
          <Text style={[styles.chipText, { color: theme.chipText }, filters.onlyAvailableNow && styles.chipTextActive]}>
            Available Now
          </Text>
        </TouchableOpacity>

        {activeFiltersCount > 0 && (
          <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
            <Ionicons name="refresh-outline" size={14} color={VKU_COLORS.red} />
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Collapsible Advanced Filters */}
      {isAdvancedVisible && (
        <View style={[styles.advancedContainer, { borderTopColor: theme.divider }]}>
          {/* Capacity options */}
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Minimum Capacity:</Text>
          <View style={styles.capacityRow}>
            {CAPACITIES.map((cap) => {
              const isSelected = filters.minCapacity === cap;
              return (
                <TouchableOpacity
                  key={cap}
                  style={[styles.capacityBtn, { backgroundColor: theme.capacityBg, borderColor: theme.border }, isSelected && styles.capacityBtnActive]}
                  onPress={() => setMinCapacity(cap)}
                >
                  <Text style={[styles.capacityBtnText, { color: theme.textSecondary }, isSelected && styles.capacityBtnTextActive]}>
                    {cap === 0 ? 'Any' : `${cap}+`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Equipment multi-select */}
          <Text style={[styles.sectionLabel, { marginTop: 10, color: theme.textMuted }]}>Required Equipment:</Text>
          <View style={styles.equipmentWrap}>
            {ALL_EQUIPMENT.map((eq) => {
              const isSelected = filters.selectedEquipment.includes(eq);
              return (
                <TouchableOpacity
                  key={eq}
                  style={[styles.eqBtn, { backgroundColor: theme.capacityBg, borderColor: theme.border }, isSelected && styles.eqBtnActive]}
                  onPress={() => toggleEquipment(eq)}
                >
                  {isSelected && <Ionicons name="checkmark" size={12} color="#ffffff" style={{ marginRight: 3 }} />}
                  <Text style={[styles.eqBtnText, { color: theme.textSecondary }, isSelected && styles.eqBtnTextActive]}>
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
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    backgroundColor: VKU_COLORS.red,
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
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipGreenActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
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
    color: VKU_COLORS.red,
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
    backgroundColor: VKU_COLORS.blue,
    borderColor: VKU_COLORS.blue,
  },
  capacityBtnText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  capacityBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
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
    backgroundColor: VKU_COLORS.red,
    borderColor: VKU_COLORS.red,
  },
  eqBtnText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  eqBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

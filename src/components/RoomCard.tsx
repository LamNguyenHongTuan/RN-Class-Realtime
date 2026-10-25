import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Room, EquipmentType } from '../types';
import { VKU_COLORS } from '../constants/colors';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
  isOccupiedNow: boolean;
}

const getBuildingColor = (code: string) => {
  switch (code) {
    case 'A':
      return VKU_COLORS.red;
    case 'B':
      return VKU_COLORS.blue;
    case 'C':
      return '#059669';
    case 'V':
      return VKU_COLORS.gold;
    default:
      return VKU_COLORS.blue;
  }
};

const EquipmentBadge: React.FC<{ type: EquipmentType }> = ({ type }) => {
  const getIcon = () => {
    switch (type) {
      case 'Projector':
        return <MaterialCommunityIcons name="projector" size={12} color={VKU_COLORS.blue} />;
      case 'High-spec PC':
        return <Ionicons name="desktop-outline" size={12} color={VKU_COLORS.red} />;
      case 'Whiteboard':
        return <MaterialCommunityIcons name="whiteboard" size={12} color="#059669" />;
      case 'Air Conditioner':
        return <MaterialCommunityIcons name="air-conditioner" size={12} color="#0891b2" />;
      case 'Smart TV':
        return <Ionicons name="tv-outline" size={12} color={VKU_COLORS.gold} />;
      case 'High-Speed LAN':
        return <Ionicons name="wifi-outline" size={12} color={VKU_COLORS.blue} />;
      default:
        return <Ionicons name="sparkles-outline" size={12} color="#64748b" />;
    }
  };

  return (
    <View style={styles.badgeContainer}>
      {getIcon()}
      <Text style={styles.badgeText}>{type}</Text>
    </View>
  );
};

export const RoomCard: React.FC<RoomCardProps> = React.memo(
  ({ room, onBook, isOccupiedNow }) => {
    const buildingColor = getBuildingColor(room.building);

    return (
      <View style={styles.cardContainer}>
        {/* Photo Container */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: room.imageUrl }}
            style={styles.roomImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(15, 23, 42, 0.88)']}
            style={styles.gradientOverlay}
          />

          {/* Building & Floor Tag with VKU Color */}
          <View style={[styles.buildingTag, { borderColor: buildingColor }]}>
            <View style={[styles.buildingDot, { backgroundColor: buildingColor }]} />
            <Text style={styles.buildingTagText}>
              Bldg {room.building} • Fl. {room.floor}
            </Text>
          </View>

          {/* Dynamic Availability Tag */}
          <View style={styles.statusTagWrapper}>
            {isOccupiedNow ? (
              <View style={[styles.statusTag, styles.statusOccupied]}>
                <Ionicons name="time-outline" size={12} color="#ffffff" />
                <Text style={styles.statusText}>In Use Now</Text>
              </View>
            ) : (
              <View style={[styles.statusTag, styles.statusAvailable]}>
                <View style={styles.pulseDot} />
                <Text style={styles.statusText}>Available Now</Text>
              </View>
            )}
          </View>

          {/* Photo Bottom Label */}
          <View style={styles.photoBottomContent}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.campusCategoryText}>VKU CAMPUS SPACE</Text>
              <Text style={styles.roomTitle} numberOfLines={1}>
                {room.name}
              </Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={11} color={VKU_COLORS.gold} />
              <Text style={styles.ratingText}>{room.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Capacity & Code Meta */}
          <View style={styles.metaRow}>
            <View style={styles.capacityBadge}>
              <Ionicons name="people-outline" size={14} color={VKU_COLORS.blue} />
              <Text style={styles.capacityText}>
                Capacity: <Text style={styles.capacityBold}>{room.capacity} students</Text>
              </Text>
            </View>
            <Text style={styles.roomNumberText}>#{room.roomNumber}</Text>
          </View>

          {/* Description */}
          <Text style={styles.descriptionText} numberOfLines={2}>
            {room.description}
          </Text>

          {/* Equipment Badges */}
          <View style={styles.equipmentRow}>
            {room.equipment.map((eq) => (
              <EquipmentBadge key={eq} type={eq} />
            ))}
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <View style={styles.instantConfirmWrapper}>
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <Text style={styles.instantConfirmText}>Instant Confirmation</Text>
            </View>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => onBook(room)}
              activeOpacity={0.8}
            >
              <Text style={styles.bookButtonText}>Select Slot</Text>
              <Ionicons name="arrow-forward" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
  (prev, next) =>
    prev.room.id === next.room.id &&
    prev.isOccupiedNow === next.isOccupiedNow &&
    prev.room.capacity === next.room.capacity &&
    prev.room.name === next.room.name
);

RoomCard.displayName = 'RoomCard';

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  photoContainer: {
    height: 175,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  roomImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  buildingTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  buildingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  buildingTagText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  statusTagWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusAvailable: {
    backgroundColor: '#059669',
  },
  statusOccupied: {
    backgroundColor: VKU_COLORS.gold,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginRight: 5,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  photoBottomContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  campusCategoryText: {
    color: VKU_COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  roomTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 3,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  cardBody: {
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  capacityText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 5,
  },
  capacityBold: {
    color: '#0f172a',
    fontWeight: '700',
  },
  roomNumberText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  instantConfirmWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instantConfirmText: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: VKU_COLORS.red,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
});

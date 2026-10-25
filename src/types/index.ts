export type BuildingCode = 'A' | 'B' | 'C' | 'V';

export type EquipmentType = 
  | 'Projector' 
  | 'Whiteboard' 
  | 'High-spec PC' 
  | 'Air Conditioner' 
  | 'Smart TV' 
  | 'High-Speed LAN';

export interface TimeSlot {
  id: string; // e.g. "slot-1"
  label: string; // e.g. "07:30 - 09:30"
  startTime: string; // "07:30"
  endTime: string; // "09:30"
  shift: 'Morning' | 'Afternoon' | 'Evening';
}

export interface Room {
  id: string;
  name: string; // e.g. "Lab V-401 (AI & Smart Systems)"
  building: BuildingCode;
  floor: number;
  roomNumber: string;
  capacity: number;
  imageUrl: string;
  equipment: EquipmentType[];
  description: string;
  isAvailableNow: boolean;
  rating: number;
  rules: string[];
}

export type BookingStatus = 'active' | 'checked_in' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  passCode: string; // e.g. "VKU-V401-7821"
  roomId: string;
  roomName: string;
  building: BuildingCode;
  date: string; // "YYYY-MM-DD"
  slotId: string;
  slotLabel: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeesCount: number;
  userId: string;
  userName: string;
  userStudentId: string;
  status: BookingStatus;
  createdAt: string;
  reminderScheduled: boolean;
  checkedInAt?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  id: string;
  studentId: string; // e.g. "21IT001"
  fullName: string;
  email: string;
  department: string;
  avatarUrl: string;
  notificationEnabled: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedBuilding: BuildingCode | 'ALL';
  minCapacity: number;
  selectedEquipment: EquipmentType[];
  onlyAvailableNow: boolean;
}

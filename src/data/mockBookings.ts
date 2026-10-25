import { Booking, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-vku-21it001',
  studentId: '21IT001',
  fullName: 'Nguyen Van A',
  email: 'anv.21it@vku.udn.vn',
  department: 'Faculty of Computer Science & Software Engineering',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  notificationEnabled: true,
};

export function getInitialBookings(): Booking[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  return [
    {
      id: 'book-101',
      passCode: 'VKU-V401-7821',
      roomId: 'room-v-401',
      roomName: 'Lab V-401 (AI & Smart Systems)',
      building: 'V',
      date: todayStr,
      slotId: 'slot-4',
      slotLabel: '15:00 - 17:00',
      startTime: '15:00',
      endTime: '17:00',
      purpose: 'Capstone Project - Neural Network Training & Demo',
      attendeesCount: 5,
      userId: INITIAL_USER.id,
      userName: INITIAL_USER.fullName,
      userStudentId: INITIAL_USER.studentId,
      status: 'active',
      createdAt: new Date().toISOString(),
      reminderScheduled: true
    },
    {
      id: 'book-102',
      passCode: 'VKU-C204-4310',
      roomId: 'room-c-204',
      roomName: 'Study Hub C-204 (Creative Zone)',
      building: 'C',
      date: todayStr,
      slotId: 'slot-1',
      slotLabel: '07:30 - 09:30',
      startTime: '07:30',
      endTime: '09:30',
      purpose: 'Algorithm Study Group (ICPC Training)',
      attendeesCount: 4,
      userId: 'usr-peer-99',
      userName: 'Tran Thi B',
      userStudentId: '22IT045',
      status: 'active',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      reminderScheduled: false
    },
    {
      id: 'book-103',
      passCode: 'VKU-B305-6523',
      roomId: 'room-b-305',
      roomName: 'Lab B-305 (Software Engineering)',
      building: 'B',
      date: tomorrowStr,
      slotId: 'slot-2',
      slotLabel: '09:30 - 11:30',
      startTime: '09:30',
      endTime: '11:30',
      purpose: 'Mobile App Sprint Review (React Native)',
      attendeesCount: 6,
      userId: 'usr-peer-88',
      userName: 'Le Hoang C',
      userStudentId: '21IT120',
      status: 'active',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      reminderScheduled: false
    }
  ];
}

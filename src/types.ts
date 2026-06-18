export type Role = 'Ultra Admin' | 'Super Admin' | 'Admin' | 'Teacher' | 'Staff' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  institutionId?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  registrationNumber: string;
  email: string;
  mobileNumber: string;
  department: string;
  course: string;
  year: number;
  section: string;
  rfidUid?: string;
  photoUrl?: string; // Optional image URL
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  timestamp: string;
  type: 'ENTRY' | 'EXIT';
  status: 'PRESENT' | 'LATE';
}

export interface UnknownScan {
  id: string;
  rfidUid: string;
  timestamp: string;
}

export interface SystemStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateStudents: number;
  unknownScans: number;
  activeDevices: number;
}

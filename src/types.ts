export type UserRole = 'pemancing' | 'super_admin' | 'tukang_timbang';

export interface UserSession {
  role: UserRole;
  name: string;
  badge: string;
}

export type PegStatus = 'kosong' | 'booking' | 'bayaran_penuh';

export interface Peg {
  id: number; // e.g. 1 to 458
  kolamId: string | number; // 'A', 'B', 'C' (or 1, 2, 3)
  zone: '1' | '2' | 'A' | 'B';
  status: PegStatus;
  anglerName?: string;
  phone?: string;
  icNumber?: string;
  depositAmount?: number;
  totalPaid?: number;
  registeredAt?: string;
  receiptNumber?: string;
}

export const formatKolam = (kolamId: string | number): string => {
  if (kolamId === 'A' || kolamId === 1 || kolamId === '1') return 'Kolam A';
  if (kolamId === 'B' || kolamId === 2 || kolamId === '2') return 'Kolam B';
  if (kolamId === 'C' || kolamId === 3 || kolamId === '3') return 'Kolam C';
  return `Kolam ${kolamId}`;
};

export const formatZone = (zone: string): string => {
  if (zone === '1' || zone === 'A') return 'Zon 1';
  if (zone === '2' || zone === 'B') return 'Zon 2';
  return `Zon ${zone}`;
};

export interface CatchRecord {
  id: string;
  pegId: number;
  anglerName: string;
  kolamId: string | number;
  zone: '1' | '2' | 'A' | 'B';
  weightKg: number;
  timeCaught: string; // e.g. "09:42:15 AM"
  category: 'utama' | 'terbuka';
  species?: string;
  verifiedBy: string;
  verifiedAt: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant?: boolean;
}

export interface PrizeItem {
  position: number | string;
  title: string;
  prizeMoney: string;
  additionalReward?: string;
}

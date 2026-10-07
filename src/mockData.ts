import { Announcement, CatchRecord, Peg, PrizeItem } from './types';

// Generate pegs across 3 ponds (Kolam A: 458, Kolam B: 458, Kolam C: 460 = Total 1376)
export const initialPegs: Peg[] = (() => {
  const pegs: Peg[] = [];

  // Ponds definition (Kolam A, Kolam B, Kolam C)
  const pondCounts: { kolamId: string; total: number; split: number }[] = [
    { kolamId: 'A', total: 458, split: 228 },
    { kolamId: 'B', total: 458, split: 228 },
    { kolamId: 'C', total: 460, split: 230 },
  ];

  pondCounts.forEach(({ kolamId, total, split }) => {
    for (let i = 1; i <= total; i++) {
      // Zon 1 di sebelah kiri (1 to split), Zon 2 di sebelah kanan (split+1 to total)
      const zone: '1' | '2' = i <= split ? '1' : '2';
      pegs.push({
        id: i,
        kolamId,
        zone,
        status: 'kosong',
      });
    }
  });

  // Pre-seed some known bookings from user's screenshot
  // 5 - Norkhizan Che Kamal (Booking)
  // 7 - Iwan Che Kamal (Bayaran Penuh)
  const k1P5 = pegs.find(p => p.kolamId === 'A' && p.id === 5);
  if (k1P5) {
    k1P5.status = 'booking';
    k1P5.anglerName = 'Norkhizan Che Kamal';
    k1P5.phone = '019-9882314';
    k1P5.depositAmount = 20;
    k1P5.registeredAt = '2026-10-04 14:20';
    k1P5.receiptNumber = 'BK-KA-0005';
  }

  const k1P7 = pegs.find(p => p.kolamId === 'A' && p.id === 7);
  if (k1P7) {
    k1P7.status = 'bayaran_penuh';
    k1P7.anglerName = 'Iwan Che Kamal';
    k1P7.phone = '013-9114589';
    k1P7.depositAmount = 20;
    k1P7.totalPaid = 100;
    k1P7.registeredAt = '2026-10-04 15:45';
    k1P7.receiptNumber = 'FP-KA-0007';
  }

  // Pre-seed other bookings to make Total Booking = 12, Total Bayaran Penuh = 5 (matching user's screenshot)
  const sampleBookings = [
    { kolamId: 'A', id: 18, name: 'Azman bin Razak', phone: '012-3456781', status: 'booking' as const },
    { kolamId: 'A', id: 24, name: 'Hafizuddin Mat Noor', phone: '017-8901234', status: 'booking' as const },
    { kolamId: 'A', id: 45, name: 'Kamal Ariffin', phone: '014-5566778', status: 'bayaran_penuh' as const },
    { kolamId: 'A', id: 92, name: 'Mohd Shahril Ismail', phone: '018-7788990', status: 'booking' as const },
    { kolamId: 'A', id: 110, name: 'Farid Ahmad', phone: '011-2233445', status: 'booking' as const },
    { kolamId: 'A', id: 235, name: 'Zulkifli Mansor', phone: '019-3344556', status: 'bayaran_penuh' as const },
    { kolamId: 'A', id: 280, name: 'Roslan Kassim', phone: '012-9988776', status: 'booking' as const },
    { kolamId: 'B', id: 12, name: 'Ahmad Faiz', phone: '016-5544332', status: 'booking' as const },
    { kolamId: 'B', id: 33, name: 'Khairul Anuar', phone: '013-4455667', status: 'bayaran_penuh' as const },
    { kolamId: 'B', id: 78, name: 'Siti Sarah Rosli', phone: '017-2233112', status: 'booking' as const },
    { kolamId: 'B', id: 144, name: 'Megat Zaid', phone: '019-4455221', status: 'booking' as const },
    { kolamId: 'C', id: 15, name: 'Nazri Bakar', phone: '012-3311445', status: 'booking' as const },
    { kolamId: 'C', id: 50, name: 'Shamsul Hisham', phone: '018-9900112', status: 'bayaran_penuh' as const },
    { kolamId: 'C', id: 88, name: 'Tengku Firdaus', phone: '011-9988443', status: 'booking' as const },
    { kolamId: 'C', id: 120, name: 'Danial Hakimi', phone: '013-8877665', status: 'booking' as const },
  ];

  sampleBookings.forEach(item => {
    const target = pegs.find(p => p.kolamId === item.kolamId && p.id === item.id);
    if (target) {
      target.status = item.status;
      target.anglerName = item.name;
      target.phone = item.phone;
      target.depositAmount = 20;
      target.totalPaid = item.status === 'bayaran_penuh' ? 100 : 20;
      target.registeredAt = '2026-10-05 10:00';
      target.receiptNumber = `${item.status === 'bayaran_penuh' ? 'FP' : 'BK'}-K${item.kolamId}-${item.id}`;
    }
  });

  return pegs;
})();

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Pendaftaran Pancang Dibuka!',
    content: 'Pendaftaran pancang bagi Pertandingan Memancing Keli Kolam Potong Kona Keratong 10 kini dibuka secara rasmi. Sila pilih pancang pilihan anda di Kolam A, Kolam B atau Kolam C.',
    date: '04 Okt 2026',
    isImportant: true,
  },
  {
    id: 'ann-2',
    title: 'Pelepasan Keli Mega 2.5 Tan!',
    content: 'Pihak pengurusan telah melepaskan sebanyak 2,500 KG Ikan Keli Afrika bersaiz 1.5 KG hingga 4.8 KG ke Kolam A, Kolam B dan Kolam C bagi memeriahkan saingan.',
    date: '05 Okt 2026',
    isImportant: true,
  },
  {
    id: 'ann-3',
    title: 'Waktu Pendaftaran & Cabutan Undi Joran',
    content: 'Kaunter pendaftaran fizikal dibuka seawal 6:30 pagi pada hari acara. Wisel bermula ditiup tepat jam 8:30 pagi sehingga 12:30 tengah hari (4 Jam Berentap).',
    date: '05 Okt 2026',
    isImportant: false,
  },
  {
    id: 'ann-4',
    title: 'Peringatan Syarat Penggunaan Mata Kail',
    content: 'Hanya maksimum 2 mata kail dibenarkan bagi setiap joran. Mata kail candat/tiga serangkai dilarang sama sekali.',
    date: '06 Okt 2026',
    isImportant: false,
  },
];

export const initialCatches: CatchRecord[] = [
  {
    id: 'c-1',
    pegId: 7,
    anglerName: 'Iwan Che Kamal',
    kolamId: 'A',
    zone: '1',
    weightKg: 3.42,
    timeCaught: '09:14:22 AM',
    category: 'utama',
    species: 'Keli Afrika',
    verifiedBy: 'Marshall Zaki',
    verifiedAt: '09:15 AM',
    notes: 'Keli Afrika saiz mega, sangkut bibir atas mulut.',
  },
  {
    id: 'c-2',
    pegId: 45,
    anglerName: 'Kamal Ariffin',
    kolamId: 'A',
    zone: '1',
    weightKg: 3.15,
    timeCaught: '09:32:05 AM',
    category: 'utama',
    species: 'Keli Afrika',
    verifiedBy: 'Marshall Razif',
    verifiedAt: '09:33 AM',
    notes: 'Umpan cacing tanah, ikan sah dan bertenaga.',
  },
  {
    id: 'c-3',
    pegId: 235,
    anglerName: 'Zulkifli Mansor',
    kolamId: 'A',
    zone: '2',
    weightKg: 2.89,
    timeCaught: '09:48:19 AM',
    category: 'utama',
    species: 'Keli Afrika',
    verifiedBy: 'Marshall Zaki',
    verifiedAt: '09:50 AM',
    notes: 'Umpan hati ayam, timbangan rasmi di meja 1.',
  },
  {
    id: 'c-4',
    pegId: 33,
    anglerName: 'Khairul Anuar',
    kolamId: 'B',
    zone: '1',
    weightKg: 2.74,
    timeCaught: '10:05:40 AM',
    category: 'utama',
    species: 'Keli Afrika',
    verifiedBy: 'Marshall Hafiz',
    verifiedAt: '10:07 AM',
  },
  {
    id: 'c-5',
    pegId: 50,
    anglerName: 'Shamsul Hisham',
    kolamId: 'C',
    zone: '1',
    weightKg: 2.61,
    timeCaught: '10:22:15 AM',
    category: 'utama',
    species: 'Keli Afrika',
    verifiedBy: 'Marshall Danial',
    verifiedAt: '10:23 AM',
  },
  {
    id: 'c-6',
    pegId: 18,
    anglerName: 'Azman bin Razak',
    kolamId: 'A',
    zone: '1',
    weightKg: 2.45,
    timeCaught: '10:41:00 AM',
    category: 'utama',
    species: 'Keli Afrika',
    verifiedBy: 'Marshall Zaki',
    verifiedAt: '10:42 AM',
  },
  {
    id: 'c-7',
    pegId: 92,
    anglerName: 'Mohd Shahril Ismail',
    kolamId: 'A',
    zone: '1',
    weightKg: 2.28,
    timeCaught: '11:02:18 AM',
    category: 'utama',
    species: 'Keli Afrika',
    verifiedBy: 'Marshall Razif',
    verifiedAt: '11:04 AM',
  },
  {
    id: 'c-8',
    pegId: 110,
    anglerName: 'Farid Ahmad',
    kolamId: 'A',
    zone: '1',
    weightKg: 2.12,
    timeCaught: '11:15:45 AM',
    category: 'utama',
    species: 'Keli Afrika',
    verifiedBy: 'Marshall Zaki',
    verifiedAt: '11:17 AM',
  },
  // Kategori Terbuka (Spesies lain)
  {
    id: 'c-open-1',
    pegId: 5,
    anglerName: 'Norkhizan Che Kamal',
    kolamId: 'A',
    zone: '1',
    weightKg: 4.15,
    timeCaught: '09:55:10 AM',
    category: 'terbuka',
    species: 'Patin',
    verifiedBy: 'Marshall Zaki',
    verifiedAt: '09:57 AM',
    notes: 'Patin mega kolam Potong Kona.',
  },
  {
    id: 'c-open-2',
    pegId: 24,
    anglerName: 'Hafizuddin Mat Noor',
    kolamId: 'A',
    zone: '1',
    weightKg: 3.65,
    timeCaught: '10:12:44 AM',
    category: 'terbuka',
    species: 'Rohu',
    verifiedBy: 'Marshall Hafiz',
    verifiedAt: '10:14 AM',
    notes: 'Ikan Rohu disahkan sihat.',
  },
];

export const prizeStructure: PrizeItem[] = [
  { position: 1, title: 'JUARA', prizeMoney: 'RM 10,000', additionalReward: 'Piala Pusingan + Mock Cheque + Barangan Memancing' },
  { position: 2, title: 'NAIB JUARA', prizeMoney: 'RM 3,000', additionalReward: 'Piala Iringan + Barangan Memancing' },
  { position: 3, title: 'KETIGA', prizeMoney: 'RM 1,500', additionalReward: 'Piala Iringan + Barangan Memancing' },
  { position: 4, title: 'KE-4', prizeMoney: 'RM 500', additionalReward: 'Medal' },
  { position: 5, title: 'KE-5', prizeMoney: 'RM 400', additionalReward: 'Medal' },
  { position: '6 - 10', title: 'KE-6 HINGGA KE-10', prizeMoney: 'RM 250 Setiap Pemenang', additionalReward: 'Medal Penghargaan' },
  { position: '11 - 20', title: 'KE-11 HINGGA KE-20', prizeMoney: 'RM 150 Setiap Pemenang', additionalReward: 'Hamper Saguhati' },
  { position: '21 - 40', title: 'KE-21 HINGGA KE-40', prizeMoney: 'RM 100 Setiap Pemenang', additionalReward: 'Saguhati Urusetia' },
  { position: 'Khas 1', title: 'Keli Terpanjang (Panjang CM)', prizeMoney: 'RM 500', additionalReward: 'Trofi Khas' },
  { position: 'Khas 2', title: 'Spesies Terbuka (Patin/Rohu)', prizeMoney: 'RM 800', additionalReward: 'Trofi Khas' },
];

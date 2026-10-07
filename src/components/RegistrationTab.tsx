import React, { useState, useMemo } from 'react';
import { Peg, UserRole, formatKolam, formatZone } from '../types';
import { Search, Filter, Check, User, AlertCircle, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { SeatMapImageBar } from './SeatMapImageBar';

interface RegistrationTabProps {
  pegs: Peg[];
  onOpenBookingModal: (selectedPegs: Peg[]) => void;
  onViewTicket: (peg: Peg) => void;
  userRole: UserRole;
  onAdminUpdatePeg?: (pegId: number, kolamId: string | number, newStatus: Peg['status'], anglerName?: string) => void;
  seatMapImageUrl: string | null;
  onUploadSeatMapImage: (url: string | null) => void;
}

export const RegistrationTab: React.FC<RegistrationTabProps> = ({
  pegs,
  onOpenBookingModal,
  onViewTicket,
  userRole,
  onAdminUpdatePeg,
  seatMapImageUrl,
  onUploadSeatMapImage,
}) => {
  const isSuperAdmin = userRole === 'super_admin';
  const [selectedKolamId, setSelectedKolamId] = useState<'A' | 'B' | 'C' | number>('A');
  const [selectedPegId, setSelectedPegId] = useState<number | null>(5); // default or null
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'kosong' | 'booking' | 'bayaran_penuh'>('all');

  // Stats across the entire tournament (Matching Screenshot 2 counts)
  const totalPegsCount = pegs.length; // 1376
  const bookedCount = useMemo(() => pegs.filter((p) => p.status === 'booking').length, [pegs]); // 12
  const paidCount = useMemo(() => pegs.filter((p) => p.status === 'bayaran_penuh').length, [pegs]); // 5

  // Pegs for currently active pond (Kolam A, Kolam B, or Kolam C)
  const currentPondPegs = useMemo(
    () =>
      pegs.filter((p) => {
        if (selectedKolamId === 'A' || selectedKolamId === 1) {
          return p.kolamId === 'A' || p.kolamId === 1 || p.kolamId === '1';
        }
        if (selectedKolamId === 'B' || selectedKolamId === 2) {
          return p.kolamId === 'B' || p.kolamId === 2 || p.kolamId === '2';
        }
        if (selectedKolamId === 'C' || selectedKolamId === 3) {
          return p.kolamId === 'C' || p.kolamId === 3 || p.kolamId === '3';
        }
        return p.kolamId === selectedKolamId;
      }),
    [pegs, selectedKolamId]
  );

  // Split into Zon 1 (di sebelah kiri) and Zon 2 (di sebelah kanan)
  const zon1Pegs = useMemo(
    () => currentPondPegs.filter((p) => p.zone === '1' || p.zone === 'A'),
    [currentPondPegs]
  );

  const zon2Pegs = useMemo(
    () => currentPondPegs.filter((p) => p.zone === '2' || p.zone === 'B'),
    [currentPondPegs]
  );

  // Filtered lists based on search & status filter
  const filterPeg = (p: Peg) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchesId = p.id.toString().includes(term);
    const matchesName = p.anglerName?.toLowerCase().includes(term);
    return matchesId || !!matchesName;
  };

  const filteredZon1 = useMemo(() => zon1Pegs.filter(filterPeg), [zon1Pegs, searchTerm, filterStatus]);
  const filteredZon2 = useMemo(() => zon2Pegs.filter(filterPeg), [zon2Pegs, searchTerm, filterStatus]);

  // Selected peg details
  const selectedPeg = useMemo(
    () => currentPondPegs.find((p) => p.id === selectedPegId) || null,
    [currentPondPegs, selectedPegId]
  );

  const handleSelectPeg = (peg: Peg) => {
    setSelectedPegId(peg.id);
  };

  const handleClearSelection = () => {
    setSelectedPegId(null);
  };

  const handleProceedBooking = () => {
    if (selectedPeg) {
      if (selectedPeg.status === 'kosong') {
        onOpenBookingModal([selectedPeg]);
      } else {
        // Already booked or paid, show ticket or view details
        onViewTicket(selectedPeg);
      }
    }
  };

  // Helper for button styling matching user screenshot
  const getPegButtonClass = (peg: Peg, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-amber-300 text-slate-950 font-black ring-4 ring-amber-400 shadow-lg scale-[1.02]';
    }

    switch (peg.status) {
      case 'booking':
        // Orange / Amber matching "5 - Norkhizan Che Kamal" in screenshot
        return 'bg-[#f0b15b] hover:bg-[#e89d38] text-slate-950 font-bold border-none shadow-sm';
      case 'bayaran_penuh':
        // Green matching "7 - Iwan Che Kamal" in screenshot
        return 'bg-[#68c187] hover:bg-[#52af73] text-slate-950 font-bold border-none shadow-sm';
      case 'kosong':
      default:
        // Blue matching "1 - Kosong" in screenshot
        return 'bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium border-none shadow-sm';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900">
      
      {/* 1. Top 3 Stat Cards (Exactly matching Screenshot 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Jumlah Pancang Keseluruhan */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="text-slate-500 font-medium text-sm sm:text-base mb-1">
            Jumlah Pancang Keseluruhan
          </div>
          <div className="text-4xl sm:text-5xl font-black text-[#0c2f57] font-serif tracking-tight">
            {totalPegsCount}
          </div>
        </div>

        {/* Card 2: Pancang Ditempah (Booking) */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="text-slate-500 font-medium text-sm sm:text-base mb-1">
            Pancang Ditempah (Booking)
          </div>
          <div className="text-4xl sm:text-5xl font-black text-[#0c2f57] font-serif tracking-tight">
            {bookedCount}
          </div>
        </div>

        {/* Card 3: Pancang Ditempah (Bayaran Penuh) */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="text-slate-500 font-medium text-sm sm:text-base mb-1">
            Pancang Ditempah (Bayaran Penuh)
          </div>
          <div className="text-4xl sm:text-5xl font-black text-[#0c2f57] font-serif tracking-tight">
            {paidCount}
          </div>
        </div>
      </div>

      {/* Bar Bagi Upload Gambar Di Antara Bar Statistik Dan Peta Tempat Duduk */}
      <SeatMapImageBar
        imageUrl={seatMapImageUrl}
        onUploadImage={onUploadSeatMapImage}
        userRole={userRole}
      />

      {/* 2. Peta Tempat Duduk Main Container */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-200 space-y-5">
        
        {/* Title & Pond Switcher (Kolam A, Kolam B, Kolam C) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0c2f57] tracking-tight">
            Peta Tempat Duduk
          </h2>

          {/* Kolam Switcher (Kolam A, Kolam B, Kolam C) */}
          <div className="flex items-center gap-2">
            {[
              { id: 'A', label: 'Kolam A' },
              { id: 'B', label: 'Kolam B' },
              { id: 'C', label: 'Kolam C' },
            ].map((pond) => {
              const isActive =
                selectedKolamId === pond.id ||
                (pond.id === 'A' && selectedKolamId === 1) ||
                (pond.id === 'B' && selectedKolamId === 2) ||
                (pond.id === 'C' && selectedKolamId === 3);

              return (
                <button
                  key={pond.id}
                  onClick={() => {
                    setSelectedKolamId(pond.id as 'A' | 'B' | 'C');
                    setSelectedPegId(null);
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0284c7] text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-500 font-extrabold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {pond.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nombor pancang (cth: 5, 230) atau nama pemancing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Padam
              </button>
            )}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Semua ({currentPondPegs.length})
            </button>
            <button
              onClick={() => setFilterStatus('kosong')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                filterStatus === 'kosong'
                  ? 'bg-[#0284c7] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              Kosong
            </button>
            <button
              onClick={() => setFilterStatus('booking')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                filterStatus === 'booking'
                  ? 'bg-[#f0b15b] text-slate-950 font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#f0b15b]" />
              Booking
            </button>
            <button
              onClick={() => setFilterStatus('bayaran_penuh')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                filterStatus === 'bayaran_penuh'
                  ? 'bg-[#68c187] text-slate-950 font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#68c187]" />
              Bayaran Penuh
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 pb-1">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#0284c7]" />
            <span>Pancang Kosong (Boleh Ditempah)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#f0b15b]" />
            <span>Booking (Deposit RM20)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#68c187]" />
            <span>Bayaran Penuh (RM100)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-300 ring-2 ring-amber-400" />
            <span>Pilihan Anda</span>
          </div>
        </div>

        {/* 3-Column Interactive Pegs & Pond Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column: ZON 1 (di sebelah kiri) */}
          <div className="lg:col-span-3 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col h-[580px]">
            <div className="text-center font-black tracking-wider text-slate-700 text-sm mb-3 uppercase flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300 font-extrabold">
                ZON 1
              </span>
              <span className="text-xs font-normal text-slate-500">
                ({filteredZon1.length} Pancang)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
              {filteredZon1.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-8">
                  Tiada pancang padan dengan tapisan.
                </div>
              ) : (
                filteredZon1.map((peg) => {
                  const isSelected = selectedPegId === peg.id;
                  const label =
                    peg.status === 'kosong'
                      ? `${peg.id} - Kosong`
                      : `${peg.id} - ${peg.anglerName || 'Ditempah'}`;

                  return (
                    <button
                      key={peg.id}
                      onClick={() => handleSelectPeg(peg)}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs transition-all text-center truncate block font-medium cursor-pointer ${getPegButtonClass(
                        peg,
                        isSelected
                      )}`}
                      title={`${label} (${peg.status})`}
                    >
                      {label}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Middle Column: Pond Visual & Peg Detail Card */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#e3f4fc] to-[#d0ecf9] rounded-2xl p-6 border-2 border-sky-300 shadow-inner flex flex-col justify-between min-h-[580px] relative overflow-hidden text-center">
            
            {/* Water background graphic animations */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute w-72 h-72 -left-12 -top-12 bg-sky-400/20 rounded-full blur-2xl" />
              <div className="absolute w-72 h-72 -right-12 -bottom-12 bg-sky-500/20 rounded-full blur-2xl" />
            </div>

            {/* Pond Header (KOLAM A, KOLAM B, KOLAM C) */}
            <div className="relative space-y-1">
              <h3 className="text-2xl font-black text-[#0c2f57] tracking-wider uppercase font-serif">
                {formatKolam(selectedKolamId).toUpperCase()}
              </h3>
              <div className="text-sm text-sky-900 font-semibold">
                {selectedPeg ? (
                  <span>
                    Pancang dipilih:{' '}
                    <span className="font-extrabold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
                      Pancang {selectedPeg.id} ({formatZone(selectedPeg.zone)})
                    </span>
                  </span>
                ) : (
                  <span>Pancang dipilih: —</span>
                )}
              </div>
            </div>

            {/* Pond Water Art Simulation Center */}
            <div className="relative my-6 py-6 px-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-sky-200/80 shadow-md">
              {selectedPeg ? (
                <div className="space-y-4">
                  <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-[#0a2540] to-[#123e6b] text-white shadow-xl border border-amber-400/60 max-w-sm mx-auto">
                    <div className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                      Maklumat Pancang Terpilih
                    </div>
                    <div className="text-4xl font-black my-1 text-white font-mono">
                      #{selectedPeg.id}
                    </div>
                    <div className="text-xs font-semibold text-sky-200">
                      {formatKolam(selectedPeg.kolamId)} • {formatZone(selectedPeg.zone)}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-left space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status Semasa:</span>
                        <span
                          className={`font-black uppercase ${
                            selectedPeg.status === 'kosong'
                              ? 'text-sky-300'
                              : selectedPeg.status === 'booking'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {selectedPeg.status === 'kosong'
                            ? 'Kosong (Tersedia)'
                            : selectedPeg.status === 'booking'
                            ? 'Booking Deposit (RM20)'
                            : 'Bayaran Penuh (RM100)'}
                        </span>
                      </div>
                      {selectedPeg.anglerName && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Nama Pemancing:</span>
                          <span className="font-bold text-white truncate max-w-[170px]">
                            {selectedPeg.anglerName}
                          </span>
                        </div>
                      )}
                      {selectedPeg.receiptNumber && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">No Resit:</span>
                          <span className="font-mono text-amber-300 font-semibold">
                            {selectedPeg.receiptNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Super Admin Payment Confirmation Action (Only for Super Admin) */}
                  {isSuperAdmin && onAdminUpdatePeg && (
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 text-xs flex flex-col items-center justify-center gap-2">
                      <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        👑 Sahkan Status Pembayaran (Super Admin):
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onAdminUpdatePeg(selectedPeg.id, selectedPeg.kolamId, 'kosong')}
                          className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                          title="Batal tempahan & kosongkan pancang"
                        >
                          Set Kosong
                        </button>
                        <button
                          type="button"
                          onClick={() => onAdminUpdatePeg(selectedPeg.id, selectedPeg.kolamId, 'booking', selectedPeg.anglerName || 'Peserta Tempah')}
                          className="px-2.5 py-1.5 rounded-lg bg-[#f0b15b] hover:bg-[#e89d38] text-slate-950 font-black text-xs shadow-sm cursor-pointer"
                          title="Tukar ke Booking Deposit (RM20)"
                        >
                          Set Booking (Deposit RM20)
                        </button>
                        <button
                          type="button"
                          onClick={() => onAdminUpdatePeg(selectedPeg.id, selectedPeg.kolamId, 'bayaran_penuh', selectedPeg.anglerName || 'Peserta Penuh')}
                          className="px-2.5 py-1.5 rounded-lg bg-[#68c187] hover:bg-[#52af73] text-slate-950 font-black text-xs shadow-sm cursor-pointer"
                          title="Sahkan status bayaran penuh RM100"
                        >
                          ✓ Sahkan Bayaran Penuh (RM100)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 space-y-2 text-slate-600">
                  <div className="text-4xl animate-bounce">🎣</div>
                  <div className="font-bold text-base text-slate-800">
                    Sila Pilih Mana-mana Nombor Pancang
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Klik butang pancang pada lajur Zon 1 atau Zon 2 untuk melihat status atau membuat tempahan tempat duduk pancingan anda.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Buttons ("Kosongkan Pilihan" & "Teruskan ke Borang Tempahan") */}
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClearSelection}
                disabled={!selectedPeg}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                Kosongkan Pilihan
              </button>

              <button
                type="button"
                onClick={handleProceedBooking}
                disabled={!selectedPeg}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer ${
                  !selectedPeg
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : selectedPeg.status === 'kosong'
                    ? 'bg-white hover:bg-slate-50 text-[#0c2f57] border-2 border-[#0c2f57] ring-2 ring-sky-300'
                    : 'bg-[#0c2f57] hover:bg-[#143d6b] text-white'
                }`}
              >
                {selectedPeg && selectedPeg.status !== 'kosong'
                  ? 'Lihat E-Pas / Resit Pancang'
                  : 'Teruskan ke Borang Tempahan'}
              </button>
            </div>
          </div>

          {/* Right Column: ZON 2 (di sebelah kanan) */}
          <div className="lg:col-span-3 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col h-[580px]">
            <div className="text-center font-black tracking-wider text-slate-700 text-sm mb-3 uppercase flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300 font-extrabold">
                ZON 2
              </span>
              <span className="text-xs font-normal text-slate-500">
                ({filteredZon2.length} Pancang)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
              {filteredZon2.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-8">
                  Tiada pancang padan dengan tapisan.
                </div>
              ) : (
                filteredZon2.map((peg) => {
                  const isSelected = selectedPegId === peg.id;
                  const label =
                    peg.status === 'kosong'
                      ? `${peg.id} - Kosong`
                      : `${peg.id} - ${peg.anglerName || 'Ditempah'}`;

                  return (
                    <button
                      key={peg.id}
                      onClick={() => handleSelectPeg(peg)}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs transition-all text-center truncate block font-medium cursor-pointer ${getPegButtonClass(
                        peg,
                        isSelected
                      )}`}
                      title={`${label} (${peg.status})`}
                    >
                      {label}
                    </button>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

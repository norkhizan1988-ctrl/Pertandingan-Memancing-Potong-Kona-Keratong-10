import React, { useState, useMemo } from 'react';
import { CatchRecord, Peg, UserRole, formatKolam, formatZone } from '../types';
import {
  Trophy,
  Scale,
  Clock,
  Plus,
  Flame,
  Award,
  Sparkles,
  Search,
  Filter,
  KeyRound,
} from 'lucide-react';

interface RankingTabProps {
  catches: CatchRecord[];
  pegs: Peg[];
  onOpenWeighInModal: () => void;
  userRole: UserRole;
  onDeleteCatch?: (id: string) => void;
  onOpenLoginModal?: () => void;
}

export const RankingTab: React.FC<RankingTabProps> = ({
  catches,
  pegs,
  onOpenWeighInModal,
  userRole,
  onDeleteCatch,
  onOpenLoginModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<'utama' | 'terbuka'>('utama');
  const [rangeFilter, setRangeFilter] = useState<'all' | 'top10' | 'top40'>('top40');
  const [searchAngler, setSearchAngler] = useState('');

  const isSuperAdmin = userRole === 'super_admin';
  const isTukangTimbang = userRole === 'tukang_timbang';
  const canRecordWeighIn = isSuperAdmin || isTukangTimbang;

  // Filter by category
  const categoryCatches = useMemo(() => {
    return catches.filter((c) => c.category === activeCategory);
  }, [catches, activeCategory]);

  // Sort by highest weight, then earliest time (tie-breaker)
  const sortedCatches = useMemo(() => {
    return [...categoryCatches].sort((a, b) => {
      if (b.weightKg !== a.weightKg) {
        return b.weightKg - a.weightKg;
      }
      return a.timeCaught.localeCompare(b.timeCaught);
    });
  }, [categoryCatches]);

  // Filtered by search & range
  const displayedCatches = useMemo(() => {
    let list = sortedCatches;
    if (searchAngler.trim()) {
      const term = searchAngler.toLowerCase();
      list = list.filter(
        (c) =>
          c.anglerName.toLowerCase().includes(term) ||
          c.pegId.toString().includes(term) ||
          (c.species && c.species.toLowerCase().includes(term))
      );
    }
    if (rangeFilter === 'top10') {
      return list.slice(0, 10);
    }
    if (rangeFilter === 'top40') {
      return list.slice(0, 40);
    }
    return list;
  }, [sortedCatches, searchAngler, rangeFilter]);

  // Top 3 Podium Winners
  const juara = sortedCatches[0] || null;
  const naibJuara = sortedCatches[1] || null;
  const ketiga = sortedCatches[2] || null;

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900">
      
      {/* 1. Category Switcher (Matching Screenshot 4 buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveCategory('utama')}
            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold tracking-wide transition-all shadow-sm cursor-pointer ${
              activeCategory === 'utama'
                ? 'bg-[#0a2540] text-white shadow-md ring-2 ring-[#0a2540]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            Kategori Utama
          </button>

          <button
            onClick={() => setActiveCategory('terbuka')}
            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold tracking-wide transition-all shadow-sm cursor-pointer ${
              activeCategory === 'terbuka'
                ? 'bg-[#0a2540] text-white shadow-md ring-2 ring-[#0a2540]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            Kategori Terbuka
          </button>
        </div>

        {/* Marshall / Tukang Timbang Quick Action Button */}
        {canRecordWeighIn ? (
          <button
            onClick={onOpenWeighInModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Scale className="w-4 h-4" />
            + Catat Timbangan Ikan (Tukang Timbang)
          </button>
        ) : (
          onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-bold text-xs border border-sky-400/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              Log Masuk Kaunter Tukang Timbang
            </button>
          )
        )}
      </div>

      {/* 2. Main Leaderboard Container Card (Matching Screenshot 4) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
        
        {/* Top Banner Header: "RANKING TERKINI" in large navy serif font */}
        <div className="text-center py-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0c2f57] tracking-widest font-serif uppercase">
            RANKING TERKINI
          </h2>
        </div>

        {/* Subcard Box (Matching Screenshot 4 banner) */}
        <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-sm">
          <h3 className="text-lg sm:text-xl font-black text-[#0c2f57] tracking-wide uppercase">
            {activeCategory === 'utama' ? 'KATEGORI UTAMA' : 'KATEGORI TERBUKA (SPESIES LAIN)'}
          </h3>

          <div className="text-red-600 font-extrabold text-base sm:text-lg tracking-tight">
            {sortedCatches.length > 0
              ? '⚡ Keputusan Rasmi Di Meja Timbangan Sedang Berlangsung'
              : 'Berat Ikan akan diumumkan semasa hari pertandingan'}
          </div>

          {/* Range Button: "No 1 – No 40" */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setRangeFilter('top40')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-sm ${
                rangeFilter === 'top40'
                  ? 'bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              No 1 – No 40
            </button>
            <button
              onClick={() => setRangeFilter('top10')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                rangeFilter === 'top10'
                  ? 'bg-[#0284c7] text-white ring-2 ring-sky-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Top 10
            </button>
            <button
              onClick={() => setRangeFilter('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                rangeFilter === 'all'
                  ? 'bg-[#0284c7] text-white ring-2 ring-sky-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua ({sortedCatches.length})
            </button>
          </div>
        </div>

        {/* 3. PODIUM CARDS (Exact match to Screenshot 4 design) */}
        <div className="space-y-3">
          
          {/* Card 1: JUARA */}
          <div className="bg-[#0c2f57] text-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row items-stretch border border-[#1b4372]">
            <div className="w-full md:w-48 bg-[#092444] px-5 py-3.5 flex items-center justify-center md:justify-start gap-2 border-b md:border-b-0 md:border-r border-[#1b4372] shrink-0">
              <span className="text-amber-400 text-lg">🥇</span>
              <span className="font-black text-sm tracking-wider uppercase text-amber-300">
                JUARA
              </span>
            </div>

            <div className="flex-1 grid grid-cols-3 divide-x divide-[#1b4372] text-center py-2.5 px-3">
              <div>
                <div className="text-[11px] italic text-sky-200">Joran</div>
                <div className="font-black text-sm sm:text-base text-white truncate px-1">
                  {juara ? `Pancang #${juara.pegId} (${juara.anglerName})` : '—'}
                </div>
              </div>

              <div>
                <div className="text-[11px] italic text-sky-200">Berat (kg)</div>
                <div className="font-mono font-black text-base sm:text-lg text-amber-300">
                  {juara ? `${juara.weightKg.toFixed(2)} KG` : '—'}
                </div>
              </div>

              <div>
                <div className="text-[11px] italic text-sky-200">Masa</div>
                <div className="font-mono font-bold text-xs sm:text-sm text-slate-200">
                  {juara ? juara.timeCaught : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: NAIB JUARA */}
          <div className="bg-[#0c2f57] text-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row items-stretch border border-[#1b4372]">
            <div className="w-full md:w-48 bg-[#092444] px-5 py-3.5 flex items-center justify-center md:justify-start gap-2 border-b md:border-b-0 md:border-r border-[#1b4372] shrink-0">
              <span className="text-slate-300 text-lg">🥈</span>
              <span className="font-black text-sm tracking-wider uppercase text-slate-100">
                NAIB JUARA
              </span>
            </div>

            <div className="flex-1 grid grid-cols-3 divide-x divide-[#1b4372] text-center py-2.5 px-3">
              <div>
                <div className="text-[11px] italic text-sky-200">Joran</div>
                <div className="font-black text-sm sm:text-base text-white truncate px-1">
                  {naibJuara ? `Pancang #${naibJuara.pegId} (${naibJuara.anglerName})` : '—'}
                </div>
              </div>

              <div>
                <div className="text-[11px] italic text-sky-200">Berat (kg)</div>
                <div className="font-mono font-black text-base sm:text-lg text-slate-100">
                  {naibJuara ? `${naibJuara.weightKg.toFixed(2)} KG` : '—'}
                </div>
              </div>

              <div>
                <div className="text-[11px] italic text-sky-200">Masa</div>
                <div className="font-mono font-bold text-xs sm:text-sm text-slate-200">
                  {naibJuara ? naibJuara.timeCaught : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: KETIGA */}
          <div className="bg-[#0c2f57] text-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row items-stretch border border-[#1b4372]">
            <div className="w-full md:w-48 bg-[#092444] px-5 py-3.5 flex items-center justify-center md:justify-start gap-2 border-b md:border-b-0 md:border-r border-[#1b4372] shrink-0">
              <span className="text-amber-600 text-lg">🥉</span>
              <span className="font-black text-sm tracking-wider uppercase text-amber-200">
                KETIGA
              </span>
            </div>

            <div className="flex-1 grid grid-cols-3 divide-x divide-[#1b4372] text-center py-2.5 px-3">
              <div>
                <div className="text-[11px] italic text-sky-200">Joran</div>
                <div className="font-black text-sm sm:text-base text-white truncate px-1">
                  {ketiga ? `Pancang #${ketiga.pegId} (${ketiga.anglerName})` : '—'}
                </div>
              </div>

              <div>
                <div className="text-[11px] italic text-sky-200">Berat (kg)</div>
                <div className="font-mono font-black text-base sm:text-lg text-amber-200">
                  {ketiga ? `${ketiga.weightKg.toFixed(2)} KG` : '—'}
                </div>
              </div>

              <div>
                <div className="text-[11px] italic text-sky-200">Masa</div>
                <div className="font-mono font-bold text-xs sm:text-sm text-slate-200">
                  {ketiga ? ketiga.timeCaught : '—'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Leaderboard Table / Empty state notification */}
        {displayedCatches.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <p className="text-sm font-medium">
              Keputusan pertandingan belum dikemaskini. Tiada data ranking untuk dipaparkan.
            </p>
            <p className="text-xs text-slate-400">
              Klik butang <strong>+ Catat Timbangan Ikan</strong> untuk memasukkan rekod pertama di meja timbangan.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {/* Search filter within standings */}
            <div className="flex items-center justify-between gap-3 pb-1">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Senarai Kedudukan Rasmi ({displayedCatches.length} Tangkapan Sah)
              </div>
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari pemancing / pancang..."
                  value={searchAngler}
                  onChange={(e) => setSearchAngler(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Standings Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c2f57] text-white font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4 text-center w-20">Kedudukan</th>
                    <th className="py-3 px-4">Joran / Pancang</th>
                    <th className="py-3 px-4">Nama Pemancing</th>
                    <th className="py-3 px-4 text-center">Berat (kg)</th>
                    <th className="py-3 px-4">Masa Timbangan</th>
                    <th className="py-3 px-4">Spesies / Zon</th>
                    <th className="py-3 px-4">Pengesah</th>
                    {isSuperAdmin && <th className="py-3 px-4 text-center">Tindakan</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {displayedCatches.map((item, idx) => {
                    const isTop1 = idx === 0;
                    const isTop2 = idx === 1;
                    const isTop3 = idx === 2;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isTop1
                            ? 'bg-amber-50 font-semibold'
                            : isTop2
                            ? 'bg-slate-100/60 font-semibold'
                            : isTop3
                            ? 'bg-amber-50/40 font-semibold'
                            : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-black font-mono">
                          {isTop1 ? (
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              🥇 #1
                            </span>
                          ) : isTop2 ? (
                            <span className="inline-flex items-center gap-1 text-slate-600">
                              🥈 #2
                            </span>
                          ) : isTop3 ? (
                            <span className="inline-flex items-center gap-1 text-amber-700">
                              🥉 #3
                            </span>
                          ) : (
                            `#${idx + 1}`
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                           Pancang #{item.pegId}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{item.anglerName}</td>
                        <td className="py-3 px-4 text-center font-mono font-black text-amber-600 text-sm">
                          {item.weightKg.toFixed(2)} KG
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{item.timeCaught}</td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 font-medium">{item.species || 'Keli Afrika'}</span>
                          <span className="text-slate-400 text-[10px] block">
                            {formatKolam(item.kolamId)} • {formatZone(item.zone)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ✓ {item.verifiedBy}
                          </span>
                        </td>
                        {isSuperAdmin && onDeleteCatch && (
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => onDeleteCatch(item.id)}
                              className="text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                            >
                              Padam
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

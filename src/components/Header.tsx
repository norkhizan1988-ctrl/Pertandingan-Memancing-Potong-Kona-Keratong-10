import React from 'react';
import { FishLogo } from './FishLogo';
import {
  ShieldCheck,
  Scale,
  Clock,
  MapPin,
  KeyRound,
} from 'lucide-react';
import { UserRole } from '../types';

export type TabType = 'utama' | 'pendaftaran' | 'syarat' | 'ranking';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userRole: UserRole;
  openLoginModal: () => void;
  openAdminModal: () => void;
  openWeighInModal: () => void;
  headerBgUrl: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  openLoginModal,
  openAdminModal,
  openWeighInModal,
  headerBgUrl,
}) => {
  return (
    <header className="relative w-full bg-[#0a2540] border-b border-[#1b3d68] shadow-2xl overflow-hidden select-none">
      
      {/* 1. Header Background: High-resolution tournament banner image */}
      {headerBgUrl ? (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={headerBgUrl}
            alt="Header Background Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-[1.01]"
          />
          {/* Subtle gradient overlay to ensure text and buttons remain crisp and legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071d36]/85 via-[#0c2f57]/80 to-[#124275]/85 backdrop-blur-[0.5px]" />
        </div>
      ) : (
        /* Fallback dynamic gradient & tech pattern */
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#071d36] via-[#0c2f57] to-[#124275] opacity-95 pointer-events-none" />
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#1e4a7d]/40 to-transparent pointer-events-none skew-x-[-18deg] translate-x-12" />
        </>
      )}

      {/* Main Top Banner Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Main Title Section */}
          <div className="flex items-center gap-4 sm:gap-6">
            <FishLogo size={90} className="hover:scale-105 transition-transform duration-300 shrink-0 drop-shadow-xl" />

            <div className="space-y-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-bold tracking-wide uppercase shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                ANJURAN KOLAM PALMVIEW KERATONG 8
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-none">
                <span className="text-amber-400 block sm:inline drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  KOLAM PANCING{' '}
                </span>
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  POTONG KONA KERATONG 10
                </span>
              </h1>

              {/* Sub-info */}
              <div className="flex items-center gap-3 pt-0.5 text-xs text-slate-200 drop-shadow">
                <span className="flex items-center gap-1 text-sky-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5" /> Keratong, Muadzam Shah, Pahang
                </span>
                <span className="hidden sm:inline text-slate-400">•</span>
                <span className="hidden sm:flex items-center gap-1 text-emerald-300 font-bold">
                  <Clock className="w-3.5 h-3.5" /> 8:30 AM – 12:30 PM (4 Jam Berentap)
                </span>
              </div>
            </div>
          </div>

          {/* User Role & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/50">
            
            {/* Status indicator */}
            <div className="text-right hidden lg:block mr-2">
              <div className="text-[11px] text-slate-300 uppercase font-semibold tracking-wider drop-shadow">
                Peranan Semasa
              </div>
              <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5 drop-shadow">
                {userRole === 'super_admin' ? (
                  <span className="text-amber-400 flex items-center gap-1 font-black">
                    👑 Super Admin (Penuh)
                  </span>
                ) : userRole === 'tukang_timbang' ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-black">
                    ⚖️ Tukang Timbang
                  </span>
                ) : (
                  <span className="text-sky-300 flex items-center gap-1 font-bold">
                    🎣 Pemancing (Awam)
                  </span>
                )}
              </div>
            </div>

            {/* Role-specific quick actions */}
            {userRole === 'super_admin' && (
              <button
                onClick={openAdminModal}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Panel Admin
              </button>
            )}

            {userRole === 'tukang_timbang' && (
              <button
                onClick={openWeighInModal}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                + Timbang Ikan
              </button>
            )}

            {/* Switch Role Button */}
            <button
              onClick={openLoginModal}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer backdrop-blur-sm ${
                userRole !== 'pemancing'
                  ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-600'
                  : 'bg-sky-500/30 hover:bg-sky-500/40 text-sky-200 border-sky-400/60'
              }`}
              title="Tukar peranan pengguna (Pemancing / Super Admin / Tukang Timbang)"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              {userRole !== 'pemancing' ? 'Tukar Peranan' : 'Log Masuk'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Exact buttons matching the user's design) */}
        <div className="mt-6 pt-4 border-t border-[#1a3a60]/80">
          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { id: 'utama', label: 'Utama' },
              { id: 'pendaftaran', label: 'Pendaftaran' },
              { id: 'syarat', label: 'Syarat Pertandingan' },
              { id: 'ranking', label: 'Ranking Terkini' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-2.5 px-4 rounded-xl text-center font-bold text-sm sm:text-base tracking-wide transition-all duration-200 cursor-pointer shadow-md ${
                    isActive
                      ? 'bg-white text-[#0a2540] shadow-xl shadow-black/30 ring-2 ring-white/90 font-extrabold'
                      : 'bg-[#1b4372]/90 hover:bg-[#25568f] text-slate-100 border border-[#2b5d99] backdrop-blur-sm'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

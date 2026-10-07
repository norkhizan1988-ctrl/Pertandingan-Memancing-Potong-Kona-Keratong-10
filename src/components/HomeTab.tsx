import React from 'react';
import {
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { UserRole } from '../types';
import { PosterUploadCard } from './PosterUploadCard';

interface HomeTabProps {
  posterUrl: string | null;
  onUploadPoster: (url: string | null) => void;
  onNavigateToBooking: () => void;
  onNavigateToRanking: () => void;
  onNavigateToRules: () => void;
  userRole: UserRole;
  onOpenLoginModal?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  posterUrl,
  onUploadPoster,
  userRole,
}) => {
  const isSuperAdmin = userRole === 'super_admin';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Maklumat & Pengumuman Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6 text-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-[#0c2f57] tracking-tight">
          Maklumat & Pengumuman
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Maklumat terkini akan dikemaskini dari semasa ke semasa.
        </p>
      </div>

      {/* 2. Kad Poster (Boleh Upload untuk Super Admin, View-Only untuk Pemancing) */}
      <PosterUploadCard
        posterUrl={posterUrl}
        onUploadPoster={onUploadPoster}
        isSuperAdmin={isSuperAdmin}
      />

      {/* 3. Kad Hubungi Urusetia & Bantuan */}
      <div className="bg-[#0e2a4a] border border-[#1b4372] rounded-2xl p-5 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5 text-emerald-400 font-black text-lg">
              <PhoneCall className="w-5 h-5" />
              Bantuan & Pertanyaan Urusetia
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              Hubungi urusetia penganjur untuk sebarang urusan tempahan pancang, pengesahan bayaran, atau pertanyaan teknikal pertandingan.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Pegawai Pendaftaran:</span>
                <span className="font-bold text-white">Norkhizan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Talian WhatsApp:</span>
                <span className="font-mono font-bold text-amber-300">+60 19-988 2314</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Lokasi Tapak:</span>
                <span className="font-bold text-white">Keratong 10 / Keratong 8</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href="https://wa.me/60199882314?text=Salam%20Urusetia%2C%20saya%20ingin%20bertanya%20mengenai%20Pertandingan%20Memancing%20Keli%20Kolam%20Potong%20Kona%20Keratong."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              WhatsApp Urusetia Sekarang
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

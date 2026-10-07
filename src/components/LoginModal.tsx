import React, { useState } from 'react';
import { UserRole, UserSession } from '../types';
import {
  X,
  ShieldCheck,
  Scale,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  KeyRound,
  LogOut,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole, customName?: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  const [selectedTab, setSelectedTab] = useState<UserRole>(currentRole);
  const [password, setPassword] = useState('');
  const [marshallName, setMarshallName] = useState('Marshall Zaki');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (role: UserRole) => {
    setError('');

    if (role === 'pemancing') {
      onSelectRole('pemancing');
      onClose();
      return;
    }

    if (role === 'super_admin') {
      // Optional password check (accepts 'admin123' or empty for fast bypass)
      if (password && password !== 'admin123') {
        setError('Kata laluan Super Admin tidak tepat. (Kata laluan: admin123)');
        return;
      }
      onSelectRole('super_admin');
      setPassword('');
      onClose();
      return;
    }

    if (role === 'tukang_timbang') {
      if (password && password !== 'timbang123') {
        setError('Kata laluan Tukang Timbang tidak tepat. (Kata laluan: timbang123)');
        return;
      }
      onSelectRole('tukang_timbang', marshallName || 'Tukang Timbang');
      setPassword('');
      onClose();
      return;
    }
  };

  const handleQuickSwitch = (role: UserRole) => {
    onSelectRole(role, role === 'tukang_timbang' ? marshallName : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e2a4a] text-white rounded-3xl max-w-lg w-full border border-sky-500/40 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#0a213b] border-b border-sky-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Pilih Peranan Akses Sistem</h3>
              <p className="text-xs text-sky-200">
                Pilih mod penggunaan mengikut fungsi & tanggungjawab anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Options */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-900/50 border border-red-500 text-red-200 text-xs">
              {error}
            </div>
          )}

          {/* 1. Pemancing */}
          <div
            onClick={() => setSelectedTab('pemancing')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedTab === 'pemancing'
                ? 'bg-sky-950/70 border-sky-400 ring-2 ring-sky-400/30'
                : 'bg-[#091f36] border-slate-700/80 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-base">Pemancing</span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                      Awam
                    </span>
                    {currentRole === 'pemancing' && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        ● Sedang Digunakan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Lihat poster, pilih & tempah pancang duduk, semak syarat dan lihat ranking langsung secara masa nyata.
                  </p>
                </div>
              </div>
            </div>

            {selectedTab === 'pemancing' && (
              <div className="mt-3 pt-3 border-t border-sky-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('pemancing')}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  Gunakan Mod Pemancing
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 2. Super Admin */}
          <div
            onClick={() => setSelectedTab('super_admin')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedTab === 'super_admin'
                ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-[#091f36] border-slate-700/80 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-base">Super Admin</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Penganjur Utama
                    </span>
                    {currentRole === 'super_admin' && (
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        ● Sedang Digunakan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Akses penuh: Muat naik/padam poster, sahkan status pembayaran peserta (Booking / Bayaran Penuh), selia ranking & eksport CSV.
                  </p>
                </div>
              </div>
            </div>

            {selectedTab === 'super_admin' && (
              <div className="mt-3 pt-3 border-t border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-400">
                    Kata laluan lalai: <span className="text-amber-300 font-mono font-bold">admin123</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickSwitch('super_admin')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    Masuk Sebagai Super Admin
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Tukang Timbang */}
          <div
            onClick={() => setSelectedTab('tukang_timbang')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedTab === 'tukang_timbang'
                ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-[#091f36] border-slate-700/80 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-base">Tukang Timbang</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Marshall Kaunter
                    </span>
                    {currentRole === 'tukang_timbang' && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        ● Sedang Digunakan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Khusus untuk meja timbangan: Memasukkan data no. joran/pancang, berat ikan (kg), dan masa tangkapan ikan secara langsung.
                  </p>
                </div>
              </div>
            </div>

            {selectedTab === 'tukang_timbang' && (
              <div className="mt-3 pt-3 border-t border-emerald-800/60 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="w-full sm:w-auto flex-1">
                    <input
                      type="text"
                      placeholder="Nama Petugas Marshall..."
                      value={marshallName}
                      onChange={(e) => setMarshallName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#091f36] border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickSwitch('tukang_timbang')}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
                  >
                    Buka Kaunter Timbangan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-[#0a213b] border-t border-sky-800/80 flex items-center justify-between text-xs text-slate-400">
          <div>
            Peranan Semasa:{' '}
            <span className="text-white font-bold capitalize">
              {currentRole === 'super_admin'
                ? 'Super Admin'
                : currentRole === 'tukang_timbang'
                ? 'Tukang Timbang'
                : 'Pemancing (Awam)'}
            </span>
          </div>

          {currentRole !== 'pemancing' && (
            <button
              onClick={() => handleQuickSwitch('pemancing')}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Keluar (Kembali ke Pemancing)
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

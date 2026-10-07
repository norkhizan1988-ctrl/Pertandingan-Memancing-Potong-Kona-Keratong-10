import React, { useState, useEffect } from 'react';
import { CatchRecord, Peg, formatKolam, formatZone } from '../types';
import { X, Scale, Clock, CheckCircle, AlertCircle, Plus, RefreshCw } from 'lucide-react';

interface WeighInModalProps {
  isOpen: boolean;
  onClose: () => void;
  pegs: Peg[];
  onAddCatch: (newCatch: Omit<CatchRecord, 'id'>) => void;
  currentMarshallName?: string;
}

export const WeighInModal: React.FC<WeighInModalProps> = ({
  isOpen,
  onClose,
  pegs,
  onAddCatch,
  currentMarshallName = 'Marshall Zaki',
}) => {
  const [pegNumber, setPegNumber] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [timeCaught, setTimeCaught] = useState('');
  const [category, setCategory] = useState<'utama' | 'terbuka'>('utama');
  const [species, setSpecies] = useState('Keli Afrika');
  const [notes, setNotes] = useState('');
  const [verifiedBy, setVerifiedBy] = useState(currentMarshallName);
  const [error, setError] = useState('');

  // Auto-fill time on open
  useEffect(() => {
    if (isOpen) {
      updateToCurrentTime();
      setVerifiedBy(currentMarshallName);
    }
  }, [isOpen, currentMarshallName]);

  const updateToCurrentTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    setTimeCaught(timeStr);
  };

  if (!isOpen) return null;

  const currentPegNumber = parseInt(pegNumber, 10);
  const matchingPeg = pegs.find((p) => p.id === currentPegNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(weightKg);
    if (!currentPegNumber || isNaN(currentPegNumber)) {
      setError('Sila masukkan nombor joran / pancang yang sah.');
      return;
    }
    if (isNaN(weight) || weight <= 0) {
      setError('Sila masukkan berat ikan (KG) yang tepat.');
      return;
    }

    const finalTimeCaught = timeCaught.trim() || new Date().toLocaleTimeString('en-US', { hour12: true });

    onAddCatch({
      pegId: currentPegNumber,
      anglerName: matchingPeg?.anglerName || `Pemancing Pancang ${currentPegNumber}`,
      kolamId: matchingPeg?.kolamId || 'A',
      zone: matchingPeg?.zone || '1',
      weightKg: parseFloat(weight.toFixed(3)),
      timeCaught: finalTimeCaught,
      category,
      species,
      verifiedBy: verifiedBy.trim() || 'Tukang Timbang',
      verifiedAt: finalTimeCaught,
      notes: notes.trim() || 'Ikan hidup, sangkut mulut sah.',
    });

    // Reset form fields
    setPegNumber('');
    setWeightKg('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e2a4a] text-white rounded-2xl max-w-md w-full border border-emerald-500/50 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a213b] border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-emerald-400">Kaunter Tukang Timbang</h3>
              <p className="text-[11px] text-slate-300">Kemasukan Data Tangkapan Ikan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Peg Number (No Joran / Pancang) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              No. Joran / Pancang Pemancing <span className="text-amber-400">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              max="1376"
              placeholder="Masukkan no. pancang (cth: 7)"
              value={pegNumber}
              onChange={(e) => setPegNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#091f36] border border-slate-700 text-white placeholder-slate-500 text-lg font-mono font-bold focus:border-emerald-400 focus:outline-none"
            />
            {matchingPeg ? (
              <div className="text-xs text-emerald-300 mt-1.5 flex items-center gap-1.5 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/50">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">{matchingPeg.anglerName || 'Nama Peserta'}</span>
                  <span className="text-slate-400 text-[11px] block">
                    {formatKolam(matchingPeg.kolamId)} • {formatZone(matchingPeg.zone)}
                  </span>
                </div>
              </div>
            ) : pegNumber ? (
              <div className="text-[11px] text-amber-300 mt-1">
                Pancang #{pegNumber} belum didaftarkan nama (akan direkod atas no. pancang ini).
              </div>
            ) : null}
          </div>

          {/* 2. Weight Input (Berat Ikan KG) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Berat Ikan (Kilogram - KG) <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full pl-4 pr-14 py-3 rounded-xl bg-[#091f36] border-2 border-emerald-500/60 text-emerald-300 placeholder-slate-600 text-3xl font-mono font-black focus:border-emerald-400 focus:outline-none"
              />
              <span className="absolute right-4 top-3.5 text-base font-black text-emerald-400">
                KG
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Pastikan penimbang digital di-reset ke 0.00 KG sebelum meletakkan ikan.
            </p>
          </div>

          {/* 3. Masa Dapat Ikan (Time caught) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Masa Dapat Ikan / Timbang <span className="text-amber-400">*</span>
              </label>
              <button
                type="button"
                onClick={updateToCurrentTime}
                className="text-[10px] text-sky-300 hover:text-sky-200 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Waktu Sekarang
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={timeCaught}
                onChange={(e) => setTimeCaught(e.target.value)}
                placeholder="09:14:22 AM"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#091f36] border border-slate-700 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* 4. Kategori Pertandingan */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory('utama');
                setSpecies('Keli Afrika');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                category === 'utama'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Kategori Utama (Keli)
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory('terbuka');
                setSpecies('Patin');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                category === 'terbuka'
                  ? 'bg-sky-500 text-slate-950 border-sky-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Kategori Terbuka (Lain)
            </button>
          </div>

          {/* Nama Tukang Timbang & Catatan */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Tukang Timbang</label>
              <input
                type="text"
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#091f36] border border-slate-700 text-white text-xs focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Catatan Sah</label>
              <input
                type="text"
                placeholder="Potong sirip sah"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#091f36] border border-slate-700 text-white text-xs focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Simpan & Kemaskini Ranking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

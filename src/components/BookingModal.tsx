import React, { useState } from 'react';
import { Peg, formatKolam, formatZone } from '../types';
import { X, CheckCircle, ShieldCheck, QrCode, AlertCircle, Phone, User, CreditCard } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPegs: Peg[];
  onConfirmBooking: (data: {
    pegs: Peg[];
    anglerName: string;
    phone: string;
    icNumber: string;
    paymentType: 'booking' | 'bayaran_penuh';
    paymentMethod: 'duitnow' | 'bank_transfer' | 'tunai';
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedPegs,
  onConfirmBooking,
}) => {
  const [anglerName, setAnglerName] = useState('');
  const [phone, setPhone] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [paymentType, setPaymentType] = useState<'booking' | 'bayaran_penuh'>('booking');
  const [paymentMethod, setPaymentMethod] = useState<'duitnow' | 'bank_transfer' | 'tunai'>('duitnow');
  const [error, setError] = useState('');

  if (!isOpen || selectedPegs.length === 0) return null;

  const depositRate = 20;
  const fullRate = 100;
  const perPancangFee = paymentType === 'booking' ? depositRate : fullRate;
  const totalAmount = perPancangFee * selectedPegs.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anglerName.trim()) {
      setError('Sila masukkan nama penuh peserta.');
      return;
    }
    if (!phone.trim()) {
      setError('Sila masukkan nombor telefon / WhatsApp yang sah.');
      return;
    }
    setError('');

    onConfirmBooking({
      pegs: selectedPegs,
      anglerName: anglerName.trim(),
      phone: phone.trim(),
      icNumber: icNumber.trim(),
      paymentType,
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e2a4a] text-white rounded-2xl max-w-lg w-full border border-sky-600/40 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a213b] border-b border-sky-800/60 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-amber-400">Borang Tempahan Pancang</h3>
            <p className="text-xs text-slate-300">
              Pertandingan Memancing Keli Kolam Potong Kona Keratong
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Pegs Summary */}
          <div className="p-3.5 rounded-xl bg-[#14365d] border border-sky-700/50">
            <div className="text-xs font-semibold text-sky-200 mb-1">
              Pancang Yang Dipilih ({selectedPegs.length} Pancang):
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPegs.map((peg) => (
                <span
                  key={`${peg.kolamId}-${peg.id}`}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-xs shadow-sm flex items-center gap-1"
                >
                  {formatKolam(peg.kolamId)} • Pancang {peg.id} ({formatZone(peg.zone)})
                </span>
              ))}
            </div>
          </div>

          {/* Angler Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Penuh Peserta / Pemancing <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: Norkhizan bin Che Kamal"
                  value={anglerName}
                  onChange={(e) => setAnglerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#091f36] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  No Telefon (WhatsApp) <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 019-9882314"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#091f36] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  No Kad Pengenalan (Pilihan)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: 880512-06-XXXX"
                    value={icNumber}
                    onChange={(e) => setIcNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#091f36] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Pilihan Pendaftaran & Bayaran
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType('booking')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentType === 'booking'
                    ? 'border-amber-400 bg-amber-500/20 text-white ring-1 ring-amber-400'
                    : 'border-slate-700 bg-[#091f36] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold text-amber-300">Tempah Sahaja (Deposit)</div>
                <div className="text-lg font-black text-white">RM 20 <span className="text-xs font-normal text-slate-400">/ pancang</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Baki RM80 dibayar semasa hari acara</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('bayaran_penuh')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentType === 'bayaran_penuh'
                    ? 'border-emerald-400 bg-emerald-500/20 text-white ring-1 ring-emerald-400'
                    : 'border-slate-700 bg-[#091f36] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold text-emerald-400">Bayaran Penuh</div>
                <div className="text-lg font-black text-white">RM 100 <span className="text-xs font-normal text-slate-400">/ pancang</span></div>
                <div className="text-[11px] text-emerald-300 mt-1">Dapat Pas Pantas & E-Tiket Rasmi</div>
              </button>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="p-3.5 rounded-xl bg-[#081a2e] border border-sky-900/80 space-y-3">
            <label className="block text-xs font-semibold text-sky-200">
              Kaedah Pembayaran:
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('duitnow')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                  paymentMethod === 'duitnow'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                DuitNow QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Pindahan Bank
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('tunai')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                  paymentMethod === 'tunai'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Tunai Kaunter
              </button>
            </div>

            {/* Bank details & QR */}
            <div className="bg-[#0e2a4a] p-3 rounded-lg border border-slate-700 flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="text-slate-400">Bank: <span className="text-white font-semibold">MAYBANK</span></div>
                <div className="text-slate-400">No Akaun: <span className="font-mono text-amber-300 font-bold">1560 9345 8821</span></div>
                <div className="text-slate-400">Nama: <span className="text-white font-semibold">KOLAM PALMVIEW ENT</span></div>
              </div>
              <div className="p-2 bg-white rounded-lg shrink-0 text-slate-950 flex flex-col items-center">
                <QrCode className="w-9 h-9" />
                <span className="text-[9px] font-bold mt-0.5">DuitNow</span>
              </div>
            </div>
          </div>

          {/* Amount Due Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-400/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-300">Jumlah Perlu Dibayar Sekarang:</div>
              <div className="text-xs text-slate-400">
                {selectedPegs.length} Pancang × RM{perPancangFee}
              </div>
            </div>
            <div className="text-2xl font-black text-amber-400">
              RM {totalAmount}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Sahkan & Jana Pas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { Peg, formatKolam, formatZone } from '../types';
import { X, CheckCircle, Printer, Share2, QrCode, Phone, MapPin, Fish } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  peg: Peg | null;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, peg }) => {
  if (!isOpen || !peg) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Salam Urusetia Kolam Palmview / Potong Kona,\n\nSaya ingin mengesahkan tempahan pancang pendaftaran saya:\n- No Pancang: ${formatKolam(peg.kolamId)}, Pancang ${peg.id} (${formatZone(peg.zone)})\n- Nama: ${peg.anglerName || 'Peserta'}\n- No Tel: ${peg.phone || '-'}\n- Status: ${peg.status === 'bayaran_penuh' ? 'Bayaran Penuh (RM100)' : 'Booking Deposit (RM20)'}\n- No Resit: ${peg.receiptNumber || 'TEMP-001'}\n\nTerima kasih!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Ticket Header */}
        <div className="bg-[#0c2f57] text-white p-5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-amber-400" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase mb-2">
            <CheckCircle className="w-3.5 h-3.5" /> Pendaftaran Berjaya
          </div>

          <h3 className="text-xl font-black text-white">E-PAS PERTANDINGAN</h3>
          <p className="text-xs text-sky-200">KOLAM POTONG KONA KERATONG 10</p>
        </div>

        {/* Ticket Body with Punch Hole style */}
        <div className="p-6 space-y-5 bg-gradient-to-b from-slate-50 to-white">
          
          {/* Main Peg Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-center shadow-lg border-2 border-amber-400/80 relative">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              {formatKolam(peg.kolamId).toUpperCase()} • {formatZone(peg.zone).toUpperCase()}
            </div>
            <div className="text-5xl font-black text-amber-400 my-1 font-mono tracking-tight">
              #{peg.id}
            </div>
            <div className="inline-block px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {peg.status === 'bayaran_penuh' ? 'BAYARAN PENUH (RM100)' : 'BOOKING TERJAMIN (DEPOSIT RM20)'}
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs text-slate-600 border-y border-dashed border-slate-300 py-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Nama Pemancing:</span>
              <span className="font-bold text-slate-900 text-sm">{peg.anglerName || 'Peserta'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">No Telefon:</span>
              <span className="font-mono font-semibold text-slate-800">{peg.phone || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">No Resit Pendaftaran:</span>
              <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {peg.receiptNumber || `BK-K${peg.kolamId}-${peg.id}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tarikh Tempahan:</span>
              <span className="text-slate-700">{peg.registeredAt || '06 Okt 2026, 10:00 AM'}</span>
            </div>
          </div>

          {/* QR Code Verification Section */}
          <div className="bg-slate-100 p-3.5 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Kod Pengesahan Joran</div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  Tunjukkan slip ini kepada Marshall di meja pendaftaran sebelum 8:00 AM.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <a
              href={`https://wa.me/60199882314?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Hantar Bukti ke WhatsApp Urusetia
            </a>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-300"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak E-Tiket
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Announcement, Peg, CatchRecord, formatKolam, formatZone } from '../types';
import {
  X,
  ShieldCheck,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Users,
  Bell,
  Scale,
  CheckCircle,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  pegs: Peg[];
  announcements: Announcement[];
  catches: CatchRecord[];
  onAddAnnouncement: (item: Omit<Announcement, 'id'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onUpdatePegStatus: (pegId: number, kolamId: string | number, newStatus: Peg['status'], anglerName?: string) => void;
  onResetData: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  pegs,
  announcements,
  catches,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onUpdatePegStatus,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'peserta' | 'pengumuman' | 'timbangan' | 'tetapan'>('peserta');
  
  // New announcement state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  // Search in admin peserta
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter booked or paid pegs
  const registeredPegs = pegs.filter((p) => p.status !== 'kosong');
  const filteredPegs = registeredPegs.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.id.toString().includes(q) ||
      p.anglerName?.toLowerCase().includes(q) ||
      p.phone?.includes(q)
    );
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const dateStr = new Date().toLocaleDateString('ms-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    onAddAnnouncement({
      title: newTitle.trim(),
      content: newContent.trim(),
      date: dateStr,
      isImportant,
    });

    setNewTitle('');
    setNewContent('');
    setIsImportant(false);
  };

  const handleExportCSV = () => {
    const headers = 'Kolam,Zon,No Pancang,Nama Pemancing,No Telefon,Status,Bayaran (RM),No Resit,Tarikh\n';
    const rows = registeredPegs
      .map(
        (p) =>
          `"${formatKolam(p.kolamId)}","${formatZone(p.zone)}",${p.id},"${p.anglerName || '-'}",${p.phone || '-'},${p.status},${
            p.status === 'bayaran_penuh' ? 100 : 20
          },${p.receiptNumber || '-'},"${p.registeredAt || '-'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Senarai_Peserta_Kolam_Keratong_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e2a4a] text-white rounded-3xl max-w-4xl w-full border border-sky-500/40 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a213b] border-b border-sky-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Panel Pengurusan Urusetia & Marshall</h3>
              <p className="text-xs text-sky-200">
                Kolam Palmview Keratong 8 & Kolam Potong Kona Keratong 10
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Subnav */}
        <div className="flex border-b border-sky-900/60 bg-[#081a2e] px-6 gap-2 text-xs font-bold pt-2">
          <button
            onClick={() => setActiveTab('peserta')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'peserta'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Pengurusan Peserta ({registeredPegs.length})
          </button>
          <button
            onClick={() => setActiveTab('pengumuman')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'pengumuman'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            Pengumuman ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('tetapan')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tetapan'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Eksport & Tetapan
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: PESERTA */}
          {activeTab === 'peserta' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Cari peserta, nombor telefon atau nombor pancang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-[#091f36] border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 flex-1"
                />
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Muat Turun CSV
                </button>
              </div>

              {filteredPegs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-[#091f36] rounded-xl border border-slate-800">
                  Tiada rekod tempahan dijumpai.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-sky-900/60 shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#091f36] text-sky-200 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Kolam/Pancang</th>
                        <th className="py-2.5 px-3">Nama Pemancing</th>
                        <th className="py-2.5 px-3">No Telefon</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">No Resit</th>
                        <th className="py-2.5 px-3 text-center">Ubah Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-950 text-slate-300">
                      {filteredPegs.map((p) => (
                        <tr key={`${p.kolamId}-${p.id}`} className="hover:bg-[#12365d]/50">
                          <td className="py-2 px-3 font-mono font-bold text-white">
                            {formatKolam(p.kolamId)} • #{p.id} ({formatZone(p.zone)})
                          </td>
                          <td className="py-2 px-3 font-semibold text-white">
                            {p.anglerName || '-'}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-400">{p.phone || '-'}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                p.status === 'bayaran_penuh'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {p.status === 'bayaran_penuh' ? 'Bayar Penuh' : 'Booking'}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-xs text-sky-300">
                            {p.receiptNumber || '-'}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {p.status !== 'bayaran_penuh' && (
                                <button
                                  onClick={() =>
                                    onUpdatePegStatus(p.id, p.kolamId, 'bayaran_penuh', p.anglerName)
                                  }
                                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                                  title="Tukar ke Bayaran Penuh (RM100)"
                                >
                                  Sahkan Penuh
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  onUpdatePegStatus(p.id, p.kolamId, 'kosong', undefined)
                                }
                                className="px-2 py-1 rounded bg-red-800/80 hover:bg-red-700 text-white font-bold text-[10px]"
                                title="Batal & Kosongkan Pancang"
                              >
                                Batal
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PENGUMUMAN */}
          {activeTab === 'pengumuman' && (
            <div className="space-y-5">
              {/* Add form */}
              <form
                onSubmit={handleCreateAnnouncement}
                className="bg-[#091f36] p-4 rounded-2xl border border-sky-900/60 space-y-3"
              >
                <div className="font-bold text-xs text-amber-300">Tambah Pengumuman Terkini:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Tajuk pengumuman..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0e2a4a] border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isImportant}
                        onChange={(e) => setIsImportant(e.target.checked)}
                        className="rounded bg-slate-800 text-amber-400 focus:ring-amber-400"
                      />
                      <span>Penting (Warna Merah)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Kandungan mesej pengumuman rasmi..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e2a4a] border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Terbitkan Pengumuman
                  </button>
                </div>
              </form>

              {/* Announcements list */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400">Senarai Pengumuman Semasa:</div>
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#091f36] border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.title}</span>
                        {item.isImportant && (
                          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold">
                            PENTING
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-slate-300 mt-1">{item.content}</p>
                    </div>
                    <button
                      onClick={() => onDeleteAnnouncement(item.id)}
                      className="p-1 rounded hover:bg-red-900/40 text-red-400 hover:text-red-300"
                      title="Padam Pengumuman"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TETAPAN & RESET */}
          {activeTab === 'tetapan' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#091f36] border border-sky-900/60 space-y-3">
                <div className="font-bold text-xs text-white">Eksport Data Acara:</div>
                <p className="text-xs text-slate-300">
                  Simpan sandaran fail semua peserta pancang dan tangkapan ikan untuk arkib urusetia.
                </p>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Eksport Fail CSV
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-3">
                <div className="font-bold text-xs text-red-300">Reset Data Semula:</div>
                <p className="text-xs text-slate-300">
                  Tetapkan semula semua data pancang, ranking dan pengumuman kepada tetapan asal.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Adakah anda pasti ingin menetapkan semula data sistem kepada asal?')) {
                      onResetData();
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset ke Data Asal
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a213b] border-t border-sky-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Tutup Panel
          </button>
        </div>

      </div>
    </div>
  );
};

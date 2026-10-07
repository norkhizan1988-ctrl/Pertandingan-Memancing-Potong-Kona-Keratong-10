import React from 'react';
import { prizeStructure } from '../mockData';
import { FishLogo } from './FishLogo';
import {
  FileText,
  AlertTriangle,
  Scale,
  Award,
  CheckCircle2,
  Printer,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const RulesTab: React.FC<RulesTabProps> = ({ posterUrl }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900">
      
      {/* 1. Header Card with Title & Poster Visual (Matching Screenshot 3) */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c2f57] tracking-tight">
              Syarat Pertandingan
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Sila baca dan fahami peraturan rasmi sebelum pertandingan bermula.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Syarat
          </button>
        </div>

        {/* Poster Visual (Matching the visual banner in Screenshot 3 or showing uploaded poster) */}
        <div className="p-4 sm:p-6 bg-slate-900">
          {posterUrl ? (
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40 bg-black flex justify-center items-center max-h-[500px]">
              <img
                src={posterUrl}
                alt="Poster Rasmi Pertandingan"
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#031526] via-[#092c52] to-[#041629] border border-amber-500/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              {/* Water background & light glow */}
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

              {/* Left Logo */}
              <div className="relative z-10 shrink-0">
                <FishLogo size={120} className="shadow-2xl hover:scale-105 transition-transform" />
              </div>

              {/* Center Poster Title */}
              <div className="relative z-10 text-center md:text-left space-y-2 flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-widest">
                  ANJURAN KOLAM PALMVIEW KERATONG 8
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
                  SYARAT-SYARAT <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
                    PERTANDINGAN
                  </span>{' '}
                  <span className="text-amber-400">MEMANCING KELI</span>
                </h3>
                <p className="text-sky-200 font-bold text-sm tracking-wide">
                  KOLAM PALMVIEW KERATONG 8 & KOLAM POTONG KONA KERATONG 10
                </p>
              </div>

              {/* Right Badge */}
              <div className="relative z-10 bg-slate-950/80 p-4 rounded-xl border border-amber-500/40 text-center shrink-0">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Hadiah Juara</div>
                <div className="text-2xl font-black text-amber-400 font-mono">RM 10,000</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">WANG TUNAI</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Structured Rules Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Section A: Syarat Am & Pendaftaran */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-3">
          <div className="flex items-center gap-2.5 text-[#0c2f57] font-black text-lg pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-sky-600" />
            1. Syarat Am & Pendaftaran
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed list-disc list-inside">
            <li>
              Penyertaan terbuka kepada seluruh warganegara Malaysia dan peminat sukan memancing.
            </li>
            <li>
              Setiap penyertaan terhad kepada <strong>1 joran bagi 1 pemancing</strong> untuk satu nombor pancang yang didaftarkan.
            </li>
            <li>
              Yuran penyertaan rasmi adalah <strong>RM 100 bagi setiap joran</strong>. Deposit booking sebanyak <strong>RM 20</strong> boleh dibayar awal untuk tempahan tempat duduk.
            </li>
            <li>
              Wang yuran penyertaan atau deposit <strong>tidak akan dikembalikan</strong> sekiranya peserta menarik diri atau gagal hadir pada hari pertandingan.
            </li>
            <li>
              Peserta wajib memakai tag pengesahan joran yang dibekalkan oleh pihak urusetia sepanjang pertandingan.
            </li>
          </ul>
        </div>

        {/* Section B: Syarat Joran & Mata Kail */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-3">
          <div className="flex items-center gap-2.5 text-[#0c2f57] font-black text-lg pb-2 border-b border-slate-100">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            2. Syarat Joran & Mata Kail
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed list-disc list-inside">
            <li>
              Hanya dibenarkan menggunakan <strong>maksimum 2 mata kail sahaja</strong> pada setiap joran.
            </li>
            <li>
              <strong className="text-red-600">DILARANG SAMA SEKALI:</strong> Menggunakan mata kail candat, mata tiga serangkai (treble hook), atau sauh.
            </li>
            <li>
              Saiz mata kail yang dibenarkan adalah mengikut saiz standard kolam pancing keli (Mata kail tajam bersaiz 1 hingga 6).
            </li>
            <li>
              Tali tangsi atau tali benang (braided) bebas tanpa sebarang had ketahanan paun.
            </li>
            <li>
              Joran sandaran dibenarkan diletakkan di belakang pancang, namun mata kail mestilah tidak berada di dalam air sebelum digunakan.
            </li>
          </ul>
        </div>

        {/* Section C: Syarat Umpan Sah */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-3">
          <div className="flex items-center gap-2.5 text-[#0c2f57] font-black text-lg pb-2 border-b border-slate-100">
            <FileText className="w-5 h-5 text-emerald-600" />
            3. Syarat Umpan & Teknik Pancingan
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed list-disc list-inside">
            <li>
              <strong>Umpan yang dibenarkan:</strong> Cacing tanah, cacing susu, hati ayam mentah, isi ayam, roti, dedak kolam, dan perisa makanan yang diluluskan.
            </li>
            <li>
              <strong className="text-red-600">DILARANG KERAS:</strong> Bahan beracun, bahan kimia merbahaya, usus babi/anjing, atau bahan yang mencemarkan air kolam.
            </li>
            <li>
              Teknik menabur dedak berlebihan (bom dedak) yang mengganggu pemancing di pancang sebelah adalah dilarang.
            </li>
            <li>
              Sebarang lontaran hendaklah lurus ke hadapan pancang masing-masing bagi mengelakkan tali berselirat dengan peserta bersebelahan.
            </li>
          </ul>
        </div>

        {/* Section D: Syarat Timbangan Ikan */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-3">
          <div className="flex items-center gap-2.5 text-[#0c2f57] font-black text-lg pb-2 border-b border-slate-100">
            <Scale className="w-5 h-5 text-indigo-600" />
            4. Peraturan Timbangan Ikan Keli
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed list-disc list-inside">
            <li>
              Ikan mestilah <strong>hidup dan segar</strong> semasa dibawa ke kaunter timbangan rasmi. Ikan yang mati atau busuk tidak akan diterima.
            </li>
            <li>
              Ikan sah mestilah <strong>tersangkut di bahagian mulut sahaja</strong> (bibir atas, bibir bawah atau dalam mulut). Ikan yang tersangkut di badan/sirip/ekor (tercucuk tidak sengaja) dianggap batal.
            </li>
            <li>
              Marshall di meja timbangan berhak memotong/menandakan sirip dorsal ikan sejurus selepas ditimbang bagi mengelakkan timbangan berulang.
            </li>
            <li>
              Masa timbangan akan direkodkan mengikut jam sistem digital urusetia secara tepat ke peringkat saat.
            </li>
          </ul>
        </div>

      </div>

      {/* 3. Penentuan Pemenang & Bantahan Notice */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-300 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          Penentuan Pemenang, Seri & Bantahan Rasmi:
        </div>
        <p className="text-xs leading-relaxed text-amber-900">
          • Pemenang ditentukan berdasarkan <strong>berat ikan tertinggi (Kilogram)</strong>.<br />
          • Sekiranya terdapat <strong>berat ikan yang sama (seri)</strong>, pemenang akan ditentukan berasaskan <strong>masa tangkapan yang paling awal didaftarkan</strong> di meja timbangan.<br />
          • Sebarang bantahan rasmi mestilah dikemukakan dalam tempoh <strong>15 minit selepas wisel penamat</strong> ditiup berserta wang cagaran tunai <strong>RM 100.00</strong>. Wang cagaran akan hangus sekiranya bantahan ditolak.<br />
          • Keputusan panel juri dan urusetia penganjur adalah <strong>MUKTAMAD</strong>.
        </p>
      </div>

      {/* 4. Jadual Hadiah Rasmi (No 1 - No 40) */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-lg font-black text-[#0c2f57]">
            <Award className="w-5 h-5 text-amber-500" />
            Jadual Rasmi Hadiah Pertandingan
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Total 40+ Hadiah
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Kedudukan</th>
                <th className="py-3 px-4">Gelaran / Kategori</th>
                <th className="py-3 px-4">Hadiah Wang Tunai</th>
                <th className="py-3 px-4 rounded-r-lg">Hadiah Iringan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {prizeStructure.map((prize, idx) => {
                const isPodium = idx < 3;
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 transition-colors ${
                      isPodium ? 'bg-amber-50/50 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${prize.position}`}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">{prize.title}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700 font-mono text-sm">
                      {prize.prizeMoney}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{prize.additionalReward || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

interface RulesTabProps {
  posterUrl?: string | null;
}

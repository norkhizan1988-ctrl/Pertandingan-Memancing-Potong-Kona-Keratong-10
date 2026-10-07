import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Maximize2,
  X,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { FishLogo } from './FishLogo';

interface PosterUploadCardProps {
  posterUrl: string | null;
  onUploadPoster: (url: string | null) => void;
  isSuperAdmin?: boolean;
}

export const PosterUploadCard: React.FC<PosterUploadCardProps> = ({
  posterUrl,
  onUploadPoster,
  isSuperAdmin = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showLightbox, setShowLightbox] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Handle file selection from local device (Super Admin only)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSuperAdmin) return;
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Sila pilih fail gambar sahaja (PNG, JPG, WEBP, JPEG).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Saiz fail terlalu besar. Sila pilih gambar di bawah 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUploadPoster(result);
      }
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca fail gambar. Sila cuba lagi.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isSuperAdmin) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isSuperAdmin) return;
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isSuperAdmin) return;
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    onUploadPoster(imageUrl.trim());
    setImageUrl('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      {/* Poster Container Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white rounded-2xl shadow-xl border overflow-hidden transition-all duration-200 ${
          isDragging && isSuperAdmin
            ? 'border-amber-400 ring-4 ring-amber-400/30'
            : 'border-slate-200'
        }`}
      >
        {/* Top Control Bar: Visible ONLY for Super Admin */}
        {isSuperAdmin && (
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 font-bold">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0c2f57]">
                  Pengurusan Poster Pertandingan (Super Admin)
                </h3>
                <p className="text-xs text-slate-500">
                  {posterUrl
                    ? 'Poster rasmi telah dimuat naik. Anda boleh menukar, memasukkan URL atau memadamkannya.'
                    : 'Muat naik gambar poster rasmi pertandingan memancing di sini.'}
                </p>
              </div>
            </div>

            {/* Super Admin Action Buttons */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-[#0c2f57] hover:bg-[#143d6b] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                {posterUrl ? 'Tukar Poster' : 'Muat Naik Poster'}
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="Masukkan pautan URL gambar"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                URL
              </button>

              {posterUrl && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowLightbox(true)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Lihat Saiz Penuh"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                    Penuh
                  </button>

                  <button
                    type="button"
                    onClick={() => onUploadPoster(null)}
                    className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs border border-red-200 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Padam poster"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Padam
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* URL Input Form (Super Admin Only) */}
        {isSuperAdmin && showUrlInput && (
          <form
            onSubmit={handleUrlSubmit}
            className="p-4 bg-sky-50 border-b border-sky-100 flex items-center gap-2 animate-fadeIn"
          >
            <input
              type="url"
              required
              placeholder="Tampal pautan gambar poster (cth: https://contoh.com/poster.jpg)..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Guna URL
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Upload Error notification (Super Admin Only) */}
        {isSuperAdmin && uploadError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs border-b border-red-200 flex items-center justify-between">
            <span>{uploadError}</span>
            <button onClick={() => setUploadError('')} className="text-red-500 font-bold">×</button>
          </div>
        )}

        {/* Main Display Area */}
        <div className="p-3 sm:p-5 bg-slate-900/95">
          {posterUrl ? (
            /* Custom Uploaded Poster (Clean View for everyone, click to open full size) */
            <div className="relative group rounded-xl overflow-hidden shadow-2xl bg-black border border-slate-800 flex justify-center items-center max-h-[700px]">
              <img
                src={posterUrl}
                alt="Poster Rasmi Pertandingan Memancing Keli"
                className="w-full h-auto max-h-[700px] object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.005]"
                onClick={() => setShowLightbox(true)}
              />

              {/* View full size hover badge */}
              <div
                onClick={() => setShowLightbox(true)}
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-none sm:pointer-events-auto"
              >
                <div className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-bold text-xs flex items-center gap-2 shadow-2xl border border-sky-400/40 backdrop-blur">
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                  Klik Untuk Lihat Saiz Penuh
                </div>
              </div>
            </div>
          ) : isSuperAdmin ? (
            /* Super Admin Dropzone when no poster uploaded yet */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sky-600/50 hover:border-amber-400 rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all bg-gradient-to-b from-[#09223e] to-[#051426] hover:bg-[#0b2848] text-white space-y-4 group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-[#12365d] border border-sky-400/40 flex items-center justify-center group-hover:scale-110 group-hover:border-amber-400 transition-all shadow-xl">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg sm:text-xl font-black text-white">
                  Klik atau Tarik Gambar Poster Ke Sini
                </h4>
                <p className="text-xs sm:text-sm text-sky-200">
                  Menyokong format fail PNG, JPG, JPEG atau WEBP (Maksimum 8MB).
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all">
                <Upload className="w-4 h-4" />
                Pilih Fail Gambar Poster
              </div>
            </div>
          ) : (
            /* User / Pemancing Mode (View-Only Official Tournament Graphic Banner) */
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#06192e] via-[#0b2b4f] to-[#041221] text-white p-6 sm:p-10 border border-[#1e4a7d] shadow-2xl">
              {/* Subtle background tech accents */}
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="space-y-3.5 max-w-2xl text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
                    🏆 Acara Terbesar Pantai Timur 2026
                  </div>

                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white drop-shadow-lg">
                    PERTANDINGAN <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                      MEMANCING KELI
                    </span>
                  </h3>

                  <p className="text-base sm:text-lg font-bold text-sky-200">
                    KOLAM POTONG KONA KERATONG 10 & KOLAM PALMVIEW KERATONG 8
                  </p>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Sedia berentap memburu gelaran Juara Keli Terberat! Terbuka kepada 1,376 pemancing
                    dengan pelepasan <span className="text-amber-300 font-semibold">2,500 KG Keli Afrika Kasar</span>. Rebut hadiah wang tunai keseluruhan mencecah puluhan ribu ringgit!
                  </p>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/80 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Juara Utama</div>
                      <div className="text-lg font-black text-amber-400">RM 10,000</div>
                    </div>
                    <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/80 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Yuran / Joran</div>
                      <div className="text-lg font-black text-sky-400">RM 100</div>
                    </div>
                    <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/80 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Deposit Booking</div>
                      <div className="text-lg font-black text-emerald-400">RM 20</div>
                    </div>
                    <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/80 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Kouta Pancang</div>
                      <div className="text-lg font-black text-white">1,376</div>
                    </div>
                  </div>
                </div>

                {/* Right Logo visual */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <FishLogo size={150} className="shadow-2xl" />
                  <div className="mt-3 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-500/40 text-amber-300 text-[10px] font-bold tracking-widest uppercase">
                    SINCE 2024 • KERATONG
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Lightbox Modal for Fullscreen Poster */}
      {showLightbox && posterUrl && (
        <div
          onClick={() => setShowLightbox(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center"
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-lg cursor-pointer"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={posterUrl}
              alt="Poster Penuh"
              className="max-h-[85vh] w-auto max-w-full rounded-2xl shadow-2xl border border-slate-700 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

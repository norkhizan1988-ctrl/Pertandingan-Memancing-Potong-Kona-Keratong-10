import React, { useRef, useState } from 'react';
import { UserRole } from '../types';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Maximize2,
  X,
  Link as LinkIcon,
  Check,
  MapPin,
  Sparkles,
  Layers,
  ZoomIn,
} from 'lucide-react';

interface SeatMapImageBarProps {
  imageUrl: string | null;
  onUploadImage: (url: string | null) => void;
  userRole: UserRole;
}

export const SeatMapImageBar: React.FC<SeatMapImageBarProps> = ({
  imageUrl,
  onUploadImage,
  userRole,
}) => {
  const isSuperAdmin = userRole === 'super_admin';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Sila muat naik fail gambar (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onUploadImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isSuperAdmin) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onUploadImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlValue.trim()) {
      onUploadImage(urlValue.trim());
      setShowUrlInput(false);
      setUrlValue('');
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 transition-all">
        {/* Top Header of the Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#0c2f57]">
                  Peta Tapak & Susun Atur Pancang Kolam
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  Kolam A, B & C
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Panduan susun atur: <span className="font-semibold text-slate-700">Zon 1 (Sebelah Kiri)</span> &amp;{' '}
                <span className="font-semibold text-slate-700">Zon 2 (Sebelah Kanan)</span>
              </p>
            </div>
          </div>

          {/* Action buttons on top right */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {imageUrl && (
              <button
                type="button"
                onClick={() => setIsFullScreen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Besarkan Gambar</span>
              </button>
            )}

            {isSuperAdmin && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{imageUrl ? 'Tukar Gambar' : 'Muat Naik Gambar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Pautan URL Gambar"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">URL</span>
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Adakah anda pasti ingin memadam gambar peta tapak ini?')) {
                        onUploadImage(null);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs transition-colors cursor-pointer"
                    title="Padam Gambar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* URL Input Drawer for Super Admin */}
        {showUrlInput && isSuperAdmin && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="url"
              placeholder="Masukkan URL gambar peta (cth: https://contoh.com/peta-kolam.jpg)"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              className="flex-1 w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Content Body: Either Uploaded Image OR Upload Prompt / Guide Banner */}
        <div className="mt-4">
          {imageUrl ? (
            <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
              <div
                className="cursor-pointer relative overflow-hidden flex items-center justify-center max-h-[360px] bg-slate-950"
                onClick={() => setIsFullScreen(true)}
              >
                <img
                  src={imageUrl}
                  alt="Peta Pelan & Susun Atur Kolam Keratong"
                  className="w-full object-contain max-h-[360px] transition-transform duration-300 group-hover:scale-[1.01]"
                />
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-[2px]">
                  <ZoomIn className="w-5 h-5 text-amber-400" />
                  <span>Klik Untuk Paparan Penuh (Zoom)</span>
                </div>
              </div>

              {/* Bottom bar caption */}
              <div className="px-4 py-2 bg-slate-900/90 text-slate-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">
                    Peta Kolam A, B, C &amp; Zon 1, 2
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(true)}
                  className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" />
                  Lihat Saiz Penuh
                </button>
              </div>
            </div>
          ) : isSuperAdmin ? (
            /* Super Admin Dropzone when no image is uploaded */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-300 hover:border-sky-400 bg-slate-50/80 hover:bg-sky-50/40'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm mb-1">
                Muat Naik Gambar Peta / Kawasan Kolam &amp; Susun Atur Pancang
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-3">
                Seret dan lepas fail gambar di sini, atau klik untuk memilih gambar (PNG, JPG, WEBP).
                Gambar ini akan dipaparkan kepada pemancing untuk rujukan kedudukan pancang.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm">
                <ImageIcon className="w-4 h-4" />
                Pilih Fail Gambar
              </div>
            </div>
          ) : (
            /* Angler view when no custom image has been uploaded by super admin */
            <div className="rounded-xl border border-sky-200 bg-gradient-to-r from-[#0d3056] to-[#124277] text-white p-5 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> Pelan Rasmi Pertandingan
                  </div>
                  <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Susun Atur 3 Kolam: Kolam A, Kolam B &amp; Kolam C
                  </h4>
                  <p className="text-xs text-sky-200 max-w-xl">
                    Setiap kolam dibahagikan kepada <span className="font-bold text-amber-300">Zon 1 (sebelah kiri)</span> dan{' '}
                    <span className="font-bold text-amber-300">Zon 2 (sebelah kanan)</span>. Sila klik nombor pancang pilihan anda di ruangan peta tempat duduk di bawah.
                  </p>
                </div>

                {/* Quick Visual Chips */}
                <div className="grid grid-cols-3 gap-2 w-full md:w-auto shrink-0">
                  <div className="bg-[#0a2340] border border-sky-400/30 p-2.5 rounded-xl text-center">
                    <div className="font-black text-amber-400 text-xs">Kolam A</div>
                    <div className="text-[10px] text-slate-300 font-medium">458 Pancang</div>
                    <div className="text-[9px] text-sky-300 mt-0.5 font-bold">Zon 1 &amp; 2</div>
                  </div>
                  <div className="bg-[#0a2340] border border-sky-400/30 p-2.5 rounded-xl text-center">
                    <div className="font-black text-amber-400 text-xs">Kolam B</div>
                    <div className="text-[10px] text-slate-300 font-medium">458 Pancang</div>
                    <div className="text-[9px] text-sky-300 mt-0.5 font-bold">Zon 1 &amp; 2</div>
                  </div>
                  <div className="bg-[#0a2340] border border-sky-400/30 p-2.5 rounded-xl text-center">
                    <div className="font-black text-amber-400 text-xs">Kolam C</div>
                    <div className="text-[10px] text-slate-300 font-medium">460 Pancang</div>
                    <div className="text-[9px] text-sky-300 mt-0.5 font-bold">Zon 1 &amp; 2</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsFullScreen(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={imageUrl}
              alt="Peta Penuh Susun Atur Kolam"
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />

            <div className="mt-3 text-center text-xs text-white/80 font-medium">
              Peta Tapak &amp; Susun Atur Kolam A, B, C (Zon 1 &amp; Zon 2) • Klik di luar gambar atau tekan silang untuk tutup.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

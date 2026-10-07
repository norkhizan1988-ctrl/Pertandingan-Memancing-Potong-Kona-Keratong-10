/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { HomeTab } from './components/HomeTab';
import { RegistrationTab } from './components/RegistrationTab';
import { RulesTab } from './components/RulesTab';
import { RankingTab } from './components/RankingTab';
import { BookingModal } from './components/BookingModal';
import { TicketModal } from './components/TicketModal';
import { WeighInModal } from './components/WeighInModal';
import { AdminModal } from './components/AdminModal';
import { LoginModal } from './components/LoginModal';
import { initialPegs, initialAnnouncements, initialCatches } from './mockData';
import { Peg, Announcement, CatchRecord, UserRole } from './types';
import { FishLogo } from './components/FishLogo';

const LOCAL_STORAGE_PEGS_KEY = 'keratong_fishing_pegs_v2';
const LOCAL_STORAGE_ANNOUNCEMENTS_KEY = 'keratong_fishing_announcements_v2';
const LOCAL_STORAGE_CATCHES_KEY = 'keratong_fishing_catches_v2';
const LOCAL_STORAGE_POSTER_KEY = 'keratong_fishing_poster_v2';
const LOCAL_STORAGE_ROLE_KEY = 'keratong_fishing_user_role_v2';
const LOCAL_STORAGE_HEADER_BG_KEY = 'keratong_fishing_header_bg_v2';
const LOCAL_STORAGE_SEATMAP_IMAGE_KEY = 'keratong_fishing_seatmap_image_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('utama');
  
  // Persistent seatmap image URL (for pond layout / seat map bar)
  const [seatMapImageUrl, setSeatMapImageUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_SEATMAP_IMAGE_KEY) || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  });

  const handleUploadSeatMapImage = (url: string | null) => {
    setSeatMapImageUrl(url);
    try {
      if (url) {
        localStorage.setItem(LOCAL_STORAGE_SEATMAP_IMAGE_KEY, url);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_SEATMAP_IMAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Persistent header background image URL (defaults to generated high-res header banner)
  const [headerBgUrl, setHeaderBgUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_HEADER_BG_KEY) || '/header_banner.jpg';
    } catch (e) {
      return '/header_banner.jpg';
    }
  });

  const handleUploadHeaderBg = (url: string | null) => {
    setHeaderBgUrl(url);
    try {
      if (url) {
        localStorage.setItem(LOCAL_STORAGE_HEADER_BG_KEY, url);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_HEADER_BG_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Persistent role state (pemancing | super_admin | tukang_timbang)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY) as UserRole;
      if (saved && ['pemancing', 'super_admin', 'tukang_timbang'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return 'pemancing';
  });

  const [marshallName, setMarshallName] = useState('Marshall Zaki');

  const handleSelectRole = (newRole: UserRole, customName?: string) => {
    setUserRole(newRole);
    if (customName) setMarshallName(customName);
    try {
      localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, newRole);
    } catch (e) {
      console.error(e);
    }
  };

  // Persistent poster URL
  const [posterUrl, setPosterUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_POSTER_KEY) || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  });

  const handleUploadPoster = (url: string | null) => {
    setPosterUrl(url);
    try {
      if (url) {
        localStorage.setItem(LOCAL_STORAGE_POSTER_KEY, url);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_POSTER_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  // Persistent pegs data
  const [pegs, setPegs] = useState<Peg[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PEGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialPegs;
  });

  // Persistent announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ANNOUNCEMENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialAnnouncements;
  });

  // Persistent catches
  const [catches, setCatches] = useState<CatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CATCHES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialCatches;
  });

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PEGS_KEY, JSON.stringify(pegs));
    } catch (e) {
      console.error(e);
    }
  }, [pegs]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
    } catch (e) {
      console.error(e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CATCHES_KEY, JSON.stringify(catches));
    } catch (e) {
      console.error(e);
    }
  }, [catches]);

  // Modal states
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPegsForBooking, setSelectedPegsForBooking] = useState<Peg[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketPeg, setTicketPeg] = useState<Peg | null>(null);
  const [isWeighInModalOpen, setIsWeighInModalOpen] = useState(false);

  // Handle open booking modal
  const handleOpenBooking = (selected: Peg[]) => {
    setSelectedPegsForBooking(selected);
    setIsBookingModalOpen(true);
  };

  // Handle view ticket
  const handleViewTicket = (peg: Peg) => {
    setTicketPeg(peg);
    setIsTicketModalOpen(true);
  };

  // Handle confirm booking
  const handleConfirmBooking = ({
    pegs: bookedPegs,
    anglerName,
    phone,
    icNumber,
    paymentType,
    paymentMethod,
  }: {
    pegs: Peg[];
    anglerName: string;
    phone: string;
    icNumber: string;
    paymentType: 'booking' | 'bayaran_penuh';
    paymentMethod: 'duitnow' | 'bank_transfer' | 'tunai';
  }) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('ms-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const bookedIds = new Set(bookedPegs.map((p) => `${p.kolamId}-${p.id}`));

    let lastUpdatedPeg: Peg | null = null;

    setPegs((prev) =>
      prev.map((peg) => {
        if (bookedIds.has(`${peg.kolamId}-${peg.id}`)) {
          const receiptCode = `${paymentType === 'bayaran_penuh' ? 'FP' : 'BK'}-K${peg.kolamId}-${peg.id.toString().padStart(4, '0')}`;
          const updated: Peg = {
            ...peg,
            status: paymentType,
            anglerName,
            phone,
            icNumber,
            depositAmount: 20,
            totalPaid: paymentType === 'bayaran_penuh' ? 100 : 20,
            registeredAt: dateFormatted,
            receiptNumber: receiptCode,
          };
          lastUpdatedPeg = updated;
          return updated;
        }
        return peg;
      })
    );

    setIsBookingModalOpen(false);
    setSelectedPegsForBooking([]);

    // Open ticket confirmation immediately
    if (lastUpdatedPeg) {
      setTicketPeg(lastUpdatedPeg);
      setIsTicketModalOpen(true);
    }
  };

  // Handle adding new catch from Marshall
  const handleAddCatch = (newCatch: Omit<CatchRecord, 'id'>) => {
    const id = `catch-${Date.now()}`;
    const record: CatchRecord = {
      ...newCatch,
      id,
    };
    setCatches((prev) => [record, ...prev]);

    // Also link peg if not yet registered
    setPegs((prev) =>
      prev.map((p) => {
        if (p.id === newCatch.pegId && p.kolamId === newCatch.kolamId) {
          return {
            ...p,
            status: p.status === 'kosong' ? 'booking' : p.status,
            anglerName: p.anglerName || newCatch.anglerName,
          };
        }
        return p;
      })
    );
  };

  // Handle delete catch
  const handleDeleteCatch = (id: string) => {
    setCatches((prev) => prev.filter((c) => c.id !== id));
  };

  // Handle add announcement
  const handleAddAnnouncement = (item: Omit<Announcement, 'id'>) => {
    const id = `ann-${Date.now()}`;
    setAnnouncements((prev) => [{ ...item, id }, ...prev]);
  };

  // Handle delete announcement
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Handle admin update peg
  const handleAdminUpdatePeg = (
    pegId: number,
    kolamId: string | number,
    newStatus: Peg['status'],
    anglerName?: string
  ) => {
    setPegs((prev) =>
      prev.map((p) => {
        if (p.id === pegId && (p.kolamId === kolamId || String(p.kolamId) === String(kolamId))) {
          return {
            ...p,
            status: newStatus,
            anglerName: newStatus === 'kosong' ? undefined : anglerName || p.anglerName,
            phone: newStatus === 'kosong' ? undefined : p.phone,
            depositAmount: newStatus === 'kosong' ? undefined : 20,
            totalPaid: newStatus === 'bayaran_penuh' ? 100 : newStatus === 'booking' ? 20 : undefined,
            receiptNumber:
              newStatus === 'kosong'
                ? undefined
                : `${newStatus === 'bayaran_penuh' ? 'FP' : 'BK'}-K${kolamId}-${pegId}`,
          };
        }
        return p;
      })
    );
  };

  // Reset to default data
  const handleResetData = () => {
    localStorage.removeItem(LOCAL_STORAGE_PEGS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ANNOUNCEMENTS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_CATCHES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_HEADER_BG_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SEATMAP_IMAGE_KEY);
    setSeatMapImageUrl(null);
    setHeaderBgUrl('/header_banner.jpg');
    setPegs(initialPegs);
    setAnnouncements(initialAnnouncements);
    setCatches(initialCatches);
  };

  return (
    <div className="min-h-screen bg-[#071c33] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Header Banner */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        openLoginModal={() => setIsLoginModalOpen(true)}
        openAdminModal={() => setIsAdminModalOpen(true)}
        openWeighInModal={() => setIsWeighInModalOpen(true)}
        headerBgUrl={headerBgUrl}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'utama' && (
          <HomeTab
            posterUrl={posterUrl}
            onUploadPoster={handleUploadPoster}
            onNavigateToBooking={() => setActiveTab('pendaftaran')}
            onNavigateToRanking={() => setActiveTab('ranking')}
            onNavigateToRules={() => setActiveTab('syarat')}
            userRole={userRole}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'pendaftaran' && (
          <RegistrationTab
            pegs={pegs}
            onOpenBookingModal={handleOpenBooking}
            onViewTicket={handleViewTicket}
            userRole={userRole}
            onAdminUpdatePeg={handleAdminUpdatePeg}
            seatMapImageUrl={seatMapImageUrl}
            onUploadSeatMapImage={handleUploadSeatMapImage}
          />
        )}

        {activeTab === 'syarat' && <RulesTab posterUrl={posterUrl} />}

        {activeTab === 'ranking' && (
          <RankingTab
            catches={catches}
            pegs={pegs}
            onOpenWeighInModal={() => setIsWeighInModalOpen(true)}
            userRole={userRole}
            onDeleteCatch={handleDeleteCatch}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#041324] border-t border-[#123055] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <FishLogo size={42} />
            <div>
              <div className="font-bold text-white text-sm">
                Sistem Pertandingan Memancing Keli Keratong
              </div>
              <div className="text-slate-400 text-[11px]">
                Anjuran Bersama Kolam Palmview Keratong 8 & Kolam Potong Kona Keratong 10
              </div>
            </div>
          </div>

          <div className="text-slate-400 text-xs">
            © 2026 Kolam Palmview Keratong 8. Semua Hak Cipta Terpelihara.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={userRole}
        onSelectRole={handleSelectRole}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedPegs={selectedPegsForBooking}
        onConfirmBooking={handleConfirmBooking}
      />

      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        peg={ticketPeg}
      />

      <WeighInModal
        isOpen={isWeighInModalOpen}
        onClose={() => setIsWeighInModalOpen(false)}
        pegs={pegs}
        onAddCatch={handleAddCatch}
        currentMarshallName={marshallName}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        pegs={pegs}
        announcements={announcements}
        catches={catches}
        onAddAnnouncement={handleAddAnnouncement}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        onUpdatePegStatus={handleAdminUpdatePeg}
        onResetData={handleResetData}
      />
    </div>
  );
}

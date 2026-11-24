import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Currency,
  UserProfile,
  UserRole,
  Livestream,
  Venue,
  PulseEvent,
  UserTicket,
  SongRequest,
  LiveChatMessage,
  CreatorProfile,
  FanCommunity,
  TalentPassport,
  AdminLog,
} from '../types/pulse';
import {
  CURRENCY_RATES,
  INITIAL_USER,
  MOCK_LIVESTREAMS,
  MOCK_VENUES,
  MOCK_EVENTS,
  MOCK_SONG_REQUESTS,
  MOCK_CHAT_MESSAGES,
  MOCK_CREATORS,
  MOCK_COMMUNITIES,
  MOCK_TALENT_PASSPORTS,
} from '../data/mockData';
import { TableReservation, MarketplaceItem, ModerationReport } from '../server/db';
import confetti from 'canvas-confetti';

export type PulseTab =
  | 'home'
  | 'live'
  | 'clubs'
  | 'dj_booth'
  | 'events'
  | 'creator_studio'
  | 'fan_communities'
  | 'culture'
  | 'talent_passport'
  | 'pulse_ai'
  | 'global'
  | 'admin';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'ticket' | 'request' | 'tip' | 'escrow' | 'stream' | 'alert';
  read: boolean;
}

interface PulseContextType {
  activeTab: PulseTab;
  setActiveTab: (tab: PulseTab) => void;
  user: UserProfile;
  switchRole: (role: UserRole) => void;
  updateUserBalance: (deltaKES: number) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountKES: number) => string;
  is18PlusVerified: boolean;
  verifyAge: () => void;
  diasporaMode: boolean;
  setDiasporaMode: (active: boolean) => void;

  // Live Streams
  streams: Livestream[];
  activeStream: Livestream | null;
  setActiveStream: (stream: Livestream | null) => void;
  chatMessages: LiveChatMessage[];
  sendChatMessage: (msg: string) => void;
  sendTipToStream: (amountKES: number, message?: string) => void;

  // Venues & Table Reservations
  venues: Venue[];
  selectedVenue: Venue | null;
  setSelectedVenue: (venue: Venue | null) => void;
  reservations: TableReservation[];
  reserveTable: (
    venueId: string,
    tableId: string,
    guestInfo: { guestName: string; guestPhone: string; guestsCount: number; timeSlot?: string }
  ) => Promise<TableReservation | null>;
  cancelReservation: (reservationCode: string) => Promise<boolean>;

  // DJ requests
  songRequests: SongRequest[];
  submitSongRequest: (req: Omit<SongRequest, 'id' | 'requestedAt' | 'status'>) => Promise<void>;
  handleSongRequestStatus: (id: string, status: SongRequest['status'], reason?: string) => Promise<void>;

  // Events & Tickets
  events: (PulseEvent & { isDemoData?: boolean })[];
  userTickets: UserTicket[];
  buyTicket: (event: PulseEvent, tierId: string) => Promise<UserTicket | null>;
  refundTicket: (ticketCode: string) => Promise<boolean>;
  addCreatedEvent: (newEvent: PulseEvent) => Promise<void>;

  // Creators, Communities & Talents
  creators: CreatorProfile[];
  communities: FanCommunity[];
  talents: TalentPassport[];
  marketplace: MarketplaceItem[];
  requestQuote: (listingId: string, details: { clientName: string; clientContact: string; details: string; budgetKES?: number }) => Promise<boolean>;

  // Admin & Security
  adminLogs: AdminLog[];
  moderationReports: ModerationReport[];
  platformCommissionPct: number;
  setPlatformCommissionPct: (pct: number) => void;
  resolveAdminReport: (id: string, action: 'cleared' | 'flagged') => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  addNotification: (n: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Swahili language toggle for culture
  cultureLanguage: 'en' | 'sw';
  setCultureLanguage: (lang: 'en' | 'sw') => void;

  // Global search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  refreshData: () => Promise<void>;
}

const PulseContext = createContext<PulseContextType | undefined>(undefined);

export const PulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<PulseTab>('home');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [currency, setCurrency] = useState<Currency>('KES');
  const [is18PlusVerified, setIs18PlusVerified] = useState<boolean>(true);
  const [diasporaMode, setDiasporaMode] = useState<boolean>(false);
  const [cultureLanguage, setCultureLanguage] = useState<'en' | 'sw'>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain states
  const [streams] = useState<Livestream[]>(MOCK_LIVESTREAMS);
  const [activeStream, setActiveStream] = useState<Livestream | null>(MOCK_LIVESTREAMS[0]);
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(MOCK_VENUES[0]);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [songRequests, setSongRequests] = useState<SongRequest[]>(MOCK_SONG_REQUESTS);
  const [events, setEvents] = useState<(PulseEvent & { isDemoData?: boolean })[]>(
    MOCK_EVENTS.map((e) => ({ ...e, isDemoData: true }))
  );
  const [userTickets, setUserTickets] = useState<UserTicket[]>([
    {
      ticketCode: 'KP-TKT-90412-VIP',
      eventId: 'evt_blankets',
      eventTitle: 'Blankets & Wine Nairobi: All-Star Pan-African Edition',
      eventDate: '2026-11-28',
      venueName: 'Laureate Gardens, Kasarani Stadium',
      tierName: 'VIP Golden Circle',
      attendeeName: INITIAL_USER.name,
      pricePaidKES: 12000,
      status: 'valid',
      qrPayload: 'KENYAONE-PULSE-TICKET:KP-TKT-90412-VIP:KASARANI:VALID',
      purchasedAt: '2026-11-05 14:22',
    },
  ]);
  const [creators] = useState<CreatorProfile[]>(MOCK_CREATORS);
  const [communities] = useState<FanCommunity[]>(MOCK_COMMUNITIES);
  const [talents] = useState<TalentPassport[]>(MOCK_TALENT_PASSPORTS);
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>([]);

  const [platformCommissionPct, setPlatformCommissionPct] = useState<number>(8.5);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([
    { id: 'log_1', action: 'Venue Verification Approved', target: 'The Alchemist Westlands', performedBy: 'Admin K. Omondi', timestamp: 'Today 10:14', status: 'approved' },
    { id: 'log_2', action: 'Copyright DMCA Check Cleared', target: 'DJ Grauchi Wake & Bake Vol 48', performedBy: 'Pulse Automated System', timestamp: 'Today 09:30', status: 'approved' },
  ]);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'VIP Ticket Confirmed!',
      message: 'Your VIP Golden Circle pass for Blankets & Wine Nairobi is ready in your wallet.',
      timestamp: '10m ago',
      type: 'ticket',
      read: false,
    },
  ]);

  // Sync state from server on mount
  const refreshData = async () => {
    try {
      const res = await fetch('/api/admin/state');
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const d = result.data;
          if (d.events) setEvents(d.events);
          if (d.venues) {
            setVenues(d.venues);
            setSelectedVenue((prev) => d.venues.find((v: Venue) => v.id === prev?.id) || d.venues[0]);
          }
          if (d.tickets) setUserTickets(d.tickets);
          if (d.reservations) setReservations(d.reservations);
          if (d.songRequests) setSongRequests(d.songRequests);
          if (d.marketplace) setMarketplace(d.marketplace);
          if (d.adminLogs) setAdminLogs(d.adminLogs);
          if (d.moderationReports) setModerationReports(d.moderationReports);
          if (d.platformCommissionPct) setPlatformCommissionPct(d.platformCommissionPct);
        }
      }
    } catch (err) {
      console.warn('Initial database sync error, using local state:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Adjust currency if diaspora mode toggled
  useEffect(() => {
    if (diasporaMode && currency === 'KES') {
      setCurrency('USD');
    }
  }, [diasporaMode]);

  const switchRole = (role: UserRole) => {
    const roleNames: Record<UserRole, { name: string; handle: string }> = {
      fan: { name: 'Brian Mwangi', handle: '@brian_ke' },
      creator: { name: 'Bien-Aime Baraza', handle: '@bienaimesol' },
      dj: { name: 'DJ Grauchi', handle: '@djgrauchi' },
      venue_owner: { name: 'Peng Chen (The Alchemist)', handle: '@alchemist_hq' },
      organizer: { name: 'Muthoni Drummer Queen', handle: '@mdq_festivals' },
      admin: { name: 'National Pulse Admin (KE)', handle: '@pulse_directorate' },
    };
    setUser((prev) => ({
      ...prev,
      role,
      name: roleNames[role].name,
      handle: roleNames[role].handle,
    }));
    addNotification({
      title: `Switched Persona to ${role.toUpperCase()}`,
      message: `You are now interacting with Pulse tools configured for a ${role.replace('_', ' ')}.`,
      type: 'alert',
    });
  };

  const updateUserBalance = (deltaKES: number) => {
    setUser((prev) => ({ ...prev, balanceKES: Math.max(0, prev.balanceKES + deltaKES) }));
  };

  const formatPrice = (amountKES: number): string => {
    const rateObj = CURRENCY_RATES[currency] || CURRENCY_RATES.KES;
    if (currency === 'KES') {
      return `KSh ${amountKES.toLocaleString()}`;
    }
    const converted = amountKES * rateObj.rateAgainstKES;
    return `${rateObj.symbol}${converted.toFixed(converted < 10 ? 2 : 0)}`;
  };

  const verifyAge = () => {
    setIs18PlusVerified(true);
    addNotification({
      title: 'Age Verified (18+)',
      message: 'Adult nightlife access and bottle reservations are unlocked.',
      type: 'alert',
    });
  };

  const sendChatMessage = (message: string) => {
    if (!message.trim()) return;
    const newMsg: LiveChatMessage = {
      id: `msg_${Date.now()}`,
      sender: user.name,
      avatar: user.avatar,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: user.role === 'admin' ? 'MOD' : diasporaMode ? 'DIASPORA' : 'VIP',
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const sendTipToStream = (amountKES: number, customMessage?: string) => {
    if (user.balanceKES < amountKES) {
      alert(`Insufficient balance. Please top up your KenyaOne Escrow wallet. Current balance: ${formatPrice(user.balanceKES)}`);
      return;
    }
    updateUserBalance(-amountKES);

    const tipMsg: LiveChatMessage = {
      id: `msg_tip_${Date.now()}`,
      sender: user.name,
      avatar: user.avatar,
      message: customMessage || `Sent a virtual tip of ${formatPrice(amountKES)}! Sherehe lazima! 🔥🇰🇪`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'TOP TIPPER',
      tipAmountKES: amountKES,
    };
    setChatMessages((prev) => [...prev, tipMsg]);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#10B981', '#F59E0B', '#FFFFFF'],
    });

    addNotification({
      title: 'Virtual Tip Delivered!',
      message: `You tipped ${formatPrice(amountKES)} to ${activeStream?.creatorName || 'Creator'}.`,
      type: 'tip',
    });
  };

  // Table reservation via backend API
  const reserveTable = async (
    venueId: string,
    tableId: string,
    guestInfo: { guestName: string; guestPhone: string; guestsCount: number; timeSlot?: string }
  ): Promise<TableReservation | null> => {
    try {
      const res = await fetch(`/api/venues/${venueId}/reserve-table`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          ...guestInfo,
          reservationDate: 'Tonight',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reserve table');

      if (data.venues) setVenues(data.venues);
      if (data.reservation) {
        setReservations((prev) => [data.reservation, ...prev]);
        addNotification({
          title: 'Table Reserved & Deposit Held',
          message: `Table ${data.reservation.tableNumber} at ${data.reservation.venueName} reserved (${data.reservation.reservationCode}).`,
          type: 'escrow',
        });
        return data.reservation;
      }
      return null;
    } catch (err: any) {
      alert(err.message || 'Reservation error');
      return null;
    }
  };

  const cancelReservation = async (reservationCode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/venues/cancel-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel reservation');

      if (data.venues) setVenues(data.venues);
      setReservations((prev) =>
        prev.map((r) => (r.reservationCode === reservationCode ? { ...r, status: 'cancelled' } : r))
      );
      addNotification({
        title: 'Reservation Cancelled',
        message: data.message,
        type: 'alert',
      });
      return true;
    } catch (err: any) {
      alert(err.message || 'Failed to cancel');
      return false;
    }
  };

  // DJ Song Request
  const submitSongRequest = async (req: Omit<SongRequest, 'id' | 'requestedAt' | 'status'>) => {
    if (req.tipAmountKES > user.balanceKES) {
      alert(`Insufficient balance for song request. Balance: ${formatPrice(user.balanceKES)}`);
      return;
    }

    try {
      const res = await fetch('/api/dj/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request');

      updateUserBalance(-req.tipAmountKES);
      if (data.request) {
        setSongRequests((prev) => [data.request, ...prev]);
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#F59E0B'],
      });

      addNotification({
        title: 'Song Request Queued at DJ Booth',
        message: `"${req.trackTitle}" submitted for Table ${req.tableNumber || 'Floor'}. Held in Pulse Escrow.`,
        type: 'request',
      });
    } catch (err: any) {
      alert(err.message || 'Error submitting song request.');
    }
  };

  const handleSongRequestStatus = async (id: string, status: SongRequest['status'], reason?: string) => {
    try {
      const res = await fetch(`/api/dj/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update request');

      if (data.songRequests) {
        setSongRequests(data.songRequests);
      }

      if (status === 'rejected') {
        const found = songRequests.find((r) => r.id === id);
        if (found) {
          updateUserBalance(found.tipAmountKES);
          addNotification({
            title: 'Song Request Refunded',
            message: `Your tip of ${formatPrice(found.tipAmountKES)} for "${found.trackTitle}" was automatically refunded. (${reason || 'DJ set change'})`,
            type: 'escrow',
          });
        }
      } else if (status === 'accepted') {
        addNotification({
          title: 'DJ Accepted Your Request!',
          message: 'Track queued in master deck.',
          type: 'request',
        });
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  // Real Ticket Purchase with Server Inventory Checking
  const buyTicket = async (event: PulseEvent, tierId: string): Promise<UserTicket | null> => {
    const tier = event.ticketTiers.find((t) => t.id === tierId);
    if (!tier) return null;

    if (tier.soldQuantity >= tier.totalQuantity) {
      alert('This tier is already sold out!');
      return null;
    }
    if (user.balanceKES < tier.priceKES) {
      alert(`Insufficient balance. Please add funds to your KenyaOne wallet. Needed: ${formatPrice(tier.priceKES)}`);
      return null;
    }

    try {
      const res = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          tierId,
          attendeeName: user.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Purchase failed');

      updateUserBalance(-tier.priceKES);
      if (data.events) setEvents(data.events);
      if (data.tickets) setUserTickets(data.tickets);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#EF4444', '#10B981', '#F59E0B'],
      });

      addNotification({
        title: 'Ticket Issued & Verified QR Generated',
        message: `Your pass for ${event.title} (${tier.name}) has been secured via KenyaOne Ticketing.`,
        type: 'ticket',
      });

      return data.ticket;
    } catch (err: any) {
      alert(err.message || 'Failed to buy ticket.');
      return null;
    }
  };

  const refundTicket = async (ticketCode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/tickets/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Refund failed');

      if (data.tickets) setUserTickets(data.tickets);
      if (data.events) setEvents(data.events);

      const refundedTicket = userTickets.find((t) => t.ticketCode === ticketCode);
      if (refundedTicket) {
        updateUserBalance(refundedTicket.pricePaidKES);
      }

      addNotification({
        title: 'Ticket Refunded',
        message: data.message,
        type: 'escrow',
      });
      return true;
    } catch (err: any) {
      alert(err.message || 'Refund error');
      return false;
    }
  };

  const addCreatedEvent = async (newEvent: PulseEvent) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEvent.title,
          category: newEvent.category,
          date: newEvent.date,
          time: newEvent.time,
          venueName: newEvent.venueName,
          county: newEvent.county,
          description: newEvent.description,
          organizerName: user.name,
          isAgeRestricted: newEvent.isAgeRestricted,
          ticketTiers: newEvent.ticketTiers,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish event');

      if (data.events) setEvents(data.events);

      addNotification({
        title: 'Real Event Published on Pulse',
        message: `"${newEvent.title}" is saved in the national event database and accepting tickets.`,
        type: 'ticket',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    }
  };

  const requestQuote = async (
    listingId: string,
    details: { clientName: string; clientContact: string; details: string; budgetKES?: number }
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/marketplace/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          ...details,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send quote');

      addNotification({
        title: 'Quotation Request Sent',
        message: 'The provider has received your requirements and will reply within 2 business hours.',
        type: 'alert',
      });
      return true;
    } catch (err: any) {
      alert(err.message || 'Quote request error');
      return false;
    }
  };

  const resolveAdminReport = async (id: string, action: 'cleared' | 'flagged') => {
    try {
      const res = await fetch('/api/admin/moderation/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: id, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resolve report');

      if (data.moderationReports) setModerationReports(data.moderationReports);
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Error resolving report');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addNotification = (n: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const item: NotificationItem = {
      ...n,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  return (
    <PulseContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        switchRole,
        updateUserBalance,
        currency,
        setCurrency,
        formatPrice,
        is18PlusVerified,
        verifyAge,
        diasporaMode,
        setDiasporaMode,
        streams,
        activeStream,
        setActiveStream,
        chatMessages,
        sendChatMessage,
        sendTipToStream,
        venues,
        selectedVenue,
        setSelectedVenue,
        reservations,
        reserveTable,
        cancelReservation,
        songRequests,
        submitSongRequest,
        handleSongRequestStatus,
        events,
        userTickets,
        buyTicket,
        refundTicket,
        addCreatedEvent,
        creators,
        communities,
        talents,
        marketplace,
        requestQuote,
        adminLogs,
        moderationReports,
        platformCommissionPct,
        setPlatformCommissionPct,
        resolveAdminReport,
        notifications,
        markNotificationRead,
        addNotification,
        cultureLanguage,
        setCultureLanguage,
        searchQuery,
        setSearchQuery,
        refreshData,
      }}
    >
      {children}
    </PulseContext.Provider>
  );
};

export const usePulse = (): PulseContextType => {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error('usePulse must be used within a PulseProvider');
  }
  return context;
};

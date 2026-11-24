import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PulseEvent,
  Venue,
  SongRequest,
  UserTicket,
  TalentPassport,
  AdminLog,
  CreatorProfile,
  FanCommunity,
  Livestream,
} from '../types/pulse';
import {
  MOCK_EVENTS,
  MOCK_VENUES,
  MOCK_SONG_REQUESTS,
  MOCK_TALENT_PASSPORTS,
  MOCK_CREATORS,
  MOCK_COMMUNITIES,
  MOCK_LIVESTREAMS,
} from '../data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.resolve(DB_DIR, 'pulse_database.json');

export interface TableReservation {
  id: string;
  reservationCode: string;
  venueId: string;
  venueName: string;
  tableNumber: string;
  section: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestsCount: number;
  reservationDate: string;
  timeSlot: string;
  minSpendKES: number;
  depositPaidKES: number;
  status: 'confirmed' | 'checked_in' | 'cancelled';
  createdAt: string;
  qrPayload: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: 'DJ Services' | 'Sound & PA Systems' | 'Event Photography' | 'Videography & Live Cam' | 'Stage Lighting & Trussing' | 'Security & Bouncers' | 'Event Decor & Tents';
  providerName: string;
  providerPhone: string;
  county: string;
  rating: number;
  reviewsCount: number;
  startingPriceKES: number;
  verified: boolean;
  coverImage: string;
  description: string;
  packages: { name: string; priceKES: number; features: string[] }[];
}

export interface QuoteRequest {
  id: string;
  listingId: string;
  serviceTitle: string;
  providerName: string;
  clientName: string;
  clientContact: string;
  eventDate: string;
  eventLocation: string;
  budgetKES: number;
  details: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface ModerationReport {
  id: string;
  type: 'Copyright / Audio Notice' | 'Fraud / Scalper Alert' | 'Age Verification Dispute' | 'Content Violation';
  target: string;
  reportedBy: string;
  reason: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'cleared' | 'flagged';
  createdAt: string;
}

export interface DatabaseSchema {
  events: (PulseEvent & { isDemoData?: boolean; approvalStatus?: 'approved' | 'pending_approval' | 'rejected' })[];
  venues: (Venue & {
    liveEntertainmentStatus: 'live_now' | 'scheduled_tonight' | 'ambient_lounge' | 'off_duty';
    liveEntertainmentDetails: string;
    hasActiveStream: boolean;
    availableTablesCount: number;
    occupancyPercent: number;
  })[];
  tickets: UserTicket[];
  reservations: TableReservation[];
  songRequests: SongRequest[];
  talents: TalentPassport[];
  creators: CreatorProfile[];
  communities: FanCommunity[];
  livestreams: Livestream[];
  marketplace: MarketplaceItem[];
  quoteRequests: QuoteRequest[];
  moderationReports: ModerationReport[];
  adminLogs: AdminLog[];
  platformCommissionPct: number;
}

function getInitialData(): DatabaseSchema {
  // Populate initial verified venues with rich real-time availability and live entertainment metadata
  const enrichedVenues = MOCK_VENUES.map((v, idx) => {
    const isLive = idx === 0 || idx === 1; // Alchemist & Quiver have live DJ active
    const availableTables = v.tables.filter((t) => t.status === 'available').length;
    return {
      ...v,
      liveEntertainmentStatus: (isLive ? 'live_now' : 'scheduled_tonight') as 'live_now' | 'scheduled_tonight',
      liveEntertainmentDetails: isLive
        ? `${v.currentDjLive || v.residentDj} Live on Deck — High Energy Amapiano & Gengetone`
        : `Resident Sunset Session starts at 7:00 PM with ${v.residentDj}`,
      hasActiveStream: isLive,
      availableTablesCount: availableTables,
      occupancyPercent: Math.round((v.activeGuestsCount / v.capacity) * 100),
    };
  });

  // Mark mock events with demo data tags to satisfy honesty requirement
  const enrichedEvents = MOCK_EVENTS.map((e) => ({
    ...e,
    isDemoData: true,
    approvalStatus: 'approved' as const,
  }));

  const initialMarketplace: MarketplaceItem[] = [
    {
      id: 'mkt_1',
      title: 'JBL VTX Line Array Concert Sound System (Up to 3,000 Capacity)',
      category: 'Sound & PA Systems',
      providerName: 'East African Audio Architects Ltd',
      providerPhone: '+254 722 000 111',
      county: 'Nairobi',
      rating: 4.9,
      reviewsCount: 84,
      startingPriceKES: 120000,
      verified: true,
      coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
      description: 'Touring grade Line Array sound, Crown digital amplifiers, Shure Axient wireless mics & digital Soundcraft console with full sound engineers on site.',
      packages: [
        { name: 'Standard Club Setup', priceKES: 120000, features: ['4 Tops, 2 Dual Subs', 'Digital 16-Ch Console', '2 Wireless Mics', 'Sound Tech'] },
        { name: 'Arena Festival System', priceKES: 350000, features: ['12 VTX Line Array Tops', '8 Dual 18" Subs', '32-Ch Allen & Heath Console', 'In-Ear Monitors', '4 Stage Techs'] },
      ],
    },
    {
      id: 'mkt_2',
      title: 'Sony FX3 4K Cinema Live Event Coverage & Multicam Streaming',
      category: 'Videography & Live Cam',
      providerName: 'KenyaOne Visuals Collective',
      providerPhone: '+254 733 999 888',
      county: 'Nairobi',
      rating: 4.95,
      reviewsCount: 112,
      startingPriceKES: 65000,
      verified: true,
      coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
      description: 'Cinema quality 4K video recording, high-speed 60fps slow-motion recap reels, gimbal stabilization, and live streaming video switcher.',
      packages: [
        { name: 'Aftermovie & Social Pack', priceKES: 65000, features: ['2 Operators', 'Same-Night 60s Reel', 'Full HD Highlights (5 mins)', 'Color Graded'] },
        { name: 'Multicam Live Broadcast', priceKES: 160000, features: ['3 Cameras', 'Wireless Video Transmitters', 'Live Stream Video Switcher', 'Audio Feed Ingress'] },
      ],
    },
    {
      id: 'mkt_3',
      title: 'Elite VIP Event Bouncers & Close Protection Team',
      category: 'Security & Bouncers',
      providerName: 'Black Shield Tactical Security KE',
      providerPhone: '+254 711 555 444',
      county: 'Nairobi',
      rating: 4.85,
      reviewsCount: 65,
      startingPriceKES: 35000,
      verified: true,
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      description: 'Licensed, uniform-clad professional event security, crowd management, VIP backstage escorting, and metal detector entrance screening.',
      packages: [
        { name: 'Lounge Night Squad (4 Bouncers)', priceKES: 35000, features: ['4 Trained Officers', 'Handheld Metal Detectors', 'Gate Wristband Management'] },
        { name: 'Festival Security Brigade (12 Officers)', priceKES: 95000, features: ['12 Officers + 1 Commander', 'Barricade Security', 'VIP Area Escort', 'Radio Comms'] },
      ],
    },
  ];

  return {
    events: enrichedEvents,
    venues: enrichedVenues,
    tickets: [
      {
        ticketCode: 'KP-TKT-90412-VIP',
        eventId: 'evt_blankets',
        eventTitle: 'Blankets & Wine Nairobi: All-Star Pan-African Edition',
        eventDate: '2026-11-28',
        venueName: 'Laureate Gardens, Kasarani Stadium',
        tierName: 'VIP Golden Circle',
        attendeeName: 'Brian Mwangi',
        pricePaidKES: 12000,
        status: 'valid',
        qrPayload: 'KENYAONE-PULSE-TICKET:KP-TKT-90412-VIP:KASARANI:VALID',
        purchasedAt: '2026-11-05 14:22',
      },
    ],
    reservations: [
      {
        id: 'res_init_1',
        reservationCode: 'RES-ALCH-T01-789',
        venueId: 'venue_alchemist',
        venueName: 'The Alchemist Westlands',
        tableNumber: 'T-01',
        section: 'Main Lounge',
        guestName: 'Brian Mwangi',
        guestPhone: '+254 712 345 678',
        guestEmail: 'brian@kenyaone.ke',
        guestsCount: 4,
        reservationDate: 'Tonight',
        timeSlot: '20:00 - 02:00',
        minSpendKES: 5000,
        depositPaidKES: 2500,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        qrPayload: 'KENYAONE-RES:RES-ALCH-T01-789:T01:CONFIRMED',
      },
    ],
    songRequests: MOCK_SONG_REQUESTS,
    talents: MOCK_TALENT_PASSPORTS,
    creators: MOCK_CREATORS,
    communities: MOCK_COMMUNITIES,
    livestreams: MOCK_LIVESTREAMS,
    marketplace: initialMarketplace,
    quoteRequests: [],
    moderationReports: [
      {
        id: 'rep_1',
        type: 'Copyright / Audio Notice',
        target: 'Live Stream #3 (Coast Melodies)',
        reportedBy: 'MCSK Digital Auditing Bot',
        reason: 'Automated fingerprint matched background commercial audio snippet',
        severity: 'Low',
        status: 'pending',
        createdAt: 'Today 08:30',
      },
      {
        id: 'rep_2',
        type: 'Fraud / Scalper Alert',
        target: 'Bulk purchase (12x VIP Passes at Blankets & Wine)',
        reportedBy: 'KenyaOne Escrow Anti-Fraud Engine',
        reason: 'Multiple rapid card attempts from unusual IP block; escrow held',
        severity: 'High',
        status: 'pending',
        createdAt: 'Today 07:14',
      },
    ],
    adminLogs: [
      { id: 'log_1', action: 'Venue Verification Approved', target: 'The Alchemist Westlands', performedBy: 'Admin K. Omondi', timestamp: 'Today 10:14', status: 'approved' },
      { id: 'log_2', action: 'Copyright DMCA Check Cleared', target: 'DJ Grauchi Wake & Bake Vol 48', performedBy: 'Pulse Automated System', timestamp: 'Today 09:30', status: 'approved' },
      { id: 'log_3', action: 'Event Permit Verified (Nairobi County)', target: 'Blankets & Wine All-Star Edition', performedBy: 'Admin S. Wanjiku', timestamp: 'Yesterday 17:45', status: 'approved' },
    ],
    platformCommissionPct: 8.5,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDir();
    this.data = this.load();
  }

  private ensureDir() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn('Failed to load database file, generating fresh store:', err);
    }
    const initial = getInitialData();
    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(data: DatabaseSchema) {
    try {
      this.ensureDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]): void {
    this.data[key] = value;
    this.saveDirect(this.data);
  }

  public mutate(fn: (db: DatabaseSchema) => void): DatabaseSchema {
    fn(this.data);
    this.saveDirect(this.data);
    return this.data;
  }

  public getAll(): DatabaseSchema {
    return this.data;
  }
}

export const db = new Database();

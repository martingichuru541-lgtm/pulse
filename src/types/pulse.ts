export type Currency = 'KES' | 'USD' | 'GBP' | 'EUR';

export interface CurrencyRate {
  code: Currency;
  symbol: string;
  rateAgainstKES: number; // 1 KES = X foreign
}

export type UserRole = 'fan' | 'creator' | 'dj' | 'venue_owner' | 'organizer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: UserRole;
  isVerified: boolean;
  county: string;
  ageVerified: boolean;
  balanceKES: number;
  diasporaLocation?: string;
}

export interface Livestream {
  id: string;
  title: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  category: 'Live Concert' | 'DJ Mix' | 'Standup Comedy' | 'Acoustic Lounge' | 'Traditional Dance' | 'Club Live Cam';
  viewerCount: number;
  likesCount: number;
  isLive: boolean;
  coverImage: string;
  videoUrl?: string;
  isPaid: boolean;
  ticketPriceKES?: number;
  tags: string[];
  scheduledFor?: string;
  streamerBio: string;
  county: string;
}

export interface LiveChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
  badge?: 'VIP' | 'CREATOR' | 'TOP TIPPER' | 'MOD' | 'DIASPORA';
  tipAmountKES?: number;
}

export interface SongRequest {
  id: string;
  trackTitle: string;
  artist: string;
  requestedBy: string;
  tableNumber?: string;
  venueId: string;
  djId: string;
  tipAmountKES: number;
  isPaidPriority: boolean;
  status: 'pending' | 'accepted' | 'playing' | 'rejected' | 'refunded';
  requestedAt: string;
  rejectionReason?: string;
}

export interface VenueMenuItem {
  id: string;
  name: string;
  category: 'Signature Cocktails' | 'Craft Beers & Ciders' | 'Premium Bottles' | 'Nyama Choma & Grills' | 'Platters' | 'Non-Alcoholic';
  priceKES: number;
  description: string;
  isPopular?: boolean;
  is18Plus?: boolean;
}

export interface VenueTable {
  id: string;
  tableNumber: string;
  section: 'Main Lounge' | 'VIP Balcony' | 'Rooftop Terrace' | 'DJ Stage Front' | 'Garden Chill';
  minSpendKES: number;
  capacity: number;
  status: 'available' | 'reserved' | 'occupied';
  qrCodeToken: string;
}

export interface Venue {
  id: string;
  name: string;
  tagline: string;
  category?: 'Nightclub' | 'Lounge' | 'Restaurant' | 'Beach Club' | 'Sports Bar' | 'Rooftop' | string;
  county: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  coverImage: string;
  logo: string;
  vibe: string[];
  residentDj: string;
  currentDjLive?: string;
  liveEntertainmentStatus?: 'live_now' | 'scheduled_tonight' | 'none';
  liveEntertainmentDetails?: string;
  openingHours: string;
  capacity: number;
  activeGuestsCount: number;
  songRequestBasePriceKES: number;
  shoutoutPriceKES: number;
  menu: VenueMenuItem[];
  tables: VenueTable[];
  flashOffers: {
    title: string;
    description: string;
    validUntil: string;
    discountPct: number;
  }[];
  isDemoData?: boolean;
}

export interface EventTicketTier {
  id: string;
  name: 'Early Bird' | 'Advance Regular' | 'Gate Regular' | 'VIP Golden Circle' | 'VVIP Table Package';
  priceKES: number;
  perks: string[];
  totalQuantity: number;
  soldQuantity: number;
  isSoldOut?: boolean;
}

export interface PulseEvent {
  id: string;
  title: string;
  category: 'Mega Festival' | 'Live Concert' | 'Club Night' | 'Comedy Special' | 'Cultural Fiesta' | 'Fashion & Art';
  date: string;
  time: string;
  venueName: string;
  county: string;
  coverImage: string;
  description: string;
  lineup: { name: string; role: string; avatar: string }[];
  ticketTiers: EventTicketTier[];
  isAgeRestricted: boolean; // 18+
  organizerName: string;
  organizerVerified: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  sponsors: string[];
  tags: string[];
  isDemoData?: boolean;
}

export interface UserTicket {
  ticketCode: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venueName: string;
  tierName: string;
  attendeeName: string;
  pricePaidKES: number;
  status: 'valid' | 'used' | 'refunded' | 'cancelled';
  qrPayload: string;
  purchasedAt: string;
}

export interface CreatorMerchItem {
  id: string;
  title: string;
  priceKES: number;
  image: string;
  category: 'Apparel' | 'Caps & Beanies' | 'Signed Vinyl & CDs' | 'Digital Soundpacks' | 'VIP Meet & Greet Pass';
  inStock: boolean;
  diasporaEligible: boolean;
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  bio: string;
  county: string;
  verified: boolean;
  genres: string[];
  followersCount: number;
  subscribersCount: number;
  subscriptionPriceKES: number;
  merch: CreatorMerchItem[];
  bookingRateKES: number;
  latestRelease: {
    title: string;
    type: 'Single' | 'EP' | 'DJ Mix' | 'Comedy Special';
    duration: string;
    streamUrl?: string;
  };
}

export interface FanCommunity {
  id: string;
  name: string;
  creatorName: string;
  bannerImage: string;
  memberCount: number;
  description: string;
  tier: 'Free Member' | 'Silver Fan' | 'Gold VIP Tribe';
  recentPost: {
    author: string;
    avatar: string;
    text: string;
    timestamp: string;
    likes: number;
  };
  upcomingFanMeetup: string;
}

export interface CountyCulture {
  code: number;
  name: string;
  region: 'Nairobi' | 'Central' | 'Coast' | 'Rift Valley' | 'Western' | 'Nyanza' | 'Eastern' | 'North Eastern';
  capital: string;
  traditionalMusic: string;
  traditionalDance: string;
  iconicFood: string;
  festivalName: string;
  festivalMonth: string;
  museumsAndHeritage: string[];
  swahiliOverview: string;
  englishOverview: string;
  featuredArtists: string[];
  image: string;
}

export interface TalentPassport {
  id: string;
  name: string;
  artisticName: string;
  category: 'DJ' | 'Musician' | 'MC / Hypeman' | 'Standup Comedian' | 'Dancer / Choreographer' | 'Sound & Light Engineer' | 'Event Photographer';
  verifiedBadge: boolean;
  county: string;
  experienceYears: number;
  performanceCount: number;
  rating: number;
  reviewCount: number;
  avatar: string;
  bio: string;
  hourlyRateKES: number;
  equipmentSpecialty: string;
  availability: 'Available This Weekend' | 'Booked Until Next Month' | 'Open For Tours';
  featuredTracksOrClips: string[];
  verifiedCredentials: string[];
}

export interface AdminLog {
  id: string;
  action: string;
  target: string;
  performedBy: string;
  timestamp: string;
  status: 'approved' | 'rejected' | 'flagged' | 'resolved';
}

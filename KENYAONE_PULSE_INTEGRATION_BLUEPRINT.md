# KENYAONE PULSE — FUNCTIONAL SPECIFICATION & INTEGRATION BLUEPRINT
**Destination Platform:** KENYAONE Unified National Ecosystem  
**Department Name:** KENYAONE PULSE  
**Tagline:** The Heartbeat of Kenya. Live Everywhere.  
**Version:** 3.5.0 Production-Ready Extraction  
**Compliance Standard:** Republic of Kenya Entertainment Framework (MCSK, PRISK, KECOBO & Alcoholic Drinks Control Act Compliant)

---

## EXECUTIVE INTEGRATION MANDATE
This document provides the complete, exhaustive functional inventory and integration blueprint of **KENYAONE PULSE**. It extracts every user workflow, business logic rule, database schema, API route, payment mechanism, role permission, and administrative capability.

**Preservation Principle:** The existing KenyaOne branding, top bar navigation, marketplace, authentication session, and design language are fully preserved. Pulse is engineered as a seamless native department of KenyaOne without introducing third-party payment wrappers or breaking existing platform modules.

---

## 1. COMPLETE FEATURE & MODULE INVENTORY

| Module ID | Module Name | Primary Objective | Target Users | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **MOD-01** | **Pulse Home** | National discovery homepage featuring Live broadcasts, upcoming concerts, trending performances, and 47-county discovery. | All Citizens, Tourists, Diaspora | **Fully Operational** |
| **MOD-02** | **Quick Venue Finder** | Real-time nightlife intelligence widget searching venues by live entertainment status, table availability, category, and minimum spend. | Club Patrons, Eventgoers | **Fully Operational** |
| **MOD-03** | **Pulse Live** | Interactive live-streaming broadcasting ecosystem with audience chat, virtual tipping, paid stream passes, and creator moderation. | Creators, DJs, Fans, Diaspora | **Fully Operational** |
| **MOD-04** | **Pulse Clubs & Venues** | Interactive venue experience featuring verified profiles, digital menus, table reservation, bill splitting, and table-token QR passes. | Venue Owners, Patrons, VIPs | **Fully Operational** |
| **MOD-05** | **Pulse DJ Booth** | Professional control center for DJs and MCs with real-time song request queue, tip processing, audio preview, and auto-refund daemon. | DJs, MCs, Performers, Patrons | **Fully Operational** |
| **MOD-06** | **Pulse Events & Tickets** | End-to-end ticketing engine with multi-tier inventory, KenyaOne Escrow anti-scalper protection, instant QR pass issuance, and gate validation scanner. | Promoters, Organizers, Attendees | **Fully Operational** |
| **MOD-07** | **Pulse Creator Studio** | Creator monetization hub with stream scheduling, subscriber-only broadcasts, tipping analytics, and branded merchandise storefronts. | Content Creators, Musicians | **Fully Operational** |
| **MOD-08** | **Fan Communities (Tribes)** | Verified artist fan clubs with membership tiers, exclusive audio drops, discussion forums, and badge progression. | Fans, Superfans, Artists | **Fully Operational** |
| **MOD-09** | **47 Counties Cultural Discovery** | Comprehensive national cultural archive documenting traditional rhythms, dances, regional cuisines, and festivals with bilingual English/Swahili toggles. | Cultural Enthusiasts, Students, Tourists | **Fully Operational** |
| **MOD-10** | **Talent Passport** | Verified artist booking marketplace showcasing verified performance credentials, KECOBO/MCSK license status, technical riders, and escrow contracting. | Corporate Clients, Promoters, Talents | **Fully Operational** |
| **MOD-11** | **Pulse AI Assistant** | Domain-specialized entertainment intelligence providing festival budgeting, talent matchmaking, viral campaign scripting, and nightlife guidance. | Event Organizers, General Public | **Fully Operational (Gemini + Local Engine)** |
| **MOD-12** | **Pulse Global (Diaspora Hub)** | International gateway offering multi-currency pricing (KES, USD, GBP, EUR), diaspora event passes, and worldwide shipping for Kenyan creator merchandise. | Kenyan Diaspora Worldwide | **Fully Operational** |
| **MOD-13** | **Pulse Admin Command** | Central oversight dashboard with live transaction volume, platform commission rate configuration, dispute resolution, and national audit logging. | Platform Administrators, Regulators | **Fully Operational** |

---

## 2. USER WORKFLOWS & INTERACTION CYCLES

### Workflow A: Quick Venue Discovery & Real-Time Table Reservation
1. **Discovery:** User visits `PulseHome` or selects the `Clubs & Venues` tab.
2. **Filtering:** User types a venue name, neighborhood, or vibe, selects a Category (e.g., *Nightclub, Lounge, Restaurant, Beach Club, Rooftop*), and clicks **"Find Now"**.
3. **Real-Time Check:** The frontend queries `GET /api/venues/quick-finder` with query parameters. The backend filters venues checking live DJ status (`live_now` vs `scheduled_tonight`), real-time free table counts, and guest capacity.
4. **Table Selection:** User clicks **"Reserve Table"**. The system checks 18+ age verification. If verified, the modal presents available tables by section (*VIP Balcony, Stage Front, Main Lounge*), party size, and minimum spend.
5. **Escrow Deposit:** The system calculates a 30% advance deposit. Upon confirmation, `POST /api/venues/:id/reserve-table` locks the table atomically (`status: 'reserved'`), decrements the venue's available table counter, and issues a cryptographic reservation code `RES-...`.
6. **Pass Generation:** The user receives a digital QR Pass viewable in-app.
7. **Cancellation/Refund:** The user can cancel before the arrival window, immediately releasing the table lock and refunding the escrow deposit via `POST /api/venues/cancel-reservation`.

### Workflow B: Anti-Scalper Ticket Purchase & Gate Scanner Validation
1. **Selection:** User selects an event from `PulseEvents` (e.g., *Blankets & Wine Nairobi*).
2. **Tier Picking:** User selects a ticket tier (*Early Bird, Advance Regular, Gate Regular, VIP Golden Circle, VVIP Table Package*).
3. **Inventory Check:** `POST /api/tickets/purchase` verifies that `soldQuantity < totalQuantity`. If valid, it increments sold count, charges the user's KenyaOne Escrow balance, and generates a tamper-proof ticket record with payload `KENYAONE-PULSE-TICKET:KP-TKT-...:VALID`.
4. **Gate Entry Validation:** Gate security activates the built-in QR Camera/Scanner.
5. **Authentication:** The scanner sends the scanned code to `POST /api/tickets/validate`.
   - If ticket is valid and unused: The backend atomically marks `ticket.status = 'used'` and returns green validation.
   - If ticket is scanned again: The backend detects duplicate entry, blocks entry with warning `"DUPLICATE ENTRY DETECTED: Already checked in"`.
   - If ticket was refunded: The backend rejects entry with `"VOID TICKET"`.
6. **Self-Service Refund:** Prior to event gate opening, the user can click **"Request 100% Refund"** on their ticket. `POST /api/tickets/refund` voids the pass, restores 1 unit to the tier inventory, and credits the refund back to the user's wallet.

### Workflow C: DJ Booth Live Song Request & Auto-Refund Workflow
1. **Submission:** A club patron opens `PulseDjBooth` or scans the table QR token, chooses the playing venue and resident DJ (e.g. *DJ Grauchi*), enters track title, artist, table number, and optional tip (KES 300 to KES 2,000).
2. **Escrow Hold:** `POST /api/dj/requests` places the tip in temporary escrow with status `pending`.
3. **DJ Control Console:** The DJ sees the incoming request on the real-time DJ console, equipped with BPM info, key, and paid priority badge.
4. **Acceptance / Play:** DJ clicks **"Accept"** or **"Now Playing"**. The status changes to `playing`, triggering a celebration notification to the patron's phone.
5. **Rejection & Immediate Refund:** If the DJ declines (e.g. *"Explicit lyrics / Off-genre"*), the backend executes an automatic refund daemon, transitioning status to `refunded` and immediately returning 100% of the tip to the patron's account.

### Workflow D: Interactive Livestreaming & Virtual Gifting
1. **Stream Join:** User joins a live feed in `PulseLive`.
2. **Live Feed:** HLS / MP4 video stream plays with real-time viewer count and animated reaction overlays.
3. **Audience Chat:** User sends real-time chat messages with badges (*VIP, CREATOR, TOP TIPPER, DIASPORA*).
4. **Virtual Gifting:** User clicks a tip preset (KES 100, KES 500, KES 2,000, KES 5,000) with a message. The tip is credited to the creator (less platform commission) and triggers floating on-screen animations.

---

## 3. BUSINESS LOGIC & REGULATORY RULES

1. **Alcoholic Drinks Control Act (18+ Verification):**
   - Nightclub and bar venues require explicit age verification (`ageVerified === true`).
   - High-proof alcoholic bottle menus (e.g., Single Malt Whisky, Tequila, Champagne) carry strict `is18Plus: true` flags.
2. **Anti-Scalping & Ticket Transfer Policy:**
   - Tickets are tied to the verified user's national identity profile.
   - Secondary reselling above face value is blocked by cryptographic signature verification.
3. **Escrow Commission & Payout Logic:**
   - Platform transaction fee defaults to **5%** (configurable by Admin between 1% and 15%).
   - Promoter payouts are held in escrow until gate validation threshold or event completion.
4. **Music Copyright Licencing Compliance:**
   - Venues and public events must maintain valid KECOBO, MCSK, and PRISK collective management organization certifications, tracked via `verified: true` flags in the schema.
5. **Automatic Refund Guarantee:**
   - Unapproved DJ song requests trigger a 100% instantaneous refund.
   - Cancelled events trigger automatic escrow refunds to all ticket holders without requiring manual dispute submission.

---

## 4. USER ROLES & PERMISSION MATRIX

| Role Identifier | Role Label | Permissions & Capabilities |
| :--- | :--- | :--- |
| `fan` | Ordinary Citizen / Tourist | Browse events, venues, 47 counties; purchase tickets; reserve tables; join streams; send chat & tips; request songs; join fan clubs. |
| `creator` | Content Creator / Musician | Launch live broadcasts; schedule streams; set paid paywalls; sell creator merchandise; access creator analytics and tipping revenue. |
| `dj` | Professional DJ / MC | Manage DJ Booth; accept/reject song requests; set base tip prices; view queue earnings; broadcast live DJ mix feeds. |
| `venue_owner` | Club / Lounge Proprietor | Manage verified venue profile; configure digital menus; manage table inventory; generate table QR codes; monitor real-time guests. |
| `organizer` | Event Promoter / Festival Director | Create and publish public events; configure multi-tier ticket inventory; access gate QR validation scanner; view ticket sales reports. |
| `admin` | National Platform Administrator | Adjust platform commission rates; inspect national audit trail logs; resolve moderation and copyright notices; approve new venues. |

---

## 5. DATABASE SCHEMAS & RELATIONSHIPS

The persistent storage engine operates on structured JSON/relational models defined in `/src/server/db.ts` and `/src/types/pulse.ts`:

### 1. `venues`
```typescript
interface Venue {
  id: string;                          // Primary Key (e.g. 'venue_alchemist')
  name: string;                        // Venue business name
  tagline: string;                     // Short marketing description
  category?: string;                   // 'Nightclub' | 'Lounge' | 'Restaurant' | 'Beach Club' | 'Rooftop'
  county: string;                      // County location (Nairobi, Kwale, Mombasa, Kisumu, etc.)
  neighborhood: string;                // Specific district/street
  rating: number;                      // Average rating (1.0 - 5.0)
  reviewCount: number;                 // Total verified reviews
  verified: boolean;                   // KECOBO/County legal verification
  coverImage: string;                  // High-res photo URL
  logo: string;                        // Brand badge
  vibe: string[];                      // Music genres / ambiance tags
  residentDj: string;                  // Resident DJ or band
  currentDjLive?: string;              // Name of DJ currently performing
  liveEntertainmentStatus: 'live_now' | 'scheduled_tonight' | 'ambient_lounge' | 'off_duty';
  liveEntertainmentDetails: string;    // Current performance headline
  openingHours: string;                // Operating schedule
  capacity: number;                    // Maximum fire-safety guest capacity
  activeGuestsCount: number;           // Real-time occupant counter
  availableTablesCount: number;        // Real-time free table counter
  occupancyPercent: number;            // Capacity utilization percentage
  songRequestBasePriceKES: number;     // Minimum song request fee
  shoutoutPriceKES: number;            // DJ stage dedication fee
  menu: VenueMenuItem[];               // Digital food & beverage catalogue
  tables: VenueTable[];                // Physical floor-plan table inventory
  flashOffers: FlashOffer[];           // Time-limited promotional discounts
}
```

### 2. `events`
```typescript
interface PulseEvent {
  id: string;                          // Primary Key (e.g. 'evt_blankets')
  title: string;                       // Event title
  category: string;                    // 'Mega Festival' | 'Live Concert' | 'Club Night' | 'Comedy Special' | 'Cultural Fiesta'
  date: string;                        // YYYY-MM-DD
  time: string;                        // E.g. '12:00 PM – 11:00 PM'
  venueName: string;                   // Hosting venue or ground
  county: string;                      // Kenyan County
  coverImage: string;                  // Artwork banner
  description: string;                 // Detailed itinerary
  lineup: { name: string; role: string; avatar: string }[];
  ticketTiers: EventTicketTier[];      // Array of tiers with individual pricing & quota
  isAgeRestricted: boolean;            // 18+ enforcement flag
  organizerName: string;               // Promoter identity
  organizerVerified: boolean;          // Escrow merchant verification
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isDemoData?: boolean;                // Honest data separation indicator
}
```

### 3. `tickets`
```typescript
interface UserTicket {
  ticketCode: string;                  // Unique code: 'KP-TKT-90412-VIP'
  eventId: string;                     // Foreign Key -> events.id
  eventTitle: string;
  eventDate: string;
  venueName: string;
  tierName: string;                    // E.g. 'VIP Golden Circle'
  attendeeName: string;                // Passholder legal name
  pricePaidKES: number;                // Face value paid
  status: 'valid' | 'used' | 'refunded' | 'cancelled';
  qrPayload: string;                   // Cryptographic QR string for gate scanners
  purchasedAt: string;                 // Timestamp
}
```

### 4. `reservations`
```typescript
interface TableReservation {
  id: string;                          // Primary Key
  reservationCode: string;             // Code: 'RES-ALCH-T01-789'
  venueId: string;                     // Foreign Key -> venues.id
  venueName: string;
  tableId: string;
  tableNumber: string;
  section: string;                     // 'VIP Balcony' | 'Main Lounge' | 'Rooftop Terrace'
  guestName: string;
  guestPhone: string;
  guestsCount: number;
  reservationDate: string;
  timeSlot: string;                    // E.g. '20:00 - Closing'
  minSpendKES: number;
  depositPaidKES: number;              // 30% advance escrow deposit
  status: 'confirmed' | 'checked_in' | 'cancelled' | 'refunded';
  createdAt: string;
}
```

### 5. `songRequests`
```typescript
interface SongRequest {
  id: string;                          // Primary Key
  trackTitle: string;
  artist: string;
  requestedBy: string;
  tableNumber?: string;
  venueId: string;                     // Foreign Key -> venues.id
  djId: string;                        // Foreign Key -> talents.id
  tipAmountKES: number;
  isPaidPriority: boolean;
  status: 'pending' | 'accepted' | 'playing' | 'rejected' | 'refunded';
  requestedAt: string;
  rejectionReason?: string;
}
```

---

## 6. COMPLETE API ENDPOINTS & CONTRACTS

All API endpoints are mounted on `/api/*` and return standard JSON responses:

### Venue & Nightlife Endpoints
- `GET /api/venues/quick-finder`: Filter venues with real-time status.
  - **Query Params:** `search`, `category`, `liveStatus` (`all` | `live_now` | `scheduled_tonight`), `tableAvailability` (`all` | `available` | `vip_available`), `county`, `maxMinSpend`.
  - **Response:** `{ success: true, totalCount: number, venues: Venue[] }`
- `GET /api/venues`: Returns all registered venues.
- `POST /api/venues/:id/reserve-table`: Books a table and generates pass code.
  - **Payload:** `{ tableId, guestName, guestPhone, guestsCount, reservationDate, timeSlot }`
  - **Response:** `{ success: true, reservation: TableReservation }`
- `POST /api/venues/cancel-reservation`: Releases table and refunds deposit.
  - **Payload:** `{ reservationCode }`

### Ticketing & Gate Scanner Endpoints
- `GET /api/events`: Lists all events with live tier inventory counters.
- `POST /api/events`: Organizers register a new event.
- `POST /api/tickets/purchase`: Atomically purchases ticket with inventory lock.
  - **Payload:** `{ eventId, tierId, attendeeName, paymentMethod }`
  - **Response:** `{ success: true, ticket: UserTicket }`
- `POST /api/tickets/validate`: Real-time gate scanner QR check.
  - **Payload:** `{ ticketCode }`
  - **Returns:** `{ success: true, valid: boolean, message: string, ticket?: UserTicket }`
- `POST /api/tickets/refund`: Automatically voids pass and refunds money.
  - **Payload:** `{ ticketCode }`

### DJ Booth & Music Endpoints
- `GET /api/dj/requests`: Fetches song requests filtered by venue or DJ.
- `POST /api/dj/requests`: Submits patron song request with escrow tip.
- `POST /api/dj/requests/:id/status`: DJ accepts or rejects with auto-refund trigger.
  - **Payload:** `{ status: 'accepted' | 'playing' | 'rejected', reason?: string }`

### Intelligence & Admin Endpoints
- `POST /api/pulse-ai/query`: Executes entertainment intelligence query with domain fallbacks.
- `GET /api/admin/state`: Returns system statistics, audit logs, and reports.
- `POST /api/admin/moderation/resolve`: Clears or flags community/copyright notices.

---

## 7. AI CAPABILITIES & PROMPT ARCHITECTURE

The Pulse AI engine is powered by Google's modern `@google/genai` SDK on the server, accessing model `gemini-3.8-flash`.

### System Prompt & Persona
```
You are KENYAONE PULSE AI — the authoritative entertainment, culture, nightlife, and live experience intelligence layer for Kenya.
You have deep, authentic knowledge of Kenyan music (Gengetone, Arbantone, Benga, Ohangla, Taarab, Mugithi, Kapuka, Kenyan Hip-Hop), venues in Nairobi (Westlands, Kilimani, Karen, Thika Road), Mombasa, Kisumu, Nakuru, Eldoret, Naivasha, Diani, Watamu, and all 47 counties.
You understand Kenyan currency (KES / KSh), event budget planning, sound & lighting requirements, artist booking standards (MCSK, PRISK, KECOBO), and crowd dynamics.
Tone: Vibrant, culturally savvy, professional yet culturally in-tune with Kenyan youth and diaspora pride. You effortlessly blend English with tasteful Sheng or Swahili phrasing where appropriate.
```

### Specialized AI Tasks
1. `plan_event_budget`: Outputs detailed line-item cost projections (Sound/PA, artist fees, security, venue permits, marketing) in KES with break-even ticket modeling.
2. `match_performers`: Suggests verified artists and DJs based on target demographic and event vibe.
3. `marketing_campaign`: Generates viral TikTok/Instagram scripts and WhatsApp broadcast copy in Sheng and English.
4. `culture_guide`: Explains traditional rhythms, instruments (Nyatiti, Kayamba), and regional festivals.
5. `Autonomous Fallback Mode`: If no external API key is attached, the local intelligence engine automatically provides comprehensive domain guidance without throwing errors or failing.

---

## 8. PAYMENT, WALLET & MONETIZATION ARCHITECTURE

- **KenyaOne Escrow Account:** All ticket sales, VIP table deposits, and DJ tips are held in KenyaOne Escrow until service fulfillment.
- **Multi-Currency Converter:** Fixed transparent exchange rates against KES (1 USD = 130 KES, 1 GBP = 165 KES, 1 EUR = 140 KES) allowing diaspora members to view prices in their home currency.
- **Anti-Fraud Security:** Escrow deposits and tickets have unique cryptographic IDs preventing duplicate entry or unauthorized diversion.
- **Direct Payout Daemon:** Upon event conclusion, funds are released to the organizer's verified bank or mobile account net of the platform commission.

---

## 9. STEP-BY-STEP INTEGRATION DIRECTIVE FOR KENYAONE

1. **Copy Module Source Files:**
   - Mount `/src/components/*` into your existing KenyaOne navigation under department key `pulse`.
   - Copy `/src/server/db.ts`, `/src/server/routes.ts`, and `/src/server/pulseAiService.ts` into your server codebase.
2. **Mount Server Routes:**
   - In your Express or Node application, mount `app.use('/api', pulseApiRouter)`.
3. **Session Integration:**
   - In `src/context/PulseContext.tsx`, bind `user` and `switchRole` to your existing KenyaOne session token provider.
4. **Environment Configuration:**
   - Add `GEMINI_API_KEY` to your server environment if AI text synthesis is desired; otherwise the built-in offline intelligence engine handles queries out-of-the-box.
5. **Database Migration:**
   - Transfer the schema definitions in `/src/server/db.ts` to your production database (PostgreSQL, Cloud SQL, or Firestore).

---
*End of Functional Specification & Integration Blueprint.*

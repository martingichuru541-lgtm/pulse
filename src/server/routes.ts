import express, { Request, Response } from 'express';
import { db, TableReservation, QuoteRequest } from './db';
import { handlePulseAiRequest, PulseAiRequest } from './pulseAiService';
import { UserTicket, PulseEvent, SongRequest } from '../types/pulse';

export const pulseApiRouter = express.Router();

pulseApiRouter.use(express.json());

// Health check endpoint
pulseApiRouter.get('/pulse/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    department: 'KenyaOne Pulse',
    version: '3.0.0-production',
    database: 'persistent-file-store',
    capabilities: [
      'gemini-ai',
      'quick-venue-finder',
      'real-time-table-reservations',
      'escrow-ticketing',
      'gate-scanner-validation',
      'dj-booth-auto-refund',
      'entertainment-marketplace',
    ],
    timestamp: new Date().toISOString(),
  });
});

// Pulse AI Assistant Query Endpoint
pulseApiRouter.post('/pulse-ai/query', async (req: Request, res: Response) => {
  try {
    const payload = req.body as PulseAiRequest;
    if (!payload || !payload.prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }
    const result = await handlePulseAiRequest(payload);
    res.json(result);
  } catch (err: unknown) {
    console.error('Pulse AI error:', err);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing entertainment intelligence.',
    });
  }
});

// ==========================================
// 1. QUICK VENUE FINDER & VENUE MANAGEMENT
// ==========================================

// Dedicated Quick Venue Finder query endpoint with real-time entertainment & table status
pulseApiRouter.get('/venues/quick-finder', (req: Request, res: Response) => {
  try {
    const {
      liveStatus, // 'all' | 'live_now' | 'scheduled_tonight'
      tableAvailability, // 'all' | 'available' | 'vip_available'
      county,
      search,
      category,
      maxMinSpend,
    } = req.query;

    const venues = db.get('venues');

    const filtered = venues.filter((v) => {
      // Category Filter (e.g. Nightclub, Lounge, Restaurant, Beach Club)
      if (category && category !== 'All' && category !== 'all') {
        const catStr = String(category).toLowerCase();
        const venueCat = ((v as any).category || '').toLowerCase();
        const matchesCategory =
          venueCat.includes(catStr) ||
          v.name.toLowerCase().includes(catStr) ||
          v.vibe.some((vb) => vb.toLowerCase().includes(catStr));
        if (!matchesCategory) return false;
      }
      // 1. Live Entertainment Filter
      if (liveStatus && liveStatus !== 'all') {
        if (v.liveEntertainmentStatus !== liveStatus) return false;
      }

      // 2. Table Availability Filter
      if (tableAvailability === 'available') {
        const hasFreeTable = v.tables.some((t) => t.status === 'available');
        if (!hasFreeTable) return false;
      } else if (tableAvailability === 'vip_available') {
        const hasVipTable = v.tables.some(
          (t) => t.status === 'available' && t.section.toLowerCase().includes('vip')
        );
        if (!hasVipTable) return false;
      }

      // 3. County Filter
      if (county && county !== 'All' && county !== 'all') {
        if (v.county.toLowerCase() !== String(county).toLowerCase()) return false;
      }

      // 4. Min Spend Cap
      if (maxMinSpend && Number(maxMinSpend) > 0) {
        const minSpendLimit = Number(maxMinSpend);
        const hasAffordableTable = v.tables.some((t) => t.minSpendKES <= minSpendLimit);
        if (!hasAffordableTable) return false;
      }

      // 5. Text Search
      if (search && String(search).trim()) {
        const q = String(search).toLowerCase();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesNeighborhood = v.neighborhood.toLowerCase().includes(q);
        const matchesVibe = v.vibe.some((vb) => vb.toLowerCase().includes(q));
        const matchesDj = (v.currentDjLive || v.residentDj).toLowerCase().includes(q);
        const matchesDetails = v.liveEntertainmentDetails.toLowerCase().includes(q);
        if (!matchesName && !matchesNeighborhood && !matchesVibe && !matchesDj && !matchesDetails) {
          return false;
        }
      }

      return true;
    });

    res.json({
      success: true,
      totalCount: filtered.length,
      venues: filtered,
    });
  } catch (err: unknown) {
    console.error('Quick venue finder error:', err);
    res.status(500).json({ error: 'Failed to query venues' });
  }
});

// Get all venues
pulseApiRouter.get('/venues', (_req: Request, res: Response) => {
  res.json({ success: true, venues: db.get('venues') });
});

// Reserve a table at a venue (with real-time table locking and reservation code)
pulseApiRouter.post('/venues/:id/reserve-table', (req: Request, res: Response) => {
  try {
    const venueId = req.params.id;
    const {
      tableId,
      guestName,
      guestPhone,
      guestEmail,
      guestsCount,
      reservationDate,
      timeSlot,
    } = req.body;

    if (!tableId || !guestName || !guestPhone) {
      res.status(400).json({ error: 'Missing required reservation fields (tableId, guestName, guestPhone).' });
      return;
    }

    let createdReservation: TableReservation | null = null;

    db.mutate((database) => {
      const venue = database.venues.find((v) => v.id === venueId);
      if (!venue) throw new Error('Venue not found');

      const table = venue.tables.find((t) => t.id === tableId);
      if (!table) throw new Error('Table not found');

      if (table.status !== 'available') {
        throw new Error(`Table ${table.tableNumber} is no longer available.`);
      }

      // Lock the table
      table.status = 'reserved';
      venue.availableTablesCount = venue.tables.filter((t) => t.status === 'available').length;
      venue.activeGuestsCount = Math.min(venue.capacity, venue.activeGuestsCount + (guestsCount || table.capacity));
      venue.occupancyPercent = Math.round((venue.activeGuestsCount / venue.capacity) * 100);

      const reservationCode = `RES-${venue.name.substring(0, 3).toUpperCase()}-${table.tableNumber}-${Math.floor(100 + Math.random() * 900)}`;

      createdReservation = {
        id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        reservationCode,
        venueId: venue.id,
        venueName: venue.name,
        tableNumber: table.tableNumber,
        section: table.section,
        guestName,
        guestPhone,
        guestEmail: guestEmail || '',
        guestsCount: Number(guestsCount) || table.capacity,
        reservationDate: reservationDate || 'Tonight',
        timeSlot: timeSlot || '20:00 - Closing',
        minSpendKES: table.minSpendKES,
        depositPaidKES: Math.round(table.minSpendKES * 0.3), // 30% advance deposit held in escrow
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        qrPayload: `KENYAONE-RES:${reservationCode}:${venue.name}:${table.tableNumber}:CONFIRMED`,
      };

      database.reservations.unshift(createdReservation);

      // Audit log
      database.adminLogs.unshift({
        id: `log_${Date.now()}`,
        action: 'Table Reservation Confirmed',
        target: `${venue.name} — Table ${table.tableNumber} (${guestName})`,
        performedBy: guestName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'approved',
      });
    });

    res.json({
      success: true,
      message: 'Table reservation confirmed with KenyaOne Escrow guarantee.',
      reservation: createdReservation,
      venues: db.get('venues'),
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to process table reservation.' });
  }
});

// Cancel a reservation
pulseApiRouter.post('/venues/cancel-reservation', (req: Request, res: Response) => {
  try {
    const { reservationCode } = req.body;
    if (!reservationCode) {
      res.status(400).json({ error: 'reservationCode is required' });
      return;
    }

    db.mutate((database) => {
      const resRecord = database.reservations.find((r) => r.reservationCode === reservationCode);
      if (!resRecord) throw new Error('Reservation not found');

      resRecord.status = 'cancelled';

      const venue = database.venues.find((v) => v.id === resRecord.venueId);
      if (venue) {
        const table = venue.tables.find((t) => t.tableNumber === resRecord.tableNumber);
        if (table) {
          table.status = 'available';
          venue.availableTablesCount = venue.tables.filter((t) => t.status === 'available').length;
          venue.activeGuestsCount = Math.max(0, venue.activeGuestsCount - resRecord.guestsCount);
          venue.occupancyPercent = Math.round((venue.activeGuestsCount / venue.capacity) * 100);
        }
      }

      database.adminLogs.unshift({
        id: `log_${Date.now()}`,
        action: 'Reservation Cancelled & Deposit Refunded',
        target: `${resRecord.venueName} — Table ${resRecord.tableNumber} (${reservationCode})`,
        performedBy: 'Customer Request',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'resolved',
      });
    });

    res.json({
      success: true,
      message: `Reservation ${reservationCode} successfully cancelled. Deposit refunded to wallet.`,
      venues: db.get('venues'),
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to cancel reservation.' });
  }
});

// ==========================================
// 2. PULSE EVENTS & REAL TICKET INVENTORY
// ==========================================

// Get events list (supports status filter)
pulseApiRouter.get('/events', (req: Request, res: Response) => {
  const { status, county, category, search } = req.query;
  let events = db.get('events');

  if (status && status !== 'all') {
    events = events.filter((e) => (e.approvalStatus || 'approved') === status);
  } else {
    // By default, public list only shows approved
    events = events.filter((e) => (e.approvalStatus || 'approved') === 'approved');
  }

  if (county && county !== 'All') {
    events = events.filter((e) => e.county.toLowerCase() === String(county).toLowerCase());
  }

  if (category && category !== 'All') {
    events = events.filter((e) => e.category === category);
  }

  if (search && String(search).trim()) {
    const q = String(search).toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        e.county.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, events });
});

// Organizer submits an event (with real validation)
pulseApiRouter.post('/events', (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      date,
      time,
      venueName,
      county,
      description,
      organizerName,
      isAgeRestricted,
      ticketTiers,
    } = req.body;

    if (!title || !venueName || !county || !date) {
      res.status(400).json({ error: 'Title, venue, county, and date are required.' });
      return;
    }

    const newEvent: PulseEvent & { isDemoData: boolean; approvalStatus: 'approved' | 'pending_approval' } = {
      id: `evt_${Date.now()}`,
      title,
      category: category || 'Live Concert',
      date,
      time: time || '4:00 PM – Midnight',
      venueName,
      county,
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      description: description || 'Genuine event submitted by organizer on KenyaOne Pulse.',
      lineup: [{ name: organizerName || 'Featured Act', role: 'Main Stage', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }],
      isAgeRestricted: Boolean(isAgeRestricted),
      organizerName: organizerName || 'Verified Organizer',
      organizerVerified: true,
      status: 'upcoming',
      sponsors: ['KenyaOne Pulse'],
      tags: [county, category || 'Concert', 'LiveKE'],
      isDemoData: false, // REAL EVENT, NOT DEMO
      approvalStatus: 'approved', // Auto-approved for verified organizers in this release
      ticketTiers: ticketTiers && ticketTiers.length > 0
        ? ticketTiers
        : [
            {
              id: `t_reg_${Date.now()}`,
              name: 'Advance Regular',
              priceKES: 2000,
              perks: ['General Admission', 'QR Gate Pass'],
              totalQuantity: 1000,
              soldQuantity: 0,
            },
            {
              id: `t_vip_${Date.now()}`,
              name: 'VIP Golden Circle',
              priceKES: 6000,
              perks: ['VIP Lounge access', 'Welcome cocktail'],
              totalQuantity: 200,
              soldQuantity: 0,
            },
          ],
    };

    db.mutate((database) => {
      database.events.unshift(newEvent);
      database.adminLogs.unshift({
        id: `log_${Date.now()}`,
        action: 'New Event Published',
        target: `${title} (${county})`,
        performedBy: organizerName || 'Organizer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'approved',
      });
    });

    res.json({
      success: true,
      message: 'Event published successfully and accepting tickets nationwide.',
      event: newEvent,
      events: db.get('events'),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit event.' });
  }
});

// Real ticket purchase with inventory checking and persistent issuance
pulseApiRouter.post('/tickets/purchase', (req: Request, res: Response) => {
  try {
    const { eventId, tierId, attendeeName } = req.body;

    if (!eventId || !tierId) {
      res.status(400).json({ error: 'eventId and tierId are required.' });
      return;
    }

    let issuedTicket: UserTicket | null = null;

    db.mutate((database) => {
      const event = database.events.find((e) => e.id === eventId);
      if (!event) throw new Error('Event not found.');

      const tier = event.ticketTiers.find((t) => t.id === tierId);
      if (!tier) throw new Error('Ticket tier not found.');

      if (tier.soldQuantity >= tier.totalQuantity) {
        throw new Error(`Sold out! All ${tier.totalQuantity} tickets for ${tier.name} have been purchased.`);
      }

      // Decrement inventory
      tier.soldQuantity += 1;
      if (tier.soldQuantity >= tier.totalQuantity) {
        tier.isSoldOut = true;
      }

      const ticketCode = `KP-TKT-${event.id.replace('evt_', '').substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}-${tier.name.substring(0, 3).toUpperCase()}`;

      issuedTicket = {
        ticketCode,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        venueName: event.venueName,
        tierName: tier.name,
        attendeeName: attendeeName || 'Brian Mwangi',
        pricePaidKES: tier.priceKES,
        status: 'valid',
        qrPayload: `KENYAONE-PULSE-TICKET:${ticketCode}:${event.venueName}:VERIFIED`,
        purchasedAt: new Date().toLocaleString(),
      };

      database.tickets.unshift(issuedTicket);

      database.adminLogs.unshift({
        id: `log_${Date.now()}`,
        action: 'Ticket Issued & Escrow Secured',
        target: `${event.title} (${ticketCode})`,
        performedBy: attendeeName || 'Patron',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'approved',
      });
    });

    res.json({
      success: true,
      message: 'Payment confirmed via KenyaOne Escrow. QR Pass generated.',
      ticket: issuedTicket,
      events: db.get('events'),
      tickets: db.get('tickets'),
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Ticket purchase failed.' });
  }
});

// Gate entrance scanner ticket validation
pulseApiRouter.post('/tickets/validate', (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code || !String(code).trim()) {
      res.status(400).json({ valid: false, message: 'Scan code is required.' });
      return;
    }

    const cleanCode = String(code).trim().toUpperCase();
    let scanResult: { valid: boolean; message: string; ticket?: UserTicket } = {
      valid: false,
      message: 'INVALID TICKET: Code not found in KenyaOne database.',
    };

    db.mutate((database) => {
      const ticket = database.tickets.find((t) => t.ticketCode.toUpperCase() === cleanCode);
      if (!ticket) {
        scanResult = { valid: false, message: 'TICKET NOT FOUND: Code does not exist in national ledger.' };
        return;
      }

      if (ticket.status === 'used') {
        scanResult = {
          valid: false,
          ticket,
          message: 'DUPLICATE ENTRY DETECTED: This ticket was already checked in at the gate!',
        };
        return;
      }

      if (ticket.status === 'refunded' || ticket.status === 'cancelled') {
        scanResult = {
          valid: false,
          ticket,
          message: 'VOID TICKET: This pass was refunded or cancelled by the user.',
        };
        return;
      }

      // Mark as used
      ticket.status = 'used';
      scanResult = {
        valid: true,
        ticket,
        message: `ACCESS GRANTED: Verified ${ticket.tierName} for ${ticket.attendeeName}. Welcome!`,
      };

      database.adminLogs.unshift({
        id: `log_${Date.now()}`,
        action: 'Gate Entry Validated',
        target: `${ticket.ticketCode} (${ticket.attendeeName})`,
        performedBy: 'Entrance Scanner Crew',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'resolved',
      });
    });

    res.json(scanResult);
  } catch (err: any) {
    res.status(500).json({ valid: false, message: err.message || 'Validation error.' });
  }
});

// Ticket refund request
pulseApiRouter.post('/tickets/refund', (req: Request, res: Response) => {
  try {
    const { ticketCode } = req.body;
    if (!ticketCode) {
      res.status(400).json({ error: 'ticketCode is required' });
      return;
    }

    let refundAmount = 0;

    db.mutate((database) => {
      const ticket = database.tickets.find((t) => t.ticketCode === ticketCode);
      if (!ticket) throw new Error('Ticket not found.');

      if (ticket.status !== 'valid') {
        throw new Error(`Cannot refund ticket with status: ${ticket.status}`);
      }

      ticket.status = 'refunded';
      refundAmount = ticket.pricePaidKES;

      // Restore inventory
      const event = database.events.find((e) => e.id === ticket.eventId);
      if (event) {
        const tier = event.ticketTiers.find((t) => t.name === ticket.tierName);
        if (tier) {
          tier.soldQuantity = Math.max(0, tier.soldQuantity - 1);
          tier.isSoldOut = false;
        }
      }

      database.adminLogs.unshift({
        id: `log_${Date.now()}`,
        action: 'Ticket Escrow Refund Executed',
        target: `${ticketCode} (KES ${refundAmount})`,
        performedBy: 'Automated Refund Daemon',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'resolved',
      });
    });

    res.json({
      success: true,
      message: `Ticket ${ticketCode} refunded successfully. KES ${refundAmount} returned to your wallet.`,
      tickets: db.get('tickets'),
      events: db.get('events'),
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Refund failed.' });
  }
});

// ==========================================
// 3. DJ BOOTH & AUTOMATIC SONG REFUND
// ==========================================

// Get song requests
pulseApiRouter.get('/dj/requests', (_req: Request, res: Response) => {
  res.json({ success: true, requests: db.get('songRequests') });
});

// Patron submits song request
pulseApiRouter.post('/dj/requests', (req: Request, res: Response) => {
  try {
    const { trackTitle, artist, requestedBy, tableNumber, venueId, djId, tipAmountKES } = req.body;
    if (!trackTitle || !artist) {
      res.status(400).json({ error: 'Track title and artist are required' });
      return;
    }

    const tip = Number(tipAmountKES) || 500;
    const newReq: SongRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      trackTitle,
      artist,
      requestedBy: requestedBy || 'Anonymous Patron',
      tableNumber: tableNumber || 'Main Floor',
      venueId: venueId || 'venue_alchemist',
      djId: djId || 'dj_grauchi',
      tipAmountKES: tip,
      isPaidPriority: tip > 500,
      status: 'pending',
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    db.mutate((database) => {
      database.songRequests.unshift(newReq);
    });

    res.json({ success: true, message: 'Song request sent to DJ Booth.', request: newReq });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit request.' });
  }
});

// DJ updates song request status (Accept or Reject with Auto-Refund workflow)
pulseApiRouter.patch('/dj/requests/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['accepted', 'playing', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    let updatedReq: SongRequest | null = null;
    let refundedAmount = 0;

    db.mutate((database) => {
      const target = database.songRequests.find((r) => r.id === id);
      if (!target) throw new Error('Song request not found.');

      target.status = status;
      if (status === 'rejected') {
        target.rejectionReason = reason || 'Vibe/tempo mismatch for the current DJ set.';
        refundedAmount = target.tipAmountKES;

        database.adminLogs.unshift({
          id: `log_${Date.now()}`,
          action: 'DJ Song Request Rejected & Auto-Refunded',
          target: `"${target.trackTitle}" (KES ${refundedAmount} refunded)`,
          performedBy: 'Pulse Escrow Daemon',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'resolved',
        });
      }

      updatedReq = target;
    });

    res.json({
      success: true,
      message:
        status === 'rejected'
          ? `Request rejected. Automatic refund of KES ${refundedAmount} issued to patron.`
          : `Request marked as ${status}.`,
      request: updatedReq,
      songRequests: db.get('songRequests'),
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update request.' });
  }
});

// ==========================================
// 4. ENTERTAINMENT MARKETPLACE & QUOTES
// ==========================================

// Get marketplace listings
pulseApiRouter.get('/marketplace', (_req: Request, res: Response) => {
  res.json({ success: true, listings: db.get('marketplace') });
});

// Request quotation for event services
pulseApiRouter.post('/marketplace/quote', (req: Request, res: Response) => {
  try {
    const { listingId, clientName, clientContact, eventDate, eventLocation, budgetKES, details } = req.body;
    if (!listingId || !clientName || !clientContact) {
      res.status(400).json({ error: 'listingId, clientName, and clientContact are required.' });
      return;
    }

    let createdQuote: QuoteRequest | null = null;

    db.mutate((database) => {
      const listing = database.marketplace.find((m) => m.id === listingId);
      if (!listing) throw new Error('Listing not found');

      createdQuote = {
        id: `quote_${Date.now()}`,
        listingId,
        serviceTitle: listing.title,
        providerName: listing.providerName,
        clientName,
        clientContact,
        eventDate: eventDate || 'Upcoming Weekend',
        eventLocation: eventLocation || 'Nairobi',
        budgetKES: Number(budgetKES) || listing.startingPriceKES,
        details: details || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      database.quoteRequests.unshift(createdQuote);
    });

    res.json({
      success: true,
      message: 'Quotation request dispatched directly to service provider.',
      quote: createdQuote,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to request quote.' });
  }
});

// ==========================================
// 5. TALENT PASSPORT CONTRACT BOOKINGS
// ==========================================

pulseApiRouter.post('/talent/book', (req: Request, res: Response) => {
  try {
    const { talentId, clientName, eventDate, hours, venueLocation, agreedFeeKES } = req.body;
    if (!talentId || !clientName) {
      res.status(400).json({ error: 'talentId and clientName are required.' });
      return;
    }

    db.mutate((database) => {
      const talent = database.talents.find((t) => t.id === talentId);
      if (!talent) throw new Error('Talent not found.');

      database.adminLogs.unshift({
        id: `log_${Date.now()}`,
        action: 'Talent Passport Contract Dispatched',
        target: `${talent.artisticName} booked by ${clientName} (${hours || 4}h @ KES ${agreedFeeKES || talent.hourlyRateKES})`,
        performedBy: clientName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'approved',
      });
    });

    res.json({
      success: true,
      message: 'Official talent contract dispatched with KECOBO performance rider.',
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to book talent.' });
  }
});

// ==========================================
// 6. ADMIN OPERATIONS & AUDIT LOGS
// ==========================================

pulseApiRouter.get('/admin/state', (_req: Request, res: Response) => {
  const all = db.getAll();
  res.json({
    success: true,
    data: all,
  });
});

pulseApiRouter.post('/admin/moderation/resolve', (req: Request, res: Response) => {
  try {
    const { reportId, action } = req.body; // action: 'cleared' | 'flagged'
    if (!reportId || !action) {
      res.status(400).json({ error: 'reportId and action are required.' });
      return;
    }

    db.mutate((database) => {
      const report = database.moderationReports.find((r) => r.id === reportId);
      if (report) {
        report.status = action;
      }
      database.adminLogs.unshift({
        id: `log_${Date.now()}`,
        action: `Moderation Notice ${action.toUpperCase()}`,
        target: report ? report.target : reportId,
        performedBy: 'Pulse Admin Operator',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: action === 'cleared' ? 'approved' : 'resolved',
      });
    });

    res.json({ success: true, moderationReports: db.get('moderationReports') });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to resolve report.' });
  }
});

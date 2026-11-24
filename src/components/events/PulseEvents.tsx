import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  MapPin,
  PlusCircle,
  QrCode,
  CheckCircle2,
  Users,
  Search,
  ShieldCheck,
  Download,
  Share2,
  Clock,
  Sparkles,
  BarChart2,
  Scan,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { PulseEvent, UserTicket } from '../../types/pulse';
import { QRModal } from '../common/QRModal';

export const PulseEvents: React.FC = () => {
  const {
    events,
    userTickets,
    buyTicket,
    refundTicket,
    addCreatedEvent,
    formatPrice,
    user,
  } = usePulse();

  const [activeTab, setActiveTab] = useState<'discover' | 'my_tickets' | 'organizer_studio' | 'gate_scanner'>('discover');
  const [selectedEvent, setSelectedEvent] = useState<PulseEvent>(events[0]);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [activeTicketForModal, setActiveTicketForModal] = useState<UserTicket | null>(null);

  // Organizer Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PulseEvent['category']>('Mega Festival');
  const [newCounty, setNewCounty] = useState('Nairobi');
  const [newVenueName, setNewVenueName] = useState('');
  const [newDate, setNewDate] = useState('2026-12-19');
  const [newPrice, setNewPrice] = useState(2500);
  const [newDescription, setNewDescription] = useState('');
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  // Gate Scanner Simulator
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [scanResult, setScanResult] = useState<{
    valid: boolean;
    ticket?: UserTicket;
    message: string;
  } | null>(null);

  const handleOpenTicketQR = (ticket: UserTicket) => {
    setActiveTicketForModal(ticket);
    setShowQRModal(true);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVenueName.trim()) {
      alert('Please fill out all required event details.');
      return;
    }

    setIsSubmittingEvent(true);
    const created: PulseEvent = {
      id: `evt_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: newDate,
      time: '2:00 PM – Midnight',
      venueName: newVenueName,
      county: newCounty,
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      description: newDescription || 'Genuine event submitted by organizer on KenyaOne Pulse.',
      lineup: [{ name: user.name, role: 'Host', avatar: user.avatar }],
      isAgeRestricted: false,
      organizerName: user.name,
      organizerVerified: true,
      status: 'upcoming',
      sponsors: ['KenyaOne Pulse', 'Safaricom M-Pesa'],
      tags: ['LiveConcert', 'KenyaOnePulse', newCounty],
      ticketTiers: [
        {
          id: `t_reg_${Date.now()}`,
          name: 'Advance Regular',
          priceKES: newPrice,
          perks: ['General Admission', 'KenyaOne Digital Pass'],
          totalQuantity: 2000,
          soldQuantity: 0,
        },
        {
          id: `t_vip_${Date.now()}`,
          name: 'VIP Golden Circle',
          priceKES: newPrice * 3,
          perks: ['VIP Lounge access', 'Welcome cocktail', 'Express entrance gate'],
          totalQuantity: 300,
          soldQuantity: 0,
        },
      ],
    };

    await addCreatedEvent(created);
    setIsSubmittingEvent(false);
    setActiveTab('discover');
    setNewTitle('');
    setNewVenueName('');
    setNewDescription('');
  };

  const handleValidateTicket = async () => {
    if (!scanCodeInput.trim()) return;
    setIsValidating(true);
    try {
      const res = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: scanCodeInput.trim() }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch (err: any) {
      setScanResult({
        valid: false,
        message: 'NETWORK ERROR: Could not reach entrance validation database.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRefund = async (ticketCode: string) => {
    if (confirm(`Are you sure you want to cancel ticket ${ticketCode}? Funds will be refunded to your KenyaOne wallet.`)) {
      await refundTicket(ticketCode);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Event Header & Top Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">PULSE EVENTS & TICKETING</h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                KENYAONE ESCROW VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure QR ticketing with real-time inventory management, fraud prevention, and gate scanning.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'discover' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Discover Events
          </button>
          <button
            onClick={() => setActiveTab('my_tickets')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'my_tickets' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>My Tickets</span>
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
              {userTickets.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('organizer_studio')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'organizer_studio' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Organizer Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('gate_scanner')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'gate_scanner' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Entrance Scanner</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DISCOVER EVENTS & TICKET TIERS */}
      {activeTab === 'discover' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List */}
          <div className="lg:col-span-2 space-y-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row gap-4 ${
                  selectedEvent.id === evt.id
                    ? 'bg-slate-900 border-red-500 shadow-xl shadow-red-600/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="sm:w-48 h-36 rounded-xl overflow-hidden shrink-0 relative">
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-white">
                      {evt.category}
                    </span>
                    {evt.isDemoData ? (
                      <span className="px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-700 text-[9px] font-bold">
                        DEMO DATA
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 text-[9px] font-bold">
                        VERIFIED EVENT
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-red-500" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{evt.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {evt.venueName}, {evt.county}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">
                      Tiers: {evt.ticketTiers.map((t) => `${t.name} (${t.soldQuantity}/${t.totalQuantity})`).join(' | ')}
                    </span>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      From {formatPrice(evt.ticketTiers[0].priceKES)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Selected Event Tier Checkout */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                  Select Ticket Tier
                </span>
                {selectedEvent.isDemoData && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold">
                    DEMO PREVIEW
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1">{selectedEvent.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Organized by {selectedEvent.organizerName}
              </p>
            </div>

            <div className="space-y-3">
              {selectedEvent.ticketTiers.map((tier) => {
                const soldOut = tier.soldQuantity >= tier.totalQuantity;
                const remaining = tier.totalQuantity - tier.soldQuantity;
                return (
                  <div
                    key={tier.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      soldOut
                        ? 'bg-slate-950/40 border-slate-800 opacity-60'
                        : 'bg-slate-950 border-slate-700/80 hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-bold text-white text-xs block">{tier.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {soldOut ? 'Sold Out' : `${remaining} tickets left`}
                        </span>
                      </div>
                      <span className="font-mono font-black text-emerald-400 text-xs">
                        {formatPrice(tier.priceKES)}
                      </span>
                    </div>

                    <ul className="text-[11px] text-slate-400 space-y-0.5 mb-3">
                      {tier.perks.map((p, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => buyTicket(selectedEvent, tier.id)}
                      disabled={soldOut}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        soldOut
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/30'
                      }`}
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{soldOut ? 'Sold Out' : `Buy Ticket (${formatPrice(tier.priceKES)})`}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Funds held securely in KenyaOne Escrow until event commencement.</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MY DIGITAL TICKETS & QR PASSES */}
      {activeTab === 'my_tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">My Active QR Passes ({userTickets.length})</h3>
            <span className="text-xs text-slate-400">Ready to show at entrance turnstiles</span>
          </div>

          {userTickets.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
              You haven't bought any event tickets yet. Explore upcoming concerts and secure your pass.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userTickets.map((t) => (
                <div
                  key={t.ticketCode}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border ${
                        t.status === 'valid'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : t.status === 'used'
                          ? 'bg-purple-950 text-purple-400 border-purple-800'
                          : 'bg-red-950 text-red-400 border-red-800'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {t.status.toUpperCase()} ESCROW TICKET
                      </span>
                      <span className="font-mono text-xs text-slate-400">{t.ticketCode}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{t.eventTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {t.venueName} • {t.eventDate}
                    </p>

                    <div className="mt-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-400">Tier: <strong className="text-white">{t.tierName}</strong></span>
                      <span className="text-slate-400">Attendee: <strong className="text-white">{t.attendeeName}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenTicketQR(t)}
                      className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-red-600/30"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Show QR Ticket</span>
                    </button>

                    {t.status === 'valid' && (
                      <button
                        onClick={() => handleRefund(t.ticketCode)}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors"
                        title="Cancel ticket & refund to wallet"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Refund</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        alert(`Ticket ${t.ticketCode} downloaded for offline presentation.`);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      title="Download offline pass"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: ORGANIZER STUDIO (CREATE REAL EVENT) */}
      {activeTab === 'organizer_studio' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">KenyaOne Event Organizer Studio</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                PROMOTER PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Publish national events with persistent database storage, configure ticket tiers, and receive payouts via KenyaOne Escrow.
            </p>
          </div>

          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Event Title:</label>
              <input
                type="text"
                placeholder="e.g. Nairobi Sunset Festival 2026"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as PulseEvent['category'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Mega Festival">Mega Festival</option>
                  <option value="Live Concert">Live Concert</option>
                  <option value="Club Night">Club Night</option>
                  <option value="Comedy Special">Comedy Special</option>
                  <option value="Cultural Fiesta">Cultural Fiesta</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">County:</label>
                <select
                  value={newCounty}
                  onChange={(e) => setNewCounty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kwale', 'Turkana', 'Uasin Gishu', 'Machakos'].map(
                    (c) => (
                      <option key={c} value={c}>
                        {c} County
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Venue Location:</label>
                <input
                  type="text"
                  placeholder="e.g. Carnivore Grounds, Langata"
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Event Date:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Regular Ticket Price (KES):</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                min={200}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Event Description & Lineup:</label>
              <textarea
                rows={3}
                placeholder="Highlight headliners, sound engineering setup, gate security, and experiences..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingEvent}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 font-bold text-white text-xs transition-all shadow-lg shadow-red-600/30 disabled:opacity-50"
            >
              {isSubmittingEvent ? 'Publishing Event...' : 'Publish Event & Open Ticket Reservations'}
            </button>
          </form>
        </div>
      )}

      {/* VIEW 4: GATE ENTRANCE QR SCANNER SIMULATOR */}
      {activeTab === 'gate_scanner' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Live Entrance Gate Validator</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Real-time validation against the persistent server database. Prevents duplicate and refunded tickets.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Ticket Code (e.g. KP-TKT-90412-VIP)"
                value={scanCodeInput}
                onChange={(e) => setScanCodeInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleValidateTicket}
                disabled={isValidating || !scanCodeInput.trim()}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shrink-0 shadow-md shadow-emerald-600/30"
              >
                {isValidating ? 'Validating...' : 'Scan Ticket'}
              </button>
            </div>

            {userTickets.length > 0 && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setScanCodeInput(userTickets[0].ticketCode)}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 underline"
                >
                  Autofill active ticket ({userTickets[0].ticketCode})
                </button>
              </div>
            )}
          </div>

          {/* Validation Result Display */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                scanResult.valid
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/40 border-red-500 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {scanResult.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span>{scanResult.message}</span>
              </div>
              {scanResult.ticket && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                  <p>Event: {scanResult.ticket.eventTitle}</p>
                  <p>Tier: {scanResult.ticket.tierName}</p>
                  <p>Holder: {scanResult.ticket.attendeeName}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ticket QR Modal */}
      {activeTicketForModal && (
        <QRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          title={activeTicketForModal.eventTitle}
          subtitle={`${activeTicketForModal.tierName} • ${activeTicketForModal.venueName}`}
          code={activeTicketForModal.ticketCode}
          type="ticket"
          meta={[
            { label: 'Event Date', value: activeTicketForModal.eventDate },
            { label: 'Attendee', value: activeTicketForModal.attendeeName },
            { label: 'Price Paid', value: formatPrice(activeTicketForModal.pricePaidKES) },
            { label: 'Status', value: activeTicketForModal.status.toUpperCase() },
          ]}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Search,
  GlassWater,
  MapPin,
  Music,
  Radio,
  CheckCircle,
  Users,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign,
  QrCode,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { Venue, VenueTable } from '../../types/pulse';
import { QRModal } from '../common/QRModal';
import { TableReservation } from '../../server/db';

export const QuickVenueFinder: React.FC = () => {
  const {
    venues,
    setSelectedVenue,
    setActiveTab,
    formatPrice,
    user,
    setActiveStream,
    streams,
  } = usePulse();

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [liveStatusFilter, setLiveStatusFilter] = useState<'all' | 'live_now' | 'scheduled_tonight'>('all');
  const [tableAvailabilityFilter, setTableAvailabilityFilter] = useState<'all' | 'available' | 'vip_available'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');
  const [maxMinSpend, setMaxMinSpend] = useState<number>(0);
  const [isSearchingBackend, setIsSearchingBackend] = useState<boolean>(false);
  const [backendVenues, setBackendVenues] = useState<Venue[] | null>(null);

  // Reservation Modal State
  const [reservingVenue, setReservingVenue] = useState<Venue | null>(null);
  const [selectedTableForRes, setSelectedTableForRes] = useState<VenueTable | null>(null);
  const [guestName, setGuestName] = useState<string>(user.name);
  const [guestPhone, setGuestPhone] = useState<string>('+254 712 000 000');
  const [guestCount, setGuestCount] = useState<number>(4);
  const [timeSlot, setTimeSlot] = useState<string>('20:00 - Closing');
  const [isSubmittingRes, setIsSubmittingRes] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);

  // Execute real-time query against the backend database
  const executeFindNow = async () => {
    setIsSearchingBackend(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (liveStatusFilter !== 'all') params.append('liveStatus', liveStatusFilter);
      if (tableAvailabilityFilter !== 'all') params.append('tableAvailability', tableAvailabilityFilter);
      if (selectedCounty !== 'All') params.append('county', selectedCounty);
      if (maxMinSpend > 0) params.append('maxMinSpend', String(maxMinSpend));

      const res = await fetch(`/api/venues/quick-finder?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.venues) {
          setBackendVenues(data.venues);
        }
      }
    } catch (err) {
      console.warn('Real-time backend check fallback:', err);
    } finally {
      setIsSearchingBackend(false);
    }
  };

  // Initial query on mount to verify live entertainment database in real time
  useEffect(() => {
    executeFindNow();
  }, []);

  // Base list of venues (from backend query if performed, or from context)
  const currentVenuesList = backendVenues !== null ? backendVenues : venues;

  // Local filter logic applied for immediate responsive feedback
  const filteredVenues = currentVenuesList.filter((v: any) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = v.name.toLowerCase().includes(q);
      const matchesNeighborhood = v.neighborhood.toLowerCase().includes(q);
      const matchesVibe = v.vibe?.some((vb: string) => vb.toLowerCase().includes(q));
      const matchesDj = (v.currentDjLive || v.residentDj || '').toLowerCase().includes(q);
      if (!matchesName && !matchesNeighborhood && !matchesVibe && !matchesDj) return false;
    }

    // 2. Category Filter (Nightclub, Lounge, Restaurant, Beach Club, Rooftop, etc.)
    if (selectedCategory !== 'All') {
      const cat = selectedCategory.toLowerCase();
      const venueCategory = (v.category || '').toLowerCase();
      const matchesCat =
        venueCategory.includes(cat) ||
        v.name.toLowerCase().includes(cat) ||
        v.vibe?.some((vb: string) => vb.toLowerCase().includes(cat));
      if (!matchesCat) return false;
    }

    // 3. Live Entertainment Status
    if (liveStatusFilter !== 'all') {
      const isLiveNow = v.liveEntertainmentStatus === 'live_now' || v.currentDjLive;
      if (liveStatusFilter === 'live_now' && !isLiveNow) return false;
      if (liveStatusFilter === 'scheduled_tonight' && isLiveNow) return false;
    }

    // 4. Table availability
    if (tableAvailabilityFilter === 'available') {
      const hasFree = v.tables?.some((t: VenueTable) => t.status === 'available');
      if (!hasFree) return false;
    } else if (tableAvailabilityFilter === 'vip_available') {
      const hasFreeVip = v.tables?.some(
        (t: VenueTable) => t.status === 'available' && t.section.toLowerCase().includes('vip')
      );
      if (!hasFreeVip) return false;
    }

    // 5. County
    if (selectedCounty !== 'All') {
      if (v.county.toLowerCase() !== selectedCounty.toLowerCase()) return false;
    }

    // 6. Max min spend
    if (maxMinSpend > 0) {
      const hasAffordable = v.tables?.some((t: VenueTable) => t.minSpendKES <= maxMinSpend);
      if (!hasAffordable) return false;
    }

    return true;
  });

  const handleOpenReservation = (venue: Venue) => {
    setReservingVenue(venue);
    const firstFree = venue.tables.find((t) => t.status === 'available') || venue.tables[0];
    setSelectedTableForRes(firstFree);
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservingVenue || !selectedTableForRes) return;

    setIsSubmittingRes(true);
    try {
      const res = await fetch(`/api/venues/${reservingVenue.id}/reserve-table`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTableForRes.id,
          guestName,
          guestPhone,
          guestsCount: guestCount,
          reservationDate: 'Tonight',
          timeSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete reservation');
      }

      setConfirmedReservation(data.reservation);
      setIsSubmittingRes(false);
    } catch (err: any) {
      alert(err.message || 'Reservation error.');
      setIsSubmittingRes(false);
    }
  };

  return (
    <div className="liquid-glass rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative background specular glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
              Real-Time Nightlife Intelligence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Quick Venue Finder</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full liquid-glass-pill text-slate-200 border border-white/15">
              {filteredVenues.length} Venues Active
            </span>
          </h2>
          <p className="text-xs text-slate-300/80 mt-1">
            Search venues by name, category (Nightclub, Lounge, Restaurant), and live entertainment availability in real-time.
          </p>
        </div>

        {/* Quick Clear & Reset */}
        {(selectedCategory !== 'All' || liveStatusFilter !== 'all' || tableAvailabilityFilter !== 'all' || selectedCounty !== 'All' || searchQuery || maxMinSpend > 0) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setLiveStatusFilter('all');
              setTableAvailabilityFilter('all');
              setSelectedCounty('All');
              setMaxMinSpend(0);
              setBackendVenues(null);
            }}
            className="text-xs text-rose-300 hover:text-white flex items-center gap-1.5 font-semibold self-start md:self-auto cursor-pointer liquid-glass-pill px-3 py-1.5 rounded-xl transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>

      {/* Primary Finder Form Bar: Search Input, Category Selector, and 'Find Now' Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeFindNow();
        }}
        className="relative z-10 pt-5 space-y-3.5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* 1. Venue Name Search Input */}
          <div className="sm:col-span-5 liquid-glass-input rounded-2xl px-4 py-3 flex items-center gap-3 text-xs text-slate-200 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search venue name (e.g. Alchemist, Quiver, K1...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white focus:outline-none placeholder-slate-400 text-xs font-medium"
            />
          </div>

          {/* 2. Category Filter (e.g., Nightclub, Lounge, Restaurant, Beach Club, Rooftop) */}
          <div className="sm:col-span-3 liquid-glass-input rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-slate-200 transition-all">
            <Filter className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
              className="w-full bg-transparent text-white focus:outline-none text-xs cursor-pointer font-medium"
            >
              <option value="All" className="bg-slate-900 text-white">All Categories</option>
              <option value="Nightclub" className="bg-slate-900 text-white">Nightclub</option>
              <option value="Lounge" className="bg-slate-900 text-white">Lounge</option>
              <option value="Restaurant" className="bg-slate-900 text-white">Restaurant & Grill</option>
              <option value="Beach Club" className="bg-slate-900 text-white">Beach Club</option>
              <option value="Rooftop" className="bg-slate-900 text-white">Rooftop Lounge</option>
            </select>
          </div>

          {/* 3. County Location Filter */}
          <div className="sm:col-span-2 liquid-glass-input rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-slate-200 transition-all">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none text-xs cursor-pointer truncate font-medium"
            >
              <option value="All" className="bg-slate-900 text-white">All Counties</option>
              <option value="Nairobi" className="bg-slate-900 text-white">Nairobi</option>
              <option value="Kwale" className="bg-slate-900 text-white">Kwale / Diani</option>
              <option value="Mombasa" className="bg-slate-900 text-white">Mombasa</option>
              <option value="Kisumu" className="bg-slate-900 text-white">Kisumu</option>
              <option value="Nakuru" className="bg-slate-900 text-white">Nakuru</option>
            </select>
          </div>

          {/* 4. Prominent 'Find Now' Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSearchingBackend}
              className="w-full h-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black tracking-wide shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98] border border-white/20 disabled:opacity-60"
            >
              {isSearchingBackend ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Find Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Entertainment Status & Seating Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs">
          {/* Live Entertainment Status Toggle */}
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-red-400" />
            Live Status:
          </span>
          <button
            type="button"
            onClick={() => setLiveStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              liveStatusFilter === 'all'
                ? 'liquid-glass-pill-active text-white'
                : 'liquid-glass-pill text-slate-300 hover:text-white'
            }`}
          >
            All Live Statuses
          </button>
          <button
            type="button"
            onClick={() => setLiveStatusFilter('live_now')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              liveStatusFilter === 'live_now'
                ? 'liquid-glass-pill-active text-white'
                : 'liquid-glass-pill text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Live DJ / Performance Now</span>
          </button>
          <button
            type="button"
            onClick={() => setLiveStatusFilter('scheduled_tonight')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              liveStatusFilter === 'scheduled_tonight'
                ? 'bg-amber-500/80 text-slate-950 font-black border border-amber-300/40 shadow-lg shadow-amber-500/20'
                : 'liquid-glass-pill text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Scheduled Tonight</span>
          </button>

          <span className="text-white/20 hidden sm:inline">|</span>

          {/* Table Availability Toggle */}
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mr-1">
            Seating:
          </span>
          <button
            type="button"
            onClick={() => setTableAvailabilityFilter(tableAvailabilityFilter === 'available' ? 'all' : 'available')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tableAvailabilityFilter === 'available'
                ? 'bg-emerald-600/90 text-white border border-emerald-400/40 shadow-lg shadow-emerald-600/30'
                : 'liquid-glass-pill text-slate-300 hover:text-white'
            }`}
          >
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Tables Free</span>
          </button>
          <button
            type="button"
            onClick={() => setTableAvailabilityFilter(tableAvailabilityFilter === 'vip_available' ? 'all' : 'vip_available')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tableAvailabilityFilter === 'vip_available'
                ? 'bg-purple-600/90 text-white border border-purple-400/40 shadow-lg shadow-purple-600/30'
                : 'liquid-glass-pill text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-300" />
            <span>VIP Booths</span>
          </button>
        </div>
      </form>

      {/* Venues Results Grid */}
      <div className="relative z-10 mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVenues.length === 0 ? (
          <div className="col-span-full py-14 text-center text-slate-400 space-y-2.5 liquid-glass-card rounded-3xl border border-white/10">
            <GlassWater className="w-10 h-10 text-slate-500 mx-auto mb-1 opacity-70" />
            <p className="text-sm font-bold text-white">No venues match your exact live criteria right now.</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search for another county.</p>
          </div>
        ) : (
          filteredVenues.map((v: any) => {
            const isLive = v.liveEntertainmentStatus === 'live_now' || v.currentDjLive;
            const freeTables = v.tables.filter((t: VenueTable) => t.status === 'available');
            const lowestMinSpend = Math.min(...v.tables.map((t: VenueTable) => t.minSpendKES));

            return (
              <div
                key={v.id}
                className="group liquid-glass-card rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Top Image & Badges */}
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                    <img
                      src={v.coverImage}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Live Entertainment Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      {isLive ? (
                        <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          LIVE DJ ON DECK
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-bold flex items-center gap-1 border border-slate-700">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Starts Tonight
                        </span>
                      )}
                    </div>

                    {/* Table availability tag */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-400" />
                        {freeTables.length > 0 ? (
                          <strong className="text-emerald-400">{freeTables.length} Tables Free</strong>
                        ) : (
                          <strong className="text-rose-400">Tables Full</strong>
                        )}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md font-mono text-[10px] text-slate-300">
                        {v.activeGuestsCount} / {v.capacity} Inside
                      </span>
                    </div>
                  </div>

                  {/* Venue Name & Location & Category */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-rose-300 border border-slate-700">
                          {v.category || 'Nightclub'}
                        </span>
                        {v.verified && (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors">
                        {v.name}
                      </h3>
                    </div>
                    <span className="text-xs text-amber-400 font-bold shrink-0">★ {v.rating}</span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{v.neighborhood}, {v.county}</span>
                  </p>

                  {/* Real-time Entertainment Headline */}
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
                      <Music className="w-3 h-3" />
                      <span>{v.currentDjLive || v.residentDj}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {v.liveEntertainmentDetails || v.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Actions Bottom Row */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Min Spend from:</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {formatPrice(lowestMinSpend)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenReservation(v)}
                      disabled={freeTables.length === 0}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                        freeTables.length === 0
                          ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/30 border border-white/20'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{freeTables.length === 0 ? 'Waitlist' : 'Reserve Table'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedVenue(v);
                        setActiveTab('clubs');
                      }}
                      className="py-2.5 px-3 rounded-xl liquid-glass-pill hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all active:scale-[0.98]"
                      title="View Digital Menu & Table Tokens"
                    >
                      <QrCode className="w-4 h-4 text-emerald-400" />
                    </button>

                    {isLive && (
                      <button
                        onClick={() => {
                          const stream = streams.find((s) => s.county === v.county) || streams[0];
                          setActiveStream(stream);
                          setActiveTab('live');
                        }}
                        className="py-2.5 px-3 rounded-xl liquid-glass-pill hover:bg-purple-600/30 hover:border-purple-400/50 text-purple-400 text-xs font-semibold transition-all active:scale-[0.98]"
                        title="Tune into Live Cam / Stream"
                      >
                        <Radio className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Instant Table Reservation Modal */}
      {reservingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="w-full max-w-lg liquid-glass border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            {!confirmedReservation ? (
              <>
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                        KenyaOne Escrow Table Booking
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">{reservingVenue.name}</h3>
                    <p className="text-xs text-slate-300/80">{reservingVenue.neighborhood}, {reservingVenue.county}</p>
                  </div>
                  <button
                    onClick={() => setReservingVenue(null)}
                    className="p-2 rounded-full text-slate-400 hover:text-white liquid-glass-pill transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleConfirmReservation} className="space-y-4">
                  {/* Select Table Grid */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">
                      Select Available Table:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {reservingVenue.tables.map((t) => {
                        const isSelected = selectedTableForRes?.id === t.id;
                        const isFree = t.status === 'available';
                        return (
                          <button
                            key={t.id}
                            type="button"
                            disabled={!isFree}
                            onClick={() => setSelectedTableForRes(t)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-red-600/20 border-red-500 text-white'
                                : isFree
                                ? 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                                : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs">{t.tableNumber}</span>
                              <span className="text-[9px] font-bold uppercase">
                                {isFree ? 'Free' : 'Full'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">{t.section}</span>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 block mt-1">
                              {formatPrice(t.minSpendKES)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Lead Guest Name:</label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">M-Pesa / Phone Number:</label>
                      <input
                        type="text"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Party Size:</label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                      >
                        {[2, 4, 6, 8, 10, 12].map((num) => (
                          <option key={num} value={num}>{num} Guests</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Arrival Window:</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                      >
                        <option value="18:00 - 21:00">Early Sunset (18:00 - 21:00)</option>
                        <option value="20:00 - 00:00">Prime Peak (20:00 - 00:00)</option>
                        <option value="22:00 - Closing">Late Night (22:00 - Closing)</option>
                      </select>
                    </div>
                  </div>

                  {/* Deposit Summary Box */}
                  {selectedTableForRes && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Selected Table:</span>
                        <strong className="text-white">{selectedTableForRes.tableNumber} ({selectedTableForRes.section})</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Table Minimum Spend:</span>
                        <strong className="text-white font-mono">{formatPrice(selectedTableForRes.minSpendKES)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Advance Escrow Deposit (30%):</span>
                        <strong className="text-emerald-400 font-mono text-sm">
                          {formatPrice(Math.round(selectedTableForRes.minSpendKES * 0.3))}
                        </strong>
                      </div>
                      <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                        Deposit directly offsets your bottle and food bill. Held securely in KenyaOne Escrow.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReservingVenue(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingRes || !selectedTableForRes}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-bold text-white transition-all shadow-lg shadow-red-600/30 disabled:opacity-50"
                    >
                      {isSubmittingRes ? 'Locking Table...' : 'Confirm Table Reservation'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Confirmation Sheet */
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
                    Reservation Confirmed
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    Table {confirmedReservation.tableNumber} Reserved!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {confirmedReservation.venueName} • {confirmedReservation.timeSlot}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Reservation Code:</span>
                    <span className="font-mono font-bold text-white text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {confirmedReservation.reservationCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Section:</span>
                    <span className="text-white font-semibold">{confirmedReservation.section}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Guests:</span>
                    <span className="text-white font-semibold">{confirmedReservation.guestsCount} Guests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Escrow Deposit:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatPrice(confirmedReservation.depositPaidKES)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>View Pass QR</span>
                  </button>
                  <button
                    onClick={() => {
                      setConfirmedReservation(null);
                      setReservingVenue(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reservation Pass QR Modal */}
      {confirmedReservation && (
        <QRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          title={`Table ${confirmedReservation.tableNumber} Pass`}
          subtitle={`${confirmedReservation.venueName} • ${confirmedReservation.section}`}
          code={confirmedReservation.reservationCode}
          type="table_qr"
          meta={[
            { label: 'Lead Guest', value: confirmedReservation.guestName },
            { label: 'Time Slot', value: confirmedReservation.timeSlot },
            { label: 'Min Spend', value: formatPrice(confirmedReservation.minSpendKES) },
            { label: 'Status', value: 'Confirmed Escrow' },
          ]}
        />
      )}
    </div>
  );
};

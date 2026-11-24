import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  Radio,
  Ticket,
  GlassWater,
  Disc3,
  Play,
  Heart,
  Users,
  Flame,
  ArrowRight,
  Filter,
  CheckCircle2,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { PulseEvent, Livestream } from '../../types/pulse';
import { QuickVenueFinder } from './QuickVenueFinder';

export const PulseHome: React.FC = () => {
  const {
    streams,
    events,
    venues,
    creators,
    setActiveTab,
    setActiveStream,
    setSelectedVenue,
    buyTicket,
    formatPrice,
    searchQuery,
    setSearchQuery,
    user,
  } = usePulse();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');

  const categories = [
    'All',
    'Mega Festival',
    'Live Concert',
    'Club Night',
    'Standup Comedy',
    'Cultural Fiesta',
    'DJ Mix',
  ];

  const counties = ['All', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kwale', 'Turkana', 'Uasin Gishu'];

  const liveStreams = streams.filter((s) => s.isLive);

  // Filtered events
  const filteredEvents = events.filter((e) => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesCounty = selectedCounty === 'All' || e.county === selectedCounty;
    const matchesSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lineup.some((art) => art.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesCounty && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner: The Heartbeat of Kenya */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-red-950/40 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            KenyaOne Pulse National Entertainment Ecosystem
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            THE HEARTBEAT OF KENYA.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
              LIVE EVERYWHERE.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Kenya’s premier stage for live concerts, club table reservations, DJ booth song requests,
            creator livestreams, and rich 47-county cultural celebrations. Powered by KenyaOne verified escrow.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3">
              <span className="text-2xl font-black text-white font-mono">47</span>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Counties Covered</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3">
              <span className="text-2xl font-black text-emerald-400 font-mono">100%</span>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Escrow Ticket Protection</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3">
              <span className="text-2xl font-black text-rose-400 font-mono">24/7</span>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Live Creator Feeds</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3">
              <span className="text-2xl font-black text-amber-400 font-mono">QR</span>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Table & Gate Entry</p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/90 border border-slate-700/80 rounded-2xl p-2 sm:p-3 shadow-xl flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by event, artist, club, DJ or county..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder-slate-500 text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* County dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 w-full sm:w-auto">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
                >
                  {counties.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c === 'All' ? 'All Counties' : `${c} County`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ask Pulse AI Button */}
              <button
                onClick={() => setActiveTab('pulse_ai')}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRIMARY FEATURE: QUICK VENUE FINDER WIDGET */}
      <section className="space-y-4">
        <QuickVenueFinder />
      </section>

      {/* SECTION 1: LIVE NOW BROADCASTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              LIVE NOW ON PULSE
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('live')}
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            Explore All Livestreams
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveStreams.slice(0, 2).map((stream) => (
            <div
              key={stream.id}
              onClick={() => {
                setActiveStream(stream);
                setActiveTab('live');
              }}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all cursor-pointer shadow-lg hover:shadow-red-600/10 flex flex-col sm:flex-row"
            >
              <div className="sm:w-1/2 relative h-48 sm:h-auto overflow-hidden">
                <img
                  src={stream.coverImage}
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-xs font-mono">
                  {stream.viewerCount.toLocaleString()} watching
                </div>
              </div>

              <div className="sm:w-1/2 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={stream.creatorAvatar}
                      alt={stream.creatorName}
                      className="w-6 h-6 rounded-full object-cover border border-slate-700"
                    />
                    <span className="text-xs font-semibold text-slate-300 truncate">
                      {stream.creatorName}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                    {stream.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{stream.streamerBio}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {stream.county} County
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center gap-1 group-hover:bg-red-500 transition-colors">
                    <Play className="w-3 h-3 fill-white" />
                    Watch Now
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: UPCOMING EVENTS & CONCERTS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                KENYAN EVENTS & TICKET INVENTORY
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                REAL ESCROW TICKETS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Verified tickets with instant QR entry and zero fraud guarantee.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('events')}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Submit Event (Organizer)</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              All Passes
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const lowestTier = evt.ticketTiers[0];
            return (
              <div
                key={evt.id}
                className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={evt.coverImage}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-[11px] font-bold">
                        {evt.category}
                      </span>
                      {evt.isDemoData ? (
                        <span className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-700 text-[9px] font-bold">
                          DEMO PREVIEW
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 text-[9px] font-bold">
                          ORGANIZER VERIFIED
                        </span>
                      )}
                    </div>

                    {evt.isAgeRestricted && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-950/90 border border-red-700 text-red-300 text-[10px] font-bold">
                        18+ ONLY
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                      <span className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                        <Calendar className="w-3 h-3 text-red-400" />
                        {evt.date}
                      </span>
                      <span className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {evt.county}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400 font-medium">Headliners:</span>
                      <div className="flex items-center -space-x-1.5 overflow-hidden">
                        {evt.lineup.map((performer, idx) => (
                          <img
                            key={idx}
                            src={performer.avatar}
                            alt={performer.name}
                            title={`${performer.name} (${performer.role})`}
                            className="w-5 h-5 rounded-full border border-slate-800 object-cover"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-300 font-semibold truncate">
                        {evt.lineup.map((l) => l.name).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 mt-3">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">From</span>
                      <span className="text-base font-black text-emerald-400 font-mono">
                        {formatPrice(lowestTier.priceKES)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        buyTicket(evt, lowestTier.id);
                      }}
                      className="py-2 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-red-600/30"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Buy Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: POPULAR VERIFIED CLUBS & NIGHTLIFE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              PULSE CLUBS & VERIFIED VENUES
            </h2>
            <p className="text-xs text-slate-400">
              Unique table QR codes, interactive digital menus, bottle reservations & DJ song queues.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('clubs')}
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            View All Venues & Tables
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {venues.map((v) => (
            <div
              key={v.id}
              onClick={() => {
                setSelectedVenue(v);
                setActiveTab('clubs');
              }}
              className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 transition-all cursor-pointer shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                  <img
                    src={v.coverImage}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {v.activeGuestsCount} Guests Inside
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-base group-hover:text-red-400 transition-colors">
                    {v.name}
                  </h3>
                  {v.verified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {v.neighborhood}, {v.county}
                </p>

                <p className="text-xs text-slate-300 line-clamp-2">{v.tagline}</p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {v.vibe.map((vb, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"
                    >
                      {vb}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Resident DJ</span>
                  <span className="font-semibold text-slate-200">{v.residentDj}</span>
                </div>
                <span className="py-1.5 px-3 rounded-xl bg-slate-800 group-hover:bg-red-600 group-hover:text-white text-slate-300 font-bold transition-all">
                  Open Digital Menu
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: FEATURED CREATORS & DJS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              FEATURED CREATORS & DJS
            </h2>
            <p className="text-xs text-slate-400">
              Subscribe, tip, book talent, or purchase verified artist merchandise.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('creator_studio')}
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            Creator Studio & Merch
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {creators.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveTab('creator_studio')}
              className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-lg text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-full h-full rounded-full object-cover border-2 border-red-500 shadow-lg"
                />
                <span className="absolute bottom-0 right-0 p-1 rounded-full bg-emerald-500 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="font-bold text-white text-base group-hover:text-red-400 transition-colors">
                {c.name}
              </h3>
              <span className="text-xs text-slate-400">{c.handle}</span>

              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed px-2">
                {c.bio}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Followers</span>
                  <span className="font-bold text-white">
                    {(c.followersCount / 1000).toFixed(0)}K
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Merch Items</span>
                  <span className="font-bold text-amber-400">{c.merch.length} drops</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: 47 COUNTIES CULTURAL SPOTLIGHT */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-800/40 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              National Cultural Heritage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Explore All 47 Counties of Kenya
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Discover traditional music, iconic regional dances (Isukuti, Chakacha, Mwomboko, Ohangla),
              local food festivals, and county cultural calendars in both English and Kiswahili.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('culture')}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all shrink-0"
          >
            <span>Open 47 Counties Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

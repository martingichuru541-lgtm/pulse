import React, { useState } from 'react';
import {
  GlassWater,
  MapPin,
  QrCode,
  Music,
  Wine,
  Sparkles,
  Users,
  CheckCircle,
  Clock,
  Send,
  Split,
  ChevronRight,
  TrendingUp,
  Star,
  DollarSign,
  AlertCircle,
  Flame,
  Cake,
  Mic2,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { Venue, VenueTable, VenueMenuItem } from '../../types/pulse';
import { QRModal } from '../common/QRModal';
import { AgeGateModal } from '../common/AgeGateModal';

export const PulseClubs: React.FC = () => {
  const {
    venues,
    selectedVenue,
    setSelectedVenue,
    submitSongRequest,
    formatPrice,
    user,
    is18PlusVerified,
  } = usePulse();

  const venue = selectedVenue || venues[0];

  // Modals & Active Tab inside Clubs
  const [activeVenueTab, setActiveVenueTab] = useState<'menu' | 'tables' | 'shoutouts' | 'analytics'>('menu');
  const [selectedTable, setSelectedTable] = useState<VenueTable | null>(venue.tables[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [qrModalData, setQrModalData] = useState<{ code: string; title: string; subtitle: string }>({
    code: '',
    title: '',
    subtitle: '',
  });
  const [showAgeGate, setShowAgeGate] = useState<boolean>(false);

  // Song / Shoutout request form
  const [showSongModal, setShowSongModal] = useState<boolean>(false);
  const [songTitle, setSongTitle] = useState<string>('');
  const [songArtist, setSongArtist] = useState<string>('');
  const [requestTip, setRequestTip] = useState<number>(venue.songRequestBasePriceKES);
  const [requestType, setRequestType] = useState<'standard' | 'birthday' | 'dedication'>('standard');
  const [dedicationNote, setDedicationNote] = useState<string>('');

  // Bill Splitter state
  const [showBillSplitter, setShowBillSplitter] = useState<boolean>(false);
  const [splitGuestsCount, setSplitGuestsCount] = useState<number>(4);
  const [splitTotalKES, setSplitTotalKES] = useState<number>(14800);

  // Cart / Orders simulation
  const [cart, setCart] = useState<{ item: VenueMenuItem; count: number }[]>([]);

  const addToCart = (item: VenueMenuItem) => {
    if (item.is18Plus && !is18PlusVerified) {
      setShowAgeGate(true);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, count: c.count + 1 } : c));
      }
      return [...prev, { item, count: 1 }];
    });
  };

  const cartTotalKES = cart.reduce((acc, c) => acc + c.item.priceKES * c.count, 0);

  const handleOpenTableQR = (table: VenueTable) => {
    setSelectedTable(table);
    setQrModalData({
      code: table.qrCodeToken,
      title: `${venue.name} — Table ${table.tableNumber}`,
      subtitle: `${table.section} (Capacity: ${table.capacity} Guests)`,
    });
    setShowQRModal(true);
  };

  const handleSendSongRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim() || !songArtist.trim()) {
      alert('Please provide both track title and artist.');
      return;
    }

    submitSongRequest({
      trackTitle: songTitle,
      artist: songArtist,
      requestedBy: `${user.name} (${requestType.toUpperCase()})`,
      tableNumber: selectedTable?.tableNumber || 'Floor',
      venueId: venue.id,
      djId: venue.residentDj,
      tipAmountKES: requestTip,
      isPaidPriority: requestTip > venue.songRequestBasePriceKES,
    });

    setShowSongModal(false);
    setSongTitle('');
    setSongArtist('');
    setDedicationNote('');
  };

  const categories = [
    'All',
    'Signature Cocktails',
    'Craft Beers & Ciders',
    'Premium Bottles',
    'Nyama Choma & Grills',
    'Platters',
    'Non-Alcoholic',
  ];

  const filteredMenuItems = venue.menu.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Venue Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {venues.map((v) => {
          const isSelected = v.id === venue.id;
          return (
            <button
              key={v.id}
              onClick={() => setSelectedVenue(v)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-red-600 border-red-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <GlassWater className="w-3.5 h-3.5" />
              <span>{v.name}</span>
              <span className="text-[10px] text-slate-300">({v.neighborhood})</span>
            </button>
          );
        })}
      </div>

      {/* Venue Hero Cover & Identity Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src={venue.coverImage}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Flash Offer Ribbon */}
          {venue.flashOffers.length > 0 && (
            <div className="absolute top-4 left-4 right-4 sm:right-auto bg-gradient-to-r from-amber-600 to-red-600 text-white px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-pulse">
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Flash Offer: {venue.flashOffers[0].title} — {venue.flashOffers[0].discountPct}% OFF!</span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  VERIFIED VENUE
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {venue.activeGuestsCount} Guests Checked-In
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">{venue.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                {venue.neighborhood}, {venue.county} County • Resident DJ: {venue.residentDj}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenTableQR(selectedTable || venue.tables[0])}
                className="py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 shadow-md backdrop-blur-md"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Table QR Token</span>
              </button>
              <button
                onClick={() => setShowSongModal(true)}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30"
              >
                <Music className="w-4 h-4" />
                <span>DJ Song Request</span>
              </button>
            </div>
          </div>
        </div>

        {/* Venue Sub-Navigation */}
        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {[
              { key: 'menu', label: 'Interactive Digital Menu' },
              { key: 'tables', label: 'VIP Tables & Floor Plan' },
              { key: 'shoutouts', label: 'Birthdays & Shoutouts' },
              { key: 'analytics', label: 'Venue Manager Dashboard' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveVenueTab(t.key as typeof activeVenueTab)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeVenueTab === t.key
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowBillSplitter(true)}
            className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold hover:text-amber-300"
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Table Bill</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE DIGITAL MENU */}
      {activeVenueTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      {item.isPopular && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                          HOT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                    {item.is18Plus && (
                      <span className="text-[9px] text-red-400 font-bold block mt-1">
                        18+ ID Required
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      {formatPrice(item.priceKES)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white text-xs font-bold text-slate-200 transition-all border border-slate-700"
                    >
                      + Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Table Cart & Order Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 h-fit space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Table Order
                </span>
                <h4 className="text-sm font-bold text-white">
                  Table: {selectedTable?.tableNumber || 'Main Floor'} ({selectedTable?.section || 'Lounge'})
                </h4>
              </div>
              <button
                onClick={() => selectedTable && handleOpenTableQR(selectedTable)}
                className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                View QR
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No items added yet. Click "+ Add to Order" from the menu.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {cart.map((c) => (
                  <div
                    key={c.item.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60"
                  >
                    <div>
                      <span className="font-bold text-white block truncate max-w-[150px]">
                        {c.item.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {c.count} × {formatPrice(c.item.priceKES)}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatPrice(c.item.priceKES * c.count)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-medium">Order Total:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {formatPrice(cartTotalKES)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    alert(`Order sent directly to ${venue.name} bar & kitchen for Table ${selectedTable?.tableNumber || 'T-01'}! Server will deliver shortly.`);
                    setCart([]);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30"
                >
                  Send Order to Table ({formatPrice(cartTotalKES)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VIP TABLES & FLOOR PLAN */}
      {activeVenueTab === 'tables' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Interactive Table Map & Reservations</h3>
              <p className="text-xs text-slate-400">
                Reserve your spot in advance with KenyaOne Escrow. Minimum spend offsets bottle service.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {venue.tables.map((t) => {
              const isSelected = selectedTable?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTable(t)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-red-500 shadow-lg shadow-red-600/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-white">{t.tableNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        t.status === 'available'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <span className="text-xs text-slate-300 block font-semibold">{t.section}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Capacity: Up to {t.capacity} Guests
                  </span>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Min Spend</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {formatPrice(t.minSpendKES)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTableQR(t);
                      }}
                      className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1 border border-slate-700"
                    >
                      <QrCode className="w-3 h-3 text-emerald-400" />
                      Table QR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BIRTHDAYS & SHOUTOUTS */}
      {activeVenueTab === 'shoutouts' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Cake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Live Club Dedication & Birthday Pyro</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Get MC shoutouts, sparklers brought to your table, and birthday fanfare announced live on the venue PA system.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Mic2 className="w-5 h-5 text-red-500" />
              <div>
                <span className="font-bold text-white block">Standard MC Shoutout Fee:</span>
                <span className="text-slate-400">Includes live LED screen name display</span>
              </div>
            </div>
            <span className="text-base font-black text-amber-400 font-mono">
              {formatPrice(venue.shoutoutPriceKES)}
            </span>
          </div>

          <button
            onClick={() => {
              setRequestType('birthday');
              setShowSongModal(true);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 font-black text-slate-950 text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Order Birthday Pyro & MC Dedication</span>
          </button>
        </div>
      )}

      {/* TAB 4: VENUE MANAGER DASHBOARD */}
      {activeVenueTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-semibold block">Total Sales Tonight</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {formatPrice(482000)}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
                ↑ 18% vs last Friday
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-semibold block">Table Occupancy</span>
              <span className="text-2xl font-black text-white font-mono mt-1 block">85%</span>
              <span className="text-[10px] text-slate-400 block mt-1">17 / 20 Tables Seated</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-semibold block">DJ Song Tips</span>
              <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">
                {formatPrice(34500)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">29 requests submitted</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-semibold block">Guest Satisfaction</span>
              <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">4.9 ★</span>
              <span className="text-[10px] text-slate-400 block mt-1">Based on 142 reviews</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white">Live Floor Orders & Queue Stream</h4>
            <div className="text-xs text-slate-400 space-y-2">
              <div className="p-3 bg-slate-950 rounded-xl flex items-center justify-between border border-slate-800/80">
                <div>
                  <span className="font-bold text-white">Table VIP-01:</span> 1x Don Julio Tequila (750ml) + 6 Mixers
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                  DELIVERED
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl flex items-center justify-between border border-slate-800/80">
                <div>
                  <span className="font-bold text-white">Table T-02:</span> 2x Mbuzi Choma Platters + 4 Tuskers
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold">
                  PREPARING IN GRILL
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Splitter Modal */}
      {showBillSplitter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Split className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Pulse Smart Bill Split</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Split Table Bill</h3>
            <p className="text-xs text-slate-400 mb-4">
              Instantly split across M-Pesa or KenyaOne balances with zero friction.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Total Table Amount (KES):</label>
                <input
                  type="number"
                  value={splitTotalKES}
                  onChange={(e) => setSplitTotalKES(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Number of Guests Splitting:</label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 6, 8].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSplitGuestsCount(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                        splitGuestsCount === n
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Each Person Pays</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {formatPrice(Math.round(splitTotalKES / splitGuestsCount))}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowBillSplitter(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Split payment request sent to all ${splitGuestsCount} phones via KenyaOne notifications!`);
                  setShowBillSplitter(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors"
              >
                Request Split
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Song / Shoutout Request Modal */}
      {showSongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <Music className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Direct to DJ {venue.residentDj}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              Request a Track or Shoutout
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Held in KenyaOne Escrow. If the DJ rejects your request, your tip is automatically refunded instantly.
            </p>

            <form onSubmit={handleSendSongRequest} className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Track Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Inauma, Arbantone Anthem, Kula Nje"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Artist Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Bien, Mejja, Xenia Manasseh"
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Priority Tip (KES):</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[500, 1000, 2000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setRequestTip(amt)}
                      className={`py-1.5 rounded-lg text-xs font-bold ${
                        requestTip === amt ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {formatPrice(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSongModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors shadow-lg shadow-red-600/30"
                >
                  Send Request ({formatPrice(requestTip)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal QR Modal */}
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title={qrModalData.title}
        subtitle={qrModalData.subtitle}
        code={qrModalData.code}
        type="table_qr"
        meta={[
          { label: 'Venue', value: venue.name },
          { label: 'County', value: venue.county },
          { label: 'Token Status', value: 'Active Table Session' },
          { label: 'Escrow Bill Sync', value: 'Enabled' },
        ]}
      />

      {/* 18+ Gate Modal */}
      <AgeGateModal
        isOpen={showAgeGate}
        onClose={() => setShowAgeGate(false)}
        reason="Bottles and alcoholic beverages can only be ordered by patrons aged 18 and older in compliance with Kenyan Law."
      />
    </div>
  );
};

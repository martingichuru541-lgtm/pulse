import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Star,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle,
  Briefcase,
  Music,
  Camera,
  Sliders,
  Send,
  ExternalLink,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { TalentPassport } from '../../types/pulse';

export const PulseTalentPassport: React.FC = () => {
  const { talents, formatPrice, user } = usePulse();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTalent, setSelectedTalent] = useState<TalentPassport>(talents[0]);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [bookingDate, setBookingDate] = useState<string>('2026-12-15');
  const [bookingHours, setBookingHours] = useState<number>(4);
  const [bookingVenue, setBookingVenue] = useState<string>('Carnivore Nairobi');

  const categories = [
    'All',
    'DJ',
    'Musician',
    'MC / Hypeman',
    'Standup Comedian',
    'Dancer / Choreographer',
    'Sound & Light Engineer',
    'Event Photographer',
  ];

  const filteredTalents = talents.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  const estimatedTotalKES = selectedTalent.hourlyRateKES * bookingHours;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Booking Inquiry & Escrow Hold of ${formatPrice(estimatedTotalKES)} sent to ${selectedTalent.artisticName}'s management! A contract with KECOBO rider compliance has been generated.`);
    setShowBookingModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Talent Passport Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-950 border border-amber-600/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>National Verified Talent Registry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Pulse Talent Passport
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Directly discover, verify, and contract professional Kenyan DJs, MCs, Musicians, Sound Engineers,
            and Photographers. Verified by KECOBO, PRISK, and MCSK accreditation.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Talent Cards Roster */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1">
            Verified Professionals ({filteredTalents.length})
          </span>
          <div className="space-y-2.5">
            {filteredTalents.map((t) => {
              const isSelected = selectedTalent.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTalent(t)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-600/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.artisticName}
                      className="w-12 h-12 rounded-full object-cover border border-amber-500/60 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{t.artisticName}</h4>
                        {t.verifiedBadge && (
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{t.category} • {t.county}</span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{t.rating} ({t.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-xs text-emerald-400 shrink-0">
                    {formatPrice(t.hourlyRateKES)}/hr
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center / Right Column: Comprehensive Talent Passport Dossier */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTalent.avatar}
                  alt={selectedTalent.artisticName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shadow-xl shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {selectedTalent.artisticName}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase border border-amber-500/40">
                      PASSPORT VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Legal Name: <strong className="text-slate-300">{selectedTalent.name}</strong> • {selectedTalent.category} ({selectedTalent.county} County)
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
                    <span className="text-emerald-400 font-semibold">{selectedTalent.availability}</span>
                    <span>•</span>
                    <span>{selectedTalent.performanceCount}+ Gigs Performed</span>
                    <span>•</span>
                    <span>{selectedTalent.experienceYears} Years Exp</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Talent ({formatPrice(selectedTalent.hourlyRateKES)}/hr)</span>
              </button>
            </div>

            {/* Bio & Specialty */}
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                Professional Bio & Technical Rider
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">{selectedTalent.bio}</p>

              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-0.5">Hardware / Equipment Specialty:</span>
                <span className="text-white font-semibold">{selectedTalent.equipmentSpecialty}</span>
              </div>
            </div>

            {/* Verified Industry Accreditations */}
            <div>
              <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Accredited Credentials & Board Verification</span>
              </h3>
              <div className="space-y-1.5">
                {selectedTalent.verifiedCredentials.map((cred, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{cred}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Tracks & Performances */}
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                Featured Highlights & Discography
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedTalent.featuredTracksOrClips.map((clip, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium flex items-center gap-1.5"
                  >
                    <Music className="w-3.5 h-3.5 text-purple-400" />
                    {clip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal with Escrow calculation */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Official Booking Contract (Escrow Protected)
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              Book {selectedTalent.artisticName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Funds are held safely in KenyaOne Escrow and only disbursed following performance verification.
            </p>

            <form onSubmit={handleConfirmBooking} className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Event Venue / Location:</label>
                <input
                  type="text"
                  value={bookingVenue}
                  onChange={(e) => setBookingVenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Event Date:</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Duration (Hours):</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={bookingHours}
                    onChange={(e) => setBookingHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center my-2">
                <span className="text-xs text-slate-400 block">Total Escrow Booking Fee</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {formatPrice(estimatedTotalKES)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ({bookingHours} hrs @ {formatPrice(selectedTalent.hourlyRateKES)}/hr)
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors shadow-lg shadow-amber-500/20"
                >
                  Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

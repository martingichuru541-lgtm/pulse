import React, { useState } from 'react';
import {
  Video,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  UploadCloud,
  CheckCircle,
  ArrowUpRight,
  Music,
  Share2,
  Gift,
  CreditCard,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { CreatorProfile, CreatorMerchItem } from '../../types/pulse';

export const PulseCreatorStudio: React.FC = () => {
  const { creators, formatPrice, user, updateUserBalance } = usePulse();

  const [activeTab, setActiveTab] = useState<'storefront' | 'subscriptions' | 'media' | 'earnings'>('storefront');
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile>(creators[0]);
  const [subscribedCreators, setSubscribedCreators] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [payoutAmount, setPayoutAmount] = useState<number>(25000);

  const handleSubscribe = (creator: CreatorProfile) => {
    if (user.balanceKES < creator.subscriptionPriceKES) {
      alert(`Insufficient funds. Subscription is ${formatPrice(creator.subscriptionPriceKES)}/month.`);
      return;
    }
    updateUserBalance(-creator.subscriptionPriceKES);
    setSubscribedCreators((prev) => [...prev, creator.id]);
    alert(`Subscribed to ${creator.name} VIP Fan Club! Exclusive vault and badges unlocked.`);
  };

  const handleBuyMerch = (item: CreatorMerchItem) => {
    if (user.balanceKES < item.priceKES) {
      alert(`Insufficient funds for this drop. Price: ${formatPrice(item.priceKES)}.`);
      return;
    }
    updateUserBalance(-item.priceKES);
    alert(`Order confirmed for "${item.title}"! Tracking token dispatched via KenyaOne Logistics.`);
  };

  const handleUploadMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim()) return;
    setIsUploadingMedia(true);
    setTimeout(() => {
      setIsUploadingMedia(false);
      alert(`"${newMediaTitle}" published to KenyaOne Pulse CDN & Creator Catalog!`);
      setNewMediaTitle('');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Creator Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={selectedCreator.avatar}
            alt={selectedCreator.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-red-500 shadow-xl shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{selectedCreator.name}</h1>
              <span className="text-xs text-slate-400 font-mono">{selectedCreator.handle}</span>
              <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 text-[10px] font-black uppercase inline-block mx-auto sm:mx-0">
                VERIFIED CREATOR
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {selectedCreator.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              {selectedCreator.genres.map((g, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"
                >
                  {g}
                </span>
              ))}
              <span className="text-xs text-slate-400 ml-2">
                Booking Rate: <strong className="text-emerald-400 font-mono">{formatPrice(selectedCreator.bookingRateKES)}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            {subscribedCreators.includes(selectedCreator.id) ? (
              <span className="py-2.5 px-4 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Subscribed Member
              </span>
            ) : (
              <button
                onClick={() => handleSubscribe(selectedCreator)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Subscribe ({formatPrice(selectedCreator.subscriptionPriceKES)}/mo)</span>
              </button>
            )}
          </div>
        </div>

        {/* Creator Navigation Tabs */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { key: 'storefront', label: 'Merchandise & Storefront' },
            { key: 'subscriptions', label: 'Fan Tiers & VIP Perks' },
            { key: 'media', label: 'Audio / Video Catalog' },
            { key: 'earnings', label: 'Creator Studio & Payouts' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === t.key
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: MERCHANDISE STOREFRONT */}
      {activeTab === 'storefront' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Official Artist Merchandise Drops</h3>
              <p className="text-xs text-slate-400">
                Direct-to-consumer apparel, caps, signed vinyl, and producer soundpacks.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Dispatched via KenyaOne Global Commerce
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {selectedCreator.merch.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-slate-200">
                      {item.category}
                    </div>
                    {item.diasporaEligible && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 text-[9px] font-bold">
                        DIASPORA SHIPPING
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                      In Stock • Dispatches in 24h
                    </span>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-base font-black text-white font-mono">
                      {formatPrice(item.priceKES)}
                    </span>
                    <button
                      onClick={() => handleBuyMerch(item)}
                      className="py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-red-600/30"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIPTION TIERS */}
      {activeTab === 'subscriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Bronze Supporter', priceKES: 350, perks: ['Supporter Chat Badge', 'Access to Fan Feed', 'Early Notice on Event Drops'] },
            { name: 'Silver VIP Tribe', priceKES: 650, perks: ['All Bronze Perks', 'Exclusive Monthly Unreleased Mixes', 'Behind-the-scenes Livestream Backstage Cam', '10% Off Merch'] },
            { name: 'Gold Patron / Maasai Tier', priceKES: 1500, perks: ['All Silver Perks', 'Priority DJ Song Request token every month', 'Annual VIP Meet & Greet Pass', 'Private Discord / Telegram Channel'] },
          ].map((tier, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-red-500/50 transition-all shadow-xl"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                  Tier 0{idx + 1}
                </span>
                <h4 className="text-base font-bold text-white mt-1">{tier.name}</h4>
                <div className="mt-3 mb-4">
                  <span className="text-2xl font-black text-white font-mono">
                    {formatPrice(tier.priceKES)}
                  </span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>

                <ul className="text-xs text-slate-300 space-y-2 mb-6">
                  {tier.perks.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  updateUserBalance(-tier.priceKES);
                  alert(`Joined ${tier.name}! Payment secured by KenyaOne Escrow.`);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white text-xs font-bold text-slate-200 transition-all border border-slate-700"
              >
                Join {tier.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MEDIA PUBLISHING */}
      {activeTab === 'media' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white">Audio & Video Publishing Studio</h3>
            <p className="text-xs text-slate-400">
              Upload uncompressed audio or live recordings to the KenyaOne Pulse high-speed CDN.
            </p>
          </div>

          <form onSubmit={handleUploadMedia} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Track / Episode Title:</label>
              <input
                type="text"
                placeholder="e.g. Wake & Bake Sunset Session Live"
                value={newMediaTitle}
                onChange={(e) => setNewMediaTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div className="p-6 border-2 border-dashed border-slate-700 hover:border-red-500 rounded-2xl text-center bg-slate-950/50 cursor-pointer transition-colors">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <span className="text-xs font-bold text-white block">
                Drag and drop MP3, WAV, FLAC or MP4 files here
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Up to 2GB per file • DRM & Copyright Fingerprinting automatically applied
              </span>
            </div>

            <button
              type="submit"
              disabled={isUploadingMedia}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold transition-colors"
            >
              {isUploadingMedia ? 'Encoding to KenyaOne CDN...' : 'Publish to Fan Vault'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: EARNINGS & PAYOUTS */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 block">Total Lifetime Earnings</span>
              <span className="text-2xl font-black text-white font-mono mt-1 block">
                {formatPrice(1840000)}
              </span>
              <span className="text-[11px] text-emerald-400 block mt-1">Across Tips, Merch & Subs</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 block">Pending Escrow Settlement</span>
              <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                {formatPrice(64200)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Clears in 24 hours</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 block">Available for Instant Payout</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {formatPrice(142800)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Direct to M-Pesa / Bank</span>
            </div>
          </div>

          {/* Request Payout Box */}
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white">Instant Creator Payout</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Payout Amount (KES):</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Destination:</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                  <option>M-Pesa Express (Safcom 254712***89) — Instant</option>
                  <option>KCB Bank Account (****4890) — Pesalink</option>
                  <option>Equity Bank (****1022) — Pesalink</option>
                  <option>Diaspora Swift Wire (USD) — 2 business days</option>
                </select>
              </div>

              <button
                onClick={() => {
                  alert(`Payout request of ${formatPrice(payoutAmount)} initiated! Funds will reflect in your account within 3 minutes.`);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold transition-all shadow-md shadow-emerald-600/30"
              >
                Withdraw {formatPrice(payoutAmount)} Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

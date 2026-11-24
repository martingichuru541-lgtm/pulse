import React, { useState } from 'react';
import {
  Globe2,
  Clock,
  CreditCard,
  Plane,
  Radio,
  ShoppingBag,
  Sparkles,
  Ticket,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';

export const PulseGlobal: React.FC = () => {
  const {
    streams,
    events,
    creators,
    setActiveTab,
    setActiveStream,
    currency,
    setCurrency,
    formatPrice,
    diasporaMode,
    setDiasporaMode,
    user,
  } = usePulse();

  const [selectedHub, setSelectedHub] = useState<string>('North America (US & Canada)');

  // Global timezones comparison for upcoming Kenyan concerts
  const timezones = [
    { city: 'Nairobi (EAT)', time: '21:00 (Today)', offset: 'UTC+3' },
    { city: 'London (GMT)', time: '18:00 (Today)', offset: 'UTC+0' },
    { city: 'New York (EST)', time: '13:00 (Today)', offset: 'UTC-5' },
    { city: 'Dallas / Texas (CST)', time: '12:00 (Today)', offset: 'UTC-6' },
    { city: 'Dubai (GST)', time: '22:00 (Today)', offset: 'UTC+4' },
    { city: 'Melbourne (AEDT)', time: '05:00 (Tomorrow)', offset: 'UTC+11' },
  ];

  const diasporaHubs = [
    'North America (US & Canada)',
    'United Kingdom & Europe',
    'Gulf & Middle East (Dubai/Qatar/Saudi)',
    'Australia & Asia-Pacific',
    'Pan-African Diaspora (SADC/ECOWAS)',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Global Diaspora Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-950 border border-sky-700/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2 border border-sky-500/30">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Pulse Global • Kenyan Diaspora Worldwide</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            CONNECT WITH HOME FROM ANYWHERE
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Direct access to Kenyan livestream concerts, digital festival passes, authentic artist merch
            with DHL/FedEx worldwide delivery, and cross-border tipping via Visa, Mastercard, and Apple Pay.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setDiasporaMode(!diasporaMode)}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                diasporaMode
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>Diaspora Mode: {diasporaMode ? 'ENABLED (Multi-Currency)' : 'DISABLED'}</span>
            </button>

            <span className="text-xs text-slate-400">
              Active Currency: <strong className="text-white font-mono">{currency}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Global Timezone Synchronizer Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-sky-400 tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Global Timezone Synchronization (Live Stream Sync)</span>
          </div>
          <span className="text-xs text-slate-400">All streams broadcast in Nairobi EAT</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {timezones.map((tz, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs ${
                tz.city.includes('Nairobi')
                  ? 'bg-red-950/30 border-red-500/50 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[11px] text-slate-400 block font-medium truncate">
                {tz.city}
              </span>
              <span className="font-mono font-bold text-white text-sm block mt-0.5">
                {tz.time}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{tz.offset}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diaspora Features Grid: Digital Event Passes & Global Merch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Digital Stream Passes for Global Audiences */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-white">Digital Livestream Passes</h3>
            </div>
            <span className="text-xs text-slate-400">Zero Geo-blocking</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Watch authorized Kenyan music concerts, comedy specials, and festival stages in pristine 1080p 60fps
            with live audience chat and diaspora badges.
          </p>

          <div className="space-y-3">
            {streams.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{s.title}</span>
                  <span className="text-[11px] text-slate-400">
                    {s.creatorName} • {s.category}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveStream(s);
                    setActiveTab('live');
                  }}
                  className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shrink-0 transition-colors"
                >
                  Watch Stream
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Global Merch & Cross-Border Delivery */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Diaspora Merch Shipping</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Worldwide DHL Tracked</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Support Kenyan musicians and creators by ordering official apparel, vinyl, and caps directly to your
            doorstep in the USA, UK, Canada, Germany, Australia, and the UAE.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full international payment methods accepted (Stripe, Visa, Mastercard, PayPal).</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Plane className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Duties & customs handled through KenyaOne Global Logistics.</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('creator_studio')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <span>Browse Creator Merch Drops</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

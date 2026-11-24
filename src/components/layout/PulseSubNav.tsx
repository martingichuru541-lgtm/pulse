import React from 'react';
import {
  Flame,
  Radio,
  GlassWater,
  Disc3,
  Ticket,
  Video,
  Users,
  MapPin,
  Award,
  Sparkles,
  Globe2,
  ShieldCheck,
} from 'lucide-react';
import { usePulse, PulseTab } from '../../context/PulseContext';

export const PulseSubNav: React.FC = () => {
  const { activeTab, setActiveTab, streams } = usePulse();

  const liveStreamsCount = streams.filter((s) => s.isLive).length;

  const navItems: { tab: PulseTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'home', label: 'Home', icon: <Flame className="w-4 h-4 text-amber-400" /> },
    {
      tab: 'live',
      label: 'Pulse Live',
      icon: <Radio className="w-4 h-4 text-red-500" />,
      badge: `${liveStreamsCount} LIVE`,
    },
    { tab: 'clubs', label: 'Clubs & Venues', icon: <GlassWater className="w-4 h-4 text-rose-400" /> },
    { tab: 'dj_booth', label: 'DJ Booth', icon: <Disc3 className="w-4 h-4 text-purple-400" /> },
    { tab: 'events', label: 'Events & Tickets', icon: <Ticket className="w-4 h-4 text-emerald-400" /> },
    { tab: 'creator_studio', label: 'Creator Studio', icon: <Video className="w-4 h-4 text-blue-400" /> },
    { tab: 'fan_communities', label: 'Fan Tribes', icon: <Users className="w-4 h-4 text-cyan-400" /> },
    { tab: 'culture', label: '47 Counties', icon: <MapPin className="w-4 h-4 text-green-500" /> },
    { tab: 'talent_passport', label: 'Talent Passport', icon: <Award className="w-4 h-4 text-yellow-400" /> },
    { tab: 'pulse_ai', label: 'Pulse AI', icon: <Sparkles className="w-4 h-4 text-indigo-400" />, badge: 'SMART' },
    { tab: 'global', label: 'Diaspora Hub', icon: <Globe2 className="w-4 h-4 text-sky-400" /> },
    { tab: 'admin', label: 'Admin Command', icon: <ShieldCheck className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 sticky top-[73px] sm:top-[69px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                      item.badge.includes('LIVE')
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

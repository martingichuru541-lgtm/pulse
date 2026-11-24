import React, { useState } from 'react';
import {
  Globe,
  Bell,
  Wallet,
  Shield,
  UserCheck,
  ChevronDown,
  Sparkles,
  Layers,
  Radio,
  Check,
  ExternalLink,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { Currency, UserRole } from '../../types/pulse';

export const KenyaOneTopBar: React.FC = () => {
  const {
    user,
    switchRole,
    currency,
    setCurrency,
    formatPrice,
    diasporaMode,
    setDiasporaMode,
    notifications,
    markNotificationRead,
    is18PlusVerified,
    verifyAge,
    updateUserBalance,
  } = usePulse();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: { key: UserRole; label: string; desc: string; icon: string }[] = [
    { key: 'fan', label: 'Ordinary Fan / Attendee', desc: 'Discover events, watch livestreams, order at club tables & tip artists', icon: '🎉' },
    { key: 'creator', label: 'Content Creator / Artist', desc: 'Stream live, sell merch, manage subscriptions & withdraw earnings', icon: '🎤' },
    { key: 'dj', label: 'Resident / Guest DJ', desc: 'DJ Booth deck, song request queue, paid shoutouts & auto-refunds', icon: '🎧' },
    { key: 'venue_owner', label: 'Club / Venue Owner', desc: 'Table QR management, interactive menus, flash sales & floor analytics', icon: '🍸' },
    { key: 'organizer', label: 'Event Organizer / Promoter', desc: 'Ticket tiers, QR entrance validator, attendee rosters & payouts', icon: '🎟️' },
    { key: 'admin', label: 'Pulse National Admin', desc: 'Content moderation, venue approvals, escrow monitoring & fraud logs', icon: '🛡️' },
  ];

  const departments = [
    { name: 'PULSE', active: true, desc: 'Entertainment, Nightlife, Live Streaming & Culture', tag: 'NEW DEPARTMENT' },
    { name: 'MARKETPLACE', active: false, desc: 'KenyaOne E-Commerce, Artisans & National Goods', tag: 'PRESERVED' },
    { name: 'SERVICES', active: false, desc: 'Government Services, Utilities & Logistics', tag: 'PRESERVED' },
    { name: 'MEDIA', active: false, desc: 'National News, Broadcasters & Podcasting', tag: 'PRESERVED' },
    { name: 'BUSINESS', active: false, desc: 'Enterprise Solutions, Trade & Escrow', tag: 'PRESERVED' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-white shadow-xl">
      {/* Top Banner: KenyaOne Unified Department Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {/* Kenya Flag Inspired Tricolor Dot */}
            <span className="flex h-2 w-4 rounded-xs overflow-hidden border border-slate-700">
              <span className="w-1/3 bg-black"></span>
              <span className="w-1/3 bg-red-600"></span>
              <span className="w-1/3 bg-emerald-600"></span>
            </span>
            <span className="font-extrabold tracking-wider text-slate-300">KENYAONE ECOSYSTEM</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] no-scrollbar">
            {departments.map((dept) => (
              <button
                key={dept.name}
                onClick={() => {
                  if (!dept.active) {
                    setShowDeptModal(dept.name);
                  }
                }}
                className={`px-2 py-0.5 rounded transition-all whitespace-nowrap flex items-center gap-1 ${
                  dept.active
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-black shadow-sm shadow-red-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{dept.name}</span>
                {dept.active ? (
                  <span className="text-[9px] bg-red-950/80 px-1 py-0.2 rounded text-red-200 uppercase font-bold">
                    ACTIVE
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Diaspora Toggle */}
          <button
            onClick={() => setDiasporaMode(!diasporaMode)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
              diasporaMode
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
            title="Toggle Diaspora Mode for international Kenyans"
          >
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">Diaspora Mode:</span>
            <span>{diasporaMode ? 'ON (Global EAT)' : 'OFF'}</span>
          </button>

          {/* 18+ Verification Tag */}
          {is18PlusVerified ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold hidden md:inline-flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              18+ Verified
            </span>
          ) : (
            <button
              onClick={verifyAge}
              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 font-semibold hover:bg-amber-900"
            >
              Verify 18+
            </button>
          )}
        </div>
      </div>

      {/* Main Department Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Department Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-red-600/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                <div className="absolute inset-0 bg-red-500/10 mix-blend-screen"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-serif">
                  KENYA<span className="text-red-500">ONE</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-black uppercase rounded bg-red-600 text-white tracking-widest shadow-sm">
                  PULSE
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wide hidden sm:block">
                THE HEARTBEAT OF KENYA. LIVE EVERYWHERE.
              </p>
            </div>
          </div>
        </div>

        {/* Right Tools: Currency, Wallet, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
            {(['KES', 'USD', 'GBP', 'EUR'] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  currency === curr
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* KenyaOne Escrow Wallet Chip */}
          <button
            onClick={() => setShowWalletModal(true)}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 transition-all shadow-sm"
            title="KenyaOne Escrow Wallet"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-slate-400 font-normal">Wallet:</span>
            <span className="text-emerald-400 font-mono font-bold">{formatPrice(user.balanceKES)}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-bold text-white">KenyaOne Notifications</span>
                  </div>
                  <span className="text-xs text-slate-400">{notifications.length} alerts</span>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                        n.read
                          ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Persona Switcher (Crucial for testing all 6 stakeholder dashboards) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 transition-all shadow-sm"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-600"
              />
              <div className="text-left hidden md:block">
                <span className="block text-[11px] font-bold text-white leading-tight truncate max-w-[100px]">
                  {user.name}
                </span>
                <span className="block text-[9px] text-red-400 uppercase font-semibold">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Persona Switcher Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 border-b border-slate-800 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Pulse Persona Simulator
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-bold border border-red-800/40">
                      KenyaOne Single Sign-On
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Switch role to experience creator, venue, DJ, promoter, or admin control dashboards:
                  </p>
                </div>

                <div className="space-y-1">
                  {roles.map((r) => {
                    const isSelected = user.role === r.key;
                    return (
                      <button
                        key={r.key}
                        onClick={() => {
                          switchRole(r.key);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-red-600/20 border border-red-500/50 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-lg shrink-0 mt-0.5">{r.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">{r.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preservation Modal for other KenyaOne Departments */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-200">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Shield className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">KenyaOne Ecosystem Preservation</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Navigating to KenyaOne {showDeptModal}
            </h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              KenyaOne {showDeptModal} is fully preserved and operates as part of the unified KenyaOne account and backend infrastructure.
              PULSE is the dedicated live entertainment, nightlife, and creator-economy department.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1 mb-6">
              <div className="flex items-center justify-between">
                <span>Unified Account ID:</span>
                <span className="font-mono text-white">{user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shared Escrow Wallet:</span>
                <span className="font-mono text-emerald-400">{formatPrice(user.balanceKES)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Connected Ecosystem:</span>
                <span className="text-slate-300 font-semibold">Active & Online</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeptModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-colors"
              >
                Stay in Pulse
              </button>
              <button
                onClick={() => {
                  alert(`Switched to KenyaOne ${showDeptModal}. All account data and wallet balances remain seamlessly synced.`);
                  setShowDeptModal(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch {showDeptModal}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Top-up Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-200">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Wallet className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">KenyaOne Escrow Wallet</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Account Balance & Top-Up</h3>
            <p className="text-xs text-slate-400 mb-4">
              Integrated with M-Pesa Express, Kenyan Banking (Pesalink) and International Cards for Diaspora.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center mb-5">
              <span className="text-xs text-slate-400 block mb-1">Available Escrow Balance</span>
              <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                {formatPrice(user.balanceKES)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Zero fees on ticket purchases & verified DJ song requests
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold text-slate-300 block">Instant Top-Up (Simulation):</span>
              <div className="grid grid-cols-3 gap-2">
                {[1000, 3000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      updateUserBalance(amt);
                      alert(`Added ${formatPrice(amt)} to your KenyaOne Escrow Wallet via M-Pesa Express!`);
                      setShowWalletModal(false);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white border border-slate-700 text-xs font-bold text-slate-200 transition-all text-center"
                  >
                    +{formatPrice(amt)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowWalletModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

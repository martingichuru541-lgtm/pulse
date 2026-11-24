/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PulseProvider, usePulse } from './context/PulseContext';
import { KenyaOneTopBar } from './components/layout/KenyaOneTopBar';
import { PulseSubNav } from './components/layout/PulseSubNav';
import { PulseHome } from './components/home/PulseHome';
import { PulseLive } from './components/live/PulseLive';
import { PulseClubs } from './components/clubs/PulseClubs';
import { PulseDjBooth } from './components/dj/PulseDjBooth';
import { PulseEvents } from './components/events/PulseEvents';
import { PulseCreatorStudio } from './components/creator/PulseCreatorStudio';
import { PulseFanCommunities } from './components/communities/PulseFanCommunities';
import { PulseCulture } from './components/culture/PulseCulture';
import { PulseTalentPassport } from './components/talent/PulseTalentPassport';
import { PulseAI } from './components/ai/PulseAI';
import { PulseGlobal } from './components/global/PulseGlobal';
import { PulseAdmin } from './components/admin/PulseAdmin';
import { Shield, Radio, Heart, Compass, MapPin, Globe, Sparkles } from 'lucide-react';

const PulseMainContent: React.FC = () => {
  const { activeTab, setActiveTab } = usePulse();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {activeTab === 'home' && <PulseHome />}
      {activeTab === 'live' && <PulseLive />}
      {activeTab === 'clubs' && <PulseClubs />}
      {activeTab === 'dj_booth' && <PulseDjBooth />}
      {activeTab === 'events' && <PulseEvents />}
      {activeTab === 'creator_studio' && <PulseCreatorStudio />}
      {activeTab === 'fan_communities' && <PulseFanCommunities />}
      {activeTab === 'culture' && <PulseCulture />}
      {activeTab === 'talent_passport' && <PulseTalentPassport />}
      {activeTab === 'pulse_ai' && <PulseAI />}
      {activeTab === 'global' && <PulseGlobal />}
      {activeTab === 'admin' && <PulseAdmin />}
    </main>
  );
};

export default function App() {
  return (
    <PulseProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
        {/* KenyaOne Global Top Bar with Unified Ecosystem Header */}
        <KenyaOneTopBar />

        {/* Pulse Department Sub-Navigation */}
        <PulseSubNav />

        {/* Main Content Area */}
        <div className="flex-1">
          <PulseMainContent />
        </div>

        {/* Ecosystem Preservation & Legal Compliance Footer */}
        <footer className="bg-slate-950 border-t border-slate-900 mt-16 text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Col */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <span className="text-lg font-black text-white font-serif tracking-tight">
                    KENYA<span className="text-red-500">ONE</span> PULSE
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Heartbeat of Kenya. Live Everywhere. The unified national entertainment,
                  nightlife, live-streaming, events, creator-economy, and 47-county cultural ecosystem.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>KenyaOne Escrow Verified Platform</span>
                </div>
              </div>

              {/* Ecosystem Departments */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-white tracking-wider block">
                  KenyaOne Departments
                </span>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="text-red-400 font-bold">★ Pulse (Entertainment & Culture)</li>
                  <li className="hover:text-slate-200 cursor-pointer">KenyaOne Marketplace (Preserved)</li>
                  <li className="hover:text-slate-200 cursor-pointer">KenyaOne Services (Preserved)</li>
                  <li className="hover:text-slate-200 cursor-pointer">KenyaOne Media (Preserved)</li>
                  <li className="hover:text-slate-200 cursor-pointer">KenyaOne Business Hub (Preserved)</li>
                </ul>
              </div>

              {/* Pulse Features */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-white tracking-wider block">
                  Pulse Ecosystem
                </span>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li>Verified Venue Profiles & Table QR Codes</li>
                  <li>DJ Booth Control Center & Live Song Requests</li>
                  <li>QR Ticket Validation & Anti-Scalper Escrow</li>
                  <li>Creator Studio & Merchandise Storefronts</li>
                  <li>47 Counties Cultural Discovery (English & Swahili)</li>
                  <li>Diaspora Stream Passes & Worldwide Shipping</li>
                </ul>
              </div>

              {/* Regulatory & Safety */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-white tracking-wider block">
                  Safety, Law & Compliance
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Strict 18+ age verification enforced for nightlife and licensed venue bookings under the
                  Alcoholic Drinks Control Act of Kenya.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Music public performance licences certified in accordance with KECOBO, MCSK, and PRISK standards.
                </p>
                <div className="pt-1 text-[11px] text-slate-500">
                  Republic of Kenya • National Entertainment Framework
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
              <p>© 2026 KenyaOne Ecosystem. All rights reserved. KenyaOne Pulse is a registered national department.</p>
              <div className="flex items-center gap-4">
                <span>Privacy & Data Protection</span>
                <span>•</span>
                <span>Terms of Service</span>
                <span>•</span>
                <span>Escrow Refund Policy</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PulseProvider>
  );
}

import React, { useState } from 'react';
import {
  Disc3,
  Play,
  Pause,
  Sliders,
  DollarSign,
  Clock,
  Check,
  X,
  RotateCcw,
  Volume2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Flame,
  Radio,
  Music2,
  Info,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { SongRequest } from '../../types/pulse';

export const PulseDjBooth: React.FC = () => {
  const { songRequests, handleSongRequestStatus, formatPrice, user } = usePulse();

  // DJ Deck Simulator State
  const [isPlayingDeckA, setIsPlayingDeckA] = useState<boolean>(true);
  const [isPlayingDeckB, setIsPlayingDeckB] = useState<boolean>(false);
  const [bpmDeckA, setBpmDeckA] = useState<number>(112); // Afro-House / Amapiano
  const [bpmDeckB, setBpmDeckB] = useState<number>(128);
  const [crossfader, setCrossfader] = useState<number>(50); // 0 = Deck A, 100 = Deck B

  // DJ Settings
  const [baseRequestFeeKES, setBaseRequestFeeKES] = useState<number>(500);
  const [priorityRequestFeeKES, setPriorityRequestFeeKES] = useState<number>(1500);
  const [isAcceptingRequests, setIsAcceptingRequests] = useState<boolean>(true);

  // Filter requests
  const pendingRequests = songRequests.filter((r) => r.status === 'pending');
  const activeQueue = songRequests.filter((r) => r.status === 'accepted' || r.status === 'playing');
  const historyRequests = songRequests.filter((r) => r.status === 'rejected' || r.status === 'refunded');

  const totalEarningsTodayKES = songRequests
    .filter((r) => r.status === 'accepted' || r.status === 'playing')
    .reduce((acc, r) => acc + r.tipAmountKES, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Disc3 className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">PULSE DJ BOOTH & PRO CONSOLE</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                LIVE ON STAGE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Venue: <span className="text-slate-200 font-semibold">The Alchemist Westlands</span> • DJ: <span className="text-white font-semibold">DJ Grauchi</span>
            </p>
          </div>
        </div>

        {/* Live Earnings Ticker */}
        <div className="flex items-center gap-4 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Tonight's Song Tips
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              {formatPrice(totalEarningsTodayKES)}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Queue Status
            </span>
            <span className="text-xs font-bold text-amber-400">
              {pendingRequests.length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Turntable Twin-Deck & Audio Mixer Simulator */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Dual-Deck Audio & Transition Controller
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Pioneer CDJ / Rekordbox Synced</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deck A */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px]">
                DECK A (MASTER)
              </span>
              <span className="font-mono font-bold text-amber-400">{bpmDeckA} BPM</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-red-500 flex items-center justify-center relative">
                <Disc3
                  className={`w-10 h-10 text-red-500 ${isPlayingDeckA ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '2s' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  Mejja — Kula Nje (Amapiano Bootleg)
                </span>
                <span className="text-[11px] text-slate-400">Time Remaining: 02:14</span>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-red-500 w-[62%]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsPlayingDeckA(!isPlayingDeckA)}
                className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                {isPlayingDeckA ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isPlayingDeckA ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={() => setBpmDeckA((b) => b + 1)}
                className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                +1 BPM
              </button>
              <button
                onClick={() => setBpmDeckA((b) => b - 1)}
                className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                -1 BPM
              </button>
            </div>
          </div>

          {/* Deck B */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-extrabold text-[10px]">
                DECK B (CUE)
              </span>
              <span className="font-mono font-bold text-purple-400">{bpmDeckB} BPM</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-purple-500 flex items-center justify-center relative">
                <Disc3
                  className={`w-10 h-10 text-purple-500 ${isPlayingDeckB ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '2s' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  Bien — Inauma (Live Sunset Remix)
                </span>
                <span className="text-[11px] text-slate-400">Ready to drop on cue</span>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-purple-500 w-[15%]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsPlayingDeckB(!isPlayingDeckB)}
                className="py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                {isPlayingDeckB ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isPlayingDeckB ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={() => setBpmDeckB((b) => b + 1)}
                className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                +1 BPM
              </button>
              <button
                onClick={() => setBpmDeckB((b) => b - 1)}
                className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                -1 BPM
              </button>
            </div>
          </div>
        </div>

        {/* Mixer Crossfader */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold text-red-400">DECK A (MASTER)</span>
            <span className="font-mono text-white">Crossfader: {crossfader}%</span>
            <span className="font-bold text-purple-400">DECK B (CUE)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={crossfader}
            onChange={(e) => setCrossfader(Number(e.target.value))}
            className="w-full accent-red-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Incoming Song Requests Management & Auto-Refund Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Incoming Song Requests</span>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold">
                  {pendingRequests.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Accept into your mix queue or reject with automatic refund to patron.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAcceptingRequests(!isAcceptingRequests)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  isAcceptingRequests
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {isAcceptingRequests ? 'Queue OPEN' : 'Queue PAUSED'}
              </button>
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No pending requests right now. Patrons can submit requests from their table menu.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-white text-sm">{req.trackTitle}</span>
                      <span className="text-xs text-slate-400 font-semibold">• {req.artist}</span>
                      {req.isPaidPriority && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                          PRIORITY
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Requested by: <strong className="text-slate-300">{req.requestedBy}</strong></span>
                      <span>Table: <strong className="text-amber-400">{req.tableNumber || 'Floor'}</strong></span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {formatPrice(req.tipAmountKES)} Tip
                      </span>
                    </div>
                  </div>

                  {/* DJ Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleSongRequestStatus(req.id, 'accepted')}
                      className="flex-1 sm:flex-none py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() =>
                        handleSongRequestStatus(
                          req.id,
                          'rejected',
                          'Tempo/vibe mismatch for current Amapiano set. Money refunded.'
                        )
                      }
                      className="flex-1 sm:flex-none py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject & Refund</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Queue & Legal Compliance Notice */}
        <div className="space-y-4">
          {/* Active Queue Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Music2 className="w-4 h-4 text-purple-400" />
              <span>Accepted Playlist Queue ({activeQueue.length})</span>
            </h4>

            <div className="space-y-2 text-xs">
              {activeQueue.map((q) => (
                <div
                  key={q.id}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">{q.trackTitle}</span>
                    <span className="text-[11px] text-slate-400">{q.artist}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      q.status === 'playing'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Compliance Notice */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Copyright & Performance Licences</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              KenyaOne Pulse does not distribute unauthorized audio files or rip tracks. DJs must perform
              using legitimately licensed audio libraries with venue KECOBO / MCSK / PRISK public performance permits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

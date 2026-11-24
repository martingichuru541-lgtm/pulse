import React, { useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Flame,
  Send,
  Gift,
  Share2,
  Users,
  Shield,
  Clock,
  Sparkles,
  BarChart2,
  Flag,
  Calendar,
  Lock,
  CheckCircle,
  Eye,
  Radio,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { Livestream } from '../../types/pulse';

export const PulseLive: React.FC = () => {
  const {
    streams,
    activeStream,
    setActiveStream,
    chatMessages,
    sendChatMessage,
    sendTipToStream,
    formatPrice,
    user,
  } = usePulse();

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [showTipModal, setShowTipModal] = useState<boolean>(false);
  const [tipCustomAmount, setTipCustomAmount] = useState<number>(500);
  const [tipMessage, setTipMessage] = useState<string>('');
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);

  // Poll state
  const [pollVoted, setPollVoted] = useState<number | null>(null);
  const [pollOptions, setPollOptions] = useState([
    { id: 1, text: 'Amapiano Wave (Kabza & Maphorisa Mix)', votes: 842 },
    { id: 2, text: 'Arbantone Bangers (Genge New Wave)', votes: 1205 },
    { id: 3, text: 'Throwback Kapuka & Early 2000s Genge', votes: 610 },
  ]);

  // Creator Moderation Mode (active if role is creator or admin)
  const isModerator = user.role === 'creator' || user.role === 'admin' || user.role === 'dj';
  const [slowModeEnabled, setSlowModeEnabled] = useState<boolean>(false);

  const currentStream = activeStream || streams[0];

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  const handleVote = (optionId: number) => {
    if (pollVoted !== null) return;
    setPollVoted(optionId);
    setPollOptions((prev) =>
      prev.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt))
    );
  };

  const totalPollVotes = pollOptions.reduce((acc, opt) => acc + opt.votes, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Stream Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {streams.map((s) => {
          const isSelected = s.id === currentStream.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStream(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-red-600 border-red-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>{s.creatorName}</span>
              <span className="text-[10px] text-slate-300 font-mono">({s.viewerCount.toLocaleString()})</span>
            </button>
          );
        })}
      </div>

      {/* Main Broadcast Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Video Player & Controls & Stream Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video shadow-2xl flex items-center justify-center">
            {/* Visual Stream Simulation (Video/Cover + Animated Canvas Visualizer) */}
            <img
              src={currentStream.coverImage}
              alt={currentStream.title}
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                isPlaying ? 'opacity-85' : 'opacity-40'
              }`}
            />

            {/* Pulsing Audio Visualizer Overlay */}
            {isPlaying && (
              <div className="absolute inset-x-0 bottom-14 h-24 flex items-end justify-center gap-1.5 px-6 pointer-events-none opacity-65">
                {[40, 65, 85, 30, 95, 70, 50, 90, 45, 80, 60, 100, 75, 45, 90, 65, 85, 55, 70].map(
                  (height, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 rounded-t-full bg-gradient-to-t from-red-600 via-rose-500 to-amber-400 animate-pulse"
                      style={{
                        height: `${(height + (idx % 3) * 15) % 100}%`,
                        animationDuration: `${0.4 + (idx % 5) * 0.15}s`,
                      }}
                    />
                  )
                )}
              </div>
            )}

            {/* Floating Reactions on Canvas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {floatingReactions.map((r) => (
                <div
                  key={r.id}
                  className="absolute bottom-8 text-2xl animate-float-up"
                  style={{ left: `${r.x}%` }}
                >
                  {r.emoji}
                </div>
              ))}
            </div>

            {/* Top Badges: Live Tag + Viewer Count + Scalable CDN badge */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE NOW
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  {currentStream.viewerCount.toLocaleString()} viewers
                </span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700 hidden sm:inline-block">
                  KenyaOne Edge HLS / WebRTC
                </span>
              </div>
            </div>

            {/* Bottom Stream Player Control Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="text-xs text-slate-300 font-medium hidden sm:block">
                  <span className="text-white font-bold">{currentStream.category}</span> — {currentStream.county}
                </div>
              </div>

              {/* Instant Emoji Reaction Emitters */}
              <div className="flex items-center gap-1.5">
                {['🔥', '🇰🇪', '❤️', '👏', '💃'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-base hover:scale-125 transition-transform"
                    title={`Send ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stream Header & Creator Action Row */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={currentStream.creatorAvatar}
                alt={currentStream.creatorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
              />
              <div>
                <h1 className="text-base sm:text-lg font-black text-white leading-tight">
                  {currentStream.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-300">
                    {currentStream.creatorName}
                  </span>
                  <span className="text-xs text-slate-500">{currentStream.creatorHandle}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 font-bold border border-red-800/40">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setShowTipModal(true)}
                className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
              >
                <Gift className="w-4 h-4" />
                <span>Tip Creator</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Stream share link copied to clipboard!');
                }}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Interactive Audience Poll */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Live Audience Poll
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {totalPollVotes.toLocaleString()} votes cast
              </span>
            </div>

            <h4 className="text-sm font-bold text-white">
              What genre should DJ Grauchi transition into at midnight?
            </h4>

            <div className="space-y-2">
              {pollOptions.map((opt) => {
                const percentage = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                const isSelected = pollVoted === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(opt.id)}
                    disabled={pollVoted !== null}
                    className={`w-full text-left p-3 rounded-xl border relative overflow-hidden transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 text-white'
                        : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    {/* Progress Fill */}
                    <div
                      className="absolute inset-y-0 left-0 bg-emerald-600/20 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between text-xs">
                      <span className="font-semibold flex items-center gap-2">
                        {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {opt.text}
                      </span>
                      <span className="font-mono font-bold text-slate-400">
                        {percentage}% ({opt.votes})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Fan Tipping Challenge Banner */}
          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-800/40 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-700/60 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
                  Live Stream Milestone Challenge
                </span>
                <p className="text-xs font-bold text-white">
                  Unlock Unreleased Arbantone Cypher Track: KES 78,500 / KES 100,000 Reached
                </p>
                <div className="w-48 sm:w-64 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[78%]" />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowTipModal(true)}
              className="py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 transition-colors"
            >
              Contribute KES 500
            </button>
          </div>
        </div>

        {/* Right Column: Live Chat, Tip Ticker & Moderation Controls */}
        <div className="flex flex-col h-[640px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Chat Header */}
          <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Live Stream Chat
              </span>
            </div>

            {isModerator && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 font-bold border border-red-800/40">
                MODERATOR ACTIVE
              </span>
            )}
          </div>

          {/* Moderator Quick Toolbar */}
          {isModerator && (
            <div className="px-3 py-1.5 bg-slate-800/80 border-b border-slate-700 text-[11px] flex items-center justify-between text-slate-300">
              <span>Creator Tools:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSlowModeEnabled(!slowModeEnabled)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    slowModeEnabled ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {slowModeEnabled ? 'Slow Mode ON' : 'Slow Mode OFF'}
                </button>
                <button
                  onClick={() => alert('Chat history cleared by Moderator.')}
                  className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-[10px]"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Feed */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-xl transition-all ${
                  msg.tipAmountKES
                    ? 'bg-amber-950/40 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/40 hover:bg-slate-950/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="font-bold text-white text-[11px] truncate max-w-[120px]">
                      {msg.sender}
                    </span>
                    {msg.badge && (
                      <span
                        className={`text-[9px] font-black px-1 rounded uppercase ${
                          msg.badge === 'VIP'
                            ? 'bg-purple-900 text-purple-300'
                            : msg.badge === 'TOP TIPPER'
                            ? 'bg-amber-500 text-slate-950'
                            : msg.badge === 'DIASPORA'
                            ? 'bg-sky-900 text-sky-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {msg.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>

                {msg.tipAmountKES && (
                  <div className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                    <Gift className="w-3 h-3 text-amber-400" />
                    Sent {formatPrice(msg.tipAmountKES)} Tip!
                  </div>
                )}

                <p className="text-slate-300 leading-relaxed text-[11px] break-words">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Chat Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendChatMessage(chatInput);
              setChatInput('');
            }}
            className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Join the conversation (Sheng / English)..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white transition-colors"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Tip Creator Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Gift className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Support Kenyan Artists & Creators
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              Send Tip to {currentStream.creatorName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Tips go directly to creator's KenyaOne verified account via Escrow.
            </p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[200, 500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTipCustomAmount(amt)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                    tipCustomAmount === amt
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {formatPrice(amt)}
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Custom Amount (KES):</label>
                <input
                  type="number"
                  value={tipCustomAmount}
                  onChange={(e) => setTipCustomAmount(Number(e.target.value))}
                  min={50}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Shoutout Message (Optional):</label>
                <input
                  type="text"
                  value={tipMessage}
                  onChange={(e) => setTipMessage(e.target.value)}
                  placeholder="e.g. Hiyo mix inabamba sana! Greetings from Nakuru"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowTipModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sendTipToStream(tipCustomAmount, tipMessage);
                  setShowTipModal(false);
                  setTipMessage('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors shadow-lg shadow-amber-500/20"
              >
                Send {formatPrice(tipCustomAmount)} Tip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

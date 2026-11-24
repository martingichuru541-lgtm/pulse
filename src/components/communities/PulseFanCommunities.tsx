import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Sparkles,
  Calendar,
  Lock,
  Send,
  CheckCircle,
  PlusCircle,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { FanCommunity } from '../../types/pulse';

export const PulseFanCommunities: React.FC = () => {
  const { communities, user } = usePulse();

  const [selectedCommunity, setSelectedCommunity] = useState<FanCommunity>(communities[0]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([communities[0].id]);
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      author: 'Shem Odongo (Buruburu)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      text: 'Who has the line-up for the Eastlands Cypher this Saturday in Buruburu? Drop the tracks you want included! 🇰🇪🔥',
      timestamp: '2 hours ago',
      likes: 412,
      isLiked: false,
    },
    {
      id: 'p2',
      author: 'Faith Muthoni (Westlands)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      text: 'The bass drop on that unreleased Arbantone track during yesterday’s stream blew my car speakers. We need the full audio link!',
      timestamp: '5 hours ago',
      likes: 289,
      isLiked: true,
    },
  ]);
  const [newPostText, setNewPostText] = useState('');

  const handleToggleJoin = (commId: string) => {
    if (joinedCommunities.includes(commId)) {
      setJoinedCommunities((prev) => prev.filter((id) => id !== commId));
    } else {
      setJoinedCommunities((prev) => [...prev, commId]);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newP = {
      id: `p_${Date.now()}`,
      author: `${user.name} (${user.county})`,
      avatar: user.avatar,
      text: newPostText,
      timestamp: 'Just now',
      likes: 1,
      isLiked: true,
    };
    setPosts([newP, ...posts]);
    setNewPostText('');
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
          : p
      )
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Communities Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">PULSE FAN TRIBES & COMMUNITIES</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect with fellow music lovers, exclusive artist drop notifications, and secret underground jam sessions.
            </p>
          </div>
        </div>

        <span className="text-xs text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/60 px-3 py-1.5 rounded-xl">
          {joinedCommunities.length} Active Tribes Joined
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Community Selector Cards */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1">
            Explore Fan Tribes
          </span>
          {communities.map((c) => {
            const isSelected = selectedCommunity.id === c.id;
            const isJoined = joinedCommunities.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCommunity(c)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-600/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm">{c.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {(c.memberCount / 1000).toFixed(1)}k members
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{c.description}</p>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-semibold text-[11px]">{c.tier}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleJoin(c.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      isJoined
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-200 hover:bg-cyan-600 hover:text-white'
                    }`}
                  >
                    {isJoined ? 'Joined' : '+ Join Tribe'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center / Right Column: Active Community Discussion Feed & Fan Events */}
        <div className="lg:col-span-2 space-y-4">
          {/* Community Banner Card */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                  Official Community Hub
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{selectedCommunity.name}</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedCommunity.description}</p>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs text-slate-400 block">Upcoming Meetup</span>
                <span className="text-xs font-bold text-amber-400">
                  {selectedCommunity.upcomingFanMeetup}
                </span>
              </div>
            </div>
          </div>

          {/* Create Post in Community */}
          <form
            onSubmit={handleCreatePost}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
          >
            <textarea
              rows={2}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={`Share music discoveries or meetup ideas in ${selectedCommunity.name}...`}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Posting as <strong className="text-white">{user.name}</strong>
              </span>
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="py-1.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Post</span>
              </button>
            </div>
          </form>

          {/* Posts Feed */}
          <div className="space-y-3">
            {posts.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.avatar}
                      alt={p.author}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <span className="font-bold text-white text-xs block">{p.author}</span>
                      <span className="text-[10px] text-slate-500">{p.timestamp}</span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                    Verified Fan
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">{p.text}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={() => toggleLike(p.id)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors ${
                      p.isLiked ? 'text-rose-500' : 'hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${p.isLiked ? 'fill-rose-500' : ''}`} />
                    <span>{p.likes} Likes</span>
                  </button>

                  <button
                    onClick={() => alert('Reply thread opened')}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Discuss</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

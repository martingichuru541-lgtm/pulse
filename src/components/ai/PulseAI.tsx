import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Calculator,
  Users,
  Megaphone,
  Compass,
  Briefcase,
  Store,
  Lightbulb,
  CheckCircle,
  Clock,
  Radio,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { PulseAiRequest } from '../../server/pulseAiService';

export const PulseAI: React.FC = () => {
  const { formatPrice, user } = usePulse();

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [activeTask, setActiveTask] = useState<PulseAiRequest['task']>('plan_event_budget');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<
    { role: 'user' | 'assistant'; content: string; actions?: string[] }[]
  >([
    {
      role: 'assistant',
      content: `Habari ${user.name}! I am KenyaOne Pulse AI — your native entertainment, nightlife, event economics, and 47-county cultural intelligence layer.\n\nI can calculate festival production budgets in KES, match verified DJs and MCs, write viral marketing campaigns in Sheng, and advise creators on monetization. How can I assist your entertainment journey today?`,
      actions: [
        'Calculate Event Production Budget',
        'Match Performers for Weekend Concert',
        'Draft Viral TikTok Promo in Sheng',
        'Explore 47-County Cultural Calendar',
      ],
    },
  ]);

  const presetTasks: {
    task: PulseAiRequest['task'];
    title: string;
    icon: React.ReactNode;
    promptTemplate: string;
  }[] = [
    {
      task: 'plan_event_budget',
      title: 'Event Budget Estimator',
      icon: <Calculator className="w-4 h-4 text-emerald-400" />,
      promptTemplate:
        'I am planning a 1,200 person outdoor concert in Nairobi with 2 headliners and 2 DJs. Give me a detailed budget breakdown in KES with sound, lighting, security, permits, and break-even ticket pricing.',
    },
    {
      task: 'match_performers',
      title: 'Talent Matchmaking',
      icon: <Users className="w-4 h-4 text-purple-400" />,
      promptTemplate:
        'Recommend 3 verified Kenyan DJs and MCs for an upscale sundowner event in Westlands that starts with Neo-Soul/Afro-House and transitions into high-energy Amapiano.',
    },
    {
      task: 'marketing_campaign',
      title: 'Viral Promo Generator',
      icon: <Megaphone className="w-4 h-4 text-rose-400" />,
      promptTemplate:
        'Write 3 punchy social media promo scripts (one in Sheng, one in English, one for WhatsApp broadcast) to sell Early Bird tickets for our upcoming festival.',
    },
    {
      task: 'culture_guide',
      title: '47-County Cultural Guide',
      icon: <Compass className="w-4 h-4 text-amber-400" />,
      promptTemplate:
        'Tell me about traditional dances, indigenous instruments, and iconic foods in Kisumu and Turkana counties for cultural tourists.',
    },
    {
      task: 'creator_strategy',
      title: 'Creator Monetization',
      icon: <Briefcase className="w-4 h-4 text-blue-400" />,
      promptTemplate:
        'I am a Kenyan DJ and live-streamer with 25,000 followers. What is the most effective blueprint to earn KES 150,000+ per month using Pulse Fan Subscriptions, tips, and soundpack sales?',
    },
    {
      task: 'venue_optimizer',
      title: 'Club Schedule Optimizer',
      icon: <Store className="w-4 h-4 text-yellow-400" />,
      promptTemplate:
        'How should a 400-capacity lounge in Kilimani structure its weekday and weekend programming (happy hours, karaoke, guest DJ nights) to maximize table spend and attendance?',
    },
  ];

  const handleSend = async (customPrompt?: string, taskOverride?: PulseAiRequest['task']) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim()) return;

    const chosenTask = taskOverride || activeTask;

    // Add user message
    setConversation((prev) => [...prev, { role: 'user', content: promptToSend }]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/pulse-ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: chosenTask,
          prompt: promptToSend,
          context: {
            userCounty: user.county,
            userRole: user.role,
            userName: user.name,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Samahani, could not process request.',
          actions: data.suggestedActions,
        },
      ]);
    } catch (err: unknown) {
      console.error('Pulse AI frontend error:', err);
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '⚠️ Pulse AI is operating in offline mode. Please verify the server connection. Here is local entertainment intelligence:\n\nFor major events in Nairobi and Mombasa, ensure KECOBO/MCSK public performance licences are cleared at least 14 days before showtime.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Pulse AI Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-700/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>KenyaOne Entertainment Intelligence Layer (Powered by Gemini)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">PULSE AI ASSISTANT</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            The national entertainment intelligence engine. Discover experiences, plan event budgets in KES,
            match artists, create marketing campaigns, and gain deep cultural insights into Kenya’s 47 counties.
          </p>
        </div>

        {/* Quick Launch Preset Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-6">
          {presetTasks.map((p) => (
            <button
              key={p.task}
              onClick={() => {
                setActiveTask(p.task);
                handleSend(p.promptTemplate, p.task);
              }}
              className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 transition-all text-left group hover:scale-[1.02]"
            >
              <div className="mb-2 p-1.5 rounded-lg bg-slate-900 w-fit group-hover:bg-indigo-950">
                {p.icon}
              </div>
              <h4 className="text-xs font-bold text-white leading-tight">{p.title}</h4>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Chat Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px]">
        {/* Chat Messages */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-red-600 text-white rounded-tr-none shadow-md shadow-red-600/20'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                {msg.content}

                {/* Suggested Action Chips */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(`Tell me more about: ${act}`, 'general_chat')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 font-semibold transition-all border border-slate-700"
                      >
                        {act} →
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover border border-slate-700 shrink-0"
                />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-11">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing Kenyan entertainment graph & calculating with Gemini...</span>
            </div>
          )}
        </div>

        {/* Chat Input Console */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about concert budgets, DJs, venues, promo copy, or 47-county culture..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

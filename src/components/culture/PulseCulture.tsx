import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Utensils,
  Music,
  Landmark,
  Languages,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { usePulse } from '../../context/PulseContext';
import { MOCK_COUNTIES_CULTURE } from '../../data/mockData';
import { CountyCulture } from '../../types/pulse';

export const PulseCulture: React.FC = () => {
  const { cultureLanguage, setCultureLanguage } = usePulse();

  const [selectedCounty, setSelectedCounty] = useState<CountyCulture>(MOCK_COUNTIES_CULTURE[0]);
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [searchCounty, setSearchCounty] = useState<string>('');

  const regions = ['All', 'Nairobi', 'Coast', 'Rift Valley', 'Nyanza', 'Eastern', 'Central'];

  const filteredCounties = MOCK_COUNTIES_CULTURE.filter((c) => {
    const matchesRegion = regionFilter === 'All' || c.region === regionFilter;
    const matchesSearch =
      !searchCounty ||
      c.name.toLowerCase().includes(searchCounty.toLowerCase()) ||
      c.capital.toLowerCase().includes(searchCounty.toLowerCase()) ||
      c.traditionalDance.toLowerCase().includes(searchCounty.toLowerCase()) ||
      c.iconicFood.toLowerCase().includes(searchCounty.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Culture Top Hero & Bilingual Switcher */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Compass className="w-3.5 h-3.5" />
              <span>National 47-County Cultural Discovery Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {cultureLanguage === 'sw'
                ? 'Urithi wa Utamaduni wa Kaunti 47 za Kenya'
                : 'Kenyan Cultural Heritage Across All 47 Counties'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {cultureLanguage === 'sw'
                ? 'Gundua ngoma za jadi, vyakula asilia vya kienyeji, muziki wa kitamaduni, na vivutio vya kihistoria katika kila pembe ya Jamhuri ya Kenya.'
                : 'Explore authentic indigenous rhythms, traditional dances, iconic regional gastronomy, and county cultural calendars celebrating our proud unity in diversity.'}
            </p>
          </div>

          {/* Bilingual Language Switcher */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 p-1.5 rounded-2xl shrink-0 shadow-lg">
            <Languages className="w-4 h-4 text-emerald-400 ml-2" />
            <button
              onClick={() => setCultureLanguage('en')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                cultureLanguage === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setCultureLanguage('sw')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                cultureLanguage === 'sw'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kiswahili
            </button>
          </div>
        </div>

        {/* Filter & County Search */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={cultureLanguage === 'sw' ? 'Tafuta kaunti, ngoma, au chakula...' : 'Search by county name, dance, or traditional food...'}
              value={searchCounty}
              onChange={(e) => setSearchCounty(e.target.value)}
              className="w-full bg-transparent border-none text-white focus:outline-none placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  regionFilter === r
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split: County Selector List & In-Depth County Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: County Grid Selector */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1">
            {cultureLanguage === 'sw' ? 'Orodha ya Kaunti' : 'Counties Directory'} ({filteredCounties.length})
          </span>
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredCounties.map((c) => {
              const isSelected = selectedCounty.code === c.code;
              return (
                <div
                  key={c.code}
                  onClick={() => setSelectedCounty(c)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-600/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                      {c.code < 10 ? `0${c.code}` : c.code}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <span className="text-[10px] text-slate-400">
                        {c.region} Region • {c.capital}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Center / Right Column: Comprehensive County Cultural Showcase */}
        <div className="lg:col-span-2 space-y-5">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="relative h-60 overflow-hidden">
              <img
                src={selectedCounty.image}
                alt={selectedCounty.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                  County Code 0{selectedCounty.code} • {selectedCounty.region}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {selectedCounty.name}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Capital / Administrative Hub: <strong className="text-white">{selectedCounty.capital}</strong>
                </p>
              </div>
            </div>

            {/* Cultural Overview Paragraph (Bilingual) */}
            <div className="p-5 sm:p-6 border-b border-slate-800">
              <h3 className="text-xs font-black uppercase text-emerald-400 tracking-wider mb-2">
                {cultureLanguage === 'sw' ? 'Muhtasari wa Kitamaduni' : 'Cultural Overview'}
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {cultureLanguage === 'sw'
                  ? selectedCounty.swahiliOverview
                  : selectedCounty.englishOverview}
              </p>
            </div>

            {/* Cultural Pillars Grid: Music, Dance, Food, Festival */}
            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase mb-1">
                  <Music className="w-4 h-4" />
                  <span>{cultureLanguage === 'sw' ? 'Muziki wa Jadi' : 'Traditional Music'}</span>
                </div>
                <p className="text-xs font-semibold text-white">{selectedCounty.traditionalMusic}</p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>{cultureLanguage === 'sw' ? 'Ngoma ya Kiasili' : 'Iconic Traditional Dance'}</span>
                </div>
                <p className="text-xs font-semibold text-white">{selectedCounty.traditionalDance}</p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                  <Utensils className="w-4 h-4" />
                  <span>{cultureLanguage === 'sw' ? 'Vyakula vya Kienyeji' : 'Authentic Food Experiences'}</span>
                </div>
                <p className="text-xs font-semibold text-white">{selectedCounty.iconicFood}</p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{cultureLanguage === 'sw' ? 'Tamasha Kuu la Kaunti' : 'County Cultural Festival'}</span>
                </div>
                <p className="text-xs font-semibold text-white">
                  {selectedCounty.festivalName} ({selectedCounty.festivalMonth})
                </p>
              </div>
            </div>

            {/* Museums & Heritage Sites */}
            <div className="p-5 sm:p-6 bg-slate-950/40 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-300 tracking-wider mb-3">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <span>{cultureLanguage === 'sw' ? 'Makumbusho na Maeneo ya Urithi' : 'Museums & Heritage Destinations'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCounty.museumsAndHeritage.map((m, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold"
                  >
                    🏛️ {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

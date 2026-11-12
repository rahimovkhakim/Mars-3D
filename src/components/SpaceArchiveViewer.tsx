import React, { useState, useMemo } from 'react';
import { SPACE_ARCHIVE_DATA, SpaceArchiveItem } from '../data/spaceArchiveData';
import {
  Camera,
  ZoomIn,
  Search,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Eye,
  Globe
} from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';

interface SpaceArchiveViewerProps {
  onBackToPlanet: () => void;
  onExploreLocation?: (target: 'earth' | 'mars') => void;
}

export const SpaceArchiveViewer: React.FC<SpaceArchiveViewerProps> = ({
  onBackToPlanet,
  onExploreLocation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItem, setActiveItem] = useState<SpaceArchiveItem | null>(null);

  const categories = [
    { id: 'all', label: 'Все снимки', count: SPACE_ARCHIVE_DATA.length, icon: '🌟' },
    { id: 'earth', label: 'Земля из космоса', count: SPACE_ARCHIVE_DATA.filter(i => i.category === 'earth').length, icon: '🌍' },
    { id: 'mars', label: 'Марс: Панорамы & Поверхность', count: SPACE_ARCHIVE_DATA.filter(i => i.category === 'mars').length, icon: '🔴' },
    { id: 'spacecraft', label: 'Космические аппараты & JWST', count: SPACE_ARCHIVE_DATA.filter(i => i.category === 'spacecraft').length, icon: '🔭' },
    { id: 'geology', label: 'Микроскопия & Геология', count: SPACE_ARCHIVE_DATA.filter(i => i.category === 'geology').length, icon: '🔬' },
  ];

  const filteredItems = useMemo(() => {
    return SPACE_ARCHIVE_DATA.filter(item => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.titleRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descriptionRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mission.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 animate-fadeIn text-slate-100 pb-16">
      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 md:p-6"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="max-w-5xl w-full bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-3 right-3 z-20 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white p-2 rounded-xl border border-slate-700 transition-all text-xs font-mono flex items-center gap-1 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Image Viewport */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden group">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.titleRu}
                className="max-h-[60vh] md:max-h-[90vh] w-full object-contain"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-amber-400">
                {activeItem.resolution}
              </div>
            </div>

            {/* Right Details Panel */}
            <div className="md:w-2/5 p-5 md:p-6 overflow-y-auto space-y-4 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded font-bold uppercase">
                    {activeItem.mission}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {activeItem.date}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-black text-white leading-snug">
                  {activeItem.titleRu}
                </h3>
                <h4 className="text-xs text-slate-400 font-mono">{activeItem.titleEn}</h4>

                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                  {activeItem.descriptionRu}
                </p>

                {/* Scientific Value Card */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                    Научная ценность снимка:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeItem.scientificValueRu}
                  </p>
                </div>

                {/* Kid Fact Callout */}
                <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 p-3 rounded-xl border border-amber-800/40 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Факт для школьников:
                    </span>
                    <p className="text-xs text-white mt-0.5">{activeItem.funKidFactRu}</p>
                  </div>
                </div>

                {/* Technical Sensor Spec */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1 text-slate-400">
                  <div>Сенсор: <strong className="text-slate-200">{activeItem.camera}</strong></div>
                  <div>Источник: <strong className="text-slate-200">{activeItem.credit}</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-mono">NASA Planetary Data System</span>
                <button
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/40 px-2 py-0.5 rounded font-mono">
              ОФИЦИАЛЬНЫЙ АРХИВ NASA & ESA
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Ultra-HD Planetary Imagery</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Великие открытия и снимки Солнечной системы
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Подлинные фотографии с телескопа James Webb, марсоходов Curiosity и Perseverance, спутников MRO и станции МКС
          </p>
        </div>

        <button
          onClick={onBackToPlanet}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <Globe className="w-4 h-4 text-sky-400" />
          <span>Вернуться к 3D планетам</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  marsAudio.playTelemetryPing();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500/25 border-amber-400 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[10px] font-mono text-amber-400 bg-black/40 px-1 rounded">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Поиск: Pamir, Webb, Олимп..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none font-mono"
          />
        </div>
      </div>

      {/* Grid of Archive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => {
              marsAudio.playTelemetryPing();
              setActiveItem(item);
            }}
            className="group bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400 transition-all shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            {/* Image Thumbnail */}
            <div className="aspect-[16/10] w-full overflow-hidden relative bg-black">
              <img
                src={item.imageUrl}
                alt={item.titleRu}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-bold font-mono text-amber-400 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800">
                  {item.mission}
                </span>
              </div>

              <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md p-1.5 rounded-lg text-slate-300 group-hover:text-amber-400 transition-colors">
                <ZoomIn className="w-3.5 h-3.5" />
              </div>

              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span className="bg-black/60 px-1.5 py-0.5 rounded">{item.camera}</span>
                <span className="text-amber-400">{item.resolution}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {item.titleRu}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.descriptionRu}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{item.date}</span>
                <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Подробнее <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-slate-950/60 p-12 rounded-2xl border border-slate-800 text-center space-y-2">
          <p className="text-sm text-slate-300 font-semibold">По вашему запросу снимков не найдено</p>
          <p className="text-xs text-slate-500">Попробуйте ввести другое ключевое слово или сбросить фильтры.</p>
        </div>
      )}
    </div>
  );
};

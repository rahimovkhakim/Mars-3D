import React, { useState } from 'react';
import { PLANETARY_COMPARISONS } from '../data/planetaryComparison';
import { PlanetComparisonMetric } from '../types/planetary';
import {
  Scale,
  Wind,
  Compass,
  Droplets,
  Flame,
  Sun,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';

interface PlanetComparisonLabProps {
  onBackToGlobe: () => void;
  onExplorePlanet: (planet: 'mars' | 'earth') => void;
}

export const PlanetComparisonLab: React.FC<PlanetComparisonLabProps> = ({
  onBackToGlobe,
  onExplorePlanet,
}) => {
  const [userWeight, setUserWeight] = useState<number>(50);
  const [selectedMetric, setSelectedMetric] = useState<PlanetComparisonMetric>(PLANETARY_COMPARISONS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const marsWeight = Math.round(userWeight * 0.38 * 10) / 10;
  const earthJumpCm = 45;
  const marsJumpCm = Math.round(earthJumpCm * 2.63);

  const categories = [
    { id: 'all', label: 'Все параметры' },
    { id: 'physics', label: 'Гравитация & Физика' },
    { id: 'atmosphere', label: 'Атмосфера & Давление' },
    { id: 'magnetism', label: 'Магнитный щит' },
    { id: 'hydrology', label: 'Океаны & Вода' },
    { id: 'orbit', label: 'Сутки & Год' },
  ];

  const filteredMetrics = activeCategory === 'all'
    ? PLANETARY_COMPARISONS
    : PLANETARY_COMPARISONS.filter(m => m.category === activeCategory);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 animate-fadeIn text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-sky-400 bg-sky-950/70 border border-sky-800/40 px-2 py-0.5 rounded font-mono">
              НАУЧНАЯ ЛАБОРАТОРИЯ СРАВНЕНИЯ
            </span>
            <span className="text-[10px] text-slate-400 font-mono">NASA Planetary Science</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Земля vs Марс: Сравнительная планетология
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Почему на Земле цветёт биосфера, а Марс стал холодной красной пустыней?
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onExplorePlanet('earth')}
            className="px-3 py-1.5 bg-sky-950/80 hover:bg-sky-900 border border-sky-600/50 text-sky-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>♁ Перейти к Земле</span>
          </button>
          <button
            onClick={() => onExplorePlanet('mars')}
            className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-600/50 text-red-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>♂ Перейти к Марсу</span>
          </button>
        </div>
      </div>

      {/* Interactive Weight & Gravity Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input Card */}
        <div className="bg-slate-950/85 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4" /> Весы гравитации
              </span>
              <span className="text-[10px] text-slate-500 font-mono">0.38 g</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Введи свой земной вес, чтобы узнать, сколько ты будешь весить на Марсе:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="200"
                value={userWeight}
                onChange={e => setUserWeight(Math.max(5, Math.min(250, Number(e.target.value))))}
                className="bg-slate-900 border border-slate-700 text-white font-mono font-bold text-lg px-3 py-1.5 rounded-xl w-24 text-center focus:border-amber-400 outline-none"
              />
              <span className="text-xs font-mono text-slate-400">кг на Земле</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
            Закон всемирного тяготения Ньютона: F = G · (M · m) / R²
          </div>
        </div>

        {/* Mars Weight Result */}
        <div className="bg-gradient-to-br from-red-950/60 to-slate-950 border border-red-800/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
              Твой вес на Марсе:
            </span>
            <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1.5">
              <span>{marsWeight}</span>
              <span className="text-sm font-semibold text-red-300">кг</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Ты потерял <strong>{(userWeight - marsWeight).toFixed(1)} кг</strong>! Твои мышцы, привыкшие к земной гравитации, будут чувствовать невероятную лёгкость.
            </p>
          </div>
          <div className="mt-3 text-[11px] text-amber-400 font-mono">
            Вес уменьшился на 62%!
          </div>
        </div>

        {/* Super Jump Result */}
        <div className="bg-gradient-to-br from-sky-950/60 to-slate-950 border border-sky-800/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
              Высота прыжка на Марсе:
            </span>
            <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1.5">
              <span>{marsJumpCm}</span>
              <span className="text-sm font-semibold text-sky-300">см</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              На Земле средний прыжок составляет {earthJumpCm} см. На Марсе ты легко перепрыгнешь легковую машину или забросишь мяч в баскетбольное кольцо на высоте 8 метров!
            </p>
          </div>
          <div className="mt-3 text-[11px] text-sky-400 font-mono">
            В 2.63 раза выше, чем на Земле!
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              marsAudio.playTelemetryPing();
              setActiveCategory(cat.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Metrics Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredMetrics.map(metric => {
          const isSelected = selectedMetric.id === metric.id;
          return (
            <div
              key={metric.id}
              onClick={() => {
                marsAudio.playTelemetryPing();
                setSelectedMetric(metric);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg ${
                isSelected
                  ? 'bg-slate-900/95 border-amber-400 ring-1 ring-amber-400/40'
                  : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="text-base">{metric.icon}</span>
                  {metric.nameRu}
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                  {metric.ratioNoticeRu}
                </span>
              </div>

              {/* Values Comparison Bar */}
              <div className="grid grid-cols-2 gap-2 my-2.5">
                <div className="bg-sky-950/30 border border-sky-800/30 p-2.5 rounded-xl">
                  <span className="text-[10px] text-sky-400 font-mono block">♁ ЗЕМЛЯ</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{metric.earthValue}</span>
                </div>
                <div className="bg-red-950/30 border border-red-800/30 p-2.5 rounded-xl">
                  <span className="text-[10px] text-red-400 font-mono block">♂ МАРС</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{metric.marsValue}</span>
                </div>
              </div>

              {/* Kid Fact Callout */}
              <div className="text-xs text-slate-300 mt-2 pt-2 border-t border-slate-800/60 leading-relaxed">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block mb-0.5">
                  Суперфакт:
                </span>
                {metric.kidFactRu}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Metric Deep Dive Callout */}
      {selectedMetric && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedMetric.icon}</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Научное объяснение NASA: {selectedMetric.nameRu}
            </h4>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {selectedMetric.scienceExplanationRu}
          </p>
        </div>
      )}
    </div>
  );
};

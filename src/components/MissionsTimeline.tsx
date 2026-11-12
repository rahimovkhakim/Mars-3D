import React, { useState } from 'react';
import { MARS_TIMELINE } from '../data/marsData';
import { TimelineMilestone } from '../types/mars';
import { Rocket, Satellite, Compass, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';

interface MissionsTimelineProps {
  onExploreMilestone?: () => void;
}

export const MissionsTimeline: React.FC<MissionsTimelineProps> = ({ onExploreMilestone }) => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone>(MARS_TIMELINE[8]); // Perseverance default

  const handleSelect = (m: TimelineMilestone) => {
    setSelectedMilestone(m);
    marsAudio.playTelemetryPing();
    if (onExploreMilestone) onExploreMilestone();
  };

  const filtered = MARS_TIMELINE.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'rover') return item.type === 'rover' || item.type === 'helicopter';
    if (filter === 'orbiter') return item.type === 'orbiter' || item.type === 'flyby';
    if (filter === 'lander') return item.type === 'lander';
    if (filter === 'future') return item.type === 'future';
    return true;
  });

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 px-2.5 py-0.5 rounded border border-sky-800/40">
              NASA & Мировая Космонавтика
            </span>
            <span className="text-xs text-slate-400">1965 — 2030+</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Хроника покорения Марса</h2>
          <p className="text-xs md:text-sm text-slate-400">
            История великих открытий: от первых черно-белых снимков до полетов вертолёта Ingenuity
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'all', label: 'Все миссии' },
            { id: 'rover', label: 'Марсоходы & Дроны' },
            { id: 'orbiter', label: 'Орбитальные станции' },
            { id: 'lander', label: 'Посадочные станции' },
            { id: 'future', label: 'Будущее' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Scroll List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(m => {
            const isSelected = selectedMilestone.name === m.name;
            return (
              <div
                key={m.name}
                onClick={() => handleSelect(m)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                  isSelected
                    ? 'bg-slate-900 border-red-500 shadow-lg ring-1 ring-red-500/30'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700'
                }`}
              >
                {/* Year Badge */}
                <div className="shrink-0 text-center">
                  <div className={`px-2.5 py-1 rounded-lg font-mono text-sm font-bold ${
                    isSelected ? 'bg-red-600 text-white' : 'bg-slate-800 text-amber-300'
                  }`}>
                    {m.year}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-semibold uppercase">
                    {m.type}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-white truncate">{m.name}</h3>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {m.agency}
                    </span>
                    {m.status === 'active' && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded ml-auto flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Работает
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-amber-400 mb-1">{m.titleRu}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{m.descriptionRu}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Milestone Inspection Sidebar */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between h-fit sticky top-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2.5 py-1 rounded border border-red-800/40">
                Год запуска: {selectedMilestone.year}
              </span>
              <span className="text-xs text-slate-400">{selectedMilestone.agency}</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{selectedMilestone.name}</h3>
            <div className="text-sm text-amber-300 font-semibold mb-4">{selectedMilestone.titleRu}</div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Ход миссии:
                </span>
                <p className="leading-relaxed">{selectedMilestone.descriptionRu}</p>
              </div>

              <div className="bg-gradient-to-br from-red-950/40 to-slate-950/60 p-3.5 rounded-xl border border-red-900/30">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Главный научный прорыв:
                </div>
                <p className="leading-relaxed text-slate-200">
                  {selectedMilestone.scientificBreakthroughRu}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>NASA Deep Space Network</span>
            <span className="font-mono">SOL #{Math.floor(selectedMilestone.year * 1.5)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

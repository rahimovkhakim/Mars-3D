import React, { useState } from 'react';
import { ISS_DATA } from '../data/earthData';
import {
  Satellite,
  Clock,
  Gauge,
  Users,
  Layers,
  Sparkles,
  X,
  Compass,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';

interface ISSStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusEarth: () => void;
}

export const ISSStationModal: React.FC<ISSStationModalProps> = ({
  isOpen,
  onClose,
  onFocusEarth,
}) => {
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);

  if (!isOpen) return null;

  const currentModule = ISS_DATA.modules[selectedModuleIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="max-w-3xl w-full bg-slate-950/95 rounded-2xl border border-slate-800 shadow-2xl p-5 md:p-6 relative text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {ISS_DATA.nameRu}
                </h3>
                <span className="text-[9px] font-bold text-sky-400 bg-sky-950/70 border border-sky-800/40 px-1.5 py-0.2 rounded font-mono">
                  ОРБИТА ЗЕМЛИ
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Низкая околоземная орбита (LEO) • Наклон 51.6°
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-all"
          >
            ✕ Закрыть
          </button>
        </div>

        {/* Real-Time Telemetry Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono uppercase block flex items-center gap-1">
              <Gauge className="w-3 h-3 text-amber-400" /> Орб. скорость
            </span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">
              27 600 км/ч
            </span>
            <span className="text-[9px] text-slate-500 font-mono">7.66 км в секунду</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono uppercase block flex items-center gap-1">
              <Compass className="w-3 h-3 text-sky-400" /> Высота орбиты
            </span>
            <span className="text-base font-bold font-mono text-sky-400 mt-0.5 block">
              408 км
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Над уровнем моря</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono uppercase block flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" /> Период витка
            </span>
            <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
              92.7 мин
            </span>
            <span className="text-[9px] text-slate-500 font-mono">16 рассветов в сутки!</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 font-mono uppercase block flex items-center gap-1">
              <Users className="w-3 h-3 text-pink-400" /> Экипаж
            </span>
            <span className="text-base font-bold font-mono text-pink-400 mt-0.5 block">
              {ISS_DATA.crewCount} астронавтов
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Международный</span>
          </div>
        </div>

        {/* Fun Educational Superfact */}
        <div className="bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-slate-950 border border-sky-800/40 p-3.5 rounded-xl mb-4 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
              Суперфакт для презентации в Душанбе:
            </span>
            <p className="text-xs text-white mt-0.5 leading-snug">
              МКС пролетает вокруг всей планеты Земля всего за полтора часа! Космонавты на борту встречают рассвет и закат Солнца 16 раз за каждые земные сутки. Станцию регулярно видно невооружённым глазом в ночном небе над Душанбе как яркую быструю звезду.
            </p>
          </div>
        </div>

        {/* Modules Breakdown */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Исследуй герметичные модули станции:
          </h4>

          {/* Module Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
            {ISS_DATA.modules.map((mod, idx) => (
              <button
                key={mod.name}
                onClick={() => {
                  marsAudio.playTelemetryPing();
                  setSelectedModuleIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedModuleIndex === idx
                    ? 'bg-sky-500/25 border-sky-400 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {mod.name}
              </button>
            ))}
          </div>

          {/* Active Module Card */}
          {currentModule && (
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-white">{currentModule.name}</h5>
                  <span className="text-xs text-sky-400 font-mono">
                    Агентство: {currentModule.agency} • Запуск: {currentModule.year} г.
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded font-mono">
                  Модуль {selectedModuleIndex + 1} из {ISS_DATA.modules.length}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                {currentModule.descriptionRu}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Общая масса: 444 615 кг • Жилой объём: 916 м³
          </span>
          <button
            onClick={() => {
              onClose();
              onFocusEarth();
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>Наблюдать орбиту Земли в 3D</span>
          </button>
        </div>
      </div>
    </div>
  );
};

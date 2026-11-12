import React from 'react';
import { MarsPOI } from '../types/mars';
import { MARS_POIS } from '../data/marsData';
import { Sparkles, MapPin, ChevronLeft, ChevronRight, CheckCircle2, Rocket, Info, Volume2 } from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';

interface POIDetailModalProps {
  poi: MarsPOI | null;
  onClose: () => void;
  onSelectPOI: (poi: MarsPOI) => void;
  isExplored: boolean;
  onMarkExplored: (poiId: string) => void;
  onLandOnSurface: (poi: MarsPOI) => void;
}

export const POIDetailModal: React.FC<POIDetailModalProps> = ({
  poi,
  onClose,
  onSelectPOI,
  isExplored,
  onMarkExplored,
  onLandOnSurface,
}) => {
  if (!poi) return null;

  const currentIndex = MARS_POIS.findIndex(p => p.id === poi.id);
  const prevPOI = currentIndex > 0 ? MARS_POIS[currentIndex - 1] : MARS_POIS[MARS_POIS.length - 1];
  const nextPOI = currentIndex < MARS_POIS.length - 1 ? MARS_POIS[currentIndex + 1] : MARS_POIS[0];

  const handlePrev = () => {
    marsAudio.playTelemetryPing();
    onSelectPOI(prevPOI);
  };

  const handleNext = () => {
    marsAudio.playTelemetryPing();
    onSelectPOI(nextPOI);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="max-w-2xl w-full bg-slate-900/95 rounded-3xl border border-slate-700/80 shadow-2xl p-5 md:p-7 relative text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Navigation Bar at Top */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs flex items-center gap-1"
              title="Предыдущий объект"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Пред.</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              {currentIndex + 1} / {MARS_POIS.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs flex items-center gap-1"
              title="Следующий объект"
            >
              <span className="hidden sm:inline">След.</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
          >
            ✕ Закрыть
          </button>
        </div>

        {/* POI Header */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2.5 py-0.5 rounded">
              {poi.badge}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              {poi.lat > 0 ? `${poi.lat.toFixed(1)}°N` : `${Math.abs(poi.lat).toFixed(1)}°S`},{' '}
              {poi.lon > 0 ? `${poi.lon.toFixed(1)}°E` : `${Math.abs(poi.lon).toFixed(1)}°W`}
            </span>
            <span className="text-xs font-mono text-sky-400">
              {poi.elevationKm >= 0 ? `+${poi.elevationKm} км` : `${poi.elevationKm} км`} над средним
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white">{poi.nameRu}</h2>
          <span className="text-xs text-slate-400 font-medium">{poi.nameEn}</span>
        </div>

        {/* Highlight Fact Callout Banner */}
        <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/50 p-4 rounded-2xl border border-red-800/40 mb-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600/30 flex items-center justify-center shrink-0 border border-red-500/40 text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
              Суперфакт для школьников:
            </div>
            <p className="text-xs md:text-sm font-semibold text-white mt-0.5 leading-snug">
              {poi.highlightFactRu}
            </p>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-3 mb-5 text-xs md:text-sm text-slate-300 leading-relaxed">
          <p>{poi.detailedTextRu}</p>

          {/* Kid Challenge Box */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
              🧠 Вообрази себе масштаб:
            </span>
            <p className="text-xs text-slate-200">{poi.kidFriendlyChallengeRu}</p>
          </div>
        </div>

        {/* NASA Technical Data Table */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 mb-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            Научные данные орбитальных спутников и посадок NASA:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {poi.nasaDataRu.map((item, idx) => (
              <div key={idx} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">{item.label}</span>
                <span className="font-semibold text-white mt-0.5 block">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Mark as Explored */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            {isExplored ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Район изучен в экспедиции (+5% к мастерству)
              </span>
            ) : (
              <span>Изучи этот район, чтобы повысить марсианский рейтинг</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onLandOnSurface(poi)}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 ring-2 ring-red-500/40"
            >
              <Rocket className="w-4 h-4" />
              <span>Спуститься на поверхность (3D вид)</span>
            </button>

            {!isExplored && (
              <button
                onClick={() => {
                  onMarkExplored(poi.id);
                  marsAudio.playSuccessChime();
                }}
                className="w-full sm:w-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Записать (+5%)
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

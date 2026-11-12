import React, { useState } from 'react';
import { MarsPOI } from '../types/mars';
import { MARS_POIS } from '../data/marsData';
import { EARTH_POIS } from '../data/earthData';
import { MARS_GEOLOGY_SAMPLES } from '../data/marsPhotosData';
import { NASAImage, PlanetType } from '../types/planetary';
import {
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Rocket,
  Info,
  Camera,
  Layers,
  ZoomIn,
  Activity,
  Compass,
  X,
  ExternalLink
} from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';

interface PlanetaryInspectorModalProps {
  poi: MarsPOI | null;
  currentPlanet: PlanetType;
  onClose: () => void;
  onSelectPOI: (poi: MarsPOI) => void;
  isExplored: boolean;
  onMarkExplored: (poiId: string) => void;
  onLandOnSurface?: (poi: MarsPOI) => void;
}

export const PlanetaryInspectorModal: React.FC<PlanetaryInspectorModalProps> = ({
  poi,
  currentPlanet,
  onClose,
  onSelectPOI,
  isExplored,
  onMarkExplored,
  onLandOnSurface,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'geology' | 'telemetry'>('photos');
  const [zoomedImage, setZoomedImage] = useState<NASAImage | null>(null);

  if (!poi) return null;

  const currentList = currentPlanet === 'mars' ? MARS_POIS : EARTH_POIS;
  const currentIndex = currentList.findIndex(p => p.id === poi.id);
  const prevPOI = currentIndex > 0 ? currentList[currentIndex - 1] : currentList[currentList.length - 1];
  const nextPOI = currentIndex < currentList.length - 1 ? currentList[currentIndex + 1] : currentList[0];

  const handlePrev = () => {
    marsAudio.playTelemetryPing();
    onSelectPOI(prevPOI);
  };

  const handleNext = () => {
    marsAudio.playTelemetryPing();
    onSelectPOI(nextPOI);
  };

  const geologySamples = MARS_GEOLOGY_SAMPLES[poi.id] || [];
  const photos = poi.photos || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      {/* Zoomed Lightbox Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-xl"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Закрыть просмотр (ESC)
            </button>
            <img
              src={zoomedImage.imageUrl}
              alt={zoomedImage.titleRu}
              className="max-h-[75vh] w-auto object-contain rounded-xl border border-slate-800 shadow-2xl"
            />
            <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl mt-3 text-center max-w-2xl w-full">
              <h4 className="text-sm font-bold text-white">{zoomedImage.titleRu}</h4>
              <p className="text-xs text-slate-300 mt-1">{zoomedImage.descriptionRu}</p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-[10px] text-amber-400 font-mono">
                <span>Камера: {zoomedImage.camera}</span>
                <span>•</span>
                <span>Миссия: {zoomedImage.mission}</span>
                <span>•</span>
                <span>{zoomedImage.credit}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dossier Container */}
      <div className="max-w-3xl w-full bg-slate-950/95 rounded-2xl border border-slate-800 shadow-2xl p-5 md:p-6 relative text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all text-xs flex items-center gap-1"
              title="Предыдущий объект"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Пред.</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              {currentIndex + 1} / {currentList.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all text-xs flex items-center gap-1"
              title="Следующий объект"
            >
              <span className="hidden sm:inline">След.</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'photos'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Фото NASA ({photos.length})</span>
            </button>

            {currentPlanet === 'mars' && (
              <button
                onClick={() => setActiveTab('geology')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'geology'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Геология & Бур</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'telemetry'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Данные NASA</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-all"
          >
            ✕ Закрыть
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* POI Title & Coordinates Banner */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded font-mono">
                {poi.badge}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {poi.lat > 0 ? `${poi.lat.toFixed(1)}°N` : `${Math.abs(poi.lat).toFixed(1)}°S`},{' '}
                {poi.lon > 0 ? `${poi.lon.toFixed(1)}°E` : `${Math.abs(poi.lon).toFixed(1)}°W`}
              </span>
              <span className="text-xs font-mono text-sky-400">
                {poi.elevationKm >= 0 ? `+${poi.elevationKm} км` : `${poi.elevationKm} км`} высота
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white">{poi.nameRu}</h2>
            <span className="text-xs text-slate-400 font-mono">{poi.nameEn}</span>
          </div>

          {/* Superfact Banner */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Научный факт:
              </span>
              <p className="text-xs md:text-sm font-semibold text-white mt-0.5">{poi.highlightFactRu}</p>
            </div>
          </div>

          {/* TAB 1: NASA High-Res Photography Gallery */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  Официальная фотогалерея миссий NASA / JPL / ESA:
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Нажмите на фото для зума</span>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {photos.map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => setZoomedImage(photo)}
                      className="group relative bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-amber-500/60 transition-all shadow-lg"
                    >
                      <div className="aspect-video w-full overflow-hidden relative">
                        <img
                          src={photo.imageUrl}
                          alt={photo.titleRu}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-2 right-2 bg-slate-950/80 p-1.5 rounded-lg text-slate-300 group-hover:text-amber-400 transition-colors">
                          <ZoomIn className="w-3.5 h-3.5" />
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-[10px] font-mono text-amber-400 bg-black/60 px-1.5 py-0.5 rounded">
                            {photo.camera}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {photo.titleRu}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {photo.descriptionRu}
                        </p>
                        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                          <span>{photo.mission}</span>
                          <span>{photo.credit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                  Орбитальные снимки высокого разрешения синхронизируются со спутников...
                </div>
              )}

              {/* Detailed scientific text */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>{poi.detailedTextRu}</p>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-0.5">
                    🧠 Задача для школьников:
                  </span>
                  <p className="text-slate-200">{poi.kidFriendlyChallengeRu}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Geological Drill & Minerals (Mars only) */}
          {activeTab === 'geology' && currentPlanet === 'mars' && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Рентгеноспектральный анализ минералов (APXS / SuperCam):
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Спектроскопический профиль бурового керна, извлечённого манипулятором марсохода на глубине до 7.5 см:
                </p>

                {geologySamples.length > 0 ? (
                  <div className="space-y-3">
                    {geologySamples.map((sample, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white">{sample.mineralRu}</span>
                          <span className="font-mono text-amber-400 font-bold">{sample.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                          <div
                            className="bg-gradient-to-r from-sky-500 to-amber-500 h-full rounded-full"
                            style={{ width: `${sample.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>Хим. формула: <strong className="text-slate-200">{sample.formula}</strong></span>
                          <span>{sample.significanceRu}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 py-3 text-center">
                    Базальтовый реголит, обогащенный железом и кремнием.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NASA Data Telemetry */}
          {activeTab === 'telemetry' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {poi.nasaDataRu.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">{item.label}</span>
                    <span className="font-bold text-white mt-1 block">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <h5 className="font-bold text-amber-400 mb-1">Описание района:</h5>
                <p>{poi.shortDescRu}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            {isExplored ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Район исследован в экспедиции (+5% к рейтингу)
              </span>
            ) : (
              <span>Исследуй этот район, чтобы повысить уровень мастерства</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* If Mars, option to land in 3D */}
            {currentPlanet === 'mars' && onLandOnSurface && (
              <button
                onClick={() => onLandOnSurface(poi)}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                title="Спуститься от первого лица на поверхность"
              >
                <Rocket className="w-4 h-4" />
                <span>3D Спуск на поверхность</span>
              </button>
            )}

            {!isExplored && (
              <button
                onClick={() => {
                  onMarkExplored(poi.id);
                  marsAudio.playSuccessChime();
                }}
                className="w-full sm:w-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Записать в журнал (+5%)
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { MarsPOI } from '../types/mars';
import { MARS_POIS } from '../data/marsData';
import { SpectralLayer } from '../utils/proceduralMarsTextures';
import {
  Globe,
  Bot,
  FlaskConical,
  Clock,
  HelpCircle,
  BookOpen,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Compass,
  Presentation,
  Rocket,
  Sun,
  Camera,
  Layers,
  Video
} from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';

export type AppMode = 'globe' | 'surface' | 'rover' | 'atmosphere' | 'timeline' | 'quiz' | 'logbook';

interface BottomDockProps {
  currentMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
  selectedPOI: MarsPOI | null;
  onSelectPOI: (poi: MarsPOI) => void;
  onLandOnSurface: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  showMoons: boolean;
  onToggleMoons: () => void;
  showAtmosphere: boolean;
  onToggleAtmosphere: () => void;
  onResetView: () => void;
  totalMastery: number;
  onOpenAmericanSpaceModal: () => void;
  // Multispectral & Lighting Controls
  spectralLayer: SpectralLayer;
  onChangeSpectralLayer: (layer: SpectralLayer) => void;
  sunAngle: number;
  onChangeSunAngle: (angle: number) => void;
  isCinematicFlying: boolean;
  onToggleCinematicFlying: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  currentMode,
  onChangeMode,
  selectedPOI,
  onSelectPOI,
  onLandOnSurface,
  autoRotate,
  onToggleAutoRotate,
  showMoons,
  onToggleMoons,
  showAtmosphere,
  onToggleAtmosphere,
  onResetView,
  totalMastery,
  onOpenAmericanSpaceModal,
  spectralLayer,
  onChangeSpectralLayer,
  sunAngle,
  onChangeSunAngle,
  isCinematicFlying,
  onToggleCinematicFlying,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSpectralExpanded, setIsSpectralExpanded] = useState(false);

  // In first-person 3D surface mode, hide bottom dock so HUD is unobstructed
  if (currentMode === 'surface') {
    return null;
  }

  const navTabs: { id: AppMode; label: string; icon: React.ReactNode }[] = [
    { id: 'globe', label: '3D Марс', icon: <Globe className="w-4 h-4" /> },
    { id: 'rover', label: 'Марсоход', icon: <Bot className="w-4 h-4" /> },
    { id: 'atmosphere', label: 'Физика & Ветер', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'timeline', label: 'Хроника NASA', icon: <Clock className="w-4 h-4" /> },
    { id: 'quiz', label: 'Викторина', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'logbook', label: 'Журнал (100%)', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const spectralModes: { id: SpectralLayer; label: string; desc: string; icon: string }[] = [
    { id: 'true-color', label: 'True Color', desc: 'Естественный 4K', icon: '📷' },
    { id: 'mola-elevation', label: 'MOLA Topo', desc: 'Лазерные высоты', icon: '🌈' },
    { id: 'themis-thermal', label: 'THEMIS IR', desc: 'Тепловая инерция', icon: '🌡️' },
    { id: 'crism-mineralogy', label: 'CRISM', desc: 'Спектр минералов', icon: '💎' },
  ];

  return (
    <div
      className="fixed z-40 left-1/2 -translate-x-1/2 transition-transform duration-300 ease-out"
      style={{
        bottom: '16px',
        maxWidth: 'min(1080px, 96vw)',
        width: '100%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 38px)' : '0'})`,
      }}
    >
      {/* Collapse Handle */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          className="bg-slate-950/90 text-slate-300 hover:text-white px-4 py-1 rounded-t-lg text-xs font-semibold border-t border-x border-slate-800 shadow-xl flex items-center gap-1.5 backdrop-blur-md transition-all"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Панель управления миссией</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Свернуть (Панорамный 3D обзор)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Mission Control Dock */}
      <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-2.5 md:p-3 text-slate-100">
        {/* Row 1: Mode Navigation Tabs & American Space Dushanbe Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1">
            {navTabs.map(tab => {
              const isActive = currentMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    marsAudio.playTelemetryPing();
                    onChangeMode(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* American Space Dushanbe & Progress Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAmericanSpaceModal}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Информация о защите проекта в American Space Dushanbe"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">American Space Душанбе</span>
              <span className="sm:hidden">ASD</span>
            </button>

            <div
              onClick={() => onChangeMode('logbook')}
              className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer hover:border-slate-700"
              title="Твой прогресс изучения Марса"
            >
              <span className="text-[10px] text-slate-400 font-medium">Изучено:</span>
              <span className="font-mono font-bold text-amber-400">{totalMastery}%</span>
            </div>
          </div>
        </div>

        {/* Row 2: 3D Planetary Operations Bar (Multispectral, Sun Angle & Cinematic Fly-over) */}
        {currentMode === 'globe' ? (
          <div className="pt-2.5 space-y-2">
            {/* Spectral Layers & Solar Terminator Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Spectral Modes */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1 hidden lg:inline">
                  Спектр:
                </span>
                {spectralModes.map(mode => {
                  const isActive = spectralLayer === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        marsAudio.playTelemetryPing();
                        onChangeSpectralLayer(mode.id);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      title={mode.desc}
                    >
                      <span>{mode.icon}</span>
                      <span className="font-mono">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Solar Angle / Shadow Terminator Slider & Cinematic Fly-over */}
              <div className="flex items-center gap-3">
                {/* Sun Angle Slider */}
                <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-md">
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Солнце:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={sunAngle}
                    onChange={e => onChangeSunAngle(Number(e.target.value))}
                    className="w-16 md:w-20 accent-amber-500 h-1 cursor-pointer bg-slate-700 rounded"
                    title={`Угол Солнца: ${sunAngle}°`}
                  />
                  <span className="text-[10px] font-mono text-amber-300 w-7 text-right">
                    {sunAngle}°
                  </span>
                </div>

                {/* Cinematic Fly-Over Button */}
                <button
                  onClick={onToggleCinematicFlying}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    isCinematicFlying
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Плавный кинематографический облет вокруг Марса"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {isCinematicFlying ? 'Стоп облет' : 'Кино-облет'}
                  </span>
                </button>
              </div>
            </div>

            {/* Row 3: Quick POI Scroll & Descent Button */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
              {/* Scrollable POIs */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
                  Локации:
                </span>
                {MARS_POIS.map(poi => {
                  const isSelected = selectedPOI?.id === poi.id;
                  return (
                    <button
                      key={poi.id}
                      onClick={() => {
                        marsAudio.playTelemetryPing();
                        onSelectPOI(poi);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                        isSelected
                          ? 'bg-amber-500/25 border-amber-400 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{poi.nameRu.split('(')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: Surface Descent & Scene Utilities */}
              <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-slate-800">
                <button
                  onClick={onLandOnSurface}
                  className="px-3 py-1.5 rounded-md text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg transition-all flex items-center gap-1.5"
                  title="Спуститься на поверхность выбранного района от первого лица"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Спуск на Марс (3D)</span>
                  <span className="sm:hidden">Спуск 3D</span>
                </button>

                <button
                  onClick={onToggleAutoRotate}
                  className={`p-1.5 rounded-md text-xs transition-all border ${
                    autoRotate && !isCinematicFlying
                      ? 'bg-red-950/80 border-red-500 text-red-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Авто-вращение планеты"
                >
                  <Compass className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onResetView}
                  className="p-1.5 rounded-md text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
                  title="Сбросить камеру на общий вид"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">
              {currentMode === 'rover' && 'Исследуй 3D модель марсохода Perseverance и вертолёта Ingenuity'}
              {currentMode === 'atmosphere' && 'Физический симулятор: прыжки при низкой гравитации и звук марсианского ветра'}
              {currentMode === 'timeline' && 'История исследований: от первого пролёта Mariner 4 в 1965 году'}
              {currentMode === 'quiz' && 'Отвечай на вопросы викторины, чтобы набрать 100% знаний о Марсе'}
              {currentMode === 'logbook' && 'Бортовой журнал миссии и именной сертификат исследователя'}
            </span>
            <button
              onClick={() => onChangeMode('globe')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md text-[11px] font-semibold border border-slate-800 shrink-0 ml-2"
            >
              ← Вернуться к 3D глобусу
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

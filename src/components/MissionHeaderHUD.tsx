import React from 'react';
import { Volume2, VolumeX, Play, Presentation, Info, Crosshair, Activity } from 'lucide-react';
import { CursorTelemetry } from './MarsCanvas';

interface MissionHeaderHUDProps {
  onStartAutoTour: () => void;
  isAutoTouring: boolean;
  onOpenAmericanSpaceModal: () => void;
  isWindPlaying: boolean;
  onToggleWind: () => void;
  totalMastery: number;
  onOpenLogbook: () => void;
  cursorTelemetry?: CursorTelemetry;
}

export const MissionHeaderHUD: React.FC<MissionHeaderHUDProps> = ({
  onStartAutoTour,
  isAutoTouring,
  onOpenAmericanSpaceModal,
  isWindPlaying,
  onToggleWind,
  totalMastery,
  onOpenLogbook,
  cursorTelemetry,
}) => {
  const isHovering = Boolean(cursorTelemetry?.isHovering);

  const formatLat = (lat: number) => {
    const dir = lat >= 0 ? 'N' : 'S';
    return `${Math.abs(lat).toFixed(1)}°${dir}`;
  };

  const formatLon = (lon: number) => {
    const dir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lon).toFixed(1)}°${dir}`;
  };

  const formatElev = (elev: number) => {
    const sign = elev > 0 ? '+' : '';
    return `${sign}${elev.toFixed(1)} км`;
  };

  return (
    <header className="fixed top-3 inset-x-3 md:inset-x-6 z-40 flex items-center justify-between pointer-events-none">
      {/* Top Left: Title & American Space Dushanbe Affiliation */}
      <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2 pointer-events-auto shadow-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-md text-xs shrink-0 font-mono">
          ♂
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-black tracking-wide text-white font-mono uppercase">
              Марс 3D: Экспедиция
            </h1>
            <span className="text-[9px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/40 px-1.5 py-0.2 rounded font-mono hidden sm:inline">
              4K MULTISPECTRAL
            </span>
            <span className="text-[9px] font-bold text-sky-400 bg-sky-950/70 border border-sky-800/40 px-1.5 py-0.2 rounded font-mono hidden md:inline">
              MOLA ALTIMETRY
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <span>American Space Dushanbe</span>
            <span className="text-slate-600">•</span>
            <span className="text-red-400">Душанбе</span>
          </div>
        </div>
      </div>

      {/* Top Center: Real-Time Sub-Cursor Telemetry OR Planetary Stats */}
      <div className="hidden lg:flex items-center bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 pointer-events-auto shadow-xl text-[11px] text-slate-300 font-mono transition-all min-w-[340px] justify-center">
        {isHovering && cursorTelemetry ? (
          <div className="flex items-center gap-3.5 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Crosshair className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-[10px] uppercase font-bold text-slate-400">Курсор:</span>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] block">ШИРОТА</span>
              <span className="text-white font-bold">{formatLat(cursorTelemetry.lat)}</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div>
              <span className="text-slate-500 text-[9px] block">ДОЛГОТА</span>
              <span className="text-white font-bold">{formatLon(cursorTelemetry.lon)}</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div>
              <span className="text-slate-500 text-[9px] block">MOLA ВЫСОТА</span>
              <span
                className={`font-bold ${
                  cursorTelemetry.elevationKm >= 0 ? 'text-amber-400' : 'text-sky-400'
                }`}
              >
                {formatElev(cursorTelemetry.elevationKm)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Диаметр</span>
              <span className="text-white font-semibold">6 779 км</span>
            </div>
            <div className="w-px h-5 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Гравитация</span>
              <span className="text-amber-400 font-semibold">0.38 g</span>
            </div>
            <div className="w-px h-5 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Сутки (Сол)</span>
              <span className="text-sky-400 font-semibold">24ч 39м</span>
            </div>
            <div className="w-px h-5 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Температура</span>
              <span className="text-red-400 font-semibold">-63°C сред.</span>
            </div>
          </div>
        )}
      </div>

      {/* Top Right: Mission Actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Wind audio toggle */}
        <button
          onClick={onToggleWind}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs flex items-center gap-1.5 shadow-xl ${
            isWindPlaying
              ? 'bg-red-600/90 border-red-500 text-white'
              : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          title={isWindPlaying ? 'Отключить шум марсианского ветра' : 'Включить атмосферный звук марсианского ветра NASA'}
        >
          {isWindPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline text-[11px] font-semibold">
            {isWindPlaying ? 'Ветер включен' : 'Звук ветра'}
          </span>
        </button>

        {/* Demo Tour Button for Presentation */}
        <button
          onClick={onStartAutoTour}
          className={`px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xl ${
            isAutoTouring
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20'
              : 'bg-slate-950/80 border-slate-800 text-amber-400 hover:bg-slate-900 hover:border-amber-500/50'
          }`}
          title="Запустить автоматический тур для презентации в American Space"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">{isAutoTouring ? 'Тур запущен...' : 'Демо-Тур'}</span>
        </button>

        {/* American Space Info Modal */}
        <button
          onClick={onOpenAmericanSpaceModal}
          className="p-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl backdrop-blur-md transition-all shadow-xl"
          title="О проекте для American Space Dushanbe"
        >
          <Info className="w-4 h-4 text-sky-400" />
        </button>
      </div>
    </header>
  );
};

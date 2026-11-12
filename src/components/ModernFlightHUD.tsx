import React from 'react';
import { Volume2, VolumeX, Play, Presentation, Info, Crosshair, Globe, Gauge, Compass } from 'lucide-react';
import { PlanetType } from '../types/planetary';
import { CursorTelemetry } from './PlanetaryCanvas';

interface ModernFlightHUDProps {
  currentPlanet: PlanetType;
  onChangePlanet: (planet: PlanetType) => void;
  onStartAutoTour: () => void;
  isAutoTouring: boolean;
  onOpenAmericanSpaceModal: () => void;
  isWindPlaying: boolean;
  onToggleWind: () => void;
  totalMastery: number;
  onOpenLogbook: () => void;
  cursorTelemetry?: CursorTelemetry;
}

export const ModernFlightHUD: React.FC<ModernFlightHUDProps> = ({
  currentPlanet,
  onChangePlanet,
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
    <header className="fixed top-3 inset-x-2 md:inset-x-5 z-40 flex items-center justify-between pointer-events-none gap-2">
      {/* Top Left: Planetary Switcher & Mission Badge */}
      <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 pointer-events-auto shadow-2xl flex items-center gap-1.5">
        {/* Earth Switch Button */}
        <button
          onClick={() => onChangePlanet('earth')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
            currentPlanet === 'earth'
              ? 'bg-sky-500/25 border border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400/30'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Переключиться на 3D планету Земля"
        >
          <span className="text-sm">♁</span>
          <span className="tracking-wider">ЗЕМЛЯ</span>
        </button>

        {/* Mars Switch Button */}
        <button
          onClick={() => onChangePlanet('mars')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
            currentPlanet === 'mars'
              ? 'bg-red-500/25 border border-red-400 text-red-200 shadow-md ring-1 ring-red-400/30'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Переключиться на 3D планету Марс"
        >
          <span className="text-sm">♂</span>
          <span className="tracking-wider">МАРС</span>
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1 hidden sm:block" />

        <div className="hidden sm:flex flex-col pr-2">
          <span className="text-[9px] font-bold text-amber-400 font-mono tracking-wider uppercase">
            American Space Dushanbe
          </span>
          <span className="text-[9px] text-slate-400 font-mono">
            {currentPlanet === 'mars' ? 'Экспедиция на Красную планету' : 'Колыбель человечества & МКС'}
          </span>
        </div>
      </div>

      {/* Top Center: Real-Time Scientific Flight Telemetry (Desktop & Tablet) */}
      <div className="hidden md:flex items-center bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 pointer-events-auto shadow-2xl text-[11px] text-slate-300 font-mono transition-all min-w-[360px] justify-center">
        {isHovering && cursorTelemetry ? (
          <div className="flex items-center gap-3.5 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Crosshair className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {cursorTelemetry.planet === 'mars' ? 'Марс (MOLA):' : 'Земля (Топо):'}
              </span>
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
              <span className="text-slate-500 text-[9px] block">ВЫСОТА</span>
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
              <span className="text-slate-500 block text-[9px] uppercase">
                {currentPlanet === 'mars' ? 'Орб. скорость' : 'Орб. скорость'}
              </span>
              <span className="text-white font-semibold">
                {currentPlanet === 'mars' ? '24.1 км/с' : '29.8 км/с'}
              </span>
            </div>
            <div className="w-px h-5 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Гравитация</span>
              <span className="text-amber-400 font-semibold">
                {currentPlanet === 'mars' ? '0.38 g' : '1.00 g (9.8 м/с²)'}
              </span>
            </div>
            <div className="w-px h-5 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Давление</span>
              <span className="text-sky-400 font-semibold">
                {currentPlanet === 'mars' ? '0.6 кПа (6 мбар)' : '101.3 кПа (1013 мбар)'}
              </span>
            </div>
            <div className="w-px h-5 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Расстояние до Солнца</span>
              <span className="text-red-400 font-semibold">
                {currentPlanet === 'mars' ? '1.52 а.е. (228 млн км)' : '1.00 а.е. (149 млн км)'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Top Right: Sound & Presentation Actions */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        {/* Wind / Space sound toggle */}
        <button
          onClick={onToggleWind}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs flex items-center gap-1.5 shadow-xl ${
            isWindPlaying
              ? 'bg-red-600/90 border-red-500 text-white'
              : 'bg-slate-950/85 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          title={isWindPlaying ? 'Отключить звук ветра NASA' : 'Включить атмосферный звук марсианского ветра NASA'}
        >
          {isWindPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden lg:inline text-[11px] font-semibold">
            {isWindPlaying ? 'Звук активен' : 'Звук ветра'}
          </span>
        </button>

        {/* Demo Tour Button for Presentation */}
        <button
          onClick={onStartAutoTour}
          className={`px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xl ${
            isAutoTouring
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20'
              : 'bg-slate-950/85 border-slate-800 text-amber-400 hover:bg-slate-900 hover:border-amber-500/50'
          }`}
          title="Запустить автоматический демо-тур для презентации в American Space"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">{isAutoTouring ? 'Тур...' : 'Демо-Тур'}</span>
        </button>

        {/* American Space Info Modal */}
        <button
          onClick={onOpenAmericanSpaceModal}
          className="p-2 bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl backdrop-blur-md transition-all shadow-xl"
          title="О проекте для American Space Dushanbe"
        >
          <Info className="w-4 h-4 text-sky-400" />
        </button>
      </div>
    </header>
  );
};
